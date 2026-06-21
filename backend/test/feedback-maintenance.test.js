import request from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../src/app.js';
import { authHeader } from './helpers.js';
import { prismaMock } from './setup.js';

describe('Feedback API', () => {
  it('validates rating range', async () => {
    const response = await request(app)
      .post('/api/feedbacks')
      .set(authHeader('member', 4))
      .send({ targetType: 'facility', rating: 6, comment: 'Test' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('rating must be between 1 and 5');
  });

  it('resolves feedback and records the staff member', async () => {
    prismaMock.feedback.findUnique.mockResolvedValue({ id: 9, status: 'pending' });
    prismaMock.feedback.update.mockResolvedValue({
      id: 9,
      status: 'resolved',
      response: 'Đã tiếp nhận và xử lý',
      resolvedById: 2,
    });

    const response = await request(app)
      .patch('/api/feedbacks/9/resolve')
      .set(authHeader('staff', 2))
      .send({ response: 'Đã tiếp nhận và xử lý' });

    expect(response.status).toBe(200);
    expect(prismaMock.feedback.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 9 },
      data: expect.objectContaining({
        status: 'resolved',
        response: 'Đã tiếp nhận và xử lý',
        resolvedById: 2,
      }),
    }));
  });
});

describe('Maintenance API', () => {
  it('prevents duplicate open maintenance requests', async () => {
    prismaMock.equipment.findUnique.mockResolvedValue({ id: 1, status: 'maintenance' });
    prismaMock.maintenanceRequest.findFirst.mockResolvedValue({ id: 3, status: 'pending' });

    const response = await request(app)
      .post('/api/maintenance')
      .set(authHeader('staff', 2))
      .send({ equipmentId: 1, description: 'Máy phát tiếng kêu' });

    expect(response.status).toBe(409);
    expect(response.body.error).toBe('Equipment already has an open maintenance request');
  });

  it('creates a request and changes equipment status in one transaction', async () => {
    prismaMock.equipment.findUnique.mockResolvedValue({ id: 1, status: 'good' });
    prismaMock.maintenanceRequest.findFirst.mockResolvedValue(null);
    prismaMock.maintenanceRequest.create.mockResolvedValue({ id: 4, equipmentId: 1, status: 'pending' });
    prismaMock.equipment.update.mockResolvedValue({ id: 1, status: 'maintenance' });

    const response = await request(app)
      .post('/api/maintenance')
      .set(authHeader('staff', 2))
      .send({ equipmentId: 1, description: 'Máy phát tiếng kêu' });

    expect(response.status).toBe(201);
    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    expect(prismaMock.equipment.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { status: 'maintenance' },
    });
  });
});
