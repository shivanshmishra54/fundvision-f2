"""
apps/users/middleware.py

GuestAuthMiddleware:
  Identifies guest (unauthenticated) users.
  When a guest hits a protected endpoint (Follow, Export, Custom Ratios),
  the view raises a specific 401 that the frontend uses to trigger the
  login popup rather than redirecting to a login page.
"""

import logging
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger("apps")


class GuestAuthMiddleware(MiddlewareMixin):
    """
    Tags each request with `request.is_guest` for use in views/permissions.
    
    This is purely informational — the actual enforcement happens in
    the IsAuthenticatedOrGuest permission class used by protected ViewSets.
    """

    def process_request(self, request):
        request.is_guest = not (
            hasattr(request, "user") and request.user and request.user.is_authenticated
        )
        return None
