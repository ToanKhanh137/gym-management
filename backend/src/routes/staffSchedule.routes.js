import express from 'express';
import prisma from '../prisma/client.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authenticate, authorize('owner', 'staff'), async (req, res) => {
  try {
    const userId = req.user.role === 'staff'
      ? req.user.id
      : (req.query.userId ? parseInt(req.query.userId) : undefined);

    const schedules = await prisma.staffSchedule.findMany({
      where: userId ? { userId } : {},
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: [{ userId: 'asc' }, { dayOfWeek: 'asc' }],
    });
    res.json(schedules);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:userId', authenticate, authorize('owner'), async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { schedules } = req.body;
    if (!Array.isArray(schedules)) {
      return res.status(400).json({ error: 'schedules must be an array' });
    }

    const staff = await prisma.user.findUnique({ where: { id: userId } });
    if (!staff || staff.role !== 'staff') {
      return res.status(404).json({ error: 'Staff account not found' });
    }

    for (const schedule of schedules) {
      const day = parseInt(schedule.dayOfWeek);
      if (day < 0 || day > 6 || !schedule.startTime || !schedule.endTime || schedule.startTime >= schedule.endTime) {
        return res.status(400).json({ error: 'Invalid schedule data' });
      }
    }

    await prisma.$transaction([
      prisma.staffSchedule.deleteMany({ where: { userId } }),
      prisma.staffSchedule.createMany({
        data: schedules.map((schedule) => ({
          userId,
          dayOfWeek: parseInt(schedule.dayOfWeek),
          startTime: schedule.startTime,
          endTime: schedule.endTime,
        })),
      }),
    ]);

    const updated = await prisma.staffSchedule.findMany({
      where: { userId },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { dayOfWeek: 'asc' },
    });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
