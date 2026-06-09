# 📝 DOC NOTES — Ghi chú tài liệu (viết trong lúc code)

> **Mục đích:** Ghi nhanh những thứ cần nhét vào tài liệu chính thức sau này.  
> Không cần đẹp, không cần đúng format — cứ ghi thoải mái, AI/người sẽ format lại sau.  
> **Cập nhật:** Mỗi khi làm xong một chức năng thì ghi vào đây.

---

## 🗂️ ACTORS (Đối tượng sử dụng)
> Dùng cho: Use Case Diagram, SRS

- **Chủ phòng tập** (Owner/Admin): quản lý tổng thể, xem báo cáo doanh thu
- **Nhân viên quản lý** (Staff): quản lý hội viên hàng ngày, đăng ký/gia hạn gói
- **Huấn luyện viên cá nhân** (PT): quản lý học viên, ghi nhận buổi tập
- **Hội viên** (Member): tự tra gói tập, lịch sử, gia hạn online

---

## 📋 USE CASES (Điền dần khi code xong từng phần)
> Dùng cho: Use Case Diagram + Đặc tả Use Case (RA)

### UC-01: Đăng ký hội viên mới
- Actor chính: Nhân viên quản lý
- Actor phụ: Hội viên
- Luồng chính:
  1. NV nhập thông tin (tên, email, mật khẩu, SĐT, ngày sinh, nghề nghiệp)
  2. POST `/api/members` → backend tạo User + Member, sinh `memberCode` tự động (`MEM` + 3 số)
  3. Trả về memberCode, redirect sang trang chi tiết hội viên
- Exception: Email đã tồn tại → lỗi 409; Mật khẩu < 6 ký tự → báo lỗi trước khi gửi
- UI: Modal form trong trang `/members`, validation phía client trước khi gửi

### UC-02: Đăng nhập hệ thống
- Actor: Tất cả
- Luồng chính:
  1. Nhập email + mật khẩu, POST `/api/auth/login`
  2. Backend trả JWT token + thông tin user (name, role, id)
  3. Lưu token vào `localStorage`, redirect theo role (`owner/staff/pt` → `/dashboard`, `member` → `/profile`)
- Exception: Sai email/mật khẩu → 401; Token hết hạn 24h → tự động logout, redirect `/login`
- UI: Trang `/login` với background ảnh phòng gym, 4 nút quick login demo

### UC-03: Quản lý gói tập (CRUD)
- Actor chính: Chủ phòng tập
- Luồng chính: Xem danh sách gói (card grid), tạo/sửa qua modal, tắt gói (soft-delete `isActive=false`)
- API: GET/POST/PATCH/DELETE `/api/packages`
- UI: Trang `/packages` hiển thị card grid, chỉ chủ phòng tập thấy nút sửa/tắt

### UC-04: Đăng ký / Gia hạn gói tập cho hội viên
- Actor chính: Nhân viên
- Luồng chính:
  1. Vào trang chi tiết hội viên `/members/:id`
  2. Chọn gói tập, ngày bắt đầu, phương thức thanh toán
  3. POST `/api/subscriptions` → tạo subscription, tính `endDate` tự động
- Exception: Hội viên đã có gói active → cần hủy trước

### UC-05: Ghi nhận lịch sử tập luyện (Check-in)
- Actor chính: Nhân viên / PT
- Luồng chính:
  1. Tìm hội viên bằng tên/email/SĐT (live search)
  2. Chọn gói tập đang active
  3. POST `/api/training-logs` → ghi `checkedInAt`
  4. Khi ra về: PATCH `/api/training-logs/:id/checkout` → ghi `checkedOutAt`
- UI: Trang `/checkin` — dropdown tìm kiếm real-time, bảng log hôm nay refresh 10 giây/lần

### UC-06: Quản lý thiết bị phòng tập
- Actor chính: Nhân viên / Chủ phòng tập
- Luồng chính: Thêm thiết bị mới, báo hỏng → tạo MaintenanceRequest, xác nhận đã sửa → status → `resolved`
- UI: Trang `/equipment` — hiển thị alert nếu có yêu cầu bảo trì đang chờ

### UC-07: Quản lý nhân sự / PT
- Actor chính: Chủ phòng tập
- Luồng chính: Tạo tài khoản staff/pt, gán role, xết duyệt
- API: GET/POST/PATCH `/api/users` (chỉ owner)
- UI: Trang `/users` — chưa làm

### UC-08: Xem báo cáo thống kê doanh thu
- Actor chính: Chủ phòng tập
- Luồng chính: Chọn khoảng ngày, GET `/api/reports/revenue` → hiển thị tổng, phân bổ theo gói
- UI: Trang `/reports` — KPI cards + bar chart + filter ngày

### UC-09: Gửi phản hồi / đánh giá dịch vụ
- Actor chính: Hội viên
- API: POST `/api/feedbacks`
- UI: Trang `/feedback` — chưa làm

### UC-10: Quản lý tài khoản người dùng
- Actor chính: Chủ phòng tập / Admin
- API: PATCH `/api/auth/change-password`
- UI: Trang `/users` — chưa làm

---

## 🗄️ DATABASE SCHEMA (Điền dần khi tạo bảng/model)
> Dùng cho: ER Diagram, Database Design (DD)

### Table: users
```
- id (PK)
- name
- email
- password_hash
- role: ENUM(owner, staff, pt, member)
- phone
- dob
- created_at
```

### Table: members
```
- id (PK)
- user_id (FK → users)
- member_code (unique)
- occupation
- birthday
- fingerprint_data (optional)
- created_at
```

### Table: membership_packages
```
- id (PK)
- name (e.g. "Gói 3 tháng", "Gói VIP")
- type: ENUM(per_session, monthly, quarterly, yearly, vip, pt)
- duration_days
- price
- description
- is_active
```

### Table: member_subscriptions
```
- id (PK)
- member_id (FK → members)
- package_id (FK → membership_packages)
- start_date
- end_date
- sessions_total (nullable, for per_session)
- sessions_used
- status: ENUM(active, expired, cancelled)
- payment_method: ENUM(cash, bank_transfer, e_wallet)
- paid_at
- created_by (FK → users)
```

### Table: rooms
```
- id (PK)
- room_code
- name
- type: ENUM(gym, yoga, fitness, other)
- capacity
- status: ENUM(active, inactive, maintenance)
```

### Table: equipment
```
- id (PK)
- room_id (FK → rooms)
- equipment_code
- name
- quantity
- imported_at
- warranty_until
- origin
- status: ENUM(good, damaged, maintenance, retired)
```

### Table: training_logs
```
- id (PK)
- member_id (FK → members)
- subscription_id (FK → member_subscriptions)
- checked_in_at
- checked_out_at
- recorded_by (FK → users)
- notes
```

### Table: feedbacks
```
- id (PK)
- member_id (FK → members)
- target_type: ENUM(staff, facility, pt)
- target_id (FK → users or rooms)
- rating (1–5)
- comment
- created_at
```

### Table: maintenance_requests
```
- id (PK)
- equipment_id (FK → equipment)
- reported_by (FK → users)
- description
- status: ENUM(pending, in_progress, resolved)
- reported_at
- resolved_at
```

---

## 🏗️ KIẾN TRÚC HỆ THỐNG
> Dùng cho: Architectural Design (AD)

- **Pattern:** Layered Architecture (Routes → Middleware → Prisma ORM → DB)
- **Frontend:** React 19 + Vite 8 + React Router DOM 7 + TanStack Query 5 + Lucide React
- **Backend:** Node.js 24 + Express 4 (ES Modules)
- **DB:** PostgreSQL (Neon cloud, Singapore region) qua Prisma ORM 5
- **Auth:** JWT (jsonwebtoken) + bcryptjs, expire 24h, Bearer token trong `Authorization` header
- **Phân quyền:** Role-based — 4 roles: `owner`, `staff`, `pt`, `member`
- **Cấu trúc:** Monorepo — `/backend` (port 3001) + `/frontend` (port 5173)
- **Responsive:** Desktop (sidebar cố định) / Mobile (bottom nav + hamburger ≤ 768px)
- **State management:** TanStack Query — cache, refetch tự động, no Redux needed

---

## 🎨 DESIGN PATTERNS ĐÃ DÙNG
> Dùng cho: Good Design (GD)

| Pattern | Nơi áp dụng | Lý do |
|---|---|---|
| **Singleton** | `src/prisma/client.js` — export 1 PrismaClient instance | Tránh tạo nhiều DB connection |
| **Middleware Chain** | `auth.middleware.js` → authenticate → authorize | Tách biệt xác thực và phân quyền |
| **Repository (qua Prisma)** | Tất cả routes dùng `prisma.model.findMany/create/update` | Abstraction layer cho DB |
| **Context / Provider** | `AuthContext.jsx` bao toàn bộ app | Global auth state, tránh prop drilling |
| **Protected Route** | `ProtectedRoute.jsx` bao từng page | Guard route theo auth + role |
| **Responsive Layout** | CSS breakpoint 768px — sidebar ↔ bottom nav | Desktop và mobile dùng cùng codebase |

---

## 🔒 PHI CHỨC NĂNG (Non-functional Requirements)
> Dùng cho: SRS

- **Bảo mật:** Mật khẩu hash bcrypt (salt=10), JWT expire 24h, phân quyền RBAC theo 4 role
- **Hiệu năng:** Neon PostgreSQL cloud (Singapore region), Prisma connection pooling
- **Khả dụng:** Backend chạy local, DB cloud Neon (uptime ~99.9%)
- **Khả năng mở rộng:** Cấu trúc route tách module, dễ thêm feature mới
- **Tính nhất quán dữ liệu:** Dùng `prisma.$transaction()` cho các thao tác multi-step (check-in, bảo trì)

---

## 📐 GIAO DIỆN — Màn hình đã làm
> Dùng cho: GUI Design (DD)

| Màn hình | Route | Actor | Trạng thái |
|---|---|---|---|
| Login | `/login` | Tất cả | ✅ Xong |
| Dashboard | `/dashboard` | Owner, Staff, PT | ✅ Xong |
| Danh sách Hội viên | `/members` | Owner, Staff, PT | ✅ Xong |
| Chi tiết Hội viên | `/members/:id` | Owner, Staff, PT | ✅ Xong |
| Quản lý Gói tập | `/packages` | Tất cả (sửa: chỉ Owner) | ✅ Xong |
| Check-in | `/checkin` | Owner, Staff, PT | ✅ Xong |
| Thiết bị | `/equipment` | Owner, Staff | ✅ Xong |
| Báo cáo doanh thu | `/reports` | Owner | ✅ Xong |
| Hồ sơ Hội viên | `/profile` | Member | ✅ Xong |
| Đăng ký / Gia hạn | `/subscriptions` | Owner, Staff | ⬜ Chưa làm |
| Phòng tập | `/rooms` | Owner, Staff | ⬜ Chưa làm |
| Nhân sự | `/users` | Owner | ⬜ Chưa làm |
| Phản hồi | `/feedbacks` | Owner, Staff | ⬜ Chưa làm |
| Gói tập (Member) | `/my-subscription` | Member | ⬜ Chưa làm |
| Lịch sử tập (Member) | `/my-training` | Member | ⬜ Chưa làm |

---

*File này cập nhật liên tục trong quá trình code. Format lại thành tài liệu chính thức sau.*
