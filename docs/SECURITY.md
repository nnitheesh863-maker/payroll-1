# Security Policy & Best Practices

## Reporting Vulnerabilities
If you discover any security issues, please report them directly to the security team rather than opening public issues.

## Architectural Security Measures
- **Password Hashing**: Bcrypt with minimum cost factor 12.
- **JWT Protection**: Short-lived access tokens (15 minutes) and rotating refresh tokens (7 days).
- **Role-Based Access Control (RBAC)**: Strict authorization checks at route and service layer.
- **Input Sanitization**: Pydantic schema validation preventing injection vulnerabilities.
- **Rate Limiting**: Throttling on sensitive endpoints (e.g., login, password reset).
