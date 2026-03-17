import { type Request, type Response } from 'express';
import { prisma } from '../config/db.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/auth.utils.js';
import { Role } from '@prisma/client';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, mobile } = req.body;

    // Validate required fields
    if (!name || !email || !password || !mobile) {
      res.status(400).json({ status: 'error', message: 'Name, email, password, and mobile are required' });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ status: 'error', message: 'User already exists' });
      return;
    }

    // Check if mobile already exists
    const existingMobile = await prisma.user.findUnique({ where: { mobile } });
    if (existingMobile) {
      res.status(400).json({ status: 'error', message: 'Mobile number already exists' });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      // Create user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role as Role || 'MEMBER', // Default to MEMBER if none provided
          mobile,
        },
      });

      res.status(201).json({ status: 'success', message: 'User registered successfully', data: { id: user.id, email: user.email, role: user.role, mobile: user.mobile } });
    } catch (error: any) {
      if (error.code === 'P2002') {
        // Prisma unique constraint error
        const target = error.meta?.target;
        if (target && target.includes('mobile')) {
          res.status(400).json({ status: 'error', message: 'Mobile number already exists' });
        } else if (target && target.includes('email')) {
          res.status(400).json({ status: 'error', message: 'Email already exists' });
        } else {
          res.status(400).json({ status: 'error', message: 'Duplicate field error' });
        }
      } else {
        console.error('Registration error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
      }
    }
  } catch (error) {
    console.error('Registration error:', error);
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