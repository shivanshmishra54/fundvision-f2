"""
apps/market/consumers.py

MarketOverviewConsumer:
  WebSocket that streams real-time Nifty 50 and Sensex updates.

  URL:  ws://host/ws/market/

  On connect:
    - Joins "market_overview" channel group
    - Immediately sends latest index values

  Message shape sent to frontend (matches MarketOverview.tsx):
    {
        "type": "market_update",
        "indices": [
            {
                "symbol": "NIFTY50",
                "current_value": 22821.40,
                "day_change": 279.30,
                "day_change_pct": 1.24,
                "timestamp": "2024-01-15T10:30:00Z"
            },
            ...
        ]
    }
"""

import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.core.cache import cache
from django.utils import timezone

logger = logging.getLogger("apps")

MARKET_GROUP = "market_overview"


class MarketOverviewConsumer(AsyncWebsocketConsumer):
    """
    Broadcasts live Nifty 50 and Sensex data to all connected clients.
    One group ("market_overview") — all subscribers receive the same updates.
    """

    async def connect(self):
        await self.channel_layer.group_add(MARKET_GROUP, self.channel_name)
        await self.accept()
        logger.info("Market WS connect: %s", self.channel_name)

        # Send latest data immediately on connection
        await self._send_current_market_data()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(MARKET_GROUP, self.channel_name)
        logger.info("Market WS disconnect: %s (code=%s)", self.channel_name, close_code)

    async def receive(self, text_data):
        """Handle ping/pong for keepalive."""
        try:
            data = json.loads(text_data)
            if data.get("action") == "ping":
                await self.send(json.dumps({"type": "pong", "timestamp": timezone.now().isoformat()}))
        except json.JSONDecodeError:
            pass

    # -----------------------------------------------------------------------
    # Channel layer event handlers — called by Celery broadcast task
    # -----------------------------------------------------------------------

    async def market_update(self, event):
        """
        Handles 'market_update' events from the Celery index sync task.
        Forwards the full indices payload to the client.
        """
        await self.send(text_data=json.dumps({
            "type": "market_update",
            "indices": event["indices"],
            "timestamp": event.get("timestamp", timezone.now().isoformat()),
        }))

    async def market_status_change(self, event):
        """Notifies clients when market opens or closes."""
        await self.send(text_data=json.dumps({
            "type": "market_status_change",
            "exchange": event["exchange"],
            "is_open": event["is_open"],
            "status_message": event.get("status_message", ""),
        }))

    # -----------------------------------------------------------------------
    # Helpers
    # -----------------------------------------------------------------------

    async def _send_current_market_data(self):
        """Send the last cached market snapshot on connect."""
        data = await self._get_cached_market_data()
        if data:
            await self.send(text_data=json.dumps({
                "type": "market_update",
                "indices": data,
                "timestamp": timezone.now().isoformat(),
            }))
        else:
            # Fallback to DB
            db_data = await self._get_indices_from_db()
            await self.send(text_data=json.dumps({
                "type": "market_update",
                "indices": db_data,
                "timestamp": timezone.now().isoformat(),
            }))

    @database_sync_to_async
    def _get_cached_market_data(self):
        return cache.get("live_market_indices")

    @database_sync_to_async
    def _get_indices_from_db(self):
        from .models import MarketIndex
        indices = MarketIndex.objects.filter(is_active=True)
        return [
            {
                "symbol": idx.symbol,
                "name": idx.name,
                "current_value": float(idx.current_value or 0),
                "day_change": float(idx.day_change or 0),
                "day_change_pct": float(idx.day_change_pct or 0),
                "day_high": float(idx.day_high or 0),
                "day_low": float(idx.day_low or 0),
            }
            for idx in indices
        ]
