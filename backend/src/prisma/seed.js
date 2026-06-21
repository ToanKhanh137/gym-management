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
  
  // Keep users except the base ones or clear all users and recreate
  await prisma.user.deleteMany({});

  // 2. CREATE SYSTEM ACCOUNTS
  console.log('👥 Creating staff and owner accounts...');
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
    { name: 'Đặng Trung Kiên', email: 'kien.dang@student.edu.vn', phone: '0901112228', dob: '2003-01-22', occ: 'Sinh viên' }
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
        memberCode: `MEM00${i + 1}`,
        occupation: md.occ
      }
    });
    members.push(m);
  }

  // 7. CREATE SUBSCRIPTIONS AND RENEWALS
  console.log('💳 Creating subscriptions and payments...');
  
  // Member 1 (Nguyễn Văn A) - Gói 3 tháng (Active) - Đăng ký từ 2026-06-01
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

  // Member 2 (Trần Thị Bình) - Gói 10 buổi lẻ (Active) - Đăng ký 2026-06-10
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

  // Member 3 (Phạm Hồng Cường) - Gói 1 năm (Active) - Đăng ký từ 2026-04-15
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

  // Member 4 (Lê Hoàng Dung) - Gói 1 tháng (Đã hết hạn và gia hạn)
  // Sub cũ (Đã hết hạn)
  const sub4Old = await prisma.subscription.create({
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
  // Sub mới gia hạn từ 2026-06-01
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
  // Ghi nhận vào lịch sử gia hạn
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

  // Member 5 (Nguyễn Tiến Đạt) - Gói VIP kèm PT (HLV Phạm Văn Minh)
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

  // Member 6 (Vũ Thị Hương) - Gói PT riêng (20 buổi với HLV Hoàng Thu Trang)
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

  // Member 7 (Hoàng Văn Hải) - Gói 3 tháng (Mới đăng ký hôm nay)
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

  // 8. CREATE TRAINING LOGS (CHECK-INS)
  console.log('🚶 Creating check-in history (Training Logs)...');
  // Checkins for Nguyễn Văn A (sub1)
  const checkins = [
    { sub: sub1, member: members[0], date: '2026-06-02', in: '08:15:00', out: '09:45:00', note: 'Chạy bộ và đẩy ngực nhẹ' },
    { sub: sub1, member: members[0], date: '2026-06-05', in: '08:00:00', out: '09:30:00', note: 'Tập chân đùi' },
    { sub: sub1, member: members[0], date: '2026-06-08', in: '08:20:00', out: '10:00:00', note: 'Tập lưng xô' },
    { sub: sub1, member: members[0], date: '2026-06-12', in: '08:10:00', out: '09:40:00', note: 'Tập vai tay sau' },
    { sub: sub1, member: members[0], date: '2026-06-19', in: '08:05:00', out: '09:35:00', note: 'Tập bụng & Cardio nhẹ' },
    
    // Checkins for Trần Thị Bình (sub2) - trừ buổi tập (sessionsUsed: 4)
    { sub: sub2, member: members[1], date: '2026-06-11', in: '18:00:00', out: '19:00:00', note: 'Chạy bộ nhẹ nhàng' },
    { sub: sub2, member: members[1], date: '2026-06-13', in: '17:45:00', out: '19:15:00', note: 'Lớp Group Fitness' },
    { sub: sub2, member: members[1], date: '2026-06-16', in: '18:10:00', out: '19:10:00', note: 'Đạp xe' },
    { sub: sub2, member: members[1], date: '2026-06-20', in: '18:00:00', out: '19:15:00', note: 'Tập cơ bụng' },

    // Checkins for Nguyễn Tiến Đạt cùng PT Minh (sub5)
    { sub: sub5, member: members[4], date: '2026-05-12', in: '14:00:00', out: '15:30:00', note: 'PT hướng dẫn căn bản và đo chỉ số Inbody' },
    { sub: sub5, member: members[4], date: '2026-05-15', in: '14:00:00', out: '15:15:00', note: 'Tập bài Squat và đùi trước' },
    { sub: sub5, member: members[4], date: '2026-05-19', in: '14:10:00', out: '15:40:00', note: 'Tập lưng xô, kéo cáp' },
    { sub: sub5, member: members[4], date: '2026-05-26', in: '14:00:00', out: '15:20:00', note: 'Đẩy ngực ngang' },
    { sub: sub5, member: members[4], date: '2026-06-02', in: '14:00:00', out: '15:30:00', note: 'Tập Cardio cường độ cao HIIT' },
    { sub: sub5, member: members[4], date: '2026-06-16', in: '14:05:00', out: '15:30:00', note: 'Tập vai tay sau gánh tạ' },

    // Checkins hôm nay (2026-06-21) - Chưa check-out (đang tập)
    { sub: sub3, member: members[2], date: '2026-06-21', in: '13:00:00', out: null, note: 'Tập lưng bụng tự do' },
    { sub: sub6, member: members[5], date: '2026-06-21', in: '13:30:00', out: null, note: 'Tập Pilates máy cùng HLV Trang' }
  ];

  for (const c of checkins) {
    await prisma.trainingLog.create({
      data: {
        memberId: c.member.id,
        subscriptionId: c.sub.id,
        checkedInAt: new Date(`${c.date}T${c.in}Z`),
        checkedOutAt: c.out ? new Date(`${c.date}T${c.out}Z`) : null,
        recordedById: staff1.id,
        notes: c.note
      }
    });
  }

  // 9. CREATE MAINTENANCE REQUESTS
  console.log('🔧 Creating maintenance requests...');
  // Request 1: Máy chạy bộ báo lỗi nút bấm - Đã xử lý xong
  const m1 = await prisma.maintenanceRequest.create({
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
