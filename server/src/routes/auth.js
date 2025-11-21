import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { registerSchema, loginSchema, changePasswordSchema } from '../utils/validators.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const parsed = registerSchema.parse(req.body);

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [parsed.email]);
    if (existing.length) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hash = await bcrypt.hash(parsed.password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES (?,?,?)',
      [parsed.name, parsed.email, hash]
    );

    const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: { id: result.insertId, name: parsed.name, email: parsed.email },
    });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ message: err.errors[0].message });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const parsed = loginSchema.parse(req.body);

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [parsed.email]);
    if (!rows.length) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(parsed.password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ message: err.errors[0].message });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password for current authenticated user
router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    const parsed = changePasswordSchema.parse(req.body);

    const [rows] = await pool.query('SELECT id, password_hash FROM users WHERE id = ?', [req.user.id]);
    if (!rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];
    const validCurrent = await bcrypt.compare(parsed.currentPassword, user.password_hash);
    if (!validCurrent) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const newHash = await bcrypt.hash(parsed.newPassword, 10);
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, req.user.id]);

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ message: err.errors[0].message });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
