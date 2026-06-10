import express from 'express';
import prisma from '../prisma/client.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/trainers — owner/staff/member gets all trainers
router.get('/', authenticate, authorize('owner', 'staff', 'member'), async (req, res) => {
  try {
    const trainers = await prisma.trainer.findMany({
      include: {
        user: {
          select: { name: true, email: true, phone: true }
        }
      }
    });
    res.json(trainers);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/trainers/mine/students — pt gets their students
router.get('/mine/students', authenticate, authorize('pt'), async (req, res) => {
  try {
    const trainer = await prisma.trainer.findUnique({ where: { userId: req.user.id } });
    if (!trainer) return res.status(404).json({ error: 'Trainer profile not found' });

    const subscriptions = await prisma.subscription.findMany({
      where: {
        trainerId: trainer.id,
        status: 'active'
      },
      include: {
        member: { include: { user: { select: { name: true, email: true, phone: true } } } },
        package: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(subscriptions);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/trainers/mine/schedule — pt gets their schedule
router.get('/mine/schedule', authenticate, authorize('pt'), async (req, res) => {
  try {
    const trainer = await prisma.trainer.findUnique({ where: { userId: req.user.id } });
    if (!trainer) return res.status(404).json({ error: 'Trainer profile not found' });

    const schedules = await prisma.trainerSchedule.findMany({
      where: { trainerId: trainer.id },
      orderBy: { dayOfWeek: 'asc' }
    });
    res.json(schedules);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/trainers/mine/schedule — pt updates their schedule (replaces all)
router.put('/mine/schedule', authenticate, authorize('pt'), async (req, res) => {
  try {
    const { schedules } = req.body; // Array of { dayOfWeek, startTime, endTime }
    if (!Array.isArray(schedules)) return res.status(400).json({ error: 'schedules must be an array' });

    const trainer = await prisma.trainer.findUnique({ where: { userId: req.user.id } });
    if (!trainer) return res.status(404).json({ error: 'Trainer profile not found' });

    // Use transaction to delete old and insert new
    await prisma.$transaction([
      prisma.trainerSchedule.deleteMany({ where: { trainerId: trainer.id } }),
      prisma.trainerSchedule.createMany({
        data: schedules.map(s => ({
          trainerId: trainer.id,
          dayOfWeek: parseInt(s.dayOfWeek),
          startTime: s.startTime,
          endTime: s.endTime,
        }))
      })
    ]);

    const updated = await prisma.trainerSchedule.findMany({
      where: { trainerId: trainer.id },
      orderBy: { dayOfWeek: 'asc' }
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
