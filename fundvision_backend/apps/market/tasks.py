"""
apps/market/tasks.py

Celery background tasks — the real-time market data engine.

Tasks:
  - sync_index_data    : Fetches Nifty/Sensex live data every 3s and broadcasts via WebSocket
  - sync_market_data   : Fetches individual stock prices every 5s
  - check_market_hours : Updates MarketStatus open/closed flag

Data sources (in priority order):
  1. Groww public API  (Indian market focus, no key required for basic data)
  2. Yahoo Finance     (via yfinance-style requests, fallback)
  3. Alpha Vantage     (API key required, highest quality)

In production: replace the _fetch_* functions with your paid data provider.
The broadcast mechanism (channel_layer.group_send) works identically regardless
of the data source.
"""

import logging
import asyncio
from datetime import datetime, time as dtime
from decimal import Decimal

import requests
from celery import shared_task
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.core.cache import cache
from django.utils import timezone
from django.conf import settings

logger = logging.getLogger("apps")

channel_layer = get_channel_layer()

# NSE market hours (IST)
MARKET_OPEN  = dtime(9, 15)
MARKET_CLOSE = dtime(15, 30)

# Indices to track
TRACKED_INDICES = [
    {"symbol": "NIFTY50",   "yahoo": "^NSEI",  "groww": "NIFTY"},
    {"symbol": "SENSEX",    "yahoo": "^BSESN", "groww": "SENSEX"},
    {"symbol": "BANKNIFTY", "yahoo": "^NSEBANK", "groww": "BANKNIFTY"},
]

# Top stocks to track for live price streaming
TRACKED_STOCKS = [
    "RELIANCE", "TCS", "HDFCBANK", "INFY", "HINDUNILVR",
    "ICICIBANK", "KOTAKBANK", "SBIN", "BHARTIARTL", "ITC",
]


# ---------------------------------------------------------------------------
# Market hours check
# ---------------------------------------------------------------------------

def _is_market_open() -> bool:
    """Returns True if current IST time is within NSE trading hours on a weekday."""
    now_ist = timezone.localtime(timezone.now())
    if now_ist.weekday() >= 5:   # Saturday=5, Sunday=6
        return False
    current_time = now_ist.time()
    return MARKET_OPEN <= current_time <= MARKET_CLOSE


# ---------------------------------------------------------------------------
# Data fetchers
# ---------------------------------------------------------------------------

def _fetch_index_from_groww(groww_symbol: str) -> dict | None:
    """
    Fetch index data from Groww's public API.
    Returns a dict with price fields or None on failure.
    """
    try:
        url = f"https://groww.in/v1/api/stocks_data/v1/accord_points/exchange/NSE/segment/INDEX/latest"
        headers = {"accept": "application/json", "User-Agent": "Mozilla/5.0 (FundVision)"}
        response = requests.get(url, headers=headers, timeout=5)
        if response.status_code == 429:
            raise ValueError("Groww rate limit")
        if response.status_code == 200:
            data = response.json()
            # Parse first index or match symbol
            for item in data:
                if item.get('point', {}).get('tradingsymbol') == groww_symbol:
                    point = item['point']
                    return {
                        'price': float(point.get('ltp', 0)),
                        'previous_close': float(point.get('pcp', 0)),
                        'day_high': float(point.get('oh', 0)),
                        'day_low': float(point.get('ol', 0)),
                        'volume': int(point.get('vtt', 0)),
                    }
            return None
        else:
            logger.debug("Groww HTTP %d for %s", response.status_code, groww_symbol)
    except Exception as e:
        logger.warning("Groww API error for %s: %s", groww_symbol, e)
    return None


def _fetch_index_from_yahoo(yahoo_symbol: str) -> dict | None:
    """
    Fetch index data from Yahoo Finance's unofficial query endpoint.
    No API key required — suitable for development/light production.
    """
    try:
        url = f"https://query1.finance.yahoo.com/v8/finance/chart/{yahoo_symbol}"
        headers = {
            "User-Agent": "Mozilla/5.0 (compatible; FundVision/1.0)",
            "Accept": "application/json",
        }
        response = requests.get(url, headers=headers, timeout=8, params={"interval": "1m", "range": "1d"})
        if response.status_code == 429:
            raise ValueError("Yahoo rate limit exceeded")
        if response.status_code != 200:
            logger.warning("Yahoo HTTP %d for %s", response.status_code, yahoo_symbol)
            return None
        data = response.json()
        result = data.get("chart", {}).get("result", [{}])[0]
        meta = result.get("meta", {})
        parsed = {
            "price": meta.get("regularMarketPrice"),
            "previous_close": meta.get("previousClose") or meta.get("chartPreviousClose"),
            "day_high": meta.get("regularMarketDayHigh"),
            "day_low": meta.get("regularMarketDayLow"),
            "volume": meta.get("regularMarketVolume"),
        }
        if not parsed["price"]:
            logger.debug("No price data in Yahoo response for %s", yahoo_symbol)
            return None
        return parsed
    except Exception as e:
        logger.warning("Yahoo Finance error for %s: %s", yahoo_symbol, e)
    return None


def _fetch_stock_from_yahoo(symbol: str) -> dict | None:
    """Fetch individual stock price from Yahoo Finance (NSE suffix)."""
    yahoo_symbol = f"{symbol}.NS"
    data = _fetch_index_from_yahoo(yahoo_symbol)
    if data:
        data["symbol"] = symbol
    return data


def _fetch_from_alpha_vantage(symbol: str) -> dict | None:
    """
    Fetch from Alpha Vantage GLOBAL_QUOTE (highest quality).
    Returns {'price': float, 'previous_close': float, ...} or None.
    Handles invalid key & rate limits.
    """
    api_key = getattr(settings, 'ALPHA_VANTAGE_API_KEY', '')
    if not api_key or api_key == 'demo' or len(api_key) < 10:
        logger.debug("No valid Alpha Vantage key for %s", symbol)
        return None

    try:
        url = "https://www.alphavantage.co/query"
        params = {
            'function': 'GLOBAL_QUOTE',
            'symbol': symbol,
            'apikey': api_key,
        }
        response = requests.get(url, params=params, timeout=10)
        
        if response.status_code == 429:
            raise ValueError("Alpha Vantage rate limit exceeded")
        if response.status_code == 400 or response.status_code == 401:
            logger.error("Alpha Vantage invalid API key for %s", symbol)
            return None
            
        data = response.json()
        quote = data.get('Global Quote', {})
        if '05. price' not in quote:
            logger.debug("No quote data from Alpha for %s", symbol)
            return None
            
        price = float(quote['05. price'])
        return {
            'price': price,
            'previous_close': float(quote.get('02. open', price)),
            'day_high': float(quote.get('03. high', price)),
            'day_low': float(quote.get('04. low', price)),
            'volume': int(quote.get('06. volume', 0)),
        }
    except ValueError as e:
        if "rate limit" in str(e):
            logger.warning("Alpha Vantage rate limit for %s: %s", symbol, e)
            raise  # Trigger Celery retry
        raise
    except Exception as e:
        logger.warning("Alpha Vantage error for %s: %s", symbol, e)
        return None


# ---------------------------------------------------------------------------
# Celery tasks
# ---------------------------------------------------------------------------



@shared_task(
    name="apps.market.tasks.sync_index_data",
    bind=True,
    max_retries=3,
    default_retry_delay=5,
    ignore_result=True,
)
def sync_index_data(self):
    """
    Fetch live index prices (Nifty 50, Sensex, Bank Nifty) every 3 seconds.
    Saves to DB, caches in Redis, and broadcasts via WebSocket to all connected clients.
    """
    from .models import MarketIndex

    if not _is_market_open():
        logger.debug("Market closed — skipping index sync")
        return

    indices_payload = []

    for idx_config in TRACKED_INDICES:
        symbol = idx_config["symbol"]
        try:
            # Priority: Alpha Vantage > Groww > Yahoo
            raw = _fetch_from_alpha_vantage(symbol)
            if not raw:
                raw = _fetch_index_from_groww(idx_config["groww"])
            if not raw:
                raw = _fetch_index_from_yahoo(idx_config["yahoo"])
                
            if not raw or not raw.get("price"):
                logger.debug("No data for %s from any source", symbol)
                continue

            price = Decimal(str(raw["price"]))
            prev_close = Decimal(str(raw.get("previous_close") or price))
            change = price - prev_close
            change_pct = (change / prev_close * 100) if prev_close else Decimal("0")

            # Update database record
            MarketIndex.objects.filter(symbol=symbol).update(
                current_value=price,
                previous_close=prev_close,
                day_change=change,
                day_change_pct=change_pct.quantize(Decimal("0.01")),
                day_high=raw.get("day_high") or price,
                day_low=raw.get("day_low") or price,
                volume=raw.get("volume"),
                last_updated=timezone.now(),
            )

            entry = {
                "symbol": symbol,
                "current_value": float(price),
                "day_change": float(change),
                "day_change_pct": float(change_pct),
                "day_high": float(raw.get("day_high") or price),
                "day_low": float(raw.get("day_low") or price),
                "timestamp": timezone.now().isoformat(),
            }
            indices_payload.append(entry)

            # Cache individual index
            cache.set(f"live_index:{symbol}", entry, timeout=30)

        except Exception as e:
            logger.exception("Error syncing index %s: %s", symbol, e)

    if indices_payload:
        # Cache the full snapshot
        cache.set("live_market_indices", indices_payload, timeout=30)

        # Broadcast to all WebSocket clients subscribed to market_overview
        async_to_sync(channel_layer.group_send)(
            "market_overview",
            {
                "type": "market_update",
                "indices": indices_payload,
                "timestamp": timezone.now().isoformat(),
            },
        )
        logger.debug("Broadcast market update: %d indices", len(indices_payload))


@shared_task(
    name="apps.market.tasks.sync_market_data",
    bind=True,
    max_retries=3,
    default_retry_delay=5,
    ignore_result=True,
)
def sync_market_data(self):
    """
    Fetch live prices for top tracked stocks every 5 seconds.
    Saves to DB, caches in Redis, and broadcasts to per-stock WebSocket groups.

    Only runs during market hours to save API quota.
    """
    from apps.stocks.models import Stock

    if not _is_market_open():
        logger.debug("Market closed — skipping stock sync")
        return

    for symbol in TRACKED_STOCKS:
        try:
            # Priority: Alpha > Yahoo (Groww for stocks tbd)
            raw = _fetch_from_alpha_vantage(symbol)
            if not raw:
                raw = _fetch_stock_from_yahoo(symbol)
                
            if not raw or not raw.get("price"):
                continue

            price = Decimal(str(raw["price"]))
            prev_close = Decimal(str(raw.get("previous_close") or price))
            change = price - prev_close
            change_pct = (change / prev_close * 100) if prev_close else Decimal("0")

            # Update the Stock model
            Stock.objects.filter(symbol=symbol).update(
                current_price=price,
                day_change=change,
                day_change_pct=change_pct.quantize(Decimal("0.01")),
                volume=raw.get("volume"),
                last_synced=timezone.now(),
            )

            price_data = {
                "symbol": symbol,
                "price": float(price),
                "change": float(change),
                "change_pct": float(change_pct),
                "volume": raw.get("volume"),
                "timestamp": timezone.now().isoformat(),
            }

            # Cache the latest price for instant WebSocket delivery on connect
            cache.set(f"live_price:{symbol}", price_data, timeout=60)

            # Broadcast to all clients watching this specific stock
            async_to_sync(channel_layer.group_send)(
                f"stock_{symbol}",
                {
                    "type": "price_update",
                    **price_data,
                },
            )

        except Exception as e:
            logger.exception("Error syncing stock %s: %s", symbol, e)


@shared_task(
    name="apps.market.tasks.check_market_hours",
    ignore_result=True,
)
def check_market_hours():
    """
    Updates MarketStatus.is_open flag and broadcasts status changes.
    Run this more frequently (every 60s is fine) — it's cheap.
    """
    from .models import MarketStatus

    is_open = _is_market_open()

    status_obj, _ = MarketStatus.objects.get_or_create(
        exchange="NSE",
        defaults={"is_open": is_open},
    )

    if status_obj.is_open != is_open:
        status_obj.is_open = is_open
        status_obj.status_message = "Open" if is_open else "Closed"
        status_obj.save()

        # Broadcast the status change to all connected WebSocket clients
        async_to_sync(channel_layer.group_send)(
            "market_overview",
            {
                "type": "market_status_change",
                "exchange": "NSE",
                "is_open": is_open,
                "status_message": status_obj.status_message,
            },
        )
        logger.info("Market status changed: NSE is now %s", "OPEN" if is_open else "CLOSED")
