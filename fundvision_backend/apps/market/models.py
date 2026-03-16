"""
apps/market/models.py

Models:
  - MarketIndex       : Nifty 50, Sensex, Bank Nifty etc.
  - IndexPrice        : Time-series for index charts
  - MarketStatus      : Is the market open? (NSE/BSE trading hours)
"""

from django.db import models
from django.utils import timezone


class MarketIndex(models.Model):
    """
    Major market indices — Nifty 50, Sensex, Bank Nifty, etc.
    Updated by the Celery background task every 3 seconds during market hours.
    """

    INDEX_CHOICES = [
        ("NIFTY50",    "Nifty 50"),
        ("SENSEX",     "BSE Sensex"),
        ("BANKNIFTY",  "Bank Nifty"),
        ("NIFTYMID50", "Nifty Midcap 50"),
        ("NIFTYIT",    "Nifty IT"),
    ]

    symbol = models.CharField(max_length=20, unique=True, choices=INDEX_CHOICES, db_index=True)
    name = models.CharField(max_length=100)
    exchange = models.CharField(max_length=5, default="NSE")

    current_value = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    previous_close = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    day_change = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    day_change_pct = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    day_high = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    day_low = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    volume = models.BigIntegerField(null=True, blank=True)

    last_updated = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "market_index"
        verbose_name = "Market Index"
        verbose_name_plural = "Market Indices"
        indexes = [
            models.Index(fields=["symbol"], name="idx_index_symbol"),
        ]
        ordering = ["symbol"]

    def __str__(self):
        return f"{self.symbol} — {self.current_value}"


class IndexPrice(models.Model):
    """
    OHLCV time-series for market indices.
    Powers the 7-day trend sparkline in MarketOverview.tsx.
    Indexed on (index + timestamp) for fast range queries.
    """

    index = models.ForeignKey(
        MarketIndex, on_delete=models.CASCADE, related_name="prices", db_index=True
    )
    timestamp = models.DateTimeField(db_index=True)
    interval = models.CharField(
        max_length=5,
        choices=[("1m", "1m"), ("5m", "5m"), ("1h", "1h"), ("1d", "1d")],
        default="1d",
    )
    open = models.DecimalField(max_digits=12, decimal_places=2)
    high = models.DecimalField(max_digits=12, decimal_places=2)
    low = models.DecimalField(max_digits=12, decimal_places=2)
    close = models.DecimalField(max_digits=12, decimal_places=2)
    volume = models.BigIntegerField(default=0)

    class Meta:
        db_table = "market_index_price"
        indexes = [
            models.Index(fields=["index", "timestamp"], name="idx_idxprice_idx_ts"),
        ]
        unique_together = [("index", "timestamp", "interval")]
        ordering = ["timestamp"]


class MarketStatus(models.Model):
    """
    Singleton table tracking whether the market is currently open.
    Checked by the Celery task to decide whether to fetch live data.
    """

    exchange = models.CharField(max_length=5, unique=True)   # NSE or BSE
    is_open = models.BooleanField(default=False)
    opens_at = models.TimeField(default="09:15:00")
    closes_at = models.TimeField(default="15:30:00")
    next_open = models.DateTimeField(null=True, blank=True)
    status_message = models.CharField(max_length=100, blank=True)  # "Pre-open", "Open", "Closed"
    last_checked = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "market_status"
        verbose_name = "Market Status"

    def __str__(self):
        return f"{self.exchange}: {'Open' if self.is_open else 'Closed'}"
