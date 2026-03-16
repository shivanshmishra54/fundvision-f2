"""
apps/stocks/routing.py  —  WebSocket URL patterns for individual stock tickers.
"""

from django.urls import re_path
from .consumers import StockTickerConsumer

websocket_urlpatterns = [
    # ws://host/ws/stock/RELIANCE/
    re_path(r"^ws/stock/(?P<symbol>[A-Z0-9]+)/$", StockTickerConsumer.as_asgi()),
]
