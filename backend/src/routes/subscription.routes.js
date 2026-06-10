import express from 'express';
import prisma from '../prisma/client.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/subscriptions?memberId=
router.get('/', authenticate, async (req, res) => {
  try {
    let { memberId, status } = req.query;

    // Members can only see their own subscriptions
    if (req.user.role === 'member') {
      const member = await prisma.member.findUnique({ where: { userId: req.user.id } });
      if (!member) return res.json([]);
      memberId = member.id;
    } else if (!['owner', 'staff', 'pt'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const subscriptions = await prisma.subscription.findMany({
      where: {
        ...(memberId && { memberId: parseInt(memberId) }),
        ...(status && { status }),
      },
      include: {
        member: { include: { user: { select: { name: true, email: true } } } },
        package: true,
        trainer: { include: { user: { select: { name: true } } } }
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
    const { memberId, packageId, paymentMethod, startDate, trainerId } = req.body;

    if (!memberId || !packageId || !paymentMethod) {
      return res.status(400).json({ error: 'memberId, packageId, paymentMethod required' });
    }

    const pkg = await prisma.membershipPackage.findUnique({ where: { id: parseInt(packageId) } });
    if (!pkg || !pkg.isActive) return res.status(404).json({ error: 'Package not found or inactive' });

    if (pkg.type === 'pt' && !trainerId) {
      return res.status(400).json({ error: 'Trainer must be assigned for PT packages' });
    }

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
        ...(trainerId && { trainerId: parseInt(trainerId) }),
      },
      include: { package: true, trainer: { include: { user: { select: { name: true } } } } },
    });

    res.status(201).json(sub);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/subscriptions/mine — member registers for a package themselves
router.post('/mine', authenticate, authorize('member'), async (req, res) => {
  try {
    const { packageId, paymentMethod, trainerId } = req.body;

    const member = await prisma.member.findUnique({ where: { userId: req.user.id } });
    if (!member) return res.status(404).json({ error: 'Member profile not found' });

    if (!packageId || !paymentMethod) {
      return res.status(400).json({ error: 'packageId, paymentMethod required' });
    }

    const pkg = await prisma.membershipPackage.findUnique({ where: { id: parseInt(packageId) } });
    if (!pkg || !pkg.isActive) return res.status(404).json({ error: 'Package not found or inactive' });

    if (pkg.type === 'pt' && !trainerId) {
      return res.status(400).json({ error: 'Trainer must be assigned for PT packages' });
    }

    const start = new Date();
    let endDate = null;
    if (pkg.durationDays) {
      const end = new Date(start);
      end.setDate(end.getDate() + pkg.durationDays);
      endDate = end.toISOString().split('T')[0];
    }

    const sub = await prisma.subscription.create({
      data: {
        memberId: member.id,
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
        ...(trainerId && { trainerId: parseInt(trainerId) }),
      },
      include: { package: true, trainer: { include: { user: { select: { name: true } } } } },
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
