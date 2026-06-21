import request from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../src/app.js';
import { authHeader } from './helpers.js';
import { prismaMock } from './setup.js';

describe('Subscription renewal', () => {
  it('renews a duration package and records a payment transaction', async () => {
    prismaMock.subscription.findUnique.mockResolvedValue({
      id: 10,
      status: 'active',
      endDate: '2099-06-30',
      package: {
        id: 1,
        name: 'Gói 3 tháng',
        durationDays: 90,
        totalSessions: null,
        price: 1500000,
        isActive: true,
      },
    });
    prismaMock.subscription.update.mockResolvedValue({ id: 10, status: 'active', endDate: '2099-09-28' });
    prismaMock.subscriptionRenewal.create.mockResolvedValue({ id: 7, amountPaid: 1500000 });

    const response = await request(app)
      .post('/api/subscriptions/10/renew')
      .set(authHeader('staff', 2))
      .send({ paymentMethod: 'bank_transfer' });

    expect(response.status).toBe(200);
    expect(prismaMock.subscription.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 10 },
      data: expect.objectContaining({ status: 'active', endDate: '2099-09-28' }),
    }));
    expect(prismaMock.subscriptionRenewal.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        subscriptionId: 10,
        paymentMethod: 'bank_transfer',
        amountPaid: 1500000,
        renewedById: 2,
      }),
    });
  });

  it('adds sessions when renewing a per-session package', async () => {
    prismaMock.subscription.findUnique.mockResolvedValue({
      id: 11,
      status: 'expired',
      endDate: null,
      package: {
        id: 3,
        durationDays: null,
        totalSessions: 10,
        price: 600000,
        isActive: true,
      },
    });
    prismaMock.subscription.update.mockResolvedValue({ id: 11, status: 'active', sessionsTotal: 20 });
    prismaMock.subscriptionRenewal.create.mockResolvedValue({ id: 8, addedSessions: 10 });

    const response = await request(app)
      .post('/api/subscriptions/11/renew')
      .set(authHeader('owner', 1))
      .send({ paymentMethod: 'cash' });

    expect(response.status).toBe(200);
    expect(prismaMock.subscription.update).toHaveBeenCalledWith(expect.objectContaining({
      data: { status: 'active', sessionsTotal: { increment: 10 } },
    }));
    expect(prismaMock.subscriptionRenewal.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ addedSessions: 10, newEndDate: null }),
    });
  });

  it('does not renew cancelled subscriptions', async () => {
    prismaMock.subscription.findUnique.mockResolvedValue({
      id: 12,
      status: 'cancelled',
      package: { isActive: true },
    });

    const response = await request(app)
      .post('/api/subscriptions/12/renew')
      .set(authHeader('staff', 2))
      .send({ paymentMethod: 'cash' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Cancelled subscription cannot be renewed');
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });

  it('blocks members from renewing through management API', async () => {
    const response = await request(app)
      .post('/api/subscriptions/10/renew')
      .set(authHeader('member', 4))
      .send({ paymentMethod: 'cash' });

    expect(response.status).toBe(403);
  });
});
