from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, UserHistory, Watchlist


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ["email", "full_name", "is_active", "is_staff", "date_joined"]
    list_filter = ["is_active", "is_staff", "date_joined"]
    search_fields = ["email", "first_name", "last_name"]
    ordering = ["-date_joined"]
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal Info", {"fields": ("first_name", "last_name", "profile_picture")}),
        ("Preferences", {"fields": ("preferred_currency", "email_notifications")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Dates", {"fields": ("date_joined", "last_login")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "first_name", "last_name", "password1", "password2"),
        }),
    )


@admin.register(UserHistory)
class UserHistoryAdmin(admin.ModelAdmin):
    list_display = ["user", "stock_symbol", "viewed_at"]
    list_filter = ["viewed_at"]
    search_fields = ["user__email", "stock_symbol"]
    ordering = ["-viewed_at"]


@admin.register(Watchlist)
class WatchlistAdmin(admin.ModelAdmin):
    list_display = ["user", "stock_symbol", "stock_name", "added_at"]
    search_fields = ["user__email", "stock_symbol"]
    ordering = ["-added_at"]
