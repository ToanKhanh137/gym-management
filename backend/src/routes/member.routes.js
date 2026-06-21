import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../prisma/client.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/members/my/profile — member views own profile
router.get('/my/profile', authenticate, authorize('member'), async (req, res) => {
  try {
    const member = await prisma.member.findUnique({
      where: { userId: req.user.id },
      include: {
        user: { select: { name: true, email: true, phone: true, dob: true } },
        subscriptions: { include: { package: true }, where: { status: 'active' } },
        trainingLogs: { orderBy: { checkedInAt: 'desc' }, take: 10 },
        feedbacks: { orderBy: { createdAt: 'desc' } },
      },
    });
    res.json(member);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/members — staff, owner
router.get('/', authenticate, authorize('owner', 'staff', 'pt'), async (req, res) => {
  try {
    const { search, status } = req.query;
    const members = await prisma.member.findMany({
      where: {
        user: {
          isActive: true,
          ...(search && {
            OR: [
              { name: { contains: search } },
              { email: { contains: search } },
              { phone: { contains: search } },
            ],
          }),
        },
      },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, dob: true } },
        subscriptions: {
          where: { status: 'active' },
          include: { package: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/members/:id
router.get('/:id', authenticate, authorize('owner', 'staff', 'pt'), async (req, res) => {
  try {
    const member = await prisma.member.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, dob: true } },
        subscriptions: { include: { package: true }, orderBy: { createdAt: 'desc' } },
        trainingLogs: { orderBy: { checkedInAt: 'desc' }, take: 20 },
        feedbacks: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/members — staff/owner creates member + user account
router.post('/', authenticate, authorize('owner', 'staff'), async (req, res) => {
  try {
    const { name, email, password, phone, dob, occupation } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email, password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already in use' });

    // Generate member code: MEM + timestamp
    const memberCode = 'MEM' + Date.now().toString().slice(-6);
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name, email, passwordHash, role: 'member', phone, dob,
        member: {
          create: { memberCode, occupation },
        },
      },
      include: {
        member: true,
      },
    });

    res.status(201).json({
      id: user.member.id,
      memberCode: user.member.memberCode,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/members/:id — update member info
router.patch('/:id', authenticate, authorize('owner', 'staff'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, phone, dob, occupation } = req.body;

    const member = await prisma.member.findUnique({ where: { id } });
    if (!member) return res.status(404).json({ error: 'Member not found' });

    await prisma.$transaction([
      prisma.user.update({ where: { id: member.userId }, data: { name, phone, dob } }),
      prisma.member.update({ where: { id }, data: { occupation } }),
    ]);

    res.json({ message: 'Member updated' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/members/my/profile — member views own profile
export default router;
