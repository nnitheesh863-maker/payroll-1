import pkg from 'pg';
const { Pool } = pkg;
import { config } from './env.js';

// Format connection string for pg if postgresql+psycopg was provided
let connectionString = config.DATABASE_URL;
if (connectionString && connectionString.startsWith('postgresql+psycopg://')) {
  connectionString = connectionString.replace('postgresql+psycopg://', 'postgresql://');
}

export const pool = new Pool({
  connectionString: connectionString,
  ssl: connectionString && connectionString.includes('supabase.com') ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err.message);
});

export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (err) {
    console.error('Database query error:', err.message, 'SQL:', text);
    throw err;
  }
};

/**
 * Health check helper to verify database connectivity
 */
export const testDbConnection = async () => {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT 1 AS connected;');
    client.release();
    return res.rows[0]?.connected === 1;
  } catch (err) {
    return false;
  }
};
