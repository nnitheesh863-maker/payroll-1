# PeoplePay360 Testing Strategy & Suites

## Backend Unit & Integration Tests
Backend tests are executed using Pytest:
```bash
cd backend
pytest -v
```

### Coverage Goals
- Core math & calculation utilities: 100% coverage
- Authentication & JWT security assertions
- REST API response schemas and HTTP error codes

## Frontend Testing
- Mock data fixtures in `src/mocks/` provide deterministic states for UI component testing.
