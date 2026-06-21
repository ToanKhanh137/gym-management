import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding rich and realistic database for GymPro...');

  // 1. CLEAN UP existing dynamic records in reverse dependency order
  console.log('🧹 Cleaning existing records...');
  await prisma.feedback.deleteMany({});
  await prisma.maintenanceRequest.deleteMany({});
  await prisma.trainingLog.deleteMany({});
  await prisma.subscriptionRenewal.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.staffSchedule.deleteMany({});
  await prisma.trainerSchedule.deleteMany({});
  await prisma.member.deleteMany({});
  await prisma.trainer.deleteMany({});
  await prisma.equipment.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.membershipPackage.deleteMany({});
  await prisma.promotion.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. CREATE SYSTEM ACCOUNTS
  console.log('👥 Creating staff, owner and PT accounts...');
  const saltRounds = 10;
  const ownerHash = await bcrypt.hash('owner123', saltRounds);
  const staffHash = await bcrypt.hash('staff123', saltRounds);
  const ptHash = await bcrypt.hash('pt123', saltRounds);
  const memberHash = await bcrypt.hash('member123', saltRounds);

  // Owner
  const owner = await prisma.user.create({
    data: { name: 'Nguyễn Khánh Toàn', email: 'owner@gym.com', passwordHash: ownerHash, role: 'owner', phone: '0912345678', dob: '1985-05-15' }
  });

  // Staff
  const staff1 = await prisma.user.create({
    data: { name: 'Trần Thị Mai', email: 'staff@gym.com', passwordHash: staffHash, role: 'staff', phone: '0987654321', dob: '1995-10-20' }
  });
  const staff2 = await prisma.user.create({
    data: { name: 'Lê Hoàng Nam', email: 'staff2@gym.com', passwordHash: staffHash, role: 'staff', phone: '0977889900', dob: '1998-02-12' }
  });
  const staff3 = await prisma.user.create({
    data: { name: 'Phạm Minh Đức', email: 'staff3@gym.com', passwordHash: staffHash, role: 'staff', phone: '0971234567', dob: '1999-05-18' }
  });

  // PTs
  const pt1User = await prisma.user.create({
    data: { name: 'HLV Phạm Văn Minh', email: 'pt@gym.com', passwordHash: ptHash, role: 'pt', phone: '0901234567', dob: '1992-04-25' }
  });
  const pt1 = await prisma.trainer.create({
    data: { userId: pt1User.id, speciality: 'Tăng cơ, giảm mỡ & Cardio' }
  });

  const pt2User = await prisma.user.create({
    data: { name: 'HLV Hoàng Thu Trang', email: 'pt2@gym.com', passwordHash: ptHash, role: 'pt', phone: '0907654321', dob: '1994-08-18' }
  });
  const pt2 = await prisma.trainer.create({
    data: { userId: pt2User.id, speciality: 'Yoga & Pilates' }
  });

  const pt3User = await prisma.user.create({
    data: { name: 'HLV Nguyễn Quốc Anh', email: 'pt3@gym.com', passwordHash: ptHash, role: 'pt', phone: '0934567890', dob: '1993-12-10' }
  });
  const pt3 = await prisma.trainer.create({
    data: { userId: pt3User.id, speciality: 'Powerlifting & Strength Training' }
  });

  // 3. CREATE ROOMS
  console.log('🏢 Creating rooms...');
  const gymRoom = await prisma.room.create({
    data: { roomCode: 'R001', name: 'Phòng Gym chính', type: 'gym', capacity: 40, status: 'active' }
  });
  const yogaRoom = await prisma.room.create({
    data: { roomCode: 'R002', name: 'Phòng Yoga & Group Class', type: 'yoga', capacity: 20, status: 'active' }
  });
  const pilatesRoom = await prisma.room.create({
    data: { roomCode: 'R003', name: 'Phòng Pilates chuyên sâu', type: 'fitness', capacity: 15, status: 'active' }
  });

  // 4. CREATE EQUIPMENT
  console.log('🏋️ Creating equipment...');
  const eqRunning = await prisma.equipment.create({
    data: { equipmentCode: 'EQ001', name: 'Máy chạy bộ Impulse', roomId: gymRoom.id, quantity: 6, importedAt: '2024-03-10', warrantyUntil: '2026-03-10', origin: 'Mỹ', status: 'good' }
  });
  const eqBicycle = await prisma.equipment.create({
    data: { equipmentCode: 'EQ002', name: 'Xe đạp tập thể hình', roomId: gymRoom.id, quantity: 4, importedAt: '2024-03-10', warrantyUntil: '2025-09-10', origin: 'Đài Loan', status: 'good' }
  });
  const eqDumbbell = await prisma.equipment.create({
    data: { equipmentCode: 'EQ003', name: 'Dàn tạ tay Iron Bull (1-30kg)', roomId: gymRoom.id, quantity: 30, importedAt: '2024-05-15', warrantyUntil: '2027-05-15', origin: 'Việt Nam', status: 'good' }
  });
  const eqChestPress = await prisma.equipment.create({
    data: { equipmentCode: 'EQ004', name: 'Máy ép ngực đa năng', roomId: gymRoom.id, quantity: 2, importedAt: '2024-06-01', warrantyUntil: '2026-06-01', origin: 'Trung Quốc', status: 'damaged' }
  });
  const eqMats = await prisma.equipment.create({
    data: { equipmentCode: 'EQ005', name: 'Thảm Yoga Adidas', roomId: yogaRoom.id, quantity: 25, importedAt: '2025-01-20', warrantyUntil: '2026-01-20', origin: 'Đức', status: 'good' }
  });
  const eqReformer = await prisma.equipment.create({
    data: { equipmentCode: 'EQ006', name: 'Giường Pilates Reformer', roomId: pilatesRoom.id, quantity: 5, importedAt: '2025-02-15', warrantyUntil: '2027-02-15', origin: 'Hàn Quốc', status: 'maintenance' }
  });

  // 5. CREATE MEMBERSHIP PACKAGES
  console.log('🏷️ Creating membership packages...');
  const pkg1m = await prisma.membershipPackage.create({
    data: { name: 'Gói 1 tháng', type: 'monthly', durationDays: 30, price: 600000, description: 'Tập tự do trong 1 tháng' }
  });
  const pkg3m = await prisma.membershipPackage.create({
    data: { name: 'Gói 3 tháng', type: 'quarterly', durationDays: 90, price: 1500000, description: 'Gói phổ thông tiết kiệm' }
  });
  const pkg12m = await prisma.membershipPackage.create({
    data: { name: 'Gói 1 năm', type: 'yearly', durationDays: 365, price: 5000000, description: 'Gói hội viên VIP năm' }
  });
  const pkg10s = await prisma.membershipPackage.create({
    data: { name: 'Gói 10 buổi lẻ', type: 'per_session', totalSessions: 10, price: 600000, description: 'Hạn dùng 45 ngày, tính theo lượt check-in' }
  });
  const pkgVipPt = await prisma.membershipPackage.create({
    data: { name: 'Gói VIP 12 tháng + PT', type: 'vip', durationDays: 365, price: 12000000, description: 'Tập tự do 1 năm kèm 24 buổi tập với HLV cá nhân' }
  });
  const pkgPtOnly = await prisma.membershipPackage.create({
    data: { name: 'Gói PT cá nhân (20 buổi)', type: 'pt', totalSessions: 20, price: 6000000, description: '20 buổi tập 1-kèm-1 chuyên sâu cùng PT tự chọn' }
  });

  // 6. CREATE MEMBERS
  console.log('👤 Creating members...');
  const memberData = [
    { name: 'Nguyễn Văn A', email: 'member@gym.com', phone: '0901112221', dob: '2001-08-15', occ: 'Sinh viên' },
    { name: 'Trần Thị Bình', email: 'binh.tran@gmail.com', phone: '0901112222', dob: '1996-03-24', occ: 'Kế toán viên' },
    { name: 'Phạm Hồng Cường', email: 'cuong.pham@gmail.com', phone: '0901112223', dob: '1990-11-05', occ: 'Lập trình viên' },
    { name: 'Lê Hoàng Dung', email: 'dung.le@yahoo.com', phone: '0901112224', dob: '1988-12-18', occ: 'Kinh doanh tự do' },
    { name: 'Nguyễn Tiến Đạt', email: 'dat.nguyen@gmail.com', phone: '0901112225', dob: '1994-07-30', occ: 'Thiết kế đồ họa' },
    { name: 'Vũ Thị Hương', email: 'huong.vu@outlook.com', phone: '0901112226', dob: '1997-09-02', occ: 'Giao dịch viên' },
    { name: 'Hoàng Văn Hải', email: 'hai.hoang@gmail.com', phone: '0901112227', dob: '1989-05-14', occ: 'Kỹ sư xây dựng' },
    { name: 'Đặng Trung Kiên', email: 'kien.dang@student.edu.vn', phone: '0901112228', dob: '2003-01-22', occ: 'Sinh viên' },
    { name: 'Bùi Minh Tuấn', email: 'tuan.bui@gmail.com', phone: '0901112229', dob: '1992-02-14', occ: 'Lập trình viên' },
    { name: 'Trần Minh Khoa', email: 'khoa.tran@yahoo.com', phone: '0901112230', dob: '1995-09-08', occ: 'Giáo viên' },
    { name: 'Phan Thúy Hạnh', email: 'hanh.phan@gmail.com', phone: '0901112231', dob: '1991-04-12', occ: 'Marketing Specialist' },
    { name: 'Lâm Chí Dũng', email: 'dung.lam@gmail.com', phone: '0901112232', dob: '1999-10-05', occ: 'Kỹ sư phần mềm' },
    { name: 'Vũ Thành Long', email: 'long.vu@gmail.com', phone: '0901112233', dob: '1987-03-30', occ: 'Doanh nhân' },
    { name: 'Ngô Gia Bảo', email: 'bao.ngo@student.edu.vn', phone: '0901112234', dob: '2004-11-20', occ: 'Sinh viên' }
  ];

  const members = [];
  for (let i = 0; i < memberData.length; i++) {
    const md = memberData[i];
    const u = await prisma.user.create({
      data: {
        name: md.name,
        email: md.email,
        passwordHash: memberHash,
        role: 'member',
        phone: md.phone,
        dob: md.dob
      }
    });
    const m = await prisma.member.create({
      data: {
        userId: u.id,
        memberCode: `MEM${String(i + 1).padStart(3, '0')}`,
        occupation: md.occ
      }
    });
    members.push(m);
  }

  // 7. CREATE SUBSCRIPTIONS AND RENEWALS (PAST & ACTIVE)
  console.log('💳 Creating subscriptions and payments...');

  // Member 1 (Nguyễn Văn A)
  // Gói quá khứ (Expired): 1 tháng từ 2026-04-15 đến 2026-05-15
  await prisma.subscription.create({
    data: {
      memberId: members[0].id,
      packageId: pkg1m.id,
      startDate: '2026-04-15',
      endDate: '2026-05-15',
      status: 'expired',
      paymentMethod: 'cash',
      amountPaid: 600000,
      paidAt: new Date('2026-04-15T08:30:00Z'),
      createdById: staff1.id
    }
  });
  // Gói hiện tại (Active)
  const sub1 = await prisma.subscription.create({
    data: {
      memberId: members[0].id,
      packageId: pkg3m.id,
      startDate: '2026-06-01',
      endDate: '2026-08-30',
      status: 'active',
      paymentMethod: 'cash',
      amountPaid: 1500000,
      paidAt: new Date('2026-06-01T08:30:00Z'),
      createdById: staff1.id
    }
  });

  // Member 2 (Trần Thị Bình)
  const sub2 = await prisma.subscription.create({
    data: {
      memberId: members[1].id,
      packageId: pkg10s.id,
      startDate: '2026-06-10',
      endDate: '2026-07-25',
      sessionsTotal: 10,
      sessionsUsed: 4,
      status: 'active',
      paymentMethod: 'bank_transfer',
      amountPaid: 600000,
      paidAt: new Date('2026-06-10T09:15:00Z'),
      createdById: staff1.id
    }
  });

  // Member 3 (Phạm Hồng Cường)
  // Gói quá khứ (Expired): 3 tháng từ 2026-01-01 đến 2026-04-01
  await prisma.subscription.create({
    data: {
      memberId: members[2].id,
      packageId: pkg3m.id,
      startDate: '2026-01-01',
      endDate: '2026-04-01',
      status: 'expired',
      paymentMethod: 'bank_transfer',
      amountPaid: 1500000,
      paidAt: new Date('2026-01-01T09:00:00Z'),
      createdById: staff2.id
    }
  });
  // Gói hiện tại (Active)
  const sub3 = await prisma.subscription.create({
    data: {
      memberId: members[2].id,
      packageId: pkg12m.id,
      startDate: '2026-04-15',
      endDate: '2027-04-15',
      status: 'active',
      paymentMethod: 'bank_transfer',
      amountPaid: 5000000,
      paidAt: new Date('2026-04-15T15:00:00Z'),
      createdById: owner.id
    }
  });

  // Member 4 (Lê Hoàng Dung)
  // Gói cũ (Expired)
  await prisma.subscription.create({
    data: {
      memberId: members[3].id,
      packageId: pkg1m.id,
      startDate: '2026-05-01',
      endDate: '2026-05-31',
      status: 'expired',
      paymentMethod: 'e_wallet',
      amountPaid: 600000,
      paidAt: new Date('2026-05-01T10:00:00Z'),
      createdById: staff2.id
    }
  });
  // Gói gia hạn mới (Active)
  const sub4 = await prisma.subscription.create({
    data: {
      memberId: members[3].id,
      packageId: pkg1m.id,
      startDate: '2026-06-01',
      endDate: '2026-06-30',
      status: 'active',
      paymentMethod: 'e_wallet',
      amountPaid: 600000,
      paidAt: new Date('2026-06-01T11:20:00Z'),
      createdById: staff1.id
    }
  });
  await prisma.subscriptionRenewal.create({
    data: {
      subscriptionId: sub4.id,
      previousEndDate: '2026-05-31',
      newEndDate: '2026-06-30',
      paymentMethod: 'e_wallet',
      amountPaid: 600000,
      renewedById: staff1.id,
      renewedAt: new Date('2026-06-01T11:20:00Z')
    }
  });

  // Member 5 (Nguyễn Tiến Đạt)
  const sub5 = await prisma.subscription.create({
    data: {
      memberId: members[4].id,
      packageId: pkgVipPt.id,
      startDate: '2026-05-10',
      endDate: '2027-05-10',
      sessionsTotal: 24,
      sessionsUsed: 6,
      status: 'active',
      paymentMethod: 'bank_transfer',
      amountPaid: 12000000,
      paidAt: new Date('2026-05-10T14:40:00Z'),
      createdById: owner.id,
      trainerId: pt1.id
    }
  });

  // Member 6 (Vũ Thị Hương)
  const sub6 = await prisma.subscription.create({
    data: {
      memberId: members[5].id,
      packageId: pkgPtOnly.id,
      startDate: '2026-06-05',
      sessionsTotal: 20,
      sessionsUsed: 3,
      status: 'active',
      paymentMethod: 'bank_transfer',
      amountPaid: 6000000,
      paidAt: new Date('2026-06-05T09:00:00Z'),
      createdById: staff2.id,
      trainerId: pt2.id
    }
  });

  // Member 7 (Hoàng Văn Hải)
  const sub7 = await prisma.subscription.create({
    data: {
      memberId: members[6].id,
      packageId: pkg3m.id,
      startDate: '2026-06-21',
      endDate: '2026-09-20',
      status: 'active',
      paymentMethod: 'cash',
      amountPaid: 1500000,
      paidAt: new Date('2026-06-21T07:15:00Z'),
      createdById: staff1.id
    }
  });

  // Member 8 (Đặng Trung Kiên)
  // Gói cũ bị Hủy (Cancelled) do bận học tập quân sự
  await prisma.subscription.create({
    data: {
      memberId: members[7].id,
      packageId: pkg1m.id,
      startDate: '2026-05-01',
      endDate: '2026-05-31',
      status: 'cancelled',
      paymentMethod: 'cash',
      amountPaid: 600000,
      paidAt: new Date('2026-05-01T14:00:00Z'),
      createdById: staff2.id
    }
  });

  // Member 9 (Bùi Minh Tuấn)
  // Gói cũ (Expired)
  const sub9Old = await prisma.subscription.create({
    data: {
      memberId: members[8].id,
      packageId: pkg10s.id,
      startDate: '2026-02-01',
      endDate: '2026-03-15',
      sessionsTotal: 10,
      sessionsUsed: 10,
      status: 'expired',
      paymentMethod: 'e_wallet',
      amountPaid: 600000,
      paidAt: new Date('2026-02-01T18:00:00Z'),
      createdById: staff3.id
    }
  });
  // Gói hiện tại (Active)
  const sub9 = await prisma.subscription.create({
    data: {
      memberId: members[8].id,
      packageId: pkg1m.id,
      startDate: '2026-06-10',
      endDate: '2026-07-10',
      status: 'active',
      paymentMethod: 'cash',
      amountPaid: 600000,
      paidAt: new Date('2026-06-10T18:15:00Z'),
      createdById: staff2.id
    }
  });

  // Member 10 (Trần Minh Khoa)
  const sub10 = await prisma.subscription.create({
    data: {
      memberId: members[9].id,
      packageId: pkg3m.id,
      startDate: '2026-05-20',
      endDate: '2026-08-20',
      status: 'active',
      paymentMethod: 'bank_transfer',
      amountPaid: 1500000,
      paidAt: new Date('2026-05-20T10:00:00Z'),
      createdById: staff3.id
    }
  });

  // Member 11 (Phan Thúy Hạnh) - Tập cùng PT Quốc Anh
  const sub11 = await prisma.subscription.create({
    data: {
      memberId: members[10].id,
      packageId: pkgPtOnly.id,
      startDate: '2026-06-01',
      sessionsTotal: 20,
      sessionsUsed: 12,
      status: 'active',
      paymentMethod: 'bank_transfer',
      amountPaid: 6000000,
      paidAt: new Date('2026-06-01T15:30:00Z'),
      createdById: owner.id,
      trainerId: pt3.id
    }
  });

  // Member 12 (Lâm Chí Dũng)
  const sub12 = await prisma.subscription.create({
    data: {
      memberId: members[11].id,
      packageId: pkg12m.id,
      startDate: '2026-02-10',
      endDate: '2027-02-10',
      status: 'active',
      paymentMethod: 'bank_transfer',
      amountPaid: 5000000,
      paidAt: new Date('2026-02-10T09:40:00Z'),
      createdById: staff1.id
    }
  });

  // Member 13 (Vũ Thành Long)
  // Gói cũ (Expired)
  await prisma.subscription.create({
    data: {
      memberId: members[12].id,
      packageId: pkg3m.id,
      startDate: '2025-10-10',
      endDate: '2026-01-10',
      status: 'expired',
      paymentMethod: 'cash',
      amountPaid: 1500000,
      paidAt: new Date('2025-10-10T08:00:00Z'),
      createdById: staff2.id
    }
  });
  // Gói hiện tại (Active)
  const sub13 = await prisma.subscription.create({
    data: {
      memberId: members[12].id,
      packageId: pkg12m.id,
      startDate: '2026-01-15',
      endDate: '2027-01-15',
      status: 'active',
      paymentMethod: 'bank_transfer',
      amountPaid: 5000000,
      paidAt: new Date('2026-01-15T11:00:00Z'),
      createdById: owner.id
    }
  });

  // Member 14 (Ngô Gia Bảo)
  const sub14 = await prisma.subscription.create({
    data: {
      memberId: members[13].id,
      packageId: pkg1m.id,
      startDate: '2026-06-18',
      endDate: '2026-07-18',
      status: 'active',
      paymentMethod: 'e_wallet',
      amountPaid: 600000,
      paidAt: new Date('2026-06-18T16:20:00Z'),
      createdById: staff3.id
    }
  });

  // 8. CREATE TRAINING LOGS (CHECK-INS)
  console.log('🚶 Creating check-in history (Training Logs)...');

  // Historical logs for Member 9's old expired subscription (10 sessions)
  for (let d = 1; d <= 10; d++) {
    const dayStr = String(d + 5).padStart(2, '0');
    await prisma.trainingLog.create({
      data: {
        memberId: members[8].id,
        subscriptionId: sub9Old.id,
        checkedInAt: new Date(`2026-02-${dayStr}T18:00:00Z`),
        checkedOutAt: new Date(`2026-02-${dayStr}T19:30:00Z`),
        recordedById: staff3.id,
        notes: `Tập luyện buổi thứ ${d}: Hướng dẫn máy gym & thể lực`
      }
    });
  }

  // Logs for Member 11 (Phan Thúy Hạnh) with PT3 - 12 sessions used
  const hanhCheckins = [
    { date: '2026-06-02', in: '16:00:00', out: '17:15:00', note: 'Khởi động nhẹ, kiểm tra thể lực với HLV Quốc Anh.' },
    { date: '2026-06-03', in: '16:00:00', out: '17:30:00', note: 'Hướng dẫn chuẩn form Squat và Lunge chống đau gối.' },
    { date: '2026-06-05', in: '16:15:00', out: '17:15:00', note: 'Tập cơ xô với xà đơn trợ lực.' },
    { date: '2026-06-08', in: '16:00:00', out: '17:20:00', note: 'Tập cơ vai và tay sau với tạ đơn.' },
    { date: '2026-06-10', in: '15:50:00', out: '17:00:00', note: 'Tập đẩy ngực tạ đòn Bench Press.' },
    { date: '2026-06-12', in: '16:00:00', out: '17:15:00', note: 'Tập Leg Press tăng tiến mức tạ nhẹ.' },
    { date: '2026-06-13', in: '10:00:00', out: '11:15:00', note: 'Cardio HIIT đốt mỡ 30 phút.' },
    { date: '2026-06-15', in: '16:00:00', out: '17:30:00', note: 'Tập Hip Thrust mông đùi.' },
    { date: '2026-06-16', in: '16:00:00', out: '17:20:00', note: 'Tập Romanian Deadlift với tạ đòn.' },
    { date: '2026-06-18', in: '16:05:00', out: '17:15:00', note: 'Tập vai trước và vai sau máy cáp.' },
    { date: '2026-06-19', in: '16:00:00', out: '17:30:00', note: 'Tập cơ core gập bụng nâng chân.' },
    { date: '2026-06-20', in: '09:30:00', out: '10:45:00', note: 'Tập phục hồi cơ giãn cơ nhẹ nhàng.' }
  ];
  for (const c of hanhCheckins) {
    await prisma.trainingLog.create({
      data: {
        memberId: members[10].id,
        subscriptionId: sub11.id,
        checkedInAt: new Date(`${c.date}T${c.in}Z`),
        checkedOutAt: new Date(`${c.date}T${c.out}Z`),
        recordedById: staff1.id,
        notes: c.note
      }
    });
  }

  // Active checkins today (2026-06-21) - Not checked out yet (in progress)
  await prisma.trainingLog.create({
    data: {
      memberId: members[2].id,
      subscriptionId: sub3.id,
      checkedInAt: new Date('2026-06-21T13:00:00Z'),
      recordedById: staff1.id,
      notes: 'Tập ngực tự do với tạ tay'
    }
  });
  await prisma.trainingLog.create({
    data: {
      memberId: members[5].id,
      subscriptionId: sub6.id,
      checkedInAt: new Date('2026-06-21T13:30:00Z'),
      recordedById: staff2.id,
      notes: 'Tập Pilates máy cùng HLV Trang'
    }
  });

  // 9. CREATE MAINTENANCE REQUESTS
  console.log('🔧 Creating maintenance requests...');
  // Request 1: Máy chạy bộ báo lỗi nút bấm - Đã xử lý xong
  await prisma.maintenanceRequest.create({
    data: {
      equipmentId: eqRunning.id,
      reportedById: staff1.id,
      description: 'Máy số 3 màn hình cảm ứng chập chờn, nút chỉnh tốc độ không nhạy.',
      status: 'resolved',
      reportedAt: new Date('2026-06-10T02:00:00Z'),
      resolvedAt: new Date('2026-06-12T09:30:00Z'),
      resolvedById: owner.id
    }
  });

  // Request 2: Máy ép ngực đứt dây cáp - Chưa xử lý (Pending)
  await prisma.maintenanceRequest.create({
    data: {
      equipmentId: eqChestPress.id,
      reportedById: staff2.id,
      description: 'Dây cáp kéo bên trái bị xước và tưa nhiều, nguy hiểm cho người tập. Cần thay thế.',
      status: 'pending',
      reportedAt: new Date('2026-06-18T10:00:00Z')
    }
  });

  // Request 3: Giường Pilates bảo dưỡng trục lăn - Đang xử lý (In progress)
  await prisma.maintenanceRequest.create({
    data: {
      equipmentId: eqReformer.id,
      reportedById: staff1.id,
      description: 'Trục lăn phát ra tiếng kêu kẽo kẹt khi hoạt động, bánh xe cao su bị mòn.',
      status: 'in_progress',
      reportedAt: new Date('2026-06-20T04:30:00Z')
    }
  });

  // Request 4: Xe đạp tập xích lọc cọc - Đã xử lý (Resolved)
  await prisma.maintenanceRequest.create({
    data: {
      equipmentId: eqBicycle.id,
      reportedById: staff2.id,
      description: 'Xe đạp số 2 kêu lọc cọc lớn ở hộp sên khi đạp nhanh, cần bôi trơn xích và căng dây.',
      status: 'resolved',
      reportedAt: new Date('2026-06-14T03:00:00Z'),
      resolvedAt: new Date('2026-06-16T15:00:00Z'),
      resolvedById: owner.id
    }
  });

  // Request 5: Thảm yoga bị rách - Chưa xử lý (Pending)
  await prisma.maintenanceRequest.create({
    data: {
      equipmentId: eqMats.id,
      reportedById: staff3.id,
      description: 'Có 3 thảm yoga Adidas bị rách mép cao su, dễ gây trượt ngã khi tập. Đề xuất mua bổ sung thảm mới.',
      status: 'pending',
      reportedAt: new Date('2026-06-19T08:30:00Z')
    }
  });

  // 10. CREATE FEEDBACKS
  console.log('💬 Creating feedback and evaluations...');

  // Feedback 1: Đánh giá cơ sở vật chất (Máy chạy bộ) - Đã giải quyết
  await prisma.feedback.create({
    data: {
      memberId: members[0].id,
      targetType: 'facility',
      rating: 4,
      comment: 'Máy chạy bộ Impulse chạy êm, nhưng phòng gym thỉnh thoảng hơi đông nên phải xếp hàng.',
      status: 'resolved',
      response: 'Cảm ơn ý kiến của bạn! Phòng tập đã ghi nhận và đang có kế hoạch bổ sung thêm 2 máy chạy bộ vào tháng tới.',
      resolvedAt: new Date('2026-06-15T09:00:00Z'),
      resolvedById: owner.id,
      createdAt: new Date('2026-06-14T03:00:00Z')
    }
  });

  // Feedback 2: Đánh giá HLV Minh (PT) - Chưa trả lời
  await prisma.feedback.create({
    data: {
      memberId: members[4].id,
      targetType: 'pt',
      targetId: pt1User.id,
      rating: 5,
      comment: 'HLV Minh hỗ trợ rất tận tình, giáo án tập luyện phù hợp giúp mình giảm được 2kg mỡ sau 1 tháng.',
      status: 'pending',
      createdAt: new Date('2026-06-18T07:20:00Z')
    }
  });

  // Feedback 3: Đánh giá nhân viên (Trần Thị Mai) - Đã giải quyết
  await prisma.feedback.create({
    data: {
      memberId: members[1].id,
      targetType: 'staff',
      targetId: staff1.id,
      rating: 5,
      comment: 'Nhân viên Mai tư vấn đăng ký gói tập rất nhiệt tình, thủ tục xuất hóa đơn nhanh gọn.',
      status: 'resolved',
      response: 'Cảm ơn bạn Bình đã dành lời khen cho đội ngũ lễ tân. Chúc bạn có những giờ tập luyện vui vẻ!',
      resolvedAt: new Date('2026-06-12T03:00:00Z'),
      resolvedById: owner.id,
      createdAt: new Date('2026-06-11T12:00:00Z')
    }
  });

  // Feedback 4: Phàn nàn phòng Yoga thảm bẩn - Đang xử lý
  await prisma.feedback.create({
    data: {
      memberId: members[3].id,
      targetType: 'facility',
      rating: 2,
      comment: 'Thảm phòng Yoga thi thoảng vẫn còn mùi mồ hôi từ ca trước, vệ sinh thảm chưa được kỹ.',
      status: 'pending',
      createdAt: new Date('2026-06-20T10:45:00Z')
    }
  });

  // Feedback 5: Đánh giá HLV Trang - Chưa trả lời
  await prisma.feedback.create({
    data: {
      memberId: members[5].id,
      targetType: 'pt',
      targetId: pt2User.id,
      rating: 4,
      comment: 'HLV dạy nhiệt tình, bài tập đa dạng. Tuy nhiên đôi khi lớp hơi bị trễ giờ 5-10 phút.',
      status: 'pending',
      createdAt: new Date('2026-06-21T02:00:00Z')
    }
  });

  // Feedback 6: Góp ý tạ đệm giảm chấn (Bùi Minh Tuấn) - Đã giải quyết
  await prisma.feedback.create({
    data: {
      memberId: members[8].id,
      targetType: 'facility',
      rating: 4,
      comment: 'Dàn tạ tay và đòn tập rất ổn nhưng mong phòng bổ sung thảm cao su dày hơn ở khu deadlift tránh ồn sàn.',
      status: 'resolved',
      response: 'Chào bạn Tuấn, phòng tập đã trang bị thêm thảm giảm lực và giảm tiếng ồn chuyên dụng tại khu tập Deadlift tự do. Chúc bạn tập luyện thoải mái!',
      resolvedAt: new Date('2026-06-18T14:30:00Z'),
      resolvedById: owner.id,
      createdAt: new Date('2026-06-17T09:00:00Z')
    }
  });

  // Feedback 7: Đánh giá HLV Quốc Anh (Phan Thúy Hạnh) - Chưa trả lời
  await prisma.feedback.create({
    data: {
      memberId: members[10].id,
      targetType: 'pt',
      targetId: pt3User.id,
      rating: 5,
      comment: 'HLV Quốc Anh có chuyên môn Powerlifting cực đỉnh, hướng dẫn set up tư thế nâng rất an toàn và chuyên nghiệp.',
      status: 'pending',
      createdAt: new Date('2026-06-21T10:00:00Z')
    }
  });

  // Feedback 8: Góp ý bãi giữ xe giờ cao điểm (Vũ Thành Long) - Chưa trả lời
  await prisma.feedback.create({
    data: {
      memberId: members[12].id,
      targetType: 'facility',
      rating: 3,
      comment: 'Phòng tập rất tốt, sạch sẽ và rộng rãi. Tuy nhiên tầm 18h bãi giữ xe máy hơi chật và dắt xe ra mất thời gian.',
      status: 'pending',
      createdAt: new Date('2026-06-20T19:00:00Z')
    }
  });

  // 11. STAFF & TRAINER WEEKLY SCHEDULES
  console.log('📅 Setting up schedules...');
  // Staff 1 schedules
  await prisma.staffSchedule.createMany({
    data: [1, 2, 3, 4, 5].map((day) => ({
      userId: staff1.id,
      dayOfWeek: day,
      startTime: '08:00',
      endTime: '17:00',
    }))
  });

  // Staff 2 schedules
  await prisma.staffSchedule.createMany({
    data: [1, 2, 3, 4, 6].map((day) => ({
      userId: staff2.id,
      dayOfWeek: day,
      startTime: '13:00',
      endTime: '21:00',
    }))
  });

  // Staff 3 schedules
  await prisma.staffSchedule.createMany({
    data: [2, 3, 4, 5, 7].map((day) => ({
      userId: staff3.id,
      dayOfWeek: day,
      startTime: '08:00',
      endTime: '17:00',
    }))
  });

  // PT 1 schedules
  await prisma.trainerSchedule.createMany({
    data: [1, 3, 5].map((day) => ({
      trainerId: pt1.id,
      dayOfWeek: day,
      startTime: '09:00',
      endTime: '12:00'
    }))
  });

  // PT 2 schedules
  await prisma.trainerSchedule.createMany({
    data: [2, 4, 6].map((day) => ({
      trainerId: pt2.id,
      dayOfWeek: day,
      startTime: '14:00',
      endTime: '18:00'
    }))
  });

  // PT 3 schedules
  await prisma.trainerSchedule.createMany({
    data: [1, 3, 4, 6].map((day) => ({
      trainerId: pt3.id,
      dayOfWeek: day,
      startTime: '08:00',
      endTime: '16:00'
    }))
  });

  // 12. PROMOTIONS
  console.log('🎁 Setting up promotions...');
  await prisma.promotion.createMany({
    data: [
      {
        title: 'Chào hè rực rỡ - Off 15%',
        description: 'Giảm ngay 15% tổng giá trị hóa đơn cho hội viên đăng ký mới hoặc gia hạn các gói tập từ 3 tháng trở lên.',
        discountPercent: 15,
        startDate: '2026-06-01',
        endDate: '2026-08-31',
        isActive: true
      },
      {
        title: 'Tặng 1 buổi tập thử PT 1-kèm-1',
        description: 'Đăng ký bất kỳ gói tập tháng nào cũng được tặng ngay 1 buổi đo chỉ số cơ thể Inbody và tập thử cùng PT chuyên nghiệp.',
        startDate: '2026-06-01',
        endDate: '2026-12-31',
        isActive: true
      },
      {
        title: 'Sinh nhật vàng - Vạn ưu đãi',
        description: 'Giảm 25% giá trị gói tập cho hội viên có sinh nhật trong tháng 6.',
        discountPercent: 25,
        startDate: '2026-06-01',
        endDate: '2026-06-30',
        isActive: true
      }
    ]
  });

  console.log('✅ Seed completed successfully!');
  console.log('📋 Test Accounts and Credentials list:');
  console.log('   - OWNER : owner@gym.com   / owner123  (Họ tên: Nguyễn Khánh Toàn)');
  console.log('   - STAFF : staff@gym.com   / staff123  (Họ tên: Trần Thị Mai)');
  console.log('   - PT    : pt@gym.com      / pt123     (Họ tên: HLV Phạm Văn Minh)');
  console.log('   - MEMBER: member@gym.com  / member123 (Họ tên: Nguyễn Văn A)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
