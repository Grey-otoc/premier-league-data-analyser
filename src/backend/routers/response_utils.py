"""
Standardised API response wrapper.
All endpoints should return via success_response() or error_response()
so that the frontend can rely on a consistent shape:

  {
    "status": "success" | "error",
    "data":    <payload>  | null,
    "message": null       | "<human-readable error string>"
  }
"""

from typing import Any


def success_response(data: Any, message: str | None = None) -> dict:
    """Wrap a successful payload in the standard envelope."""
    return {
        "status": "success",
        "data": data,
        "message": message,
    }


def error_response(message: str, data: Any = None) -> dict:
    """Wrap an error in the standard envelope."""
    return {
        "status": "error",
        "data": data,
        "message": message,
    }
