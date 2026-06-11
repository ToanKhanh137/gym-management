import express from 'express';
import prisma from '../prisma/client.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/feedbacks — owner/staff view all
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

// GET /api/feedbacks/mine — member views own feedbacks
router.get('/mine', authenticate, authorize('member'), async (req, res) => {
  try {
    const member = await prisma.member.findUnique({ where: { userId: req.user.id } });
    if (!member) return res.json([]);
    const feedbacks = await prisma.feedback.findMany({
      where: { memberId: member.id },
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
    if (!['staff', 'pt', 'facility'].includes(targetType)) {
      return res.status(400).json({ error: 'Invalid targetType' });
    }
    const parsedRating = parseInt(rating);
    if (Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ error: 'rating must be between 1 and 5' });
    }

    const member = await prisma.member.findUnique({ where: { userId: req.user.id } });
    if (!member) return res.status(404).json({ error: 'Member not found' });

    let parsedTargetId = null;
    if (targetType !== 'facility' && targetId) {
      const target = await prisma.user.findUnique({ where: { id: parseInt(targetId) } });
      if (!target || target.role !== targetType) {
        return res.status(404).json({ error: 'Feedback target not found' });
      }
      parsedTargetId = target.id;
    }

    const feedback = await prisma.feedback.create({
      data: {
        memberId: member.id,
        targetType,
        targetId: parsedTargetId,
        rating: parsedRating,
        comment,
      },
    });
    res.status(201).json(feedback);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
