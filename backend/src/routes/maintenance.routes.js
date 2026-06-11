import express from 'express';
import prisma from '../prisma/client.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/maintenance
router.get('/', authenticate, authorize('owner', 'staff'), async (req, res) => {
  try {
    const requests = await prisma.maintenanceRequest.findMany({
      include: {
        equipment: { select: { name: true, equipmentCode: true } },
        reportedBy: { select: { name: true } },
        resolvedBy: { select: { name: true } },
      },
      orderBy: { reportedAt: 'desc' },
    });
    res.json(requests);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/maintenance — report broken equipment
router.post('/', authenticate, authorize('owner', 'staff'), async (req, res) => {
  try {
    const { equipmentId, description } = req.body;
    if (!equipmentId || !description) return res.status(400).json({ error: 'equipmentId and description required' });

    const equipment = await prisma.equipment.findUnique({ where: { id: parseInt(equipmentId) } });
    if (!equipment) return res.status(404).json({ error: 'Equipment not found' });

    const existing = await prisma.maintenanceRequest.findFirst({
      where: {
        equipmentId: parseInt(equipmentId),
        status: { in: ['pending', 'in_progress'] },
      },
    });
    if (existing) {
      return res.status(409).json({ error: 'Equipment already has an open maintenance request' });
    }

    const [req_] = await prisma.$transaction([
      prisma.maintenanceRequest.create({
        data: { equipmentId: parseInt(equipmentId), description, reportedById: req.user.id },
      }),
      prisma.equipment.update({ where: { id: parseInt(equipmentId) }, data: { status: 'maintenance' } }),
    ]);
    res.status(201).json(req_);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/maintenance/:id/resolve
router.patch('/:id/resolve', authenticate, authorize('owner', 'staff'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const maintenance = await prisma.maintenanceRequest.findUnique({ where: { id } });
    if (!maintenance) return res.status(404).json({ error: 'Not found' });
    if (maintenance.status === 'resolved') {
      return res.status(400).json({ error: 'Maintenance request already resolved' });
    }

    await prisma.$transaction([
      prisma.maintenanceRequest.update({
        where: { id },
        data: { status: 'resolved', resolvedAt: new Date(), resolvedById: req.user.id },
      }),
      prisma.equipment.update({ where: { id: maintenance.equipmentId }, data: { status: 'good' } }),
    ]);

    res.json({ message: 'Resolved' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
