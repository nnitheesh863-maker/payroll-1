from app.core.validators import is_valid_email, is_valid_phone, sanitize_string

def test_is_valid_email():
    assert is_valid_email("admin@peoplepay360.com") is True
    assert is_valid_email("invalid-email") is False
    assert is_valid_email("") is False

def test_is_valid_phone():
    assert is_valid_phone("+1 555-0199") is True
    assert is_valid_phone("1234567") is True
    assert is_valid_phone("abc") is False

def test_sanitize_string():
    assert sanitize_string("  hello world  ") == "hello world"
    assert sanitize_string("a" * 300, max_length=10) == "a" * 10
