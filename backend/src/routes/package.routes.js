import express from 'express';
import prisma from '../prisma/client.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/packages
router.get('/', authenticate, async (req, res) => {
  try {
    const packages = await prisma.membershipPackage.findMany({
      where: req.user.role !== 'owner' ? { isActive: true } : {},
      orderBy: { price: 'asc' },
    });
    res.json(packages);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/packages — owner only
router.post('/', authenticate, authorize('owner'), async (req, res) => {
  try {
    const { name, type, durationDays, totalSessions, price, description } = req.body;
    if (!name || !type || !price) {
      return res.status(400).json({ error: 'name, type, price are required' });
    }
    if (!['per_session', 'monthly', 'quarterly', 'yearly', 'vip', 'pt'].includes(type)) {
      return res.status(400).json({ error: 'Invalid package type' });
    }
    const pkg = await prisma.membershipPackage.create({
      data: {
        name,
        type,
        durationDays: durationDays ? parseInt(durationDays) : null,
        totalSessions: totalSessions ? parseInt(totalSessions) : null,
        price: parseFloat(price),
        description,
      },
    });
    res.status(201).json(pkg);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/packages/:id — owner only
router.patch('/:id', authenticate, authorize('owner'), async (req, res) => {
  try {
    const { name, type, durationDays, totalSessions, price, description, isActive } = req.body;
    if (type && !['per_session', 'monthly', 'quarterly', 'yearly', 'vip', 'pt'].includes(type)) {
      return res.status(400).json({ error: 'Invalid package type' });
    }
    const pkg = await prisma.membershipPackage.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        type,
        durationDays: durationDays !== undefined ? (durationDays ? parseInt(durationDays) : null) : undefined,
        totalSessions: totalSessions !== undefined ? (totalSessions ? parseInt(totalSessions) : null) : undefined,
        price: price ? parseFloat(price) : undefined,
        description,
        isActive,
      },
    });
    res.json(pkg);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/packages/:id (soft delete)
router.delete('/:id', authenticate, authorize('owner'), async (req, res) => {
  try {
    const activeSubscriptions = await prisma.subscription.count({
      where: { packageId: parseInt(req.params.id), status: 'active' },
    });
    if (activeSubscriptions > 0) {
      return res.status(400).json({ error: 'Cannot deactivate package with active subscriptions' });
    }

    await prisma.membershipPackage.update({
      where: { id: parseInt(req.params.id) },
      data: { isActive: false },
    });
    res.json({ message: 'Package deactivated' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
