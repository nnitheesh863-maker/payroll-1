# Deployment & Troubleshooting Guide

## Deployment Checklist

1. **Environment Variables**:
   - Ensure `DATABASE_URL` uses production credentials with SSL mode enabled.
   - Set unique, cryptographically secure `SECRET_KEY` and `JWT_SECRET_KEY`.
   - Update `CORS_ORIGINS` to allow only verified frontend domains.
2. **Database Migrations**:
   - Run `flask --app app db upgrade` during the deployment release phase.
3. **Frontend Production Build**:
   - Run `npm run build` in the `frontend/` directory.
   - Serve static assets via CDN or reverse proxy (Nginx/Cloudflare).

## Troubleshooting Common Issues

- **Network Error / CORS Issue**: Check that backend port matches frontend proxy and CORS origins in `.env`.
- **Database Connection Refused**: Verify PostgreSQL socket/host accessibility and SSL parameters.
- **Token Expiration**: Confirm client system time synchronization with server clock.
