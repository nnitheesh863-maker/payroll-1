import express from 'express';
import { testDbConnection } from '../config/db.js';
import { config } from '../config/env.js';

const router = express.Router();
const startTime = Date.now();

router.get('/health', async (req, res) => {
  const isDbConnected = await testDbConnection();
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

  res.json({
    app: config.PROJECT_NAME,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime_seconds: uptimeSeconds,
    database: isDbConnected ? 'connected' : 'offline_or_fallback',
    environment: config.NODE_ENV,
    runtime: 'Node.js Express',
  });
});

export default router;
