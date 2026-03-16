"""
apps/market/serializers.py
"""

from rest_framework import serializers
from .models import MarketIndex, IndexPrice, MarketStatus


class IndexPriceSerializer(serializers.ModelSerializer):
    """Recharts-compatible sparkline data: { date, value }"""

    date = serializers.DateTimeField(source="timestamp", format="%Y-%m-%d")
    value = serializers.DecimalField(source="close", max_digits=12, decimal_places=2)

    class Meta:
        model = IndexPrice
        fields = ["date", "value", "open", "high", "low", "volume"]


class MarketIndexSerializer(serializers.ModelSerializer):
    """
    Full index data for MarketOverview.tsx.
    Includes a `sparkline` field with last 7 daily closes.
    """

    sparkline = serializers.SerializerMethodField()

    class Meta:
        model = MarketIndex
        fields = [
            "symbol",
            "name",
            "exchange",
            "current_value",
            "previous_close",
            "day_change",
            "day_change_pct",
            "day_high",
            "day_low",
            "volume",
            "last_updated",
            "sparkline",
        ]

    def get_sparkline(self, obj):
        """Returns last 7 daily close values for the mini chart."""
        prices = (
            obj.prices.filter(interval="1d")
            .order_by("-timestamp")[:7]
            .values_list("close", flat=True)
        )
        return [float(p) for p in reversed(list(prices))]


class MarketStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketStatus
        fields = ["exchange", "is_open", "opens_at", "closes_at", "status_message", "last_checked"]


class MarketOverviewSerializer(serializers.Serializer):
    """
    Aggregated response for the /market/overview/ endpoint.
    Matches the MarketOverview.tsx component data shape.
    """

    indices = MarketIndexSerializer(many=True)
    market_status = MarketStatusSerializer(many=True)
    last_updated = serializers.DateTimeField()
