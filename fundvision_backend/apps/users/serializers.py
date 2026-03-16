"""
apps/users/serializers.py

Serializers:
  - CustomTokenObtainPairSerializer : JWT login — injects user metadata into token response
  - UserRegistrationSerializer       : New user signup
  - UserProfileSerializer            : Read/update user profile
  - WatchlistSerializer              : Watchlist CRUD
  - UserHistorySerializer            : Read-only history list
"""

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

from .models import Watchlist, UserHistory

User = get_user_model()


# ---------------------------------------------------------------------------
# JWT — Custom token pair that includes user metadata
# ---------------------------------------------------------------------------

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Extends SimpleJWT's default login serializer.

    On successful login the response includes:
      - access / refresh tokens
      - user metadata (id, name, initials, profile_picture_url)
    
    This lets the frontend immediately replace Login/Register buttons
    with a Profile Icon without a second API call.
    """

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user

        # Inject user metadata alongside the tokens
        data["user"] = {
            "id": user.pk,
            "email": user.email,
            "full_name": user.full_name,
            "first_name": user.first_name,
            "initials": user.initials,
            "profile_picture_url": user.get_profile_picture_url(),
        }
        return data


# ---------------------------------------------------------------------------
# Registration
# ---------------------------------------------------------------------------

class UserRegistrationSerializer(serializers.ModelSerializer):
    """Validates and creates a new user account."""

    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={"input_type": "password"},
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"},
    )

    class Meta:
        model = User
        fields = [
            "email",
            "first_name",
            "last_name",
            "password",
            "password_confirm",
        ]

    def validate(self, attrs):
        if attrs["password"] != attrs.pop("password_confirm"):
            raise serializers.ValidationError(
                {"password_confirm": "Passwords do not match."}
            )
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data.get("last_name", ""),
            password=validated_data["password"],
        )
        return user


# ---------------------------------------------------------------------------
# User Profile
# ---------------------------------------------------------------------------

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Read/update the authenticated user's profile.
    Returns all fields required for the frontend header Profile Icon.
    """

    full_name = serializers.CharField(read_only=True)
    initials = serializers.CharField(read_only=True)
    profile_picture_url = serializers.SerializerMethodField()
    watchlist_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "initials",
            "profile_picture",
            "profile_picture_url",
            "preferred_currency",
            "email_notifications",
            "date_joined",
            "watchlist_count",
        ]
        read_only_fields = ["id", "email", "date_joined"]

    def get_profile_picture_url(self, obj):
        request = self.context.get("request")
        return obj.get_profile_picture_url(request)

    def get_watchlist_count(self, obj):
        return obj.watchlist.count()


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Separate serializer for PATCH updates — only editable fields."""

    class Meta:
        model = User
        fields = ["first_name", "last_name", "profile_picture", "email_notifications", "preferred_currency"]


# ---------------------------------------------------------------------------
# Watchlist
# ---------------------------------------------------------------------------

class WatchlistSerializer(serializers.ModelSerializer):
    """Serializes watchlist entries. user is injected from request context."""

    class Meta:
        model = Watchlist
        fields = ["id", "stock_symbol", "stock_name", "added_at", "notes"]
        read_only_fields = ["id", "added_at"]

    def validate_stock_symbol(self, value):
        return value.upper().strip()

    def create(self, validated_data):
        user = self.context["request"].user
        # Use get_or_create to handle duplicates gracefully
        obj, _ = Watchlist.objects.get_or_create(
            user=user,
            stock_symbol=validated_data["stock_symbol"],
            defaults={
                "stock_name": validated_data.get("stock_name", ""),
                "notes": validated_data.get("notes", ""),
            },
        )
        return obj


class WatchlistToggleSerializer(serializers.Serializer):
    """Used by the Follow button — toggles watchlist membership."""

    stock_symbol = serializers.CharField(max_length=20)
    stock_name = serializers.CharField(max_length=200, required=False, default="")

    def validate_stock_symbol(self, value):
        return value.upper().strip()


# ---------------------------------------------------------------------------
# User History
# ---------------------------------------------------------------------------

class UserHistorySerializer(serializers.ModelSerializer):
    """Read-only serializer for the user's search/view history."""

    class Meta:
        model = UserHistory
        fields = ["id", "stock_symbol", "stock_name", "viewed_at", "search_query"]
        read_only_fields = fields


# ---------------------------------------------------------------------------
# Password Change
# ---------------------------------------------------------------------------

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, style={"input_type": "password"})
    new_password = serializers.CharField(
        required=True,
        validators=[validate_password],
        style={"input_type": "password"},
    )

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value
