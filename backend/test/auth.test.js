import bcrypt from 'bcryptjs';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../src/app.js';
import { authHeader } from './helpers.js';
import { prismaMock } from './setup.js';

describe('Auth API', () => {
  it('rejects login when credentials are missing', async () => {
    const response = await request(app).post('/api/auth/login').send({ email: 'owner@gym.com' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Email and password are required');
  });

  it('returns JWT and user data for valid credentials', async () => {
    const passwordHash = await bcrypt.hash('owner123', 4);
    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      name: 'Owner',
      email: 'owner@gym.com',
      passwordHash,
      role: 'owner',
      phone: '0900000001',
      isActive: true,
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'owner@gym.com', password: 'owner123' });

    expect(response.status).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.user).toMatchObject({ id: 1, role: 'owner', email: 'owner@gym.com' });
  });

  it('rejects inactive users', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'owner@gym.com',
      passwordHash: 'unused',
      role: 'owner',
      isActive: false,
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'owner@gym.com', password: 'owner123' });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Invalid credentials');
  });

  it('validates the new password length', async () => {
    const response = await request(app)
      .post('/api/auth/change-password')
      .set(authHeader('member', 4))
      .send({ currentPassword: 'member123', newPassword: '123' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('New password must be at least 6 characters');
  });

  it('requires a valid token for protected endpoints', async () => {
    const response = await request(app).get('/api/auth/me');

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Access token required');
  });
});
