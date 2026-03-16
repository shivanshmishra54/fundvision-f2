"""
apps/users/models.py

Models:
  - User           : Custom user extending AbstractBaseUser
  - UserHistory    : Auto-logs every stock a user searches/views
  - Watchlist      : User's followed/saved stocks (Follow feature)
"""

import os
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone


def user_profile_picture_path(instance, filename):
    """Upload profile pictures to media/profile_pics/<user_id>/<filename>"""
    ext = filename.split(".")[-1]
    filename = f"profile.{ext}"
    return os.path.join("profile_pics", str(instance.pk), filename)


class UserManager(BaseUserManager):
    """Custom manager for the User model."""

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email address is required.")
        email = self.normalize_email(email)
        extra_fields.setdefault("is_active", True)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model using email as the primary identifier.
    Returns profile metadata (name, initials, avatar) for the frontend header.
    """

    email = models.EmailField(unique=True, db_index=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50, blank=True)
    profile_picture = models.ImageField(
        upload_to=user_profile_picture_path, null=True, blank=True
    )

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(null=True, blank=True)

    # Preferences
    preferred_currency = models.CharField(max_length=3, default="INR")
    email_notifications = models.BooleanField(default=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name"]

    class Meta:
        db_table = "users_user"
        verbose_name = "User"
        verbose_name_plural = "Users"
        indexes = [
            models.Index(fields=["email"], name="idx_user_email"),
        ]

    def __str__(self):
        return self.email

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}".strip()

    @property
    def initials(self) -> str:
        """Returns initials for the profile icon fallback, e.g. 'RK' for 'Raj Kumar'."""
        parts = self.full_name.split()
        if len(parts) >= 2:
            return f"{parts[0][0]}{parts[1][0]}".upper()
        return self.first_name[:2].upper()

    def get_profile_picture_url(self, request=None) -> str | None:
        """Returns absolute URL for profile picture or None."""
        if not self.profile_picture:
            return None
        if request:
            return request.build_absolute_uri(self.profile_picture.url)
        return self.profile_picture.url


class UserHistory(models.Model):
    """
    Automatically records every stock a logged-in user searches for / views.
    Used to power the 'Recently Viewed' section in the frontend.
    """

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="history",
        db_index=True,
    )
    # Storing symbol directly avoids a JOIN for history listings
    stock_symbol = models.CharField(max_length=20, db_index=True)
    stock_name = models.CharField(max_length=200, blank=True)
    viewed_at = models.DateTimeField(auto_now=True, db_index=True)
    search_query = models.CharField(max_length=200, blank=True)  # What they typed

    class Meta:
        db_table = "users_history"
        verbose_name = "User History"
        verbose_name_plural = "User History"
        # Most recent first; unique per user+symbol (upsert on view)
        ordering = ["-viewed_at"]
        unique_together = [("user", "stock_symbol")]
        indexes = [
            models.Index(fields=["user", "-viewed_at"], name="idx_history_user_time"),
        ]

    def __str__(self):
        return f"{self.user.email} → {self.stock_symbol}"


class Watchlist(models.Model):
    """
    User's personal watchlist — the 'Follow' feature.
    One record per user-stock pair.
    """

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="watchlist",
        db_index=True,
    )
    stock_symbol = models.CharField(max_length=20, db_index=True)
    stock_name = models.CharField(max_length=200, blank=True)
    added_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)    # Optional personal notes

    class Meta:
        db_table = "users_watchlist"
        verbose_name = "Watchlist Item"
        verbose_name_plural = "Watchlist"
        ordering = ["-added_at"]
        unique_together = [("user", "stock_symbol")]
        indexes = [
            models.Index(fields=["user", "stock_symbol"], name="idx_watchlist_user_symbol"),
        ]

    def __str__(self):
        return f"{self.user.email} → {self.stock_symbol}"
