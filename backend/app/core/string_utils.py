"""
String manipulation and slugification utilities.
"""
import re
import unicodedata

def slugify(text: str) -> str:
    """Generate a URL/file-friendly slug from string."""
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')
    text = re.sub(r'[^\w\s-]', '', text).strip().lower()
    return re.sub(r'[-\s]+', '-', text)

def mask_sensitive(value: str, visible_tail: int = 4, mask_char: str = "*") -> str:
    """Mask sensitive string (e.g. SSN or Bank Account) keeping last N characters visible."""
    if not value or len(value) <= visible_tail:
        return value or ""
    return mask_char * (len(value) - visible_tail) + value[-visible_tail:]
