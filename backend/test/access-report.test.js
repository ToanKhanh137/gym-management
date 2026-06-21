import request from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../src/app.js';
import { authHeader } from './helpers.js';
import { prismaMock } from './setup.js';

const mockDashboardQueries = () => {
  prismaMock.member.count.mockResolvedValue(12);
  prismaMock.subscription.count.mockResolvedValue(8);
  prismaMock.subscription.aggregate.mockResolvedValue({ _sum: { amountPaid: 4000000 } });
  prismaMock.subscriptionRenewal.aggregate.mockResolvedValue({ _sum: { amountPaid: 500000 } });
  prismaMock.maintenanceRequest.count.mockResolvedValue(2);
  prismaMock.trainingLog.count.mockResolvedValue(5);
};

describe('Dashboard access and reports', () => {
  it('allows staff to view dashboard KPIs without revenue', async () => {
    mockDashboardQueries();

    const response = await request(app)
      .get('/api/reports/dashboard')
      .set(authHeader('staff', 2));

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      totalMembers: 12,
      activeSubscriptions: 8,
      pendingMaintenance: 2,
      todayCheckIns: 5,
    });
    expect(response.body).not.toHaveProperty('monthlyRevenue');
  });

  it('returns revenue to owner dashboard', async () => {
    mockDashboardQueries();

    const response = await request(app)
      .get('/api/reports/dashboard')
      .set(authHeader('owner', 1));

    expect(response.status).toBe(200);
    expect(response.body.monthlyRevenue).toBe(4500000);
  });

  it('blocks members from management feedback list', async () => {
    const response = await request(app)
      .get('/api/feedbacks')
      .set(authHeader('member', 4));

    expect(response.status).toBe(403);
    expect(response.body.error).toBe('Insufficient permissions');
  });

  it('reports registrations, renewals and used sessions', async () => {
    prismaMock.member.count.mockResolvedValue(3);
    prismaMock.subscription.count.mockResolvedValue(4);
    prismaMock.subscriptionRenewal.count.mockResolvedValue(2);
    prismaMock.trainingLog.count.mockResolvedValue(18);

    const response = await request(app)
      .get('/api/reports/registrations?from=2026-06-01&to=2026-06-30')
      .set(authHeader('staff', 2));

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      newMembers: 3,
      registrations: 4,
      renewals: 2,
      sessionsUsed: 18,
    });
  });
});
