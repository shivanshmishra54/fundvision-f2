"""
fundvision/wsgi.py  —  WSGI entry-point for standard HTTP (Gunicorn, uWSGI).
For WebSocket support use asgi.py with Daphne / Uvicorn instead.
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "fundvision.settings")

application = get_wsgi_application()
