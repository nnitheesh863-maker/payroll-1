import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/env.js';
import { query } from '../config/db.js';

export const ROLES = {
  ADMIN: 'ADMIN',
  HR_MANAGER: 'HR_MANAGER',
  HR_PAYROLL_MANAGER: 'HR_PAYROLL_MANAGER',
  HR_PAYROLL_USER: 'HR_PAYROLL_USER',
  EMPLOYEE: 'EMPLOYEE',
};

export const PERMISSIONS = {
  USERS_MANAGE: 'users:manage',
  PAYROLL_READ: 'payroll:read',
  PAYROLL_COMPUTE: 'payroll:compute',
  PAYROLL_VALIDATE: 'payroll:validate',
  PAYROLL_PAY: 'payroll:pay',
  PAYROLL_SEND: 'payroll:send',
  PAYROLL_DASHBOARD: 'payroll:dashboard',
  CONTRACTS_MANAGE: 'contracts:manage',
  EMPLOYEES_MANAGE: 'employees:manage',
  TIME_OFF_APPROVE: 'time_off:approve',
};

export const ROLE_PERMISSIONS = {
  ADMIN: Object.values(PERMISSIONS),
  HR_MANAGER: [
    PERMISSIONS.EMPLOYEES_MANAGE,
    PERMISSIONS.CONTRACTS_MANAGE,
    PERMISSIONS.TIME_OFF_APPROVE,
    PERMISSIONS.PAYROLL_READ,
    PERMISSIONS.PAYROLL_DASHBOARD,
  ],
  HR_PAYROLL_MANAGER: [
    PERMISSIONS.PAYROLL_READ,
    PERMISSIONS.PAYROLL_COMPUTE,
    PERMISSIONS.PAYROLL_VALIDATE,
    PERMISSIONS.PAYROLL_PAY,
    PERMISSIONS.PAYROLL_SEND,
    PERMISSIONS.PAYROLL_DASHBOARD,
    PERMISSIONS.CONTRACTS_MANAGE,
  ],
  HR_PAYROLL_USER: [
    PERMISSIONS.PAYROLL_READ,
    PERMISSIONS.PAYROLL_COMPUTE,
    PERMISSIONS.PAYROLL_DASHBOARD,
  ],
  EMPLOYEE: [],
};

export const DEFAULT_USERS = {
  'admin@peoplepay360.com': {
    id: 1,
    email: 'admin@peoplepay360.com',
    full_name: 'Alexander Wright',
    role: 'ADMIN',
    is_active: true,
    password: 'Admin@123',
    created_at: '2026-01-01T00:00:00Z',
  },
  'hrmanager@peoplepay360.com': {
    id: 2,
    email: 'hrmanager@peoplepay360.com',
    full_name: 'Sarah Jenkins',
    role: 'HR_MANAGER',
    is_active: true,
    password: 'HrManager@123',
    created_at: '2026-01-01T00:00:00Z',
  },
  'payrollmanager@peoplepay360.com': {
    id: 3,
    email: 'payrollmanager@peoplepay360.com',
    full_name: 'Marcus Chen',
    role: 'HR_PAYROLL_MANAGER',
    is_active: true,
    password: 'PayrollManager@123',
    created_at: '2026-01-01T00:00:00Z',
  },
  'payrolluser@peoplepay360.com': {
    id: 4,
    email: 'payrolluser@peoplepay360.com',
    full_name: 'Elena Rostova',
    role: 'HR_PAYROLL_USER',
    is_active: true,
    password: 'PayrollUser@123',
    created_at: '2026-01-01T00:00:00Z',
  },
  'employee@peoplepay360.com': {
    id: 5,
    email: 'employee@peoplepay360.com',
    full_name: 'David Kumar',
    role: 'EMPLOYEE',
    is_active: true,
    password: 'Employee@123',
    created_at: '2026-01-01T00:00:00Z',
  },
};

export const formatSafeUser = (user) => {
  if (!user) return null;
  const { password, password_hash, ...safe } = user;
  return safe;
};

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const verifyPassword = async (hashedPassword, plainPassword) => {
  if (!hashedPassword || !plainPassword) return false;
  if (hashedPassword === plainPassword) return true; // Plaintext support for seed
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (err) {
    return false;
  }
};

export const createAccessToken = (user) => {
  const payload = {
    sub: String(user.id),
    email: user.email,
    role: user.role,
    employee_id: user.employee_id || null,
    full_name: user.full_name || user.name || '',
    type: 'access',
  };
  return jwt.sign(payload, config.JWT_SECRET_KEY, { expiresIn: config.JWT_ACCESS_EXPIRES_IN });
};

export const createRefreshToken = (user) => {
  const payload = {
    sub: String(user.id),
    email: user.email,
    role: user.role,
    type: 'refresh',
  };
  return jwt.sign(payload, config.JWT_SECRET_KEY, { expiresIn: config.JWT_REFRESH_EXPIRES_IN });
};

export const extractBearerToken = (authHeader) => {
  if (!authHeader || typeof authHeader !== 'string') return null;
  const parts = authHeader.trim().split(' ');
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
    return parts[1].trim();
  }
  return null;
};

export const decodeToken = (token, expectedType = 'access') => {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET_KEY);
    if (expectedType && decoded.type && decoded.type !== expectedType) {
      throw new Error(`Invalid token type: expected ${expectedType}`);
    }
    return decoded;
  } catch (err) {
    throw new Error(err.message || 'Invalid or expired token.');
  }
};

export const hasPermission = (role, permission) => {
  if (!role) return false;
  if (role === ROLES.ADMIN) return true;
  const userPerms = ROLE_PERMISSIONS[role] || [];
  return userPerms.includes(permission);
};

export const findUserByEmail = async (email) => {
  const normalized = String(email || '').trim().toLowerCase();
  if (!normalized) return null;

  try {
    const res = await query('SELECT * FROM users WHERE LOWER(email) = $1 LIMIT 1', [normalized]);
    if (res.rows.length > 0) {
      return res.rows[0];
    }
  } catch (err) {
    // Database fallback to memory personas
  }

  const persona = DEFAULT_USERS[normalized];
  if (persona) return persona;

  return null;
};

export const findUserById = async (id) => {
  if (!id) return null;

  try {
    const res = await query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
    if (res.rows.length > 0) {
      return res.rows[0];
    }
  } catch (err) {
    // Database fallback
  }

  for (const p of Object.values(DEFAULT_USERS)) {
    if (String(p.id) === String(id) || p.email.toLowerCase() === String(id).toLowerCase()) {
      return p;
    }
  }

  return null;
};
