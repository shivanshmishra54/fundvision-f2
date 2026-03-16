"""
apps/stocks/serializers.py

Serializers for all stock/financial models.
Optimized for the exact shape expected by each React component.
"""

from rest_framework import serializers
from .models import (
    Stock,
    StockPrice,
    ProfitLoss,
    BalanceSheet,
    CashFlow,
    FinancialRatio,
    QuarterlyResult,
    CompanyOverview,
    Peer,
    ShareholdingPattern,
)


# ---------------------------------------------------------------------------
# Stock List & Search
# ---------------------------------------------------------------------------

class StockListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for search results and stock lists."""

    class Meta:
        model = Stock
        fields = [
            "id",
            "symbol",
            "name",
            "exchange",
            "sector",
            "industry",
            "current_price",
            "day_change",
            "day_change_pct",
            "market_cap",
            "logo_url",
        ]


class StockSearchSerializer(serializers.ModelSerializer):
    """Even lighter — just what the search dropdown needs."""

    class Meta:
        model = Stock
        fields = ["id", "symbol", "name", "exchange", "sector", "logo_url"]


# ---------------------------------------------------------------------------
# Price / Chart Data
# ---------------------------------------------------------------------------

class StockPriceSerializer(serializers.ModelSerializer):
    """
    Maps to Recharts-compatible format:
    { date: "2024-01-01", open: 1234, high: 1260, low: 1220, close: 1250, volume: 1234567 }
    """

    date = serializers.DateTimeField(source="timestamp", format="%Y-%m-%d")

    class Meta:
        model = StockPrice
        fields = ["date", "open", "high", "low", "close", "volume", "adjusted_close"]


# ---------------------------------------------------------------------------
# Financial Statements
# ---------------------------------------------------------------------------

class ProfitLossSerializer(serializers.ModelSerializer):
    """
    Annual P&L row — mirrors the `years` array in CompanyProfitLoss.tsx.
    Field names use camelCase aliases expected by the React component.
    """

    year = serializers.CharField(source="period")
    opm = serializers.SerializerMethodField()
    tax = serializers.SerializerMethodField()
    dividend = serializers.SerializerMethodField()
    opProfit = serializers.DecimalField(source="operating_profit", max_digits=14, decimal_places=2)
    otherIncome = serializers.DecimalField(source="other_income", max_digits=14, decimal_places=2)
    pbt = serializers.DecimalField(source="profit_before_tax", max_digits=14, decimal_places=2)
    netProfit = serializers.DecimalField(source="net_profit", max_digits=14, decimal_places=2)

    class Meta:
        model = ProfitLoss
        fields = [
            "year",
            "sales",
            "expenses",
            "opProfit",
            "opm",
            "otherIncome",
            "interest",
            "depreciation",
            "pbt",
            "tax",
            "netProfit",
            "eps",
            "dividend",
            "period_type",
            "is_consolidated",
        ]

    def get_opm(self, obj):
        if obj.opm_pct is None:
            return ""
        return f"{int(obj.opm_pct)}%"

    def get_tax(self, obj):
        if obj.tax_pct is None:
            return ""
        return f"{int(obj.tax_pct)}%"

    def get_dividend(self, obj):
        if obj.dividend_payout_pct is None:
            return ""
        return f"{int(obj.dividend_payout_pct)}%"


class BalanceSheetSerializer(serializers.ModelSerializer):
    """Mirrors CompanyBalanceSheet.tsx year object shape."""

    year = serializers.CharField(source="period")
    equity = serializers.DecimalField(source="equity_capital", max_digits=14, decimal_places=2)
    borrowings = serializers.DecimalField(max_digits=14, decimal_places=2)
    otherLiab = serializers.DecimalField(source="other_liabilities", max_digits=14, decimal_places=2)
    totalLiab = serializers.DecimalField(source="total_liabilities", max_digits=14, decimal_places=2)
    fixedAssets = serializers.DecimalField(source="fixed_assets", max_digits=14, decimal_places=2)
    otherAssets = serializers.DecimalField(source="other_assets", max_digits=14, decimal_places=2)
    totalAssets = serializers.DecimalField(source="total_assets", max_digits=14, decimal_places=2)

    class Meta:
        model = BalanceSheet
        fields = [
            "year",
            "equity",
            "reserves",
            "borrowings",
            "otherLiab",
            "totalLiab",
            "fixedAssets",
            "cwip",
            "investments",
            "otherAssets",
            "totalAssets",
            "is_consolidated",
        ]


class CashFlowSerializer(serializers.ModelSerializer):
    """Mirrors CompanyCashFlow.tsx year object shape."""

    year = serializers.CharField(source="period")
    operating = serializers.DecimalField(source="cash_from_operating", max_digits=14, decimal_places=2)
    investing = serializers.DecimalField(source="cash_from_investing", max_digits=14, decimal_places=2)
    financing = serializers.DecimalField(source="cash_from_financing", max_digits=14, decimal_places=2)
    netCash = serializers.DecimalField(source="net_cash_flow", max_digits=14, decimal_places=2)

    class Meta:
        model = CashFlow
        fields = ["year", "operating", "investing", "financing", "netCash", "is_consolidated"]


class FinancialRatioSerializer(serializers.ModelSerializer):
    """
    Mirrors CompanyRatios.tsx — serialises as a flat row per period.
    The frontend uses the `name` field to build the ratio name column.
    """

    year = serializers.CharField(source="period")
    debtorDays = serializers.DecimalField(source="debtor_days", max_digits=8, decimal_places=2, allow_null=True)
    inventoryDays = serializers.DecimalField(source="inventory_days", max_digits=8, decimal_places=2, allow_null=True)
    daysPayable = serializers.DecimalField(source="days_payable", max_digits=8, decimal_places=2, allow_null=True)
    cashConversionCycle = serializers.DecimalField(source="cash_conversion_cycle", max_digits=8, decimal_places=2, allow_null=True)
    workingCapitalDays = serializers.DecimalField(source="working_capital_days", max_digits=8, decimal_places=2, allow_null=True)
    roce = serializers.DecimalField(source="roce_pct", max_digits=6, decimal_places=2, allow_null=True)

    class Meta:
        model = FinancialRatio
        fields = [
            "year",
            "debtorDays",
            "inventoryDays",
            "daysPayable",
            "cashConversionCycle",
            "workingCapitalDays",
            "roce",
            "pe_ratio",
            "pb_ratio",
            "debt_to_equity",
            "current_ratio",
            "roe_pct",
        ]


class QuarterlyResultSerializer(serializers.ModelSerializer):
    """Mirrors CompanyQuarters.tsx columns."""

    quarter = serializers.CharField(source="period")
    opProfit = serializers.DecimalField(source="operating_profit", max_digits=14, decimal_places=2, allow_null=True)
    opm = serializers.SerializerMethodField()
    otherIncome = serializers.DecimalField(source="other_income", max_digits=14, decimal_places=2, allow_null=True)
    pbt = serializers.DecimalField(source="profit_before_tax", max_digits=14, decimal_places=2, allow_null=True)
    netProfit = serializers.DecimalField(source="net_profit", max_digits=14, decimal_places=2, allow_null=True)

    class Meta:
        model = QuarterlyResult
        fields = [
            "quarter",
            "sales",
            "expenses",
            "opProfit",
            "opm",
            "otherIncome",
            "interest",
            "depreciation",
            "pbt",
            "netProfit",
            "eps",
            "is_consolidated",
        ]

    def get_opm(self, obj):
        if obj.opm_pct is None:
            return ""
        return f"{int(obj.opm_pct)}%"


# ---------------------------------------------------------------------------
# Company Detail Views
# ---------------------------------------------------------------------------

class CompanyOverviewSerializer(serializers.ModelSerializer):
    """Serves the KPI cards in CompanyOverview.tsx and CompanyHeader.tsx."""

    class Meta:
        model = CompanyOverview
        exclude = ["stock"]


class PeerSerializer(serializers.ModelSerializer):
    """Mirrors CompanyPeers.tsx peer row structure."""

    name = serializers.CharField(source="peer_name")
    cmp = serializers.DecimalField(max_digits=12, decimal_places=2, allow_null=True)
    pe = serializers.DecimalField(source="pe_ratio", max_digits=10, decimal_places=2, allow_null=True)
    marketCap = serializers.DecimalField(source="market_cap", max_digits=18, decimal_places=2, allow_null=True)
    divYield = serializers.DecimalField(source="div_yield", max_digits=6, decimal_places=2, allow_null=True)
    npQtr = serializers.DecimalField(source="np_qtr", max_digits=14, decimal_places=2, allow_null=True)
    qtrProfit = serializers.DecimalField(source="qtr_profit_var_pct", max_digits=8, decimal_places=2, allow_null=True)
    salesQtr = serializers.DecimalField(source="sales_qtr", max_digits=14, decimal_places=2, allow_null=True)
    qtrSales = serializers.DecimalField(source="qtr_sales_var_pct", max_digits=8, decimal_places=2, allow_null=True)

    class Meta:
        model = Peer
        fields = [
            "peer_symbol",
            "name",
            "cmp",
            "pe",
            "marketCap",
            "divYield",
            "npQtr",
            "qtrProfit",
            "salesQtr",
            "qtrSales",
            "roce",
            "is_current",
        ]


class ShareholdingSerializer(serializers.ModelSerializer):
    """Mirrors CompanyInvestors.tsx shareholding breakdown."""

    class Meta:
        model = ShareholdingPattern
        fields = [
            "period",
            "promoter_pct",
            "dii_pct",
            "fii_pct",
            "public_pct",
            "others_pct",
        ]


# ---------------------------------------------------------------------------
# Full Company Detail (aggregated response for CompanyDetailsPage)
# ---------------------------------------------------------------------------

class StockDetailSerializer(serializers.ModelSerializer):
    """
    Full company detail serializer.
    Assembles all sub-serializers to reduce HTTP round-trips from the frontend.
    Uses select_related / prefetch_related in the view to avoid N+1 queries.
    """

    overview = CompanyOverviewSerializer(read_only=True)
    profit_loss = ProfitLossSerializer(many=True, read_only=True)
    balance_sheets = BalanceSheetSerializer(many=True, read_only=True)
    cash_flows = CashFlowSerializer(many=True, read_only=True)
    ratios = FinancialRatioSerializer(many=True, read_only=True)
    quarterly_results = QuarterlyResultSerializer(many=True, read_only=True)
    peers = PeerSerializer(many=True, read_only=True)
    shareholding = ShareholdingSerializer(many=True, read_only=True)
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = Stock
        fields = [
            "id",
            "symbol",
            "name",
            "exchange",
            "isin",
            "sector",
            "industry",
            "current_price",
            "day_change",
            "day_change_pct",
            "week_52_high",
            "week_52_low",
            "market_cap",
            "volume",
            "logo_url",
            "website",
            "description",
            "last_synced",
            "is_following",
            # Related data
            "overview",
            "profit_loss",
            "balance_sheets",
            "cash_flows",
            "ratios",
            "quarterly_results",
            "peers",
            "shareholding",
        ]

    def get_is_following(self, obj) -> bool:
        """Check watchlist membership for the authenticated user."""
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return obj.watchlist_set.filter(user=request.user).exists()
