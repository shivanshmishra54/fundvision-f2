"""
apps/market/routing.py  —  WebSocket URL patterns for market indices.
"""

from django.urls import re_path
from .consumers import MarketOverviewConsumer

websocket_urlpatterns = [
    # ws://host/ws/market/
    re_path(r"^ws/market/$", MarketOverviewConsumer.as_asgi()),
]
