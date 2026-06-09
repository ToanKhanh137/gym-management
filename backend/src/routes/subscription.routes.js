import express from 'express';
import prisma from '../prisma/client.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/subscriptions?memberId=
router.get('/', authenticate, authorize('owner', 'staff', 'pt'), async (req, res) => {
  try {
    const { memberId, status } = req.query;
    const subscriptions = await prisma.subscription.findMany({
      where: {
        ...(memberId && { memberId: parseInt(memberId) }),
        ...(status && { status }),
      },
      include: {
        member: { include: { user: { select: { name: true, email: true } } } },
        package: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(subscriptions);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/subscriptions — register member to a package
router.post('/', authenticate, authorize('owner', 'staff'), async (req, res) => {
  try {
    const { memberId, packageId, paymentMethod, startDate } = req.body;

    if (!memberId || !packageId || !paymentMethod) {
      return res.status(400).json({ error: 'memberId, packageId, paymentMethod required' });
    }

    const pkg = await prisma.membershipPackage.findUnique({ where: { id: parseInt(packageId) } });
    if (!pkg || !pkg.isActive) return res.status(404).json({ error: 'Package not found or inactive' });

    const start = startDate ? new Date(startDate) : new Date();
    let endDate = null;
    if (pkg.durationDays) {
      const end = new Date(start);
      end.setDate(end.getDate() + pkg.durationDays);
      endDate = end.toISOString().split('T')[0];
    }

    const sub = await prisma.subscription.create({
      data: {
        memberId: parseInt(memberId),
        packageId: parseInt(packageId),
        startDate: start.toISOString().split('T')[0],
        endDate,
        sessionsTotal: pkg.totalSessions,
        sessionsUsed: 0,
        status: 'active',
        paymentMethod,
        amountPaid: pkg.price,
        paidAt: new Date(),
        createdById: req.user.id,
      },
      include: { package: true },
    });

    res.status(201).json(sub);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/subscriptions/:id/cancel
router.patch('/:id/cancel', authenticate, authorize('owner', 'staff'), async (req, res) => {
  try {
    const sub = await prisma.subscription.update({
      where: { id: parseInt(req.params.id) },
      data: { status: 'cancelled' },
    });
    res.json(sub);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
