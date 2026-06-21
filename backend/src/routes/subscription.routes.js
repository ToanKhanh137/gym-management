import express from 'express';
import prisma from '../prisma/client.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

const ACTIVE_STATUSES = ['active'];

const expireEndedSubscriptions = async () => {
  const today = new Date().toISOString().split('T')[0];
  await prisma.subscription.updateMany({
    where: {
      status: 'active',
      endDate: { not: null, lt: today },
    },
    data: { status: 'expired' },
  });
};

const assertNoActiveSubscription = async (memberId) => {
  const activeSub = await prisma.subscription.findFirst({
    where: { memberId: parseInt(memberId), status: { in: ACTIVE_STATUSES } },
    include: { package: { select: { name: true } } },
  });
  if (activeSub) {
    const error = new Error(`Member already has active package: ${activeSub.package?.name || activeSub.id}`);
    error.statusCode = 409;
    throw error;
  }
};

const assertTrainerExists = async (trainerId) => {
  if (!trainerId) return;
  const trainer = await prisma.trainer.findUnique({ where: { id: parseInt(trainerId) } });
  if (!trainer) {
    const error = new Error('Trainer not found');
    error.statusCode = 404;
    throw error;
  }
};

// GET /api/subscriptions?memberId=
router.get('/', authenticate, async (req, res) => {
  try {
    await expireEndedSubscriptions();
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
        trainer: { include: { user: { select: { name: true } } } },
        renewals: { orderBy: { renewedAt: 'desc' } },
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

    const member = await prisma.member.findUnique({ where: { id: parseInt(memberId) } });
    if (!member) return res.status(404).json({ error: 'Member not found' });

    const pkg = await prisma.membershipPackage.findUnique({ where: { id: parseInt(packageId) } });
    if (!pkg || !pkg.isActive) return res.status(404).json({ error: 'Package not found or inactive' });

    if (pkg.type === 'pt' && !trainerId) {
      return res.status(400).json({ error: 'Trainer must be assigned for PT packages' });
    }
    await assertTrainerExists(trainerId);
    await assertNoActiveSubscription(memberId);

    const start = startDate ? new Date(startDate) : new Date();
    if (Number.isNaN(start.getTime())) {
      return res.status(400).json({ error: 'Invalid startDate' });
    }
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
    res.status(err.statusCode || 500).json({ error: err.statusCode ? err.message : 'Server error' });
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
    await assertTrainerExists(trainerId);
    await assertNoActiveSubscription(member.id);

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
    res.status(err.statusCode || 500).json({ error: err.statusCode ? err.message : 'Server error' });
  }
});

// POST /api/subscriptions/:id/renew
router.post('/:id/renew', authenticate, authorize('owner', 'staff'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { paymentMethod } = req.body;
    if (!['cash', 'bank_transfer', 'e_wallet'].includes(paymentMethod)) {
      return res.status(400).json({ error: 'Invalid payment method' });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: { package: true },
    });
    if (!subscription) return res.status(404).json({ error: 'Subscription not found' });
    if (subscription.status === 'cancelled') {
      return res.status(400).json({ error: 'Cancelled subscription cannot be renewed' });
    }
    if (!subscription.package.isActive) {
      return res.status(400).json({ error: 'Package is inactive' });
    }

    const today = new Date().toISOString().split('T')[0];
    let newEndDate = subscription.endDate;
    let addedSessions = null;
    const updateData = {
      status: 'active',
    };

    if (subscription.package.durationDays) {
      const baseDate = subscription.endDate && subscription.endDate >= today
        ? new Date(subscription.endDate)
        : new Date(today);
      baseDate.setDate(baseDate.getDate() + subscription.package.durationDays);
      newEndDate = baseDate.toISOString().split('T')[0];
      updateData.endDate = newEndDate;
    } else if (subscription.package.totalSessions) {
      addedSessions = subscription.package.totalSessions;
      updateData.sessionsTotal = { increment: addedSessions };
    } else {
      return res.status(400).json({ error: 'Package has no renewable duration or sessions' });
    }

    const [updated, renewal] = await prisma.$transaction([
      prisma.subscription.update({
        where: { id },
        data: updateData,
        include: {
          member: { include: { user: { select: { name: true, email: true } } } },
          package: true,
          trainer: { include: { user: { select: { name: true } } } },
        },
      }),
      prisma.subscriptionRenewal.create({
        data: {
          subscriptionId: id,
          previousEndDate: subscription.endDate,
          newEndDate,
          addedSessions,
          paymentMethod,
          amountPaid: subscription.package.price,
          renewedById: req.user.id,
        },
      }),
    ]);

    res.json({ subscription: updated, renewal });
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
