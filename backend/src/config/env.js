import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Validated Application Environment Configuration
 */
export const config = {
  PORT: Number(process.env.PORT) || 5000,
  PROJECT_NAME: process.env.PROJECT_NAME || 'PeoplePay360',
  API_PREFIX: process.env.API_PREFIX || '/api',
  DATABASE_URL:
    process.env.DATABASE_URL ||
    'postgresql://postgres.imjkhnvnmbfnlxwqjsfy:Nitheesh8248@aws-0-ap-south-1.pooler.supabase.com:5432/postgres',
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'peoplepay360-jwt-secret-production-key-enterprise',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '1h',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  NODE_ENV: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV !== 'production',
};
