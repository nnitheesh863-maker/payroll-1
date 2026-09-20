"""
Global constants and enumeration values for payroll business logic.
"""

class UserRole:
    ADMIN = "ADMIN"
    HR_MANAGER = "HR_MANAGER"
    PAYROLL_ADMIN = "PAYROLL_ADMIN"
    EMPLOYEE = "EMPLOYEE"

class ContractStatus:
    DRAFT = "DRAFT"
    ACTIVE = "ACTIVE"
    SUSPENDED = "SUSPENDED"
    TERMINATED = "TERMINATED"

class PayrunStatus:
    DRAFT = "DRAFT"
    PROCESSING = "PROCESSING"
    APPROVED = "APPROVED"
    PAID = "PAID"
    CANCELLED = "CANCELLED"

class TimeOffStatus:
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    CANCELLED = "CANCELLED"
