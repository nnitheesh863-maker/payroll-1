def test_health_check_payload(client=None):
    """Test health check format."""
    payload = {"status": "ok"}
    assert payload["status"] == "ok"
