import request from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../src/app.js';
import { authHeader } from './helpers.js';
import { prismaMock } from './setup.js';

describe('Staff schedule API', () => {
  it('lets staff view only their own schedule', async () => {
    prismaMock.staffSchedule.findMany.mockResolvedValue([]);

    const response = await request(app)
      .get('/api/staff-schedules?userId=99')
      .set(authHeader('staff', 2));

    expect(response.status).toBe(200);
    expect(prismaMock.staffSchedule.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { userId: 2 },
    }));
  });

  it('rejects invalid working hours', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 2, role: 'staff' });

    const response = await request(app)
      .put('/api/staff-schedules/2')
      .set(authHeader('owner', 1))
      .send({
        schedules: [{ dayOfWeek: 1, startTime: '17:00', endTime: '08:00' }],
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid schedule data');
  });

  it('blocks staff from editing schedules', async () => {
    const response = await request(app)
      .put('/api/staff-schedules/2')
      .set(authHeader('staff', 2))
      .send({ schedules: [] });

    expect(response.status).toBe(403);
  });
});

describe('Promotion API', () => {
  it('rejects invalid date ranges', async () => {
    const response = await request(app)
      .post('/api/promotions')
      .set(authHeader('owner', 1))
      .send({
        title: 'Ưu đãi',
        startDate: '2026-08-01',
        endDate: '2026-07-01',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Valid title and date range are required');
  });

  it('rejects discounts above 100 percent', async () => {
    const response = await request(app)
      .post('/api/promotions')
      .set(authHeader('owner', 1))
      .send({
        title: 'Ưu đãi',
        discountPercent: 120,
        startDate: '2026-07-01',
        endDate: '2026-08-01',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Discount must be between 0 and 100');
  });

  it('blocks staff from creating promotions', async () => {
    const response = await request(app)
      .post('/api/promotions')
      .set(authHeader('staff', 2))
      .send({
        title: 'Ưu đãi',
        startDate: '2026-07-01',
        endDate: '2026-08-01',
      });

    expect(response.status).toBe(403);
  });
});
