"""
Standard pagination response builder for REST API endpoints.
"""
from typing import List, Any, Dict
import math

def paginate_records(items: List[Any], page: int = 1, page_size: int = 20, total_count: int = 0) -> Dict[str, Any]:
    """Create standardized paginated response envelope."""
    page = max(1, page)
    page_size = max(1, min(100, page_size))
    total_pages = math.ceil(total_count / page_size) if total_count > 0 else 1

    return {
        "items": items,
        "pagination": {
            "page": page,
            "page_size": page_size,
            "total_count": total_count,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1
        }
    }
