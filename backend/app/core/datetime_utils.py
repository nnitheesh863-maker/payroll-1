"""
Datetime utility helpers for ISO-8601 formatting, timezone normalization,
and business day calculation.
"""
from datetime import datetime, date, timedelta, timezone
from typing import Optional, Union

def to_iso8601(dt: Optional[Union[datetime, date]]) -> Optional[str]:
    """Convert datetime or date object to ISO-8601 string representation."""
    if dt is None:
        return None
    if isinstance(dt, datetime):
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.isoformat()
    return dt.isoformat()

def parse_iso8601(iso_str: Optional[str]) -> Optional[datetime]:
    """Parse ISO-8601 string into a UTC datetime object."""
    if not iso_str:
        return None
    try:
        dt = datetime.fromisoformat(iso_str.replace("Z", "+00:00"))
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt
    except (ValueError, TypeError):
        return None

def count_business_days(start_date: date, end_date: date) -> int:
    """Calculate the number of business days (Monday-Friday) between two dates inclusive."""
    if start_date > end_date:
        return 0
    days = 0
    cur = start_date
    while cur <= end_date:
        if cur.weekday() < 5:  # 0 to 4 are Mon-Fri
            days += 1
        cur += timedelta(days=1)
    return days
