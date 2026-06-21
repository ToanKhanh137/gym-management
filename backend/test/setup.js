import { beforeEach, vi } from 'vitest';

const model = () => ({
  findUnique: vi.fn(),
  findFirst: vi.fn(),
  findMany: vi.fn(),
  count: vi.fn(),
  create: vi.fn(),
  createMany: vi.fn(),
  update: vi.fn(),
  updateMany: vi.fn(),
  deleteMany: vi.fn(),
  aggregate: vi.fn(),
  groupBy: vi.fn(),
  upsert: vi.fn(),
});

export const prismaMock = {
  user: model(),
  member: model(),
  trainer: model(),
  trainerSchedule: model(),
  staffSchedule: model(),
  membershipPackage: model(),
  subscription: model(),
  subscriptionRenewal: model(),
  room: model(),
  equipment: model(),
  maintenanceRequest: model(),
  trainingLog: model(),
  feedback: model(),
  promotion: model(),
  $transaction: vi.fn(),
};

vi.mock('../src/prisma/client.js', () => ({
  default: prismaMock,
}));

process.env.JWT_SECRET = 'unit-test-secret';
process.env.JWT_EXPIRES_IN = '1h';

beforeEach(() => {
  vi.clearAllMocks();
  prismaMock.$transaction.mockImplementation(async (operations) => Promise.all(operations));
});
