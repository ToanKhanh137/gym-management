import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Owner account
  const ownerHash = await bcrypt.hash('owner123', 10);
  const owner = await prisma.user.upsert({
    where: { email: 'owner@gym.com' },
    update: {},
    create: { name: 'Chủ phòng tập', email: 'owner@gym.com', passwordHash: ownerHash, role: 'owner', phone: '0900000001' },
  });

  // Create Staff account
  const staffHash = await bcrypt.hash('staff123', 10);
  await prisma.user.upsert({
    where: { email: 'staff@gym.com' },
    update: {},
    create: { name: 'Nhân viên A', email: 'staff@gym.com', passwordHash: staffHash, role: 'staff', phone: '0900000002' },
  });

  // Create PT account
  const ptHash = await bcrypt.hash('pt123', 10);
  const ptUser = await prisma.user.upsert({
    where: { email: 'pt@gym.com' },
    update: {},
    create: { name: 'HLV Minh', email: 'pt@gym.com', passwordHash: ptHash, role: 'pt', phone: '0900000003' },
  });
  await prisma.trainer.upsert({
    where: { userId: ptUser.id },
    update: {},
    create: { userId: ptUser.id, speciality: 'Gym & Cardio' },
  });

  // Create Member account
  const memHash = await bcrypt.hash('member123', 10);
  const memUser = await prisma.user.upsert({
    where: { email: 'member@gym.com' },
    update: {},
    create: { name: 'Nguyễn Văn A', email: 'member@gym.com', passwordHash: memHash, role: 'member', phone: '0900000004' },
  });
  const member = await prisma.member.upsert({
    where: { userId: memUser.id },
    update: {},
    create: { userId: memUser.id, memberCode: 'MEM001', occupation: 'Sinh viên' },
  });

  // Create Rooms
  const gymRoom = await prisma.room.upsert({
    where: { roomCode: 'R001' },
    update: {},
    create: { roomCode: 'R001', name: 'Phòng Gym chính', type: 'gym', capacity: 30 },
  });
  await prisma.room.upsert({
    where: { roomCode: 'R002' },
    update: {},
    create: { roomCode: 'R002', name: 'Phòng Yoga', type: 'yoga', capacity: 20 },
  });

  // Create Equipment
  await prisma.equipment.upsert({
    where: { equipmentCode: 'EQ001' },
    update: {},
    create: { equipmentCode: 'EQ001', name: 'Máy chạy bộ', roomId: gymRoom.id, quantity: 5, importedAt: '2024-01-15', warrantyUntil: '2026-01-15', origin: 'Mỹ' },
  });
  await prisma.equipment.upsert({
    where: { equipmentCode: 'EQ002' },
    update: {},
    create: { equipmentCode: 'EQ002', name: 'Tạ đòn', roomId: gymRoom.id, quantity: 10, importedAt: '2024-01-15', origin: 'Việt Nam' },
  });

  // Create Packages
  const pkg3m = await prisma.membershipPackage.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'Gói 3 tháng', type: 'quarterly', durationDays: 90, price: 1500000, description: 'Tập không giới hạn 3 tháng' },
  });
  await prisma.membershipPackage.upsert({
    where: { id: 2 },
    update: {},
    create: { name: 'Gói 1 năm', type: 'yearly', durationDays: 365, price: 5000000, description: 'Gói tiết kiệm nhất' },
  });
  await prisma.membershipPackage.upsert({
    where: { id: 3 },
    update: {},
    create: { name: 'Gói theo buổi (10 buổi)', type: 'per_session', totalSessions: 10, price: 600000, description: '10 buổi tập linh hoạt' },
  });

  // Create a sample subscription
  await prisma.subscription.upsert({
    where: { id: 1 },
    update: {},
    create: {
      memberId: member.id,
      packageId: pkg3m.id,
      startDate: '2026-06-01',
      endDate: '2026-08-30',
      status: 'active',
      paymentMethod: 'cash',
      amountPaid: 1500000,
      paidAt: new Date('2026-06-01'),
      createdById: owner.id,
    },
  });

  console.log('✅ Seed complete!');
  console.log('📋 Test accounts:');
  console.log('  owner@gym.com   / owner123  (Chủ phòng tập)');
  console.log('  staff@gym.com   / staff123  (Nhân viên)');
  console.log('  pt@gym.com      / pt123     (Huấn luyện viên)');
  console.log('  member@gym.com  / member123 (Hội viên)');
}

main().catch(console.error).finally(() => prisma.$disconnect());
