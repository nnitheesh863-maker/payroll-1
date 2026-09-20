# PeoplePay360 System Architecture

## Overview
PeoplePay360 is a full-stack modern HR & Payroll management platform designed for high performance, compliance, and developer ergonomics.

## System Topology
```
[ Browser Client (React / Vite / Tailwind) ]
                  |
         REST API (HTTP / JSON)
                  |
   [ Flask 3.x Application Server ]
     ├── Authentication & RBAC (JWT)
     ├── Employee Lifecycle Management
     ├── Payroll & Compensation Engine
     ├── Leave & Attendance Tracking
     └── Document Vault & Signatures
                  |
     SQLAlchemy 2.0 ORM / Connection Pool
                  |
    [ PostgreSQL / Supabase Database ]
```

## Core Modules
- **Auth Module**: Token-based authentication with role-based access control (Admin, HR Manager, Employee).
- **Payroll Engine**: Automated gross-to-net calculations, statutory deductions, tax withholdings, and payrun cycles.
- **Employee Hub**: Profiles, contractual agreements, departmental mapping, and emergency contacts.
- **Attendance & Time-Off**: Leave allowances, balance accrual, multi-tier approval workflows, and check-in logs.
- **Integrations & Analytics**: Supabase real-time sync, audit logs, and export pipelines.
