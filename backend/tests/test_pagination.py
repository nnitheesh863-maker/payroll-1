from app.core.pagination import paginate_records

def test_paginate_records():
    items = ["emp1", "emp2", "emp3"]
    result = paginate_records(items, page=1, page_size=10, total_count=35)
    assert result["items"] == items
    assert result["pagination"]["total_pages"] == 4
    assert result["pagination"]["has_next"] is True
    assert result["pagination"]["has_prev"] is False
