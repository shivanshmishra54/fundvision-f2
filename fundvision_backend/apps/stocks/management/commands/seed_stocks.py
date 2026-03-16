"""
apps/stocks/management/commands/seed_stocks.py

Management command to seed initial stock and market data for development.

Usage:
    python manage.py seed_stocks
    python manage.py seed_stocks --indices-only
    python manage.py seed_stocks --clear
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from decimal import Decimal


class Command(BaseCommand):
    help = "Seeds the database with initial stock, market index, and sample financial data."

    def add_arguments(self, parser):
        parser.add_argument(
            "--indices-only",
            action="store_true",
            help="Only seed market indices (Nifty, Sensex).",
        )
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear all existing data before seeding.",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            self._clear_data()

        self._seed_market_indices()
        self._seed_market_status()

        if not options["indices_only"]:
            self._seed_stocks()
            self._seed_sample_financials()

        self.stdout.write(self.style.SUCCESS("✅  Database seeded successfully."))

    # -----------------------------------------------------------------------
    # Market Indices
    # -----------------------------------------------------------------------

    def _seed_market_indices(self):
        from apps.market.models import MarketIndex

        indices = [
            {"symbol": "NIFTY50",    "name": "Nifty 50",       "exchange": "NSE", "current_value": Decimal("22821.40"), "day_change": Decimal("279.30"),  "day_change_pct": Decimal("1.24")},
            {"symbol": "SENSEX",     "name": "BSE Sensex",      "exchange": "BSE", "current_value": Decimal("75410.25"), "day_change": Decimal("735.60"),  "day_change_pct": Decimal("0.98")},
            {"symbol": "BANKNIFTY",  "name": "Bank Nifty",      "exchange": "NSE", "current_value": Decimal("48712.30"), "day_change": Decimal("-123.50"), "day_change_pct": Decimal("-0.25")},
            {"symbol": "NIFTYMID50", "name": "Nifty Midcap 50", "exchange": "NSE", "current_value": Decimal("14230.10"), "day_change": Decimal("92.40"),   "day_change_pct": Decimal("0.65")},
        ]

        for data in indices:
            obj, created = MarketIndex.objects.update_or_create(
                symbol=data["symbol"],
                defaults={**data, "last_updated": timezone.now(), "is_active": True},
            )
            status = "Created" if created else "Updated"
            self.stdout.write(f"  {status}: {obj.symbol}")

        self.stdout.write(self.style.SUCCESS(f"  Seeded {len(indices)} market indices."))

    def _seed_market_status(self):
        from apps.market.models import MarketStatus
        from datetime import time

        MarketStatus.objects.update_or_create(
            exchange="NSE",
            defaults={"is_open": False, "opens_at": time(9, 15), "closes_at": time(15, 30), "status_message": "Closed"},
        )
        MarketStatus.objects.update_or_create(
            exchange="BSE",
            defaults={"is_open": False, "opens_at": time(9, 15), "closes_at": time(15, 30), "status_message": "Closed"},
        )
        self.stdout.write("  Seeded market status (NSE, BSE).")

    # -----------------------------------------------------------------------
    # Stocks
    # -----------------------------------------------------------------------

    def _seed_stocks(self):
        from apps.stocks.models import Stock, CompanyOverview

        stocks_data = [
            {
                "symbol": "RELIANCE",
                "name": "Reliance Industries Ltd",
                "exchange": "BOTH",
                "isin": "INE002A01018",
                "sector": "Energy",
                "industry": "Oil & Gas Refining & Marketing",
                "current_price": Decimal("2945.50"),
                "day_change": Decimal("32.10"),
                "day_change_pct": Decimal("1.10"),
                "week_52_high": Decimal("3217.90"),
                "week_52_low": Decimal("2220.30"),
                "market_cap": Decimal("1994000.00"),
                "description": "Reliance Industries Limited is a Fortune 500 company and the largest private sector corporation in India.",
            },
            {
                "symbol": "TCS",
                "name": "Tata Consultancy Services Ltd",
                "exchange": "BOTH",
                "isin": "INE467B01029",
                "sector": "Information Technology",
                "industry": "IT Services & Consulting",
                "current_price": Decimal("3812.75"),
                "day_change": Decimal("-18.25"),
                "day_change_pct": Decimal("-0.48"),
                "week_52_high": Decimal("4592.25"),
                "week_52_low": Decimal("3311.00"),
                "market_cap": Decimal("1385000.00"),
                "description": "Tata Consultancy Services is an IT services, consulting and business solutions organization.",
            },
            {
                "symbol": "HDFCBANK",
                "name": "HDFC Bank Ltd",
                "exchange": "BOTH",
                "isin": "INE040A01034",
                "sector": "Financial Services",
                "industry": "Private Sector Bank",
                "current_price": Decimal("1712.40"),
                "day_change": Decimal("21.90"),
                "day_change_pct": Decimal("1.30"),
                "week_52_high": Decimal("1794.00"),
                "week_52_low": Decimal("1363.55"),
                "market_cap": Decimal("1302000.00"),
                "description": "HDFC Bank is India's largest private sector bank by assets.",
            },
            {
                "symbol": "INFY",
                "name": "Infosys Ltd",
                "exchange": "BOTH",
                "isin": "INE009A01021",
                "sector": "Information Technology",
                "industry": "IT Services & Consulting",
                "current_price": Decimal("1534.60"),
                "day_change": Decimal("-9.40"),
                "day_change_pct": Decimal("-0.61"),
                "week_52_high": Decimal("1903.75"),
                "week_52_low": Decimal("1358.35"),
                "market_cap": Decimal("637000.00"),
                "description": "Infosys is a global leader in next-generation digital services and consulting.",
            },
            {
                "symbol": "COASTALCORP",
                "name": "Coastal Corporation Ltd",
                "exchange": "NSE",
                "isin": "INE00XX01001",
                "sector": "Consumer Staples",
                "industry": "Aquaculture & Seafood Processing",
                "current_price": Decimal("43.64"),
                "day_change": Decimal("0.85"),
                "day_change_pct": Decimal("1.99"),
                "week_52_high": Decimal("72.90"),
                "week_52_low": Decimal("35.10"),
                "market_cap": Decimal("292.29"),
                "description": "Coastal Corporation is engaged in the processing and export of shrimp and seafood products.",
            },
        ]

        for data in stocks_data:
            stock, created = Stock.objects.update_or_create(
                symbol=data["symbol"],
                defaults={**data, "is_active": True, "last_synced": timezone.now()},
            )
            # Create overview placeholder
            CompanyOverview.objects.get_or_create(
                stock=stock,
                defaults={
                    "pe_ratio": Decimal("24.50"),
                    "pb_ratio": Decimal("3.20"),
                    "div_yield_pct": Decimal("0.62"),
                    "roce_pct": Decimal("12.40"),
                    "roe_pct": Decimal("14.20"),
                },
            )
            status = "Created" if created else "Updated"
            self.stdout.write(f"  {status}: {stock.symbol}")

        self.stdout.write(self.style.SUCCESS(f"  Seeded {len(stocks_data)} stocks."))

    # -----------------------------------------------------------------------
    # Sample Financial Data (for Coastal Corporation — matches React component)
    # -----------------------------------------------------------------------

    def _seed_sample_financials(self):
        from apps.stocks.models import Stock, ProfitLoss, BalanceSheet, CashFlow, FinancialRatio

        try:
            stock = Stock.objects.get(symbol="COASTALCORP")
        except Stock.DoesNotExist:
            self.stdout.write(self.style.WARNING("  COASTALCORP not found, skipping financials."))
            return

        # P&L data (from CompanyProfitLoss.tsx sample)
        pl_data = [
            {"period": "Mar 2020", "sales": 604, "expenses": 564, "operating_profit": 40, "opm_pct": 7,  "other_income": 15, "interest": 7,  "depreciation": 3,  "profit_before_tax": 45, "tax_pct": 24, "net_profit": 34, "eps": Decimal("5.75"), "dividend_payout_pct": 4},
            {"period": "Mar 2021", "sales": 473, "expenses": 446, "operating_profit": 26, "opm_pct": 5,  "other_income": 8,  "interest": 4,  "depreciation": 4,  "profit_before_tax": 26, "tax_pct": 30, "net_profit": 18, "eps": Decimal("2.96"), "dividend_payout_pct": 17},
            {"period": "Mar 2022", "sales": 491, "expenses": 475, "operating_profit": 16, "opm_pct": 3,  "other_income": 13, "interest": 6,  "depreciation": 4,  "profit_before_tax": 19, "tax_pct": 30, "net_profit": 14, "eps": Decimal("2.00"), "dividend_payout_pct": 17},
            {"period": "Mar 2023", "sales": 353, "expenses": 333, "operating_profit": 20, "opm_pct": 6,  "other_income": 12, "interest": 11, "depreciation": 9,  "profit_before_tax": 11, "tax_pct": 38, "net_profit": 7,  "eps": Decimal("0.99"), "dividend_payout_pct": 26},
            {"period": "Mar 2024", "sales": 436, "expenses": 407, "operating_profit": 28, "opm_pct": 6,  "other_income": 7,  "interest": 12, "depreciation": 12, "profit_before_tax": 8,  "tax_pct": 43, "net_profit": 5,  "eps": Decimal("0.67"), "dividend_payout_pct": 36},
            {"period": "Mar 2025", "sales": 628, "expenses": 598, "operating_profit": 31, "opm_pct": 5,  "other_income": 11, "interest": 22, "depreciation": 15, "profit_before_tax": 8,  "tax_pct": 40, "net_profit": 4,  "eps": Decimal("0.67"), "dividend_payout_pct": 33},
            {"period": "TTM",      "sales": 803, "expenses": 754, "operating_profit": 49, "opm_pct": 6,  "other_income": 17, "interest": 29, "depreciation": 15, "profit_before_tax": 22, "tax_pct": None, "net_profit": 15, "eps": Decimal("2.32"), "dividend_payout_pct": None, "period_type": "ttm"},
        ]

        for row in pl_data:
            period_type = row.pop("period_type", "annual")
            ProfitLoss.objects.update_or_create(
                stock=stock, period=row["period"], is_consolidated=True,
                defaults={**row, "period_type": period_type},
            )

        # Balance Sheet data
        bs_data = [
            {"period": "Mar 2021", "equity_capital": 11, "reserves": 165, "borrowings": 138, "other_liabilities": 12, "total_liabilities": 326, "fixed_assets": 82,  "cwip": 32, "investments": 2, "other_assets": 229, "total_assets": 326},
            {"period": "Mar 2022", "equity_capital": 12, "reserves": 193, "borrowings": 173, "other_liabilities": 20, "total_liabilities": 398, "fixed_assets": 69,  "cwip": 92, "investments": 1, "other_assets": 236, "total_assets": 398},
            {"period": "Mar 2023", "equity_capital": 13, "reserves": 232, "borrowings": 176, "other_liabilities": 23, "total_liabilities": 443, "fixed_assets": 181, "cwip": 17, "investments": 1, "other_assets": 244, "total_assets": 443},
            {"period": "Mar 2024", "equity_capital": 13, "reserves": 246, "borrowings": 333, "other_liabilities": 38, "total_liabilities": 630, "fixed_assets": 178, "cwip": 87, "investments": 2, "other_assets": 363, "total_assets": 630},
            {"period": "Mar 2025", "equity_capital": 13, "reserves": 249, "borrowings": 411, "other_liabilities": 77, "total_liabilities": 750, "fixed_assets": 179, "cwip": 140,"investments": 2, "other_assets": 429, "total_assets": 750},
        ]

        for row in bs_data:
            BalanceSheet.objects.update_or_create(
                stock=stock, period=row["period"], is_consolidated=True, defaults=row,
            )

        # Cash Flow data
        cf_data = [
            {"period": "Mar 2021", "cash_from_operating": 9,   "cash_from_investing": -40, "cash_from_financing": 34,  "net_cash_flow": 2},
            {"period": "Mar 2022", "cash_from_operating": 1,   "cash_from_investing": -56, "cash_from_financing": 35,  "net_cash_flow": -20},
            {"period": "Mar 2023", "cash_from_operating": 27,  "cash_from_investing": -41, "cash_from_financing": 21,  "net_cash_flow": 7},
            {"period": "Mar 2024", "cash_from_operating": -62, "cash_from_investing": -81, "cash_from_financing": 152, "net_cash_flow": 9},
            {"period": "Mar 2025", "cash_from_operating": 5,   "cash_from_investing": -54, "cash_from_financing": 58,  "net_cash_flow": 8},
        ]

        for row in cf_data:
            CashFlow.objects.update_or_create(
                stock=stock, period=row["period"], is_consolidated=True, defaults=row,
            )

        # Ratios
        ratio_data = [
            {"period": "Mar 2021", "debtor_days": 22,  "inventory_days": 107, "days_payable": 4,  "cash_conversion_cycle": 125, "working_capital_days": 23, "roce_pct": 11},
            {"period": "Mar 2022", "debtor_days": 30,  "inventory_days": 119, "days_payable": 6,  "cash_conversion_cycle": 142, "working_capital_days": 12, "roce_pct": 7},
            {"period": "Mar 2023", "debtor_days": 27,  "inventory_days": 192, "days_payable": 9,  "cash_conversion_cycle": 210, "working_capital_days": 11, "roce_pct": 5},
            {"period": "Mar 2024", "debtor_days": 49,  "inventory_days": 221, "days_payable": 9,  "cash_conversion_cycle": 261, "working_capital_days": 19, "roce_pct": 5},
            {"period": "Mar 2025", "debtor_days": 34,  "inventory_days": 220, "days_payable": 35, "cash_conversion_cycle": 220, "working_capital_days": -16,"roce_pct": 5},
        ]

        for row in ratio_data:
            FinancialRatio.objects.update_or_create(
                stock=stock, period=row["period"], defaults=row,
            )

        self.stdout.write(self.style.SUCCESS("  Seeded sample financial data for COASTALCORP."))

    def _clear_data(self):
        from apps.stocks.models import Stock, ProfitLoss, BalanceSheet, CashFlow, FinancialRatio
        from apps.market.models import MarketIndex, MarketStatus

        Stock.objects.all().delete()
        MarketIndex.objects.all().delete()
        MarketStatus.objects.all().delete()
        self.stdout.write(self.style.WARNING("  Cleared existing data."))
