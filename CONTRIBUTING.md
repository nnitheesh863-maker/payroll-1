# Contributing to PeoplePay360

Thank you for investing your time in contributing to PeoplePay360!

## Development Workflow

1. Fork or branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Set up the development environments:
   - Backend: Activate virtualenv, install dependencies, run flask server on port 5000.
   - Frontend: Run `npm install` and `npm run dev`.
3. Adhere to code style:
   - Python: PEP 8 guidelines and type hints.
   - TypeScript: Strict typing and ESLint conventions.
4. Ensure all automated tests pass before creating a pull request:
   ```bash
   pytest
   npm run build
   ```
5. Submit PR with a concise description of changes and test results.
