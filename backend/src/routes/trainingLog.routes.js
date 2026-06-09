import express from 'express';
import prisma from '../prisma/client.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// POST /api/training-logs — check-in
router.post('/', authenticate, authorize('owner', 'staff', 'pt'), async (req, res) => {
  try {
    const { memberId, subscriptionId } = req.body;
    if (!memberId || !subscriptionId) return res.status(400).json({ error: 'memberId and subscriptionId required' });

    const sub = await prisma.subscription.findUnique({ where: { id: parseInt(subscriptionId) } });
    if (!sub || sub.status !== 'active') return res.status(400).json({ error: 'Subscription not active' });

    // Check session-based packages
    if (sub.sessionsTotal !== null && sub.sessionsUsed >= sub.sessionsTotal) {
      return res.status(400).json({ error: 'No sessions remaining' });
    }

    const [log] = await prisma.$transaction([
      prisma.trainingLog.create({
        data: {
          memberId: parseInt(memberId),
          subscriptionId: parseInt(subscriptionId),
          recordedById: req.user.id,
        },
      }),
      prisma.subscription.update({
        where: { id: parseInt(subscriptionId) },
        data: { sessionsUsed: { increment: 1 } },
      }),
    ]);

    res.status(201).json(log);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/training-logs/:id/checkout
router.patch('/:id/checkout', authenticate, authorize('owner', 'staff', 'pt'), async (req, res) => {
  try {
    const log = await prisma.trainingLog.update({
      where: { id: parseInt(req.params.id) },
      data: { checkedOutAt: new Date(), notes: req.body.notes },
    });
    res.json(log);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/training-logs?memberId=
router.get('/', authenticate, async (req, res) => {
  try {
    const { memberId } = req.query;
    const logs = await prisma.trainingLog.findMany({
      where: memberId ? { memberId: parseInt(memberId) } : {},
      include: {
        member: { include: { user: { select: { name: true } } } },
        recordedBy: { select: { name: true } },
      },
      orderBy: { checkedInAt: 'desc' },
      take: 50,
    });
    res.json(logs);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
