import express from 'express';
import prisma from '../prisma/client.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const promotions = await prisma.promotion.findMany({
      where: req.user.role === 'owner'
        ? {}
        : { isActive: true, startDate: { lte: today }, endDate: { gte: today } },
      orderBy: { startDate: 'desc' },
    });
    res.json(promotions);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticate, authorize('owner'), async (req, res) => {
  try {
    const { title, description, discountPercent, startDate, endDate } = req.body;
    if (!title || !startDate || !endDate || startDate > endDate) {
      return res.status(400).json({ error: 'Valid title and date range are required' });
    }
    const discount = discountPercent === '' || discountPercent == null ? null : parseInt(discountPercent);
    if (discount !== null && (discount < 0 || discount > 100)) {
      return res.status(400).json({ error: 'Discount must be between 0 and 100' });
    }

    const promotion = await prisma.promotion.create({
      data: { title, description, discountPercent: discount, startDate, endDate },
    });
    res.status(201).json(promotion);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id', authenticate, authorize('owner'), async (req, res) => {
  try {
    const { title, description, discountPercent, startDate, endDate, isActive } = req.body;
    if (startDate && endDate && startDate > endDate) {
      return res.status(400).json({ error: 'Invalid date range' });
    }
    const discount = discountPercent !== undefined
      ? (discountPercent === '' || discountPercent === null ? null : parseInt(discountPercent))
      : undefined;
    if (discount !== undefined && discount !== null && (Number.isNaN(discount) || discount < 0 || discount > 100)) {
      return res.status(400).json({ error: 'Discount must be between 0 and 100' });
    }
    const promotion = await prisma.promotion.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title,
        description,
        discountPercent: discount,
        startDate,
        endDate,
        isActive,
      },
    });
    res.json(promotion);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
