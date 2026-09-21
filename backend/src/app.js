import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import employeeRoutes from './routes/employee.routes.js';
import corehrRoutes from './routes/corehr.routes.js';
import payrollRoutes from './routes/payroll.routes.js';
import timeoffRoutes from './routes/timeoff.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import userRoutes from './routes/user.routes.js';

export const app = express();

// ── Security & Parsing Middleware ──
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

// ── Root Endpoint ──
app.get('/', (req, res) => {
  res.json({
    app: config.PROJECT_NAME,
    status: 'online',
    version: '2.0.0',
    runtime: 'Node.js Express API',
  });
});

// ── API Routes ──
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/time-off', timeoffRoutes);
app.use('/api', corehrRoutes);
app.use('/api', payrollRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', userRoutes);
app.use('/api', healthRoutes);

// ── Catch 404 for API ──
app.use('/api/*', (req, res) => {
  res.status(404).json({ detail: `API route ${req.originalUrl} not found.` });
});

// ── Central Error Handling ──
app.use(errorHandler);

export default app;
