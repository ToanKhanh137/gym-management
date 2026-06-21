import express from 'express';
import prisma from '../prisma/client.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/reports/revenue
router.get('/revenue', authenticate, authorize('owner'), async (req, res) => {
  try {
    const { from, to } = req.query;
    const dateFilter = {
      gte: from ? new Date(from) : undefined,
      lte: to ? new Date(to + 'T23:59:59') : undefined,
    };
    const [subscriptions, renewals] = await Promise.all([
      prisma.subscription.findMany({
        where: { paidAt: dateFilter },
        include: { package: { select: { name: true, type: true } } },
        orderBy: { paidAt: 'asc' },
      }),
      prisma.subscriptionRenewal.findMany({
        where: { renewedAt: dateFilter },
        include: {
          subscription: {
            include: { package: { select: { name: true, type: true } } },
          },
        },
        orderBy: { renewedAt: 'asc' },
      }),
    ]);
    const total = subscriptions.reduce((sum, s) => sum + s.amountPaid, 0)
      + renewals.reduce((sum, renewal) => sum + renewal.amountPaid, 0);
    const byPackage = subscriptions.reduce((acc, s) => {
      const key = s.package.name;
      acc[key] = (acc[key] || 0) + s.amountPaid;
      return acc;
    }, {});
    renewals.forEach((renewal) => {
      const key = renewal.subscription.package.name;
      byPackage[key] = (byPackage[key] || 0) + renewal.amountPaid;
    });
    res.json({
      total,
      count: subscriptions.length + renewals.length,
      registrationsCount: subscriptions.length,
      renewalsCount: renewals.length,
      byPackage,
    });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/reports/members-summary
router.get('/members-summary', authenticate, authorize('owner', 'staff'), async (req, res) => {
  try {
    const [total, active, newThisMonth] = await Promise.all([
      prisma.member.count(),
      prisma.subscription.count({ where: { status: 'active' } }),
      prisma.member.count({
        where: { createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
      }),
    ]);
    res.json({ totalMembers: total, activeSubscriptions: active, newThisMonth });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/reports/dashboard
router.get('/dashboard', authenticate, authorize('owner', 'staff', 'pt'), async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const [totalMembers, activeSubscriptions, monthlyRevenue, monthlyRenewalRevenue, pendingMaintenance, todayCheckIns] = await Promise.all([
      prisma.member.count(),
      prisma.subscription.count({ where: { status: 'active' } }),
      prisma.subscription.aggregate({ where: { paidAt: { gte: startOfMonth } }, _sum: { amountPaid: true } }),
      prisma.subscriptionRenewal.aggregate({ where: { renewedAt: { gte: startOfMonth } }, _sum: { amountPaid: true } }),
      prisma.maintenanceRequest.count({ where: { status: { in: ['pending', 'in_progress'] } } }),
      prisma.trainingLog.count({ where: { checkedInAt: { gte: new Date(today.toISOString().split('T')[0]) } } }),
    ]);
    const result = { totalMembers, activeSubscriptions, pendingMaintenance, todayCheckIns };
    if (req.user.role === 'owner') {
      result.monthlyRevenue = (monthlyRevenue._sum.amountPaid || 0) + (monthlyRenewalRevenue._sum.amountPaid || 0);
    }
    res.json(result);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/reports/registrations
router.get('/registrations', authenticate, authorize('owner', 'staff'), async (req, res) => {
  try {
    const { from, to } = req.query;
    const dateFilter = {
      gte: from ? new Date(from) : undefined,
      lte: to ? new Date(`${to}T23:59:59`) : undefined,
    };
    const hasDateFilter = Boolean(from || to);

    const [newMembers, registrations, renewals, sessionsUsed] = await Promise.all([
      prisma.member.count({ where: hasDateFilter ? { createdAt: dateFilter } : undefined }),
      prisma.subscription.count({ where: hasDateFilter ? { createdAt: dateFilter } : undefined }),
      prisma.subscriptionRenewal.count({ where: hasDateFilter ? { renewedAt: dateFilter } : undefined }),
      prisma.trainingLog.count({ where: hasDateFilter ? { checkedInAt: dateFilter } : undefined }),
    ]);

    res.json({ newMembers, registrations, renewals, sessionsUsed });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/reports/performance
router.get('/performance', authenticate, authorize('owner'), async (req, res) => {
  try {
    const staffAndPTs = await prisma.user.findMany({
      where: { role: { in: ['staff', 'pt'] } },
      select: { id: true, name: true, role: true, isActive: true },
    });

    const feedbacks = await prisma.feedback.findMany({
      where: { targetId: { not: null } },
      select: { targetId: true, rating: true }
    });

    // Subscriptions created by staff
    const subsCreated = await prisma.subscription.groupBy({
      by: ['createdById'],
      _count: { id: true }
    });
    
    // Active students for PTs
    const activePTSubs = await prisma.subscription.groupBy({
      by: ['trainerId'],
      where: { status: 'active', trainerId: { not: null } },
      _count: { id: true }
    });

    const performance = staffAndPTs.map(user => {
      const userFeedbacks = feedbacks.filter(f => f.targetId === user.id);
      const avgRating = userFeedbacks.length > 0 
        ? userFeedbacks.reduce((sum, f) => sum + f.rating, 0) / userFeedbacks.length 
        : 0;
      
      let handledCount = 0;
      if (user.role === 'staff') {
        handledCount = subsCreated.find(s => s.createdById === user.id)?._count.id || 0;
      } else if (user.role === 'pt') {
        // Need to find Trainer ID for this user
        // We will fetch trainers below and map it.
      }

      return {
        ...user,
        feedbacksCount: userFeedbacks.length,
        avgRating: avgRating.toFixed(1),
        handledCount
      };
    });

    // Map PT handled counts properly
    const trainers = await prisma.trainer.findMany({ select: { id: true, userId: true } });
    for (const p of performance) {
      if (p.role === 'pt') {
        const t = trainers.find(tr => tr.userId === p.id);
        if (t) {
          p.handledCount = activePTSubs.find(s => s.trainerId === t.id)?._count.id || 0;
        }
      }
    }

    // Sort by rating desc
    performance.sort((a, b) => parseFloat(b.avgRating) - parseFloat(a.avgRating));
    res.json(performance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
