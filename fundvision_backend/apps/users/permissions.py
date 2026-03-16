"""
apps/users/permissions.py

Custom DRF permission classes for FundVision's guest/auth model.
"""

from rest_framework.permissions import BasePermission
from rest_framework.exceptions import AuthenticationFailed


class IsAuthenticatedOrReadOnly(BasePermission):
    """
    Standard read-only for guests, full access for authenticated users.
    Used on stock detail, chart, and financials endpoints.
    """

    def has_permission(self, request, view):
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return True
        return bool(request.user and request.user.is_authenticated)


class IsAuthenticatedForAction(BasePermission):
    """
    Allows guest READ access but returns a specific 401 payload for
    write/action endpoints (Follow, Export, Custom Ratios).

    The frontend intercepts this 401 and opens the login modal instead
    of navigating away.

    Response shape:
        HTTP 401
        {
            "error": "Login required to perform this action.",
            "code": 401,
            "trigger": "LOGIN_MODAL"
        }
    """

    message = {
        "error": "Login required to perform this action.",
        "code": 401,
        "trigger": "LOGIN_MODAL",
    }

    def has_permission(self, request, view):
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return True
        if request.user and request.user.is_authenticated:
            return True
        # Deny with the special modal-trigger payload
        return False


class IsOwner(BasePermission):
    """
    Object-level permission — only allows the owner of an object to access it.
    Assumes the model instance has a `user` FK field.
    """

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
