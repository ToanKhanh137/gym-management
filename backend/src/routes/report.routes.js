import express from 'express';
import prisma from '../prisma/client.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/reports/revenue
router.get('/revenue', authenticate, authorize('owner'), async (req, res) => {
  try {
    const { from, to } = req.query;
    const subscriptions = await prisma.subscription.findMany({
      where: {
        paidAt: {
          gte: from ? new Date(from) : undefined,
          lte: to ? new Date(to + 'T23:59:59') : undefined,
        },
      },
      include: { package: { select: { name: true, type: true } } },
      orderBy: { paidAt: 'asc' },
    });
    const total = subscriptions.reduce((sum, s) => sum + s.amountPaid, 0);
    const byPackage = subscriptions.reduce((acc, s) => {
      const key = s.package.name;
      acc[key] = (acc[key] || 0) + s.amountPaid;
      return acc;
    }, {});
    res.json({ total, count: subscriptions.length, byPackage });
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
router.get('/dashboard', authenticate, authorize('owner'), async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const [totalMembers, activeSubscriptions, monthlyRevenue, pendingMaintenance, todayCheckIns] = await Promise.all([
      prisma.member.count(),
      prisma.subscription.count({ where: { status: 'active' } }),
      prisma.subscription.aggregate({ where: { paidAt: { gte: startOfMonth } }, _sum: { amountPaid: true } }),
      prisma.maintenanceRequest.count({ where: { status: { in: ['pending', 'in_progress'] } } }),
      prisma.trainingLog.count({ where: { checkedInAt: { gte: new Date(today.toISOString().split('T')[0]) } } }),
    ]);
    res.json({ totalMembers, activeSubscriptions, monthlyRevenue: monthlyRevenue._sum.amountPaid || 0, pendingMaintenance, todayCheckIns });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
