"""
fundvision/celery.py  —  Celery application setup
"""

import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "fundvision.settings")

app = Celery("fundvision")

# Read config from Django settings, namespace all Celery keys with CELERY_
app.config_from_object("django.conf:settings", namespace="CELERY")

# Auto-discover tasks in all installed apps
app.autodiscover_tasks()


@app.task(bind=True, ignore_result=True)
def debug_task(self):
    """Health-check task."""
    print(f"Request: {self.request!r}")
