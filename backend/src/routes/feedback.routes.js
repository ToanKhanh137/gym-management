import express from 'express';
import prisma from '../prisma/client.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/feedbacks
router.get('/', authenticate, authorize('owner', 'staff'), async (req, res) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      include: { member: { include: { user: { select: { name: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(feedbacks);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/feedbacks — member submits feedback
router.post('/', authenticate, authorize('member'), async (req, res) => {
  try {
    const { targetType, targetId, rating, comment } = req.body;
    if (!targetType || !rating) return res.status(400).json({ error: 'targetType and rating required' });

    const member = await prisma.member.findUnique({ where: { userId: req.user.id } });
    if (!member) return res.status(404).json({ error: 'Member not found' });

    const feedback = await prisma.feedback.create({
      data: {
        memberId: member.id,
        targetType,
        targetId: targetId ? parseInt(targetId) : null,
        rating: parseInt(rating),
        comment,
      },
    });
    res.status(201).json(feedback);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
