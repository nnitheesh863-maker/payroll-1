"""
Audit logging service for registering compliance actions.
"""
from typing import Optional, Dict, Any
from app.models.audit_log import AuditLog
from app.extensions import db

class AuditService:
    @staticmethod
    def log_event(
        action: str,
        resource_type: str,
        user_id: Optional[str] = None,
        resource_id: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None
    ) -> AuditLog:
        """Create and commit a new audit record."""
        log = AuditLog(
            action=action,
            resource_type=resource_type,
            user_id=user_id,
            resource_id=resource_id,
            details=details,
            ip_address=ip_address
        )
        db.session.add(log)
        db.session.commit()
        return log
