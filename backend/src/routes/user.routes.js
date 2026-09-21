import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_USERS, hashPassword, ROLES } from '../services/auth.service.js';
import { query } from '../config/db.js';

const router = express.Router();

let inMemoryUsers = Object.values(DEFAULT_USERS).map(u => ({
  id: String(u.id),
  email: u.email,
  full_name: u.full_name,
  role: u.role,
  is_active: u.is_active,
  created_at: u.created_at || new Date().toISOString(),
}));

// ── List Users ──
router.get('/users', async (req, res) => {
  const { role } = req.query;

  try {
    const dbRes = await query('SELECT id, email, full_name, role, is_active, created_at FROM users ORDER BY created_at DESC');
    if (dbRes.rows && dbRes.rows.length > 0) {
      let users = dbRes.rows;
      if (role && role !== 'ALL') {
        users = users.filter(u => u.role === String(role).toUpperCase());
      }
      return res.json(users);
    }
  } catch (err) {
    // Database fallback
  }

  let users = [...inMemoryUsers];
  if (role && role !== 'ALL') {
    users = users.filter(u => u.role === String(role).toUpperCase());
  }
  return res.json(users);
});

// ── Get User ──
router.get('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const dbRes = await query('SELECT id, email, full_name, role, is_active, created_at FROM users WHERE id = $1', [id]);
    if (dbRes.rows && dbRes.rows.length > 0) {
      return res.json(dbRes.rows[0]);
    }
  } catch (err) {
    // fallback
  }

  const user = inMemoryUsers.find(u => String(u.id) === String(id) || u.email.toLowerCase() === String(id).toLowerCase());
  if (user) return res.json(user);

  return res.status(404).json({ detail: 'User not found' });
});

// ── Create User ──
router.post('/users', async (req, res) => {
  const data = req.body || {};
  const email = String(data.email || '').trim().toLowerCase();
  const fullName = String(data.full_name || '').trim();
  const role = String(data.role || 'EMPLOYEE').trim().toUpperCase();
  const password = String(data.password || 'Pass@123').trim();
  const isActive = data.is_active !== undefined ? Boolean(data.is_active) : true;

  if (!email || !fullName) {
    return res.status(400).json({ detail: 'Email and Full Name are required.' });
  }

  const newId = uuidv4();
  const pwdHash = await hashPassword(password);

  try {
    const insertRes = await query(`
      INSERT INTO users (id, email, password_hash, full_name, role, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING id, email, full_name, role, is_active, created_at;
    `, [newId, email, pwdHash, fullName, role, isActive]);

    if (insertRes.rows.length > 0) {
      return res.status(201).json(insertRes.rows[0]);
    }
  } catch (err) {
    // In-memory fallback
  }

  const newUser = {
    id: newId,
    email,
    full_name: fullName,
    role,
    is_active: isActive,
    created_at: new Date().toISOString(),
  };
  inMemoryUsers.unshift(newUser);
  return res.status(201).json(newUser);
});

// ── Update User ──
router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body || {};

  try {
    const updateRes = await query(`
      UPDATE users 
      SET email = COALESCE($1, email),
          full_name = COALESCE($2, full_name),
          role = COALESCE($3, role),
          is_active = COALESCE($4, is_active),
          updated_at = NOW()
      WHERE id = $5
      RETURNING id, email, full_name, role, is_active, created_at;
    `, [data.email, data.full_name, data.role, data.is_active, id]);

    if (updateRes.rows.length > 0) {
      return res.json(updateRes.rows[0]);
    }
  } catch (err) {
    // In-memory fallback
  }

  const user = inMemoryUsers.find(u => String(u.id) === String(id));
  if (user) {
    Object.assign(user, data);
    return res.json(user);
  }

  return res.status(404).json({ detail: 'User not found' });
});

// ── Toggle Status ──
router.patch('/users/:id/status', async (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body || {};

  try {
    const updateRes = await query(`
      UPDATE users 
      SET is_active = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, email, full_name, role, is_active, created_at;
    `, [Boolean(is_active), id]);

    if (updateRes.rows.length > 0) {
      return res.json(updateRes.rows[0]);
    }
  } catch (err) {
    // In-memory fallback
  }

  const user = inMemoryUsers.find(u => String(u.id) === String(id));
  if (user) {
    user.is_active = Boolean(is_active);
    return res.json(user);
  }

  return res.status(404).json({ detail: 'User not found' });
});

// ── Approve User ──
const approveHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const updateRes = await query(`
      UPDATE users 
      SET is_active = true, updated_at = NOW()
      WHERE id = $1
      RETURNING id, email, full_name, role, is_active, created_at;
    `, [id]);

    if (updateRes.rows.length > 0) {
      return res.json({
        message: 'User registration approved and activated successfully.',
        user: updateRes.rows[0],
      });
    }
  } catch (err) {
    // In-memory fallback
  }

  const user = inMemoryUsers.find(u => String(u.id) === String(id));
  if (user) {
    user.is_active = true;
    return res.json({
      message: 'User registration approved and activated successfully.',
      user,
    });
  }

  return res.status(404).json({ detail: 'User not found' });
};

router.patch('/users/:id/approve', approveHandler);
router.post('/users/:id/approve', approveHandler);

// ── Delete User ──
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await query('DELETE FROM users WHERE id = $1', [id]);
    return res.json({ detail: 'User deleted.' });
  } catch (err) {
    // In-memory fallback
  }

  const index = inMemoryUsers.findIndex(u => String(u.id) === String(id));
  if (index !== -1) {
    inMemoryUsers.splice(index, 1);
    return res.json({ detail: 'User deleted.' });
  }

  return res.status(404).json({ detail: 'User not found' });
});

export default router;
