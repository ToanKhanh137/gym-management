import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../prisma/client.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/users — owner only
router.get('/', authenticate, authorize('owner'), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, phone: true, isActive: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/users — owner creates staff/pt accounts
router.post('/', authenticate, authorize('owner'), async (req, res) => {
  try {
    const { name, email, password, role, phone, dob } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'name, email, password, role are required' });
    }
    if (!['owner', 'staff', 'pt'].includes(role)) {
      return res.status(400).json({ error: 'role must be owner, staff, or pt' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHash, role, phone, dob },
      select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
    });

    // If role is pt, create Trainer record too
    if (role === 'pt') {
      await prisma.trainer.create({ data: { userId: user.id } });
    }

    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/users/:id — owner can update any, others can update self
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (req.user.role !== 'owner' && req.user.id !== id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { name, phone, dob, isActive } = req.body;
    const data = { name, phone, dob };
    if (req.user.role === 'owner' && typeof isActive === 'boolean') {
      data.isActive = isActive;
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, phone: true, isActive: true },
    });
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
