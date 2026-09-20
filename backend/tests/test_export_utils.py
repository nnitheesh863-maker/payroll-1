from app.core.export_utils import export_dict_to_csv

def test_export_dict_to_csv():
    data = [
        {"id": "1", "name": "Alice", "role": "Engineer"},
        {"id": "2", "name": "Bob", "role": "Manager"}
    ]
    csv_str = export_dict_to_csv(data, ["id", "name", "role"])
    assert "id,name,role" in csv_str
    assert "Alice" in csv_str
    assert "Bob" in csv_str
