"""
apps/stocks/consumers.py

StockTickerConsumer:
  WebSocket endpoint for streaming real-time price updates for an individual stock.

  URL:  ws://host/ws/stock/<SYMBOL>/

  On connect:
    - Joins the stock-specific channel group "stock_<SYMBOL>"
    - Sends the latest known price immediately

  On message received (from Celery broadcast):
    - Forwards the price update to the connected client

  Message shape sent to frontend:
    {
        "type": "price_update",
        "symbol": "RELIANCE",
        "price": 2945.50,
        "change": 12.30,
        "change_pct": 0.42,
        "volume": 1234567,
        "timestamp": "2024-01-15T10:30:00Z"
    }
"""

import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.core.cache import cache

logger = logging.getLogger("apps")


class StockTickerConsumer(AsyncWebsocketConsumer):
    """
    Individual stock price WebSocket.
    Frontend connects one consumer per stock it's currently viewing.
    """

    async def connect(self):
        self.symbol = self.scope["url_route"]["kwargs"]["symbol"].upper()
        self.group_name = f"stock_{self.symbol}"

        # Join the channel group for this stock
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        logger.info("WS connect: %s → group %s", self.channel_name, self.group_name)

        # Send the last known price immediately on connect
        await self._send_current_price()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        logger.info("WS disconnect: %s from %s (code=%s)", self.channel_name, self.group_name, close_code)

    async def receive(self, text_data):
        """
        Handle client → server messages.
        Currently only supports subscription changes (subscribe to a different symbol).
        """
        try:
            data = json.loads(text_data)
            action = data.get("action")

            if action == "ping":
                await self.send(json.dumps({"type": "pong"}))
        except json.JSONDecodeError:
            await self.send(json.dumps({"type": "error", "message": "Invalid JSON."}))

    # -----------------------------------------------------------------------
    # Channel layer event handlers  (called by group_send from Celery task)
    # -----------------------------------------------------------------------

    async def price_update(self, event):
        """
        Handles 'price_update' events broadcast by the Celery market data task.
        Forwards the payload directly to the connected WebSocket client.
        """
        await self.send(text_data=json.dumps({
            "type": "price_update",
            "symbol": event["symbol"],
            "price": event["price"],
            "change": event.get("change"),
            "change_pct": event.get("change_pct"),
            "volume": event.get("volume"),
            "open": event.get("open"),
            "high": event.get("high"),
            "low": event.get("low"),
            "timestamp": event.get("timestamp"),
        }))

    # -----------------------------------------------------------------------
    # Helpers
    # -----------------------------------------------------------------------

    async def _send_current_price(self):
        """
        Fetch the last cached price for this symbol and send it to the client.
        This ensures the client sees data immediately on connect without waiting
        for the next Celery broadcast cycle.
        """
        price_data = await self._get_cached_price()
        if price_data:
            await self.send(text_data=json.dumps({
                "type": "price_update",
                **price_data,
            }))
        else:
            # Fallback: fetch from DB
            stock_data = await self._get_stock_from_db()
            if stock_data:
                await self.send(text_data=json.dumps({
                    "type": "price_update",
                    **stock_data,
                }))

    @database_sync_to_async
    def _get_cached_price(self):
        """Check Redis for latest price (set by Celery task)."""
        return cache.get(f"live_price:{self.symbol}")

    @database_sync_to_async
    def _get_stock_from_db(self):
        """Fallback: load current price from the Stock model."""
        from .models import Stock
        try:
            stock = Stock.objects.get(symbol=self.symbol)
            return {
                "symbol": self.symbol,
                "price": float(stock.current_price or 0),
                "change": float(stock.day_change or 0),
                "change_pct": float(stock.day_change_pct or 0),
                "volume": stock.volume,
                "timestamp": stock.last_synced.isoformat() if stock.last_synced else None,
            }
        except Stock.DoesNotExist:
            return None
