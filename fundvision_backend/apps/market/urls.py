"""
apps/market/urls.py  —  HTTP REST endpoints
"""

from django.urls import path
from .views import MarketOverviewView, MarketIndexDetailView, MarketStatusView

app_name = "market"

urlpatterns = [
    path("overview/",         MarketOverviewView.as_view(),               name="overview"),
    path("status/",           MarketStatusView.as_view(),                 name="status"),
    path("index/<str:symbol>/", MarketIndexDetailView.as_view(),          name="index-detail"),
]
