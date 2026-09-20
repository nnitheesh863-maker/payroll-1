from decimal import Decimal
from app.core.currency_utils import round_currency, calculate_percentage, format_currency_string

def test_round_currency():
    assert round_currency(123.456) == Decimal("123.46")
    assert round_currency("10.505") == Decimal("10.51")

def test_calculate_percentage():
    assert calculate_percentage(1000, 15) == Decimal("150.00")
    assert calculate_percentage(250, 8.5) == Decimal("21.25")

def test_format_currency_string():
    assert format_currency_string(1234.5) == "$1,234.50"
    assert format_currency_string(0, "€") == "€0.00"
