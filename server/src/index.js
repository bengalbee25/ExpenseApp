import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { pool } from './db.js';
import authRoutes from './routes/auth.js';
import txRoutes from './routes/transactions.js';
import { authMiddleware } from './middleware/authMiddleware.js';

dotenv.config();
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', async (req, res) => {
  try { await pool.query('SELECT 1'); res.json({ ok: true }); }
  catch { res.status(500).json({ ok: false }); }
});

app.use('/api/auth', authRoutes);
app.use('/api/transactions', authMiddleware, txRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on :${PORT}`));
