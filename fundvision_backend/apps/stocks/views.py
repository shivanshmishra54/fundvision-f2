"""
apps/stocks/views.py

ViewSets:
  - StockViewSet       : Search, list, detail, chart data, financials
  - FinancialsView     : Aggregated financials endpoint (P&L, BS, CF, Ratios)
  - ChartDataView      : Historical price data for Recharts

Performance:
  - select_related / prefetch_related on all detail queries (no N+1)
  - Redis caching on heavy financial queries (5-min TTL)
  - Rate limiting on search endpoint (30/minute)
"""

import logging
from django.core.cache import cache
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from .models import Stock, StockPrice
from .serializers import (
    StockListSerializer,
    StockSearchSerializer,
    StockDetailSerializer,
    StockPriceSerializer,
    ProfitLossSerializer,
    BalanceSheetSerializer,
    CashFlowSerializer,
    FinancialRatioSerializer,
    QuarterlyResultSerializer,
    PeerSerializer,
    ShareholdingSerializer,
)
from apps.users.models import UserHistory
from apps.users.permissions import IsAuthenticatedForAction

logger = logging.getLogger("apps")

CHART_CACHE_TTL = 60          # 1 minute for live chart data
FINANCIALS_CACHE_TTL = 300    # 5 minutes for financial tables


# ---------------------------------------------------------------------------
# Custom throttle scopes
# ---------------------------------------------------------------------------

class SearchRateThrottle(AnonRateThrottle):
    scope = "search"


class SearchRateThrottleUser(UserRateThrottle):
    scope = "search"


# ---------------------------------------------------------------------------
# Helper — log user history
# ---------------------------------------------------------------------------

def _log_user_history(request, stock: Stock, query: str = ""):
    """
    Upserts a UserHistory entry when an authenticated user views a stock.
    Uses update_or_create so repeated views just bump the timestamp.
    """
    if request.user and request.user.is_authenticated:
        UserHistory.objects.update_or_create(
            user=request.user,
            stock_symbol=stock.symbol,
            defaults={
                "stock_name": stock.name,
                "search_query": query,
            },
        )


# ---------------------------------------------------------------------------
# Stock ViewSet
# ---------------------------------------------------------------------------

@extend_schema(tags=["stocks"])
class StockViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ReadOnly ViewSet for stocks.

    list     GET /api/v1/stocks/                      Paginated stock list
    retrieve GET /api/v1/stocks/<symbol>/              Full company detail
    search   GET /api/v1/stocks/search/?q=<query>      Fast symbol/name search
    chart    GET /api/v1/stocks/<symbol>/chart/        Price history for Recharts
    """

    lookup_field = "symbol"
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["symbol", "name", "isin"]
    filterset_fields = ["sector", "industry", "exchange"]
    ordering_fields = ["symbol", "name", "market_cap", "day_change_pct"]
    ordering = ["symbol"]

    def get_queryset(self):
        """
        Returns appropriate queryset with eager loading.
        Detail view prefetches all related financial tables to prevent N+1.
        """
        if self.action == "retrieve":
            return (
                Stock.objects.filter(is_active=True)
                .select_related("overview")
                .prefetch_related(
                    "profit_loss",
                    "balance_sheets",
                    "cash_flows",
                    "ratios",
                    "quarterly_results",
                    "peers",
                    "shareholding",
                )
            )
        return Stock.objects.filter(is_active=True)

    def get_serializer_class(self):
        if self.action == "retrieve":
            return StockDetailSerializer
        if self.action == "search":
            return StockSearchSerializer
        return StockListSerializer

    def retrieve(self, request, *args, **kwargs):
        """
        GET /api/v1/stocks/<SYMBOL>/
        Full company detail. Logs to UserHistory if authenticated.
        Cached per symbol for 5 minutes.
        """
        symbol = kwargs.get("symbol", "").upper()
        cache_key = f"stock_detail:{symbol}"

        # Try cache first (skip user-specific fields from cache)
        cached = cache.get(cache_key)
        if not cached:
            try:
                instance = self.get_object()
            except Stock.DoesNotExist:
                return Response(
                    {"error": f"Stock '{symbol}' not found.", "code": 404},
                    status=status.HTTP_404_NOT_FOUND,
                )
            serializer = self.get_serializer(instance, context={"request": request})
            cached = serializer.data
            cache.set(cache_key, cached, FINANCIALS_CACHE_TTL)

        # Log history AFTER returning cached data (async-ish)
        try:
            stock = Stock.objects.get(symbol=symbol)
            _log_user_history(request, stock)
        except Stock.DoesNotExist:
            pass

        return Response(cached)

    @extend_schema(
        parameters=[
            OpenApiParameter("q", OpenApiTypes.STR, description="Search query (symbol or company name)"),
            OpenApiParameter("limit", OpenApiTypes.INT, description="Max results (default 10)"),
        ],
        responses={200: StockSearchSerializer(many=True)},
        description="Fast stock search for the search bar dropdown. Rate limited to 30/min.",
    )
    @action(
        detail=False,
        methods=["get"],
        url_path="search",
        throttle_classes=[SearchRateThrottle, SearchRateThrottleUser],
    )
    def search(self, request):
        """
        GET /api/v1/stocks/search/?q=<query>&limit=<n>

        Searches symbol and name. Returns lightweight results for the
        search dropdown. Rate-limited: 30 requests/minute.
        """
        query = request.query_params.get("q", "").strip()
        limit = min(int(request.query_params.get("limit", 10)), 30)

        if not query or len(query) < 1:
            return Response([])

        cache_key = f"stock_search:{query.lower()}:{limit}"
        cached = cache.get(cache_key)
        if cached:
            return Response(cached)

        try:
            results = (
                Stock.objects.filter(is_active=True)
                .filter(
                    # Prioritize exact symbol matches, then name contains
                    models.Q(symbol__iexact=query)
                    | models.Q(symbol__istartswith=query)
                    | models.Q(name__icontains=query)
                )
                .order_by(
                    # Exact symbol match first
                    models.Case(
                        models.When(symbol__iexact=query, then=0),
                        models.When(symbol__istartswith=query, then=1),
                        default=2,
                        output_field=models.IntegerField(),
                    )
                )[:limit]
            )
            data = StockSearchSerializer(results, many=True).data
            cache.set(cache_key, data, 30)  # Short 30s cache for search
            return Response(data)
        except Exception as e:
            logger.exception("Stock search error for query '%s': %s", query, e)
            return Response(
                {"error": "Search failed. Please try again.", "code": 500},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @extend_schema(
        parameters=[
            OpenApiParameter(
                "interval",
                OpenApiTypes.STR,
                description="Data interval: 1d, 1wk, 1mo",
                enum=["1m", "5m", "15m", "1h", "1d", "1wk", "1mo"],
            ),
            OpenApiParameter("from_date", OpenApiTypes.DATE, description="Start date (YYYY-MM-DD)"),
            OpenApiParameter("to_date", OpenApiTypes.DATE, description="End date (YYYY-MM-DD)"),
        ],
        responses={200: StockPriceSerializer(many=True)},
        description="OHLCV price history for Recharts charts.",
    )
    @action(detail=True, methods=["get"], url_path="chart")
    def chart(self, request, symbol=None):
        """
        GET /api/v1/stocks/<SYMBOL>/chart/?interval=1d&from_date=2023-01-01

        Returns OHLCV data formatted for Recharts.
        Cached per symbol+interval+range for 1 minute.
        """
        symbol = (symbol or "").upper()
        interval = request.query_params.get("interval", "1d")
        from_date = request.query_params.get("from_date")
        to_date = request.query_params.get("to_date")

        cache_key = f"chart:{symbol}:{interval}:{from_date}:{to_date}"
        cached = cache.get(cache_key)
        if cached:
            return Response(cached)

        try:
            stock = Stock.objects.get(symbol=symbol, is_active=True)
        except Stock.DoesNotExist:
            return Response(
                {"error": f"Stock '{symbol}' not found.", "code": 404},
                status=status.HTTP_404_NOT_FOUND,
            )

        qs = StockPrice.objects.filter(stock=stock, interval=interval)
        if from_date:
            qs = qs.filter(timestamp__date__gte=from_date)
        if to_date:
            qs = qs.filter(timestamp__date__lte=to_date)

        qs = qs.order_by("timestamp")
        data = StockPriceSerializer(qs, many=True).data
        cache.set(cache_key, data, CHART_CACHE_TTL)
        return Response(data)

    @extend_schema(description="Export stock data. Requires authentication (triggers login modal for guests).")
    @action(
        detail=True,
        methods=["get"],
        url_path="export",
        permission_classes=[IsAuthenticatedForAction],
    )
    def export(self, request, symbol=None):
        """
        GET /api/v1/stocks/<SYMBOL>/export/
        Protected — returns 401 LOGIN_MODAL trigger for guests.
        """
        # Implementation: generate CSV/Excel and return file response
        return Response({"message": f"Export for {symbol} — implementation pending."})


# ---------------------------------------------------------------------------
# Financials View — Aggregated endpoint
# ---------------------------------------------------------------------------

@extend_schema(tags=["stocks"])
class FinancialsView(APIView):
    """
    GET /api/v1/stocks/<symbol>/financials/

    Returns all financial tables in one response to reduce round-trips:
    {
        "profit_loss": [...],
        "balance_sheet": [...],
        "cash_flow": [...],
        "ratios": [...],
        "quarterly": [...],
        "consolidated": true
    }

    Heavy query — cached for 5 minutes per symbol.
    Uses select_related + prefetch_related to eliminate N+1.
    """

    permission_classes = [AllowAny]

    def get(self, request, symbol):
        symbol = symbol.upper()
        is_consolidated = request.query_params.get("consolidated", "true").lower() == "true"
        cache_key = f"financials:{symbol}:{'c' if is_consolidated else 's'}"

        cached = cache.get(cache_key)
        if cached:
            return Response(cached)

        try:
            stock = (
                Stock.objects.filter(symbol=symbol, is_active=True)
                .prefetch_related(
                    "profit_loss",
                    "balance_sheets",
                    "cash_flows",
                    "ratios",
                    "quarterly_results",
                )
                .get()
            )
        except Stock.DoesNotExist:
            return Response(
                {"error": f"Stock '{symbol}' not found.", "code": 404},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Filter consolidated vs standalone
        pl_qs = stock.profit_loss.filter(is_consolidated=is_consolidated).order_by("period")
        bs_qs = stock.balance_sheets.filter(is_consolidated=is_consolidated).order_by("period")
        cf_qs = stock.cash_flows.filter(is_consolidated=is_consolidated).order_by("period")
        qr_qs = stock.quarterly_results.filter(is_consolidated=is_consolidated).order_by("period")
        # Ratios have no consolidated flag
        ratio_qs = stock.ratios.all().order_by("period")

        data = {
            "symbol": symbol,
            "consolidated": is_consolidated,
            "profit_loss": ProfitLossSerializer(pl_qs, many=True).data,
            "balance_sheet": BalanceSheetSerializer(bs_qs, many=True).data,
            "cash_flow": CashFlowSerializer(cf_qs, many=True).data,
            "ratios": FinancialRatioSerializer(ratio_qs, many=True).data,
            "quarterly": QuarterlyResultSerializer(qr_qs, many=True).data,
        }

        cache.set(cache_key, data, FINANCIALS_CACHE_TTL)
        return Response(data)


# ---------------------------------------------------------------------------
# Peers View
# ---------------------------------------------------------------------------

@extend_schema(tags=["stocks"])
class PeersView(APIView):
    """GET /api/v1/stocks/<symbol>/peers/ — Peer comparison table data."""

    permission_classes = [AllowAny]

    def get(self, request, symbol):
        symbol = symbol.upper()
        cache_key = f"peers:{symbol}"
        cached = cache.get(cache_key)
        if cached:
            return Response(cached)

        try:
            stock = Stock.objects.get(symbol=symbol, is_active=True)
        except Stock.DoesNotExist:
            return Response(
                {"error": f"Stock '{symbol}' not found.", "code": 404},
                status=status.HTTP_404_NOT_FOUND,
            )

        peers = stock.peers.all().order_by("peer_name")
        data = PeerSerializer(peers, many=True).data
        cache.set(cache_key, data, FINANCIALS_CACHE_TTL)
        return Response(data)


# ---------------------------------------------------------------------------
# Shareholding View
# ---------------------------------------------------------------------------

@extend_schema(tags=["stocks"])
class ShareholdingView(APIView):
    """GET /api/v1/stocks/<symbol>/shareholding/ — Investor breakdown over time."""

    permission_classes = [AllowAny]

    def get(self, request, symbol):
        symbol = symbol.upper()
        try:
            stock = Stock.objects.get(symbol=symbol, is_active=True)
        except Stock.DoesNotExist:
            return Response(
                {"error": f"Stock '{symbol}' not found.", "code": 404},
                status=status.HTTP_404_NOT_FOUND,
            )

        sh = stock.shareholding.all().order_by("period")
        return Response(ShareholdingSerializer(sh, many=True).data)


# Fix missing import
from django.db import models
