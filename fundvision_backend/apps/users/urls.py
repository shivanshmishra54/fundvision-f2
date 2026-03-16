"""
apps/users/urls.py
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    CheckAuthView,
    ProfileView,
    ChangePasswordView,
    WatchlistViewSet,
    UserHistoryViewSet,
)

app_name = "users"

router = DefaultRouter()
router.register(r"watchlist", WatchlistViewSet, basename="watchlist")
router.register(r"history", UserHistoryViewSet, basename="history")

urlpatterns = [
    # Auth lifecycle
    path("register/",         RegisterView.as_view(),       name="register"),
    path("login/",            LoginView.as_view(),           name="login"),
    path("logout/",           LogoutView.as_view(),          name="logout"),
    path("token/refresh/",    TokenRefreshView.as_view(),    name="token-refresh"),
    path("check/",            CheckAuthView.as_view(),       name="check-auth"),

    # Profile
    path("profile/",          ProfileView.as_view(),         name="profile"),
    path("change-password/",  ChangePasswordView.as_view(),  name="change-password"),

    # Watchlist & History (router-generated)
    path("", include(router.urls)),
]
