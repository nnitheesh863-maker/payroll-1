# PeoplePay360 API Reference Guide

## Base URL
- Local Dev: `http://localhost:5000/api`
- Production: `https://api.peoplepay360.internal/api`

## Authentication
All requests (except public endpoints) require the `Authorization` header:
```
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

## Endpoints

### 1. Health Check
- `GET /api/health`
  - Returns: `{"status": "ok"}`

### 2. Authentication
- `POST /api/auth/login`
  - Request: `{"email": "user@example.com", "password": "secure_password"}`
  - Response: `{"access_token": "...", "refresh_token": "...", "user": {...}}`
- `POST /api/auth/refresh`
  - Request: `{"refresh_token": "..."}`
  - Response: `{"access_token": "...", "refresh_token": "..."}`

### 3. Employees
- `GET /api/employees` — List employees with pagination and filtering
- `POST /api/employees` — Create new employee record
- `GET /api/employees/:id` — Retrieve employee profile details
- `PUT /api/employees/:id` — Update employee record

### 4. Payroll
- `GET /api/payroll/runs` — List all payroll runs
- `POST /api/payroll/runs` — Initiate a new pay cycle calculation
- `GET /api/payroll/runs/:id/payslips` — Fetch individual payslips for a run
