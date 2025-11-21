import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(150),
  password: z.string().min(6).max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const transactionSchema = z.object({
  type: z.enum(['income','expense']),
  category: z.string().min(1).max(100),
  amount: z.number().positive(),
  tx_date: z.string(), // YYYY-MM-DD
  description: z.string().max(255).optional().or(z.literal('')),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6).max(100),
});
