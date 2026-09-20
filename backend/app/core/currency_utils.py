"""
Currency and precision arithmetic utilities for payroll calculations.
"""
from decimal import Decimal, ROUND_HALF_UP
from typing import Union

def round_currency(value: Union[float, int, str, Decimal], decimals: int = 2) -> Decimal:
    """Round a monetary value using standard banker's/commercial half-up rounding."""
    if not isinstance(value, Decimal):
        value = Decimal(str(value))
    exponent = Decimal("10") ** -decimals
    return value.quantize(exponent, rounding=ROUND_HALF_UP)

def calculate_percentage(base: Union[float, int, Decimal], percentage: Union[float, int, Decimal]) -> Decimal:
    """Calculate percentage amount from a base monetary value."""
    b = Decimal(str(base))
    p = Decimal(str(percentage))
    return round_currency((b * p) / Decimal("100"))

def format_currency_string(amount: Union[float, int, Decimal], symbol: str = "$") -> str:
    """Format numeric value into standard formatted currency string."""
    dec = round_currency(amount)
    return f"{symbol}{dec:,.2f}"
