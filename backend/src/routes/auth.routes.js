import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  createAccessToken,
  createRefreshToken,
  decodeToken,
  DEFAULT_USERS,
  findUserByEmail,
  findUserById,
  hashPassword,
  ROLES,
  verifyPassword,
} from '../services/auth.service.js';
import { query } from '../config/db.js';
import { jwtRequired } from '../middleware/auth.js';

const router = express.Router();

// ── Login ──
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const plainPassword = String(password || '').trim();

  if (!normalizedEmail || !plainPassword) {
    return res.status(401).json({ detail: 'Invalid credentials.' });
  }

  try {
    // 1. Check in DB
    const dbUser = await findUserByEmail(normalizedEmail);
    if (dbUser) {
      if (dbUser.is_active === false) {
        const isMatch = await verifyPassword(dbUser.password_hash || dbUser.password, plainPassword);
        if (isMatch) {
          return res.status(403).json({
            detail: 'Status: PENDING APPROVAL — Your HR account is awaiting verification by the System Administrator under User Management.',
          });
        }
      }

      const isValid = await verifyPassword(dbUser.password_hash || dbUser.password, plainPassword);
      if (isValid) {
        const accessToken = createAccessToken(dbUser);
        const refreshToken = createRefreshToken(dbUser);
        const { password_hash, password, ...safeUser } = dbUser;
        return res.json({
          access_token: accessToken,
          refresh_token: refreshToken,
          token_type: 'bearer',
          user: safeUser,
        });
      }
    }

    // 2. Check in Persona Fallback
    const persona = DEFAULT_USERS[normalizedEmail];
    if (persona && persona.password === plainPassword && persona.is_active !== false) {
      const accessToken = createAccessToken(persona);
      const refreshToken = createRefreshToken(persona);
      const { password, ...safeUser } = persona;
      return res.json({
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: 'bearer',
        user: safeUser,
      });
    }

    return res.status(401).json({ detail: 'Invalid credentials.' });
  } catch (err) {
    return res.status(500).json({ detail: err.message || 'Authentication error.' });
  }
});

// ── Profile (Me) ──
router.get('/me', jwtRequired, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ detail: 'User not found or inactive.' });
    }
    const { password, password_hash, ...safeUser } = user;
    return res.json(safeUser);
  } catch (err) {
    return res.status(401).json({ detail: 'Invalid or expired token.' });
  }
});

// ── Refresh Token ──
router.post('/refresh', async (req, res) => {
  const { refresh_token } = req.body || {};
  if (!refresh_token) {
    return res.status(401).json({ detail: 'Refresh token is required.' });
  }

  try {
    const claims = decodeToken(refresh_token, 'refresh');
    let user = await findUserById(claims.sub);

    if (!user) {
      user = {
        id: claims.sub,
        email: claims.email,
        role: claims.role || ROLES.ADMIN,
        is_active: true,
      };
    }

    const newAccessToken = createAccessToken(user);
    const newRefreshToken = createRefreshToken(user);

    return res.json({
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
      token_type: 'bearer',
    });
  } catch (err) {
    return res.status(401).json({ detail: err.message || 'Invalid or expired refresh token.' });
  }
});

// ── Register ──
router.post('/register', async (req, res) => {
  const { email, full_name, name, role = 'EMPLOYEE', password } = req.body || {};
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const userName = String(full_name || name || '').trim();
  const userPassword = String(password || '').trim();
  let userRole = String(role || 'EMPLOYEE').trim().toUpperCase();

  if (!userPassword) return res.status(400).json({ detail: 'Password is required.' });
  if (!normalizedEmail) return res.status(400).json({ detail: 'Email is required.' });
  if (!userName) return res.status(400).json({ detail: 'Full name is required.' });

  if (!Object.values(ROLES).includes(userRole) || userRole === 'ADMIN') {
    userRole = 'EMPLOYEE';
  }

  const existing = await findUserByEmail(normalizedEmail);
  if (existing) {
    return res.status(400).json({ detail: 'Email already registered.' });
  }

  const isHr = ['HR_MANAGER', 'HR_PAYROLL_MANAGER', 'HR_PAYROLL_USER'].includes(userRole);
  const isActive = !isHr;

  try {
    const pwdHash = await hashPassword(userPassword);
    const newId = uuidv4();

    let createdUser = {
      id: newId,
      email: normalizedEmail,
      full_name: userName,
      role: userRole,
      is_active: isActive,
      created_at: new Date().toISOString(),
    };

    try {
      const insertSql = `
        INSERT INTO users (id, email, password_hash, full_name, role, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING id, email, full_name, role, is_active, created_at;
      `;
      const result = await query(insertSql, [newId, normalizedEmail, pwdHash, userName, userRole, isActive]);
      if (result.rows.length > 0) {
        createdUser = result.rows[0];
      }
    } catch (dbErr) {
      // In-memory fallback if users table isn't migrated
      DEFAULT_USERS[normalizedEmail] = {
        ...createdUser,
        password: userPassword,
      };
    }

    if (!isActive) {
      return res.status(201).json({
        user: createdUser,
        status: 'PENDING_APPROVAL',
        detail: 'Your HR account has been registered and is awaiting verification by the System Administrator.',
      });
    }

    return res.status(201).json({
      user: createdUser,
      access_token: createAccessToken(createdUser),
      refresh_token: createRefreshToken(createdUser),
      token_type: 'bearer',
    });
  } catch (err) {
    return res.status(400).json({ detail: `Registration failed: ${err.message}` });
  }
});

export default router;
