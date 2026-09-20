from app.models.audit_log import AuditLog

def test_audit_log_to_dict():
    log = AuditLog(
        id="test-log-1",
        action="USER_LOGIN",
        resource_type="USER",
        resource_id="usr-123",
        details={"browser": "Chrome"},
        ip_address="127.0.0.1"
    )
    d = log.to_dict()
    assert d["id"] == "test-log-1"
    assert d["action"] == "USER_LOGIN"
    assert d["details"]["browser"] == "Chrome"
