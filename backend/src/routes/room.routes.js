import express from 'express';
import prisma from '../prisma/client.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/rooms
router.get('/', authenticate, async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      include: { _count: { select: { equipment: true } } },
      orderBy: { name: 'asc' },
    });
    res.json(rooms);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/rooms
router.post('/', authenticate, authorize('owner', 'staff'), async (req, res) => {
  try {
    const { roomCode, name, type, capacity } = req.body;
    if (!roomCode || !name || !type) return res.status(400).json({ error: 'roomCode, name, type required' });
    const room = await prisma.room.create({ data: { roomCode, name, type, capacity: capacity ? parseInt(capacity) : null } });
    res.status(201).json(room);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/rooms/:id
router.patch('/:id', authenticate, authorize('owner', 'staff'), async (req, res) => {
  try {
    const { name, type, capacity, status } = req.body;
    const room = await prisma.room.update({
      where: { id: parseInt(req.params.id) },
      data: { name, type, capacity: capacity ? parseInt(capacity) : undefined, status },
    });
    res.json(room);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
