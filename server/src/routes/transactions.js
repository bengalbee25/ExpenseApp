import express from 'express';
import { pool } from '../db.js';
import { transactionSchema } from '../utils/validators.js';

const router = express.Router();

// List transactions (optionally filtered by type)
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const params = [req.user.id];
    let sql = 'SELECT * FROM transactions WHERE user_id = ?';
    if (type === 'income' || type === 'expense') {
      sql += ' AND type = ?';
      params.push(type);
    }
    sql += ' ORDER BY tx_date DESC, id DESC';
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create transaction
router.post('/', async (req, res) => {
  try {
    const parsed = transactionSchema.parse({
      ...req.body,
      amount: Number(req.body.amount),
    });

    const [result] = await pool.query(
      'INSERT INTO transactions (user_id, type, category, amount, tx_date, description) VALUES (?,?,?,?,?,?)',
      [req.user.id, parsed.type, parsed.category, parsed.amount, parsed.tx_date, parsed.description || null]
    );

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ message: err.errors[0].message });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update transaction (partial)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [existingRows] = await pool.query(
      'SELECT * FROM transactions WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    if (!existingRows.length) {
      return res.status(404).json({ message: 'Not found' });
    }

    const existing = existingRows[0];

    const updatedData = {
      type: req.body.type || existing.type,
      category: req.body.category || existing.category,
      amount: req.body.amount != null ? Number(req.body.amount) : existing.amount,
      tx_date: req.body.tx_date || existing.tx_date,
      description: req.body.description ?? existing.description,
    };

    transactionSchema.parse(updatedData);

    const [result] = await pool.query(
      'UPDATE transactions SET type = ?, category = ?, amount = ?, tx_date = ?, description = ? WHERE id = ? AND user_id = ?',
      [
        updatedData.type,
        updatedData.category,
        updatedData.amount,
        updatedData.tx_date,
        updatedData.description,
        id,
        req.user.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.json({ success: true, updated: updatedData });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ message: err.errors[0].message });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      'DELETE FROM transactions WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Summary (total income, expense, balance)
router.get('/summary', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
         SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense
       FROM transactions
       WHERE user_id = ?`,
      [req.user.id]
    );

    const income = Number(rows[0].income || 0);
    const expense = Number(rows[0].expense || 0);
    const balance = income - expense;

    res.json({ income, expense, balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Recent transactions
router.get('/recent', async (req, res) => {
  try {
    const limit = Number(req.query.limit || 5);
    const [rows] = await pool.query(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY tx_date DESC, id DESC LIMIT ?',
      [req.user.id, limit]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Aggregated by month (last 12 months)
router.get('/by-month', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT DATE_FORMAT(tx_date, '%Y-%m') AS ym,
              SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
              SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense
       FROM transactions
       WHERE user_id = ? AND tx_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
       GROUP BY ym
       ORDER BY ym`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
