from datetime import date, datetime, timezone
from app.core.datetime_utils import to_iso8601, parse_iso8601, count_business_days

def test_to_iso8601():
    d = date(2026, 9, 21)
    assert to_iso8601(d) == "2026-09-21"
    assert to_iso8601(None) is None

def test_parse_iso8601():
    dt = parse_iso8601("2026-09-21T12:00:00Z")
    assert dt is not None
    assert dt.year == 2026
    assert dt.month == 9
    assert parse_iso8601(None) is None

def test_count_business_days():
    # Mon 2026-09-21 to Fri 2026-09-25 is 5 business days
    start = date(2026, 9, 21)
    end = date(2026, 9, 25)
    assert count_business_days(start, end) == 5
    # Over weekend: Mon to Sun is 5 business days
    end_sun = date(2026, 9, 27)
    assert count_business_days(start, end_sun) == 5
