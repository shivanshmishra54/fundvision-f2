from django.contrib import admin
from .models import Stock, StockPrice, ProfitLoss, BalanceSheet, CashFlow, FinancialRatio, CompanyOverview


@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ["symbol", "name", "exchange", "sector", "current_price", "day_change_pct", "is_active"]
    list_filter = ["exchange", "sector", "is_active"]
    search_fields = ["symbol", "name", "isin"]
    ordering = ["symbol"]
    readonly_fields = ["last_synced", "created_at"]


@admin.register(StockPrice)
class StockPriceAdmin(admin.ModelAdmin):
    list_display = ["stock", "timestamp", "interval", "open", "high", "low", "close", "volume"]
    list_filter = ["interval"]
    search_fields = ["stock__symbol"]
    ordering = ["-timestamp"]
    date_hierarchy = "timestamp"


@admin.register(ProfitLoss)
class ProfitLossAdmin(admin.ModelAdmin):
    list_display = ["stock", "period", "sales", "net_profit", "eps", "is_consolidated"]
    list_filter = ["is_consolidated"]
    search_fields = ["stock__symbol"]


@admin.register(CompanyOverview)
class CompanyOverviewAdmin(admin.ModelAdmin):
    list_display = ["stock", "pe_ratio", "pb_ratio", "roe_pct", "roce_pct"]
    search_fields = ["stock__symbol", "stock__name"]
