"""
apps/market/middleware.py

JWTAuthMiddlewareStack:
  Django Channels middleware that authenticates WebSocket connections
  using the JWT access token passed as a query parameter.

  Usage: ws://host/ws/market/?token=<access_token>
         ws://host/ws/stock/RELIANCE/?token=<access_token>

  Guests (no token) are allowed to connect for READ-ONLY data streams.
  The `scope["user"]` will be AnonymousUser for unauthenticated connections.
"""

import logging
from urllib.parse import parse_qs

from channels.middleware import BaseMiddleware
from channels.auth import AuthMiddlewareStack
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model

User = get_user_model()
logger = logging.getLogger("apps")


class JWTAuthMiddleware(BaseMiddleware):
    """
    Parses the JWT token from the WebSocket query string and
    attaches the authenticated user (or AnonymousUser) to the scope.
    """

    async def __call__(self, scope, receive, send):
        # Extract token from query string: ?token=<jwt>
        query_string = scope.get("query_string", b"").decode()
        params = parse_qs(query_string)
        token = params.get("token", [None])[0]

        scope["user"] = AnonymousUser()

        if token:
            try:
                from rest_framework_simplejwt.tokens import AccessToken
                from rest_framework_simplejwt.exceptions import TokenError
                from channels.db import database_sync_to_async

                access_token = AccessToken(token)
                user_id = access_token["user_id"]

                @database_sync_to_async
                def get_user(uid):
                    try:
                        return User.objects.get(pk=uid, is_active=True)
                    except User.DoesNotExist:
                        return AnonymousUser()

                scope["user"] = await get_user(user_id)
                logger.debug("WS authenticated user: %s", scope["user"])

            except Exception as e:
                logger.debug("WS JWT auth failed: %s", e)
                scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)


def JWTAuthMiddlewareStack(inner):
    """Convenience wrapper — wraps the inner app with JWTAuthMiddleware."""
    return JWTAuthMiddleware(AuthMiddlewareStack(inner))
