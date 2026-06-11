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
    if (sub.memberId !== parseInt(memberId)) {
      return res.status(400).json({ error: 'Subscription does not belong to this member' });
    }
    if (sub.endDate && sub.endDate < new Date().toISOString().split('T')[0]) {
      await prisma.subscription.update({
        where: { id: sub.id },
        data: { status: 'expired' },
      });
      return res.status(400).json({ error: 'Subscription expired' });
    }

    const openLog = await prisma.trainingLog.findFirst({
      where: {
        memberId: parseInt(memberId),
        checkedOutAt: null,
      },
    });
    if (openLog) {
      return res.status(400).json({ error: 'Member already has an open check-in' });
    }

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
    const existing = await prisma.trainingLog.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!existing) return res.status(404).json({ error: 'Training log not found' });
    if (existing.checkedOutAt) return res.status(400).json({ error: 'Training log already checked out' });

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
    let { memberId } = req.query;

    // If member role, only return their own logs
    if (req.user.role === 'member') {
      const member = await prisma.member.findUnique({ where: { userId: req.user.id } });
      if (!member) return res.json([]);
      memberId = member.id;
    }

    const logs = await prisma.trainingLog.findMany({
      where: memberId ? { memberId: parseInt(memberId) } : {},
      include: {
        member: { include: { user: { select: { name: true } } } },
        recordedBy: { select: { name: true } },
        subscription: { include: { package: { select: { name: true } } } },
      },
      orderBy: { checkedInAt: 'desc' },
      take: 100,
    });
    res.json(logs);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
