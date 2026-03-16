"""
apps/stocks/models.py

Models (mapped directly to the React component data structures):
  - Stock              : Master stock record (symbol, name, sector, industry)
  - StockPrice         : OHLCV time-series data (indexed on symbol + timestamp)
  - ProfitLoss         : Annual P&L (matches CompanyProfitLoss.tsx)
  - BalanceSheet       : Annual balance sheet (matches CompanyBalanceSheet.tsx)
  - CashFlow           : Annual cash flows (matches CompanyCashFlow.tsx)
  - FinancialRatio     : Annual ratios (matches CompanyRatios.tsx)
  - QuarterlyResult    : Quarterly earnings (matches CompanyQuarters.tsx)
  - CompanyOverview    : About text, KPIs, key metrics
  - Peer               : Peer comparison data (matches CompanyPeers.tsx)
  - ShareholdingPattern: Investor breakdown (matches CompanyInvestors.tsx)
"""

from django.db import models
from django.utils import timezone


class Stock(models.Model):
    """
    Master record for each listed stock.
    This is the central table — all financial sub-tables FK to this.
    """

    symbol = models.CharField(max_length=20, unique=True, db_index=True)
    name = models.CharField(max_length=200, db_index=True)
    exchange = models.CharField(
        max_length=10,
        choices=[("NSE", "NSE"), ("BSE", "BSE"), ("BOTH", "NSE & BSE")],
        default="NSE",
    )
    isin = models.CharField(max_length=12, blank=True, db_index=True)
    sector = models.CharField(max_length=100, blank=True, db_index=True)
    industry = models.CharField(max_length=100, blank=True, db_index=True)

    # Live price snapshot (updated by background task)
    current_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    day_change = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    day_change_pct = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    week_52_high = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    week_52_low = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    market_cap = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)
    volume = models.BigIntegerField(null=True, blank=True)

    logo_url = models.URLField(blank=True)
    website = models.URLField(blank=True)
    description = models.TextField(blank=True)

    is_active = models.BooleanField(default=True)
    last_synced = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "stocks_stock"
        indexes = [
            models.Index(fields=["symbol"],          name="idx_stock_symbol"),
            models.Index(fields=["sector"],           name="idx_stock_sector"),
            models.Index(fields=["industry"],         name="idx_stock_industry"),
            models.Index(fields=["name"],             name="idx_stock_name"),
        ]
        ordering = ["symbol"]

    def __str__(self):
        return f"{self.symbol} — {self.name}"


class StockPrice(models.Model):
    """
    OHLCV time-series data for charting.
    Indexed on (symbol, timestamp) for fast range queries used by Recharts.
    Supports 1D / 1W / 1M / 3M / 1Y / 5Y granularity.
    """

    INTERVAL_CHOICES = [
        ("1m",  "1 Minute"),
        ("5m",  "5 Minutes"),
        ("15m", "15 Minutes"),
        ("1h",  "1 Hour"),
        ("1d",  "1 Day"),
        ("1wk", "1 Week"),
        ("1mo", "1 Month"),
    ]

    stock = models.ForeignKey(
        Stock, on_delete=models.CASCADE, related_name="prices", db_index=True
    )
    timestamp = models.DateTimeField(db_index=True)
    interval = models.CharField(max_length=5, choices=INTERVAL_CHOICES, default="1d")

    open = models.DecimalField(max_digits=12, decimal_places=2)
    high = models.DecimalField(max_digits=12, decimal_places=2)
    low = models.DecimalField(max_digits=12, decimal_places=2)
    close = models.DecimalField(max_digits=12, decimal_places=2)
    volume = models.BigIntegerField(default=0)
    adjusted_close = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    class Meta:
        db_table = "stocks_price"
        # Composite index for the most common query: stock + time range
        indexes = [
            models.Index(fields=["stock", "timestamp", "interval"], name="idx_price_stock_ts_interval"),
            models.Index(fields=["timestamp"], name="idx_price_timestamp"),
        ]
        unique_together = [("stock", "timestamp", "interval")]
        ordering = ["timestamp"]

    def __str__(self):
        return f"{self.stock.symbol} @ {self.timestamp}"


class ProfitLoss(models.Model):
    """
    Annual Profit & Loss statement — matches CompanyProfitLoss.tsx fields exactly.
    Figures in Rs. Crores.
    """

    stock = models.ForeignKey(
        Stock, on_delete=models.CASCADE, related_name="profit_loss", db_index=True
    )
    period = models.CharField(max_length=10)  # e.g. "Mar 2024", "TTM"
    period_type = models.CharField(
        max_length=10,
        choices=[("annual", "Annual"), ("ttm", "Trailing 12 Months")],
        default="annual",
    )
    is_consolidated = models.BooleanField(default=True)

    sales = models.DecimalField(max_digits=14, decimal_places=2, null=True)
    expenses = models.DecimalField(max_digits=14, decimal_places=2, null=True)
    operating_profit = models.DecimalField(max_digits=14, decimal_places=2, null=True)
    opm_pct = models.DecimalField(max_digits=6, decimal_places=2, null=True)       # OPM %
    other_income = models.DecimalField(max_digits=14, decimal_places=2, null=True)
    interest = models.DecimalField(max_digits=14, decimal_places=2, null=True)
    depreciation = models.DecimalField(max_digits=14, decimal_places=2, null=True)
    profit_before_tax = models.DecimalField(max_digits=14, decimal_places=2, null=True)
    tax_pct = models.DecimalField(max_digits=6, decimal_places=2, null=True)
    net_profit = models.DecimalField(max_digits=14, decimal_places=2, null=True)
    eps = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    dividend_payout_pct = models.DecimalField(max_digits=6, decimal_places=2, null=True)

    class Meta:
        db_table = "stocks_profit_loss"
        unique_together = [("stock", "period", "is_consolidated")]
        indexes = [
            models.Index(fields=["stock", "period"], name="idx_pl_stock_period"),
        ]
        ordering = ["period"]

    def __str__(self):
        return f"{self.stock.symbol} P&L {self.period}"


class BalanceSheet(models.Model):
    """
    Annual Balance Sheet — matches CompanyBalanceSheet.tsx fields.
    Figures in Rs. Crores.
    """

    stock = models.ForeignKey(
        Stock, on_delete=models.CASCADE, related_name="balance_sheets", db_index=True
    )
    period = models.CharField(max_length=10)
    is_consolidated = models.BooleanField(default=True)

    # Liabilities
    equity_capital = models.DecimalField(max_digits=14, decimal_places=2, null=True)
    reserves = models.DecimalField(max_digits=14, decimal_places=2, null=True)
    borrowings = models.DecimalField(max_digits=14, decimal_places=2, null=True)
    other_liabilities = models.DecimalField(max_digits=14, decimal_places=2, null=True)
    total_liabilities = models.DecimalField(max_digits=14, decimal_places=2, null=True)

    # Assets
    fixed_assets = models.DecimalField(max_digits=14, decimal_places=2, null=True)
    cwip = models.DecimalField(max_digits=14, decimal_places=2, null=True)          # Capital work-in-progress
    investments = models.DecimalField(max_digits=14, decimal_places=2, null=True)
    other_assets = models.DecimalField(max_digits=14, decimal_places=2, null=True)
    total_assets = models.DecimalField(max_digits=14, decimal_places=2, null=True)

    class Meta:
        db_table = "stocks_balance_sheet"
        unique_together = [("stock", "period", "is_consolidated")]
        indexes = [
            models.Index(fields=["stock", "period"], name="idx_bs_stock_period"),
        ]
        ordering = ["period"]

    def __str__(self):
        return f"{self.stock.symbol} BS {self.period}"


class CashFlow(models.Model):
    """
    Annual Cash Flow Statement — matches CompanyCashFlow.tsx.
    Figures in Rs. Crores.
    """

    stock = models.ForeignKey(
        Stock, on_delete=models.CASCADE, related_name="cash_flows", db_index=True
    )
    period = models.CharField(max_length=10)
    is_consolidated = models.BooleanField(default=True)

    cash_from_operating = models.DecimalField(max_digits=14, decimal_places=2, null=True)
    cash_from_investing = models.DecimalField(max_digits=14, decimal_places=2, null=True)
    cash_from_financing = models.DecimalField(max_digits=14, decimal_places=2, null=True)
    net_cash_flow = models.DecimalField(max_digits=14, decimal_places=2, null=True)

    class Meta:
        db_table = "stocks_cash_flow"
        unique_together = [("stock", "period", "is_consolidated")]
        ordering = ["period"]

    def __str__(self):
        return f"{self.stock.symbol} CF {self.period}"


class FinancialRatio(models.Model):
    """
    Annual financial ratios — matches CompanyRatios.tsx.
    """

    stock = models.ForeignKey(
        Stock, on_delete=models.CASCADE, related_name="ratios", db_index=True
    )
    period = models.CharField(max_length=10)

    debtor_days = models.DecimalField(max_digits=8, decimal_places=2, null=True)
    inventory_days = models.DecimalField(max_digits=8, decimal_places=2, null=True)
    days_payable = models.DecimalField(max_digits=8, decimal_places=2, null=True)
    cash_conversion_cycle = models.DecimalField(max_digits=8, decimal_places=2, null=True)
    working_capital_days = models.DecimalField(max_digits=8, decimal_places=2, null=True)
    roce_pct = models.DecimalField(max_digits=6, decimal_places=2, null=True)

    # Additional ratios
    pe_ratio = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    pb_ratio = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    debt_to_equity = models.DecimalField(max_digits=8, decimal_places=2, null=True)
    current_ratio = models.DecimalField(max_digits=8, decimal_places=2, null=True)
    roe_pct = models.DecimalField(max_digits=6, decimal_places=2, null=True)

    class Meta:
        db_table = "stocks_financial_ratio"
        unique_together = [("stock", "period")]
        indexes = [
            models.Index(fields=["stock", "period"], name="idx_ratio_stock_period"),
        ]
        ordering = ["period"]

    def __str__(self):
        return f"{self.stock.symbol} Ratios {self.period}"


class QuarterlyResult(models.Model):
    """
    Quarterly financial results — matches CompanyQuarters.tsx.
    """

    stock = models.ForeignKey(
        Stock, on_delete=models.CASCADE, related_name="quarterly_results", db_index=True
    )
    period = models.CharField(max_length=10)   # e.g. "Jun 2024"
    is_consolidated = models.BooleanField(default=True)

    sales = models.DecimalField(max_digits=14, decimal_places=2, null=True)
    expenses = models.DecimalField(max_digits=14, decimal_places=2, null=True)
    operating_profit = models.DecimalField(max_digits=14, decimal_places=2, null=True)
    opm_pct = models.DecimalField(max_digits=6, decimal_places=2, null=True)
    other_income = models.DecimalField(max_digits=14, decimal_places=2, null=True)
    interest = models.DecimalField(max_digits=14, decimal_places=2, null=True)
    depreciation = models.DecimalField(max_digits=14, decimal_places=2, null=True)
    profit_before_tax = models.DecimalField(max_digits=14, decimal_places=2, null=True)
    tax_pct = models.DecimalField(max_digits=6, decimal_places=2, null=True)
    net_profit = models.DecimalField(max_digits=14, decimal_places=2, null=True)
    eps = models.DecimalField(max_digits=10, decimal_places=2, null=True)

    class Meta:
        db_table = "stocks_quarterly_result"
        unique_together = [("stock", "period", "is_consolidated")]
        ordering = ["period"]


class CompanyOverview(models.Model):
    """
    Company overview KPIs and metadata shown in CompanyOverview.tsx and CompanyHeader.tsx.
    One-to-one with Stock.
    """

    stock = models.OneToOneField(
        Stock, on_delete=models.CASCADE, related_name="overview", primary_key=True
    )

    # Key valuation metrics
    pe_ratio = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    pb_ratio = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    div_yield_pct = models.DecimalField(max_digits=6, decimal_places=2, null=True)
    book_value = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    face_value = models.DecimalField(max_digits=8, decimal_places=2, null=True)
    roce_pct = models.DecimalField(max_digits=6, decimal_places=2, null=True)
    roe_pct = models.DecimalField(max_digits=6, decimal_places=2, null=True)
    debt_to_equity = models.DecimalField(max_digits=8, decimal_places=2, null=True)

    # Compounded growth metrics (shown in P&L footer)
    sales_cagr_10y = models.CharField(max_length=10, blank=True)
    profit_cagr_10y = models.CharField(max_length=10, blank=True)
    stock_cagr_10y = models.CharField(max_length=10, blank=True)
    roe_avg_10y = models.CharField(max_length=10, blank=True)

    # About section
    about = models.TextField(blank=True)
    founded_year = models.IntegerField(null=True, blank=True)
    headquarters = models.CharField(max_length=200, blank=True)
    chairman = models.CharField(max_length=100, blank=True)
    md_ceo = models.CharField(max_length=100, blank=True)

    class Meta:
        db_table = "stocks_company_overview"


class Peer(models.Model):
    """
    Peer comparison data — matches CompanyPeers.tsx columns.
    Each record links a stock to one peer company.
    """

    stock = models.ForeignKey(
        Stock, on_delete=models.CASCADE, related_name="peers", db_index=True
    )
    peer_symbol = models.CharField(max_length=20, db_index=True)
    peer_name = models.CharField(max_length=200)
    is_current = models.BooleanField(default=True)   # Highlight current company in table

    # Peer KPIs (updated by background sync)
    cmp = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    pe_ratio = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    market_cap = models.DecimalField(max_digits=18, decimal_places=2, null=True)
    div_yield = models.DecimalField(max_digits=6, decimal_places=2, null=True)
    np_qtr = models.DecimalField(max_digits=14, decimal_places=2, null=True)
    qtr_profit_var_pct = models.DecimalField(max_digits=8, decimal_places=2, null=True)
    sales_qtr = models.DecimalField(max_digits=14, decimal_places=2, null=True)
    qtr_sales_var_pct = models.DecimalField(max_digits=8, decimal_places=2, null=True)
    roce = models.DecimalField(max_digits=6, decimal_places=2, null=True)

    class Meta:
        db_table = "stocks_peer"
        indexes = [
            models.Index(fields=["stock", "peer_symbol"], name="idx_peer_stock_symbol"),
        ]


class ShareholdingPattern(models.Model):
    """
    Quarterly shareholding pattern — powers CompanyInvestors.tsx.
    """

    stock = models.ForeignKey(
        Stock, on_delete=models.CASCADE, related_name="shareholding", db_index=True
    )
    period = models.CharField(max_length=10)   # e.g. "Jun 2024"

    promoter_pct = models.DecimalField(max_digits=6, decimal_places=2, null=True)
    dii_pct = models.DecimalField(max_digits=6, decimal_places=2, null=True)
    fii_pct = models.DecimalField(max_digits=6, decimal_places=2, null=True)
    public_pct = models.DecimalField(max_digits=6, decimal_places=2, null=True)
    others_pct = models.DecimalField(max_digits=6, decimal_places=2, null=True)

    class Meta:
        db_table = "stocks_shareholding"
        unique_together = [("stock", "period")]
        ordering = ["period"]
