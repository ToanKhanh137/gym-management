import request from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../src/app.js';
import { authHeader } from './helpers.js';
import { prismaMock } from './setup.js';

describe('Training log API', () => {
  it('rejects a subscription that belongs to another member', async () => {
    prismaMock.subscription.findUnique.mockResolvedValue({
      id: 5,
      memberId: 99,
      status: 'active',
      endDate: '2099-12-31',
      sessionsTotal: null,
      sessionsUsed: 0,
    });

    const response = await request(app)
      .post('/api/training-logs')
      .set(authHeader('staff', 2))
      .send({ memberId: 4, subscriptionId: 5 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Subscription does not belong to this member');
  });

  it('prevents duplicate open check-ins', async () => {
    prismaMock.subscription.findUnique.mockResolvedValue({
      id: 5,
      memberId: 4,
      status: 'active',
      endDate: '2099-12-31',
      sessionsTotal: null,
      sessionsUsed: 0,
      trainerId: 10,
    });
    prismaMock.trainer.findUnique.mockResolvedValue({
      id: 10,
      userId: 3,
    });
    prismaMock.trainingLog.findFirst.mockResolvedValue({ id: 20, checkedOutAt: null });

    const response = await request(app)
      .post('/api/training-logs')
      .set(authHeader('pt', 3))
      .send({ memberId: 4, subscriptionId: 5 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Member already has an open check-in');
  });

  it('creates a log and increments used sessions atomically', async () => {
    prismaMock.subscription.findUnique.mockResolvedValue({
      id: 5,
      memberId: 4,
      status: 'active',
      endDate: '2099-12-31',
      sessionsTotal: 10,
      sessionsUsed: 2,
    });
    prismaMock.trainingLog.findFirst.mockResolvedValue(null);
    prismaMock.trainingLog.create.mockResolvedValue({ id: 21, memberId: 4, subscriptionId: 5 });
    prismaMock.subscription.update.mockResolvedValue({ id: 5, sessionsUsed: 3 });

    const response = await request(app)
      .post('/api/training-logs')
      .set(authHeader('staff', 2))
      .send({ memberId: 4, subscriptionId: 5 });

    expect(response.status).toBe(201);
    expect(response.body.id).toBe(21);
    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    expect(prismaMock.subscription.update).toHaveBeenCalledWith({
      where: { id: 5 },
      data: { sessionsUsed: { increment: 1 } },
    });
  });

  it('prevents checking out the same log twice', async () => {
    prismaMock.trainingLog.findUnique.mockResolvedValue({
      id: 21,
      checkedOutAt: new Date(),
    });

    const response = await request(app)
      .patch('/api/training-logs/21/checkout')
      .set(authHeader('staff', 2))
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Training log already checked out');
  });

  it('rejects check-in by a PT not assigned to the member', async () => {
    prismaMock.subscription.findUnique.mockResolvedValue({
      id: 5,
      memberId: 4,
      status: 'active',
      endDate: '2099-12-31',
      sessionsTotal: null,
      sessionsUsed: 0,
      trainerId: 99, // Assigned to PT with ID 99
    });
    prismaMock.trainer.findUnique.mockResolvedValue({
      id: 10, // Logged-in PT has ID 10
      userId: 3,
    });

    const response = await request(app)
      .post('/api/training-logs')
      .set(authHeader('pt', 3))
      .send({ memberId: 4, subscriptionId: 5 });

    expect(response.status).toBe(403);
    expect(response.body.error).toBe('Huấn luyện viên chỉ được phép thực hiện check-in cho học viên của mình');
  });

  it('rejects check-out by a PT not assigned to the member', async () => {
    prismaMock.trainingLog.findUnique.mockResolvedValue({
      id: 21,
      subscriptionId: 5,
      checkedOutAt: null,
    });
    prismaMock.subscription.findUnique.mockResolvedValue({
      id: 5,
      trainerId: 99, // Assigned to PT with ID 99
    });
    prismaMock.trainer.findUnique.mockResolvedValue({
      id: 10, // Logged-in PT has ID 10
      userId: 3,
    });

    const response = await request(app)
      .patch('/api/training-logs/21/checkout')
      .set(authHeader('pt', 3))
      .send({ notes: 'Xong buổi' });

    expect(response.status).toBe(403);
    expect(response.body.error).toBe('Huấn luyện viên chỉ được phép thực hiện check-out cho học viên của mình');
  });
});
