# QUY TRINH KIEM THU HE THONG

> Thuc hien theo thu tu tu tren xuong. Chua lap bang Unit Test chinh thuc cho den khi hoan thanh unit test va manual test.

## 1. Nguyen tac

- Unit/API test dung Prisma mock, khong doc hoac sua du lieu Neon.
- Manual test dung giao dien, backend va database Neon chung cua nhom.
- Khong chay `npm run db:seed` tren Neon chung neu chua duoc ca nhom dong y.
- Khong commit `backend/.env`, anh co token, connection string hoac mat khau database.
- Neu mot case that bai, ghi lai ket qua thuc te va anh loi truoc khi sua.

## 2. Kiem tra cau hinh

Mo CMD tai thu muc project:

```cmd
cd C:\Users\LENOVO\Documents\Codex\2026-06-11\gym-management
git status --short
git check-ignore -v backend\.env
```

Ket qua mong doi:

- `backend/.env` khong xuat hien nhu file can commit.
- `git check-ignore` tra ve quy tac `**/.env`.

## 3. Cai dependency va cap nhat schema

Mo CMD thu nhat:

```cmd
cd C:\Users\LENOVO\Documents\Codex\2026-06-11\gym-management\backend
npm install
npx prisma generate
npx prisma migrate deploy
```

Ket qua mong doi:

- `npm install` hoan thanh khong co loi.
- Prisma Client duoc generate.
- Migration duoc ap dung hoac bao database da cap nhat.

Luu y: `migrate deploy` thay doi cau truc bang, khong seed va khong xoa du lieu cu.

## 4. Chay unit/API test

Trong CMD backend:

```cmd
npm test
npm run test:coverage
```

Ket qua mong doi:

- 6 test files pass.
- 27 test cases pass.
- Thu muc `backend/coverage` duoc tao va da nam trong `.gitignore`.

Coverage khong bat buoc 100%. Bao cao hien tai ghi dung la kiem thu cac luong nghiep vu trong tam.

## 5. Chay backend

Trong CMD thu nhat:

```cmd
cd C:\Users\LENOVO\Documents\Codex\2026-06-11\gym-management\backend
npm run dev
```

Mo tren trinh duyet:

```text
http://localhost:3001/api/health
```

Ket qua mong doi:

```json
{"status":"ok","message":"Gym Management API is running"}
```

Giu nguyen cua so CMD backend trong luc test.

## 6. Chay frontend

Mo CMD thu hai:

```cmd
cd C:\Users\LENOVO\Documents\Codex\2026-06-11\gym-management\frontend
npm install
npm run dev
```

Mo:

```text
http://localhost:5173
```

Neu trang dang nhap hien thi va khong co loi ket noi trong console thi bat dau manual test.

## 7. Cach ghi ket qua manual test

Voi moi case:

1. Thuc hien dung cac buoc.
2. So sanh man hinh voi Expected.
3. Ghi Actual ngan gon.
4. Danh `Pass` neu Actual trung Expected; nguoc lai danh `Fail`.
5. Voi case quan trong, chup anh man hinh sau khi hoan thanh.

Mau ghi:

| ID | Role | Chuc nang | Expected | Actual | Status |
|---|---|---|---|---|---|
| MT_AUTH_01 | Owner | Dang nhap dung | Chuyen den Dashboard | | |

## 8. Manual test theo role

### A. Chuan bi chung

- Xoa token cu: mo DevTools, Application, Local Storage, xoa token neu dang nhap loi bat thuong.
- Moi lan doi role, bam Dang xuat roi dang nhap tai khoan tiep theo.
- Khong dung cung mot hoi vien de tao nhieu goi active.
- Ghi lai ma hoi vien, ten goi va subscription vua tao de test cac buoc sau.

### B. Owner

Tai khoan: `owner@gym.com` / `owner123`

#### MT_OWNER_01 - Dang nhap

1. Mo `/login`.
2. Nhap tai khoan Owner.
3. Bam Dang nhap.

Expected:

- Chuyen den Dashboard.
- Hien KPI tong quan.
- Owner thay duoc doanh thu.

#### MT_OWNER_02 - Tao hoi vien

1. Mo Hoi vien.
2. Bam them hoi vien.
3. Nhap email moi chua ton tai, ho ten va cac truong bat buoc.
4. Luu.

Expected:

- Tao thanh cong.
- Hoi vien moi xuat hien trong danh sach.
- Khong hien mat khau dang ro.

#### MT_OWNER_03 - Tao hoac kiem tra goi tap

1. Mo Goi tap.
2. Tao goi co ten de nhan biet, gia lon hon 0.
3. Chon goi theo thoi han hoac so buoi.
4. Luu.

Expected:

- Goi xuat hien trong danh sach.
- Loai goi, gia, so ngay/so buoi dung du lieu nhap.

#### MT_OWNER_04 - Dang ky goi cho hoi vien

1. Mo Dang ky/Gia han.
2. Chon hoi vien vua tao.
3. Chon goi tap.
4. Chon phuong thuc thanh toan va luu.

Expected:

- Tao subscription active.
- Hien ngay bat dau, ngay ket thuc hoac so buoi.
- Co the in bien lai.

#### MT_OWNER_05 - Gia han goi

1. Tai subscription vua tao, bam Gia han.
2. Chon phuong thuc thanh toan.
3. Xac nhan.

Expected:

- Goi theo thoi han duoc cong ngay; goi theo buoi duoc cong so buoi.
- Tao mot dong lich su gia han rieng.
- Bao cao co the dem giao dich gia han.

#### MT_OWNER_06 - Lich Staff

1. Mo Lich nhan vien.
2. Chon mot Staff.
3. Sua ca lam viec va luu.

Expected:

- Lich duoc cap nhat.
- Gio bat dau nho hon gio ket thuc.

#### MT_OWNER_07 - Khuyen mai

1. Mo Khuyen mai.
2. Tao chuong trinh dang active, thoi gian gom ngay hien tai.
3. Dat phan tram giam trong khoang 0-100.
4. Luu.

Expected:

- Khuyen mai xuat hien.
- Staff va Member co the xem khi chuong trinh con hieu luc.

#### MT_OWNER_08 - Bao cao

1. Mo Bao cao.
2. Chon khoang ngay chua giao dich vua tao.

Expected:

- Owner xem duoc doanh thu.
- Bao cao co dang ky moi, gia han va so buoi da su dung.

### C. Staff

Tai khoan: `staff@gym.com` / `staff123`

#### MT_STAFF_01 - Dashboard khong lo doanh thu

1. Dang nhap Staff.
2. Mo Dashboard.

Expected:

- Staff truy cap duoc Dashboard.
- Thay KPI van hanh.
- Khong thay KPI hoac gia tri doanh thu.

#### MT_STAFF_02 - Quan ly hoi vien va subscription

1. Mo danh sach hoi vien.
2. Xem chi tiet mot hoi vien.
3. Mo Dang ky/Gia han.
4. Gia han mot subscription hop le neu co.

Expected:

- Staff xem va cap nhat duoc hoi vien.
- Staff tao/gia han subscription duoc.
- Staff khong truy cap chuc nang chi danh cho Owner.

#### MT_STAFF_03 - Xu ly feedback

1. Mo Phan hoi.
2. Chon feedback pending.
3. Nhap noi dung tra loi.
4. Danh dau da xu ly.

Expected:

- Trang thai thanh resolved.
- Hien noi dung, nguoi va thoi gian xu ly.

#### MT_STAFF_04 - Xem lich lam viec

1. Mo Lich nhan vien.

Expected:

- Staff xem duoc lich cua chinh minh.
- Staff khong sua lich cua nguoi khac.

#### MT_STAFF_05 - Bao tri thiet bi

1. Mo Thiet bi/Bao tri.
2. Tao phieu bao hong cho thiet bi chua co phieu dang mo.
3. Thu tao phieu thu hai cho cung thiet bi.

Expected:

- Phieu dau duoc tao.
- Phieu trung pending/in progress bi tu choi.

### D. PT

Tai khoan: `pt@gym.com` / `pt123`

#### MT_PT_01 - Dashboard PT

1. Dang nhap PT.
2. Mo Dashboard.

Expected:

- PT vao duoc Dashboard.
- Khong thay doanh thu.

#### MT_PT_02 - Xem hoc vien

1. Mo danh sach hoc vien/PT Students.

Expected:

- PT chi xem cac thong tin duoc phep.
- Khong co nut quan tri nhan su, khuyen mai hoac doanh thu.

#### MT_PT_03 - Check-in va checkout

1. Chon hoi vien co subscription active con han/con buoi.
2. Check-in.
3. Thu check-in lai khi lan truoc chua checkout.
4. Checkout.
5. Thu checkout lai.

Expected:

- Check-in dau thanh cong.
- Check-in trung bi tu choi.
- Checkout dau thanh cong.
- Checkout lan hai bi tu choi.

### E. Member

Tai khoan: `member@gym.com` / `member123`

#### MT_MEMBER_01 - Xem ho so va goi tap

1. Dang nhap Member.
2. Mo Ho so va Goi cua toi.

Expected:

- Hien dung thong tin cua chinh Member.
- Khong xem duoc danh sach tat ca hoi vien.
- Hien goi active, ngay het han/so buoi con lai neu co.

#### MT_MEMBER_02 - Xem lich su tap

1. Mo Lich su tap.

Expected:

- Chi hien cac lan tap cua chinh Member.
- Hien thoi gian check-in/checkout va goi tap lien quan.

#### MT_MEMBER_03 - Gui feedback

1. Mo Gui phan hoi.
2. Chon doi tuong.
3. Thu gui rating ngoai khoang 1-5 neu giao dien cho phep.
4. Gui rating hop le va noi dung.

Expected:

- Rating khong hop le bi chan.
- Feedback hop le duoc tao voi trang thai pending.

#### MT_MEMBER_04 - Xem ket qua feedback

1. Sau khi Staff xu ly MT_STAFF_03, dang nhap lai Member.
2. Mo lich su feedback.

Expected:

- Member thay trang thai resolved va noi dung tra loi.

#### MT_MEMBER_05 - Xem khuyen mai

1. Mo Khuyen mai.

Expected:

- Chi hien chuong trinh active va con trong thoi gian ap dung.
- Member khong co nut tao, sua hoac tat khuyen mai.

## 9. Kiem tra du lieu bang Prisma Studio

Chi dung de quan sat, khong sua/xoa nham du lieu chung:

```cmd
cd C:\Users\LENOVO\Documents\Codex\2026-06-11\gym-management\backend
npm run db:studio
```

Co the doi chieu cac bang:

- `User`, `Member`, `Subscription`
- `SubscriptionRenewal`
- `TrainingLog`
- `Feedback`
- `MaintenanceRequest`
- `StaffSchedule`
- `Promotion`

## 10. Thu tu bang chung can chup

1. Terminal hien 27/27 unit test pass.
2. Man hinh coverage.
3. Owner Dashboard co doanh thu.
4. Staff Dashboard khong co doanh thu.
5. Gia han thanh cong va lich su giao dich.
6. Feedback pending va resolved.
7. Check-in/checkout va mot thong bao chan thao tac trung.
8. Lich Staff va khuyen mai.
9. Bao cao dang ky/gia han.

Sau khi toan bo case da co Actual va Status, moi chuyen 27 unit test thanh bang tai lieu UT chinh thuc.

## 11. Ket qua smoke test 21/06/2026

- Backend health `GET /api/health`: Pass.
- Frontend `http://localhost:5173`: Pass.
- Ket noi Prisma voi Neon va migration deploy: Pass.
- Dang nhap bang Owner, Staff, PT, Member: Pass.
- Kiem tra nhanh chuc nang va menu theo ca 4 role: Pass.
- Unit/API test: 27/27 Pass.
- Frontend lint va production build: Pass.

Ket luan: he thong du dieu kien push code. Bang UT chi tiet tung test case va anh bang chung se duoc lap o buoc tai lieu sau; ket qua smoke test nay khong thay the bang UT chinh thuc.
