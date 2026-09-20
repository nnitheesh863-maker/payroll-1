"""
Standardized API JSON response builder and error formatters.
"""
from typing import Any, Optional, Dict, Tuple
from flask import jsonify, Response

def success_response(data: Any = None, message: str = "Success", status_code: int = 200) -> Tuple[Response, int]:
    """Return uniform success JSON response."""
    payload: Dict[str, Any] = {
        "success": True,
        "message": message,
        "data": data
    }
    return jsonify(payload), status_code

def error_response(message: str = "An error occurred", code: str = "BAD_REQUEST", details: Optional[Any] = None, status_code: int = 400) -> Tuple[Response, int]:
    """Return uniform error JSON response."""
    payload: Dict[str, Any] = {
        "success": False,
        "error": {
            "code": code,
            "message": message,
            "details": details
        }
    }
    return jsonify(payload), status_code
