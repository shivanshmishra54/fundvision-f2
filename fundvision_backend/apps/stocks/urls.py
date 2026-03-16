"""
apps/stocks/urls.py
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StockViewSet, FinancialsView, PeersView, ShareholdingView

app_name = "stocks"

router = DefaultRouter()
router.register(r"", StockViewSet, basename="stock")

urlpatterns = [
    # Extra detail endpoints (before router to avoid conflicts)
    path("<str:symbol>/financials/",   FinancialsView.as_view(),   name="financials"),
    path("<str:symbol>/peers/",        PeersView.as_view(),        name="peers"),
    path("<str:symbol>/shareholding/", ShareholdingView.as_view(), name="shareholding"),

    # Router-generated: list, retrieve, search, chart, export
    path("", include(router.urls)),
]
