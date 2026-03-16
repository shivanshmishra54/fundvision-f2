"""
apps/market/views.py

Endpoints:
  - MarketOverviewView     GET /api/v1/market/overview/
  - MarketIndexDetailView  GET /api/v1/market/index/<symbol>/
  - MarketStatusView       GET /api/v1/market/status/
"""

import logging
from django.core.cache import cache
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from drf_spectacular.utils import extend_schema

from .models import MarketIndex, MarketStatus
from .serializers import MarketIndexSerializer, MarketStatusSerializer, MarketOverviewSerializer

logger = logging.getLogger("apps")

OVERVIEW_CACHE_TTL = 10   # 10 seconds — short TTL since this is live data


@extend_schema(tags=["market"])
class MarketOverviewView(APIView):
    """
    GET /api/v1/market/overview/

    Returns Nifty 50, Sensex (and other active indices) with:
      - Current value, day change, day change %
      - 7-day sparkline data for the mini charts in MarketOverview.tsx

    Available to guests (no auth required).
    Cached for 10 seconds.
    """

    permission_classes = [AllowAny]

    def get(self, request):
        cache_key = "market_overview"
        cached = cache.get(cache_key)
        if cached:
            return Response(cached)

        try:
            indices = (
                MarketIndex.objects.filter(is_active=True)
                .prefetch_related("prices")
                .order_by("symbol")
            )
            statuses = MarketStatus.objects.all()

            data = {
                "indices": MarketIndexSerializer(indices, many=True).data,
                "market_status": MarketStatusSerializer(statuses, many=True).data,
                "last_updated": timezone.now().isoformat(),
            }
            cache.set(cache_key, data, OVERVIEW_CACHE_TTL)
            return Response(data)

        except Exception as e:
            logger.exception("Market overview error: %s", e)
            return Response(
                {"error": "Failed to fetch market data.", "code": 500},
                status=500,
            )


@extend_schema(tags=["market"])
class MarketIndexDetailView(APIView):
    """
    GET /api/v1/market/index/<SYMBOL>/
    GET /api/v1/market/index/<SYMBOL>/?interval=1d&days=30

    Detailed index data with OHLCV history for a specific index.
    """

    permission_classes = [AllowAny]

    def get(self, request, symbol):
        symbol = symbol.upper()
        try:
            index = MarketIndex.objects.prefetch_related("prices").get(symbol=symbol)
        except MarketIndex.DoesNotExist:
            return Response(
                {"error": f"Index '{symbol}' not found.", "code": 404},
                status=404,
            )
        return Response(MarketIndexSerializer(index).data)


@extend_schema(tags=["market"])
class MarketStatusView(APIView):
    """
    GET /api/v1/market/status/
    Returns whether NSE and BSE are currently open or closed.
    """

    permission_classes = [AllowAny]

    def get(self, request):
        statuses = MarketStatus.objects.all()
        return Response(MarketStatusSerializer(statuses, many=True).data)
