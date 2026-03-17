import { type Request, type Response } from 'express';
import { prisma } from '../config/db.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/auth.utils.js';
import { Role } from '@prisma/client';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, mobile } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ status: 'error', message: 'User already exists' });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as Role || 'MEMBER', // Default to MEMBER if none provided
        mobile: mobile, // Default empty mobile for now
      },
    });

    res.status(201).json({ status: 'success', message: 'User registered successfully', data: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ status: 'error', message: 'Invalid credentials' });
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ status: 'error', message: 'Invalid credentials' });
      return;
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    res.status(200).json({ status: 'success', token, data: { id: user.id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};