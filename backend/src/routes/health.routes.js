import express from 'express';
import { pool } from '../config/db.js';
import { config } from '../config/env.js';

const router = express.Router();

router.get('/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    const client = await pool.connect();
    client.release();
    dbStatus = 'connected';
  } catch (err) {
    dbStatus = 'offline_or_fallback';
  }

  res.json({
    app: config.PROJECT_NAME,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    runtime: 'Node.js Express',
  });
});

export default router;
