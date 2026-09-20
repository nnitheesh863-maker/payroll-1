"""
Base SQLAlchemy model class providing common audit timestamps and helper methods.
"""
from datetime import datetime, timezone
from sqlalchemy import DateTime, Column
from sqlalchemy.orm import declarative_base

BaseModel = declarative_base()

class TimestampMixin:
    """Mixin adding created_at and updated_at UTC timestamps to models."""
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )
