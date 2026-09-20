"""
Data export utilities for transforming query results into CSV format.
"""
import csv
import io
from typing import List, Dict, Any

def export_dict_to_csv(rows: List[Dict[str, Any]], fieldnames: List[str]) -> str:
    """Convert a list of dictionaries into a CSV string."""
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=fieldnames, extrasaction='ignore')
    writer.writeheader()
    for row in rows:
        writer.writerow(row)
    return output.getvalue()
