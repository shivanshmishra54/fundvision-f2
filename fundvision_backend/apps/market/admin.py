from django.contrib import admin
from .models import MarketIndex, IndexPrice, MarketStatus


@admin.register(MarketIndex)
class MarketIndexAdmin(admin.ModelAdmin):
    list_display = ["symbol", "name", "current_value", "day_change_pct", "last_updated", "is_active"]
    list_filter = ["is_active", "exchange"]
    search_fields = ["symbol", "name"]
    readonly_fields = ["last_updated"]


@admin.register(IndexPrice)
class IndexPriceAdmin(admin.ModelAdmin):
    list_display = ["index", "timestamp", "interval", "open", "high", "low", "close"]
    list_filter = ["interval"]
    search_fields = ["index__symbol"]
    date_hierarchy = "timestamp"


@admin.register(MarketStatus)
class MarketStatusAdmin(admin.ModelAdmin):
    list_display = ["exchange", "is_open", "status_message", "last_checked"]
    readonly_fields = ["last_checked"]
