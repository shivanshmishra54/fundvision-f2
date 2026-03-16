"""
apps/users/views.py

ViewSets & APIViews:
  - RegisterView          POST /api/v1/auth/register/
  - LoginView             POST /api/v1/auth/login/       (JWT token pair)
  - LogoutView            POST /api/v1/auth/logout/      (blacklist refresh token)
  - TokenRefreshView      POST /api/v1/auth/token/refresh/
  - ProfileView           GET/PATCH /api/v1/auth/profile/
  - ChangePasswordView    POST /api/v1/auth/change-password/
  - WatchlistViewSet      CRUD /api/v1/auth/watchlist/
  - WatchlistToggleView   POST /api/v1/auth/watchlist/toggle/
  - UserHistoryViewSet    GET  /api/v1/auth/history/
  - CheckAuthView         GET  /api/v1/auth/check/
"""

import logging
from rest_framework import status, viewsets, generics
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from drf_spectacular.utils import extend_schema, OpenApiExample

from .models import Watchlist, UserHistory
from .serializers import (
    CustomTokenObtainPairSerializer,
    UserRegistrationSerializer,
    UserProfileSerializer,
    UserProfileUpdateSerializer,
    WatchlistSerializer,
    WatchlistToggleSerializer,
    UserHistorySerializer,
    ChangePasswordSerializer,
)
from .permissions import IsOwner

logger = logging.getLogger("apps")


# ---------------------------------------------------------------------------
# Custom throttle scopes
# ---------------------------------------------------------------------------

class LoginRateThrottle(AnonRateThrottle):
    scope = "login"


class RegisterRateThrottle(AnonRateThrottle):
    scope = "register"


# ---------------------------------------------------------------------------
# Authentication Views
# ---------------------------------------------------------------------------

@extend_schema(tags=["auth"])
class RegisterView(generics.CreateAPIView):
    """
    POST /api/v1/auth/register/

    Creates a new user account.
    Rate limited to 3 requests/hour per IP to prevent abuse.
    """

    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    throttle_classes = [RegisterRateThrottle]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Issue tokens immediately on registration — no second login needed
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "message": "Account created successfully.",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.pk,
                    "email": user.email,
                    "full_name": user.full_name,
                    "initials": user.initials,
                    "profile_picture_url": None,
                },
            },
            status=status.HTTP_201_CREATED,
        )


@extend_schema(tags=["auth"])
class LoginView(TokenObtainPairView):
    """
    POST /api/v1/auth/login/

    Returns JWT access + refresh tokens plus user metadata for the frontend header.
    Rate limited to 5 attempts/minute per IP to prevent brute force.
    """

    serializer_class = CustomTokenObtainPairSerializer
    throttle_classes = [LoginRateThrottle]


@extend_schema(tags=["auth"])
class LogoutView(APIView):
    """
    POST /api/v1/auth/logout/

    Blacklists the provided refresh token, invalidating the session.
    Body: { "refresh": "<refresh_token>" }
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response(
                    {"error": "Refresh token is required.", "code": 400},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)
        except TokenError as e:
            return Response(
                {"error": str(e), "code": 400},
                status=status.HTTP_400_BAD_REQUEST,
            )


@extend_schema(tags=["auth"])
class CheckAuthView(APIView):
    """
    GET /api/v1/auth/check/

    Used by the frontend's Check-Auth middleware.
    Returns 200 with user data if authenticated, 401 otherwise.
    Guests hitting protected actions receive the LOGIN_MODAL trigger.
    """

    permission_classes = [AllowAny]

    def get(self, request):
        if request.user and request.user.is_authenticated:
            return Response(
                {
                    "authenticated": True,
                    "user": {
                        "id": request.user.pk,
                        "email": request.user.email,
                        "full_name": request.user.full_name,
                        "initials": request.user.initials,
                        "profile_picture_url": request.user.get_profile_picture_url(request),
                    },
                }
            )
        return Response(
            {
                "authenticated": False,
                "error": "Login required to perform this action.",
                "code": 401,
                "trigger": "LOGIN_MODAL",
            },
            status=status.HTTP_401_UNAUTHORIZED,
        )


# ---------------------------------------------------------------------------
# Profile Views
# ---------------------------------------------------------------------------

@extend_schema(tags=["users"])
class ProfileView(generics.RetrieveUpdateAPIView):
    """
    GET  /api/v1/auth/profile/  — Retrieve authenticated user's profile
    PATCH /api/v1/auth/profile/ — Update name, avatar, preferences
    """

    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ("PATCH", "PUT"):
            return UserProfileUpdateSerializer
        return UserProfileSerializer

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        kwargs["partial"] = True  # Always allow partial updates
        return super().update(request, *args, **kwargs)


@extend_schema(tags=["users"])
class ChangePasswordView(APIView):
    """POST /api/v1/auth/change-password/"""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data["new_password"])
        request.user.save()
        return Response({"message": "Password changed successfully."})


# ---------------------------------------------------------------------------
# Watchlist ViewSet
# ---------------------------------------------------------------------------

@extend_schema(tags=["watchlist"])
class WatchlistViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for the user's watchlist (Follow feature).

    GET    /api/v1/auth/watchlist/          List all followed stocks
    POST   /api/v1/auth/watchlist/          Follow a new stock
    DELETE /api/v1/auth/watchlist/<id>/     Unfollow a stock
    POST   /api/v1/auth/watchlist/toggle/   Toggle follow/unfollow
    """

    serializer_class = WatchlistSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    http_method_names = ["get", "post", "delete", "head", "options"]

    def get_queryset(self):
        return (
            Watchlist.objects.filter(user=self.request.user)
            .select_related("user")
            .order_by("-added_at")
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @extend_schema(
        request=WatchlistToggleSerializer,
        responses={200: WatchlistSerializer},
        description="Toggle follow/unfollow. Returns the watchlist item if added, or a removal message.",
    )
    @action(detail=False, methods=["post"], url_path="toggle")
    def toggle(self, request):
        """
        POST /api/v1/auth/watchlist/toggle/
        Body: { "stock_symbol": "RELIANCE", "stock_name": "Reliance Industries" }

        If not following → adds to watchlist, returns 201 with item.
        If already following → removes from watchlist, returns 200 with removal message.
        """
        serializer = WatchlistToggleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        symbol = serializer.validated_data["stock_symbol"]
        stock_name = serializer.validated_data.get("stock_name", "")

        existing = Watchlist.objects.filter(user=request.user, stock_symbol=symbol).first()

        if existing:
            existing.delete()
            return Response(
                {"message": f"Unfollowed {symbol}.", "following": False, "stock_symbol": symbol},
                status=status.HTTP_200_OK,
            )

        item = Watchlist.objects.create(
            user=request.user, stock_symbol=symbol, stock_name=stock_name
        )
        return Response(
            {**WatchlistSerializer(item).data, "following": True},
            status=status.HTTP_201_CREATED,
        )

    @extend_schema(description="Check if a specific stock is in the user's watchlist.")
    @action(detail=False, methods=["get"], url_path="check/(?P<symbol>[^/.]+)")
    def check(self, request, symbol=None):
        """GET /api/v1/auth/watchlist/check/<SYMBOL>/"""
        is_following = Watchlist.objects.filter(
            user=request.user, stock_symbol=symbol.upper()
        ).exists()
        return Response({"stock_symbol": symbol.upper(), "following": is_following})


# ---------------------------------------------------------------------------
# User History ViewSet
# ---------------------------------------------------------------------------

@extend_schema(tags=["history"])
class UserHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/v1/auth/history/     — List recent search/view history
    DELETE /api/v1/auth/history/  — Clear all history
    """

    serializer_class = UserHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            UserHistory.objects.filter(user=self.request.user)
            .order_by("-viewed_at")[:50]  # Cap at last 50 entries
        )

    @action(detail=False, methods=["delete"], url_path="clear")
    def clear(self, request):
        """DELETE /api/v1/auth/history/clear/ — Wipe all user history."""
        count, _ = UserHistory.objects.filter(user=request.user).delete()
        return Response({"message": f"Cleared {count} history entries."})
