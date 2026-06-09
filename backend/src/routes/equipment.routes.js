import express from 'express';
import prisma from '../prisma/client.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/equipment
router.get('/', authenticate, authorize('owner', 'staff'), async (req, res) => {
  try {
    const { roomId, status } = req.query;
    const equipment = await prisma.equipment.findMany({
      where: {
        ...(roomId && { roomId: parseInt(roomId) }),
        ...(status && { status }),
      },
      include: { room: { select: { name: true } } },
      orderBy: { name: 'asc' },
    });
    res.json(equipment);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/equipment
router.post('/', authenticate, authorize('owner', 'staff'), async (req, res) => {
  try {
    const { equipmentCode, name, roomId, quantity, importedAt, warrantyUntil, origin } = req.body;
    if (!equipmentCode || !name) return res.status(400).json({ error: 'equipmentCode and name required' });
    const eq = await prisma.equipment.create({
      data: {
        equipmentCode, name,
        roomId: roomId ? parseInt(roomId) : null,
        quantity: quantity ? parseInt(quantity) : 1,
        importedAt, warrantyUntil, origin,
      },
    });
    res.status(201).json(eq);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/equipment/:id
router.patch('/:id', authenticate, authorize('owner', 'staff'), async (req, res) => {
  try {
    const { name, status, roomId, quantity } = req.body;
    const eq = await prisma.equipment.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name, status,
        roomId: roomId !== undefined ? (roomId ? parseInt(roomId) : null) : undefined,
        quantity: quantity ? parseInt(quantity) : undefined,
      },
    });
    res.json(eq);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
