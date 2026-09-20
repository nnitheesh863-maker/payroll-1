"""
Validation utilities for common input formats (emails, phone numbers, tax identifiers).
"""
import re
from typing import Optional

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
PHONE_REGEX = re.compile(r"^\+?[0-9\s\-()]{7,20}$")

def is_valid_email(email: Optional[str]) -> bool:
    """Validate email address format."""
    if not email:
        return False
    return bool(EMAIL_REGEX.match(email.strip()))

def is_valid_phone(phone: Optional[str]) -> bool:
    """Validate telephone number string format."""
    if not phone:
        return False
    return bool(PHONE_REGEX.match(phone.strip()))

def sanitize_string(text: Optional[str], max_length: int = 255) -> str:
    """Strip leading/trailing whitespace and limit text length."""
    if not text:
        return ""
    return text.strip()[:max_length]
