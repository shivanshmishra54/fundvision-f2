"""
fundvision/exceptions.py

Standardized JSON error responses across all API endpoints.
Every error returns: { "error": "...", "code": <http_status>, "details": {...} }
"""

import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger("apps")


def custom_exception_handler(exc, context):
    """
    Global DRF exception handler. Returns consistent JSON error envelopes.

    Response shape:
        {
            "error": "Human-readable message",
            "code": 404,
            "details": { ... }   # Optional field-level errors (validation)
        }
    """
    # Call DRF's default handler first to get the standard response
    response = exception_handler(exc, context)

    if response is not None:
        error_data = {
            "error": _get_error_message(response),
            "code": response.status_code,
        }

        # Include field-level details for validation errors (400)
        if isinstance(response.data, dict) and response.status_code == 400:
            # Filter out the 'detail' key to avoid duplication
            details = {k: v for k, v in response.data.items() if k != "detail"}
            if details:
                error_data["details"] = details

        response.data = error_data
        logger.warning(
            "API Error %s: %s | View: %s",
            response.status_code,
            error_data["error"],
            context.get("view", "unknown"),
        )

    return response


def _get_error_message(response) -> str:
    """Extract a clean, human-readable error message from DRF response data."""
    data = response.data

    if isinstance(data, dict):
        if "detail" in data:
            return str(data["detail"])
        # Grab first field's first error for validation errors
        for key, value in data.items():
            if isinstance(value, list) and value:
                return f"{key}: {value[0]}"
            if isinstance(value, str):
                return f"{key}: {value}"

    if isinstance(data, list) and data:
        return str(data[0])

    # Fall back to HTTP status text
    status_messages = {
        400: "Bad request. Please check your input.",
        401: "Authentication required. Please log in.",
        403: "You do not have permission to perform this action.",
        404: "The requested resource was not found.",
        405: "Method not allowed.",
        429: "Too many requests. Please slow down.",
        500: "Internal server error. Please try again later.",
    }
    return status_messages.get(response.status_code, "An unexpected error occurred.")
