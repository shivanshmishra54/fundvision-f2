"""
fundvision/asgi.py  —  ASGI entry-point with Django Channels routing.

Handles both:
  - Standard HTTP requests  (Django views / DRF)
  - WebSocket connections   (Channels consumers)
"""

import os
import django
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "fundvision.settings")
django.setup()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from apps.market.middleware import JWTAuthMiddlewareStack
import apps.market.routing as market_routing
import apps.stocks.routing as stocks_routing

application = ProtocolTypeRouter(
    {
        # Standard Django HTTP
        "http": get_asgi_application(),

        # WebSocket — validate origin then route
        "websocket": AllowedHostsOriginValidator(
            JWTAuthMiddlewareStack(
                URLRouter(
                    market_routing.websocket_urlpatterns
                    + stocks_routing.websocket_urlpatterns
                )
            )
        ),
    }
)
