import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  // We allow passing a role for testing purposes, but default to MEMBER
  role: z.enum(['SUPERUSER', 'EXECUTIVE', 'FINANCE_EXECUTIVE', 'DONOR', 'MEMBER']).optional()
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});