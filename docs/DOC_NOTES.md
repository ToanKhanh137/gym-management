# 📝 DOC NOTES — Ghi chú tài liệu (viết trong lúc code)

> **Mục đích:** Ghi nhanh những thứ cần nhét vào tài liệu chính thức sau này.  
> Không cần đẹp, không cần đúng format — cứ ghi thoải mái, AI/người sẽ format lại sau.  
> **Cập nhật:** Mỗi khi làm xong một chức năng thì ghi vào đây.

---

## 🗂️ ACTORS (Đối tượng sử dụng)
> Dùng cho: Use Case Diagram, SRS

- **Chủ phòng tập** (Owner/Admin): quản lý tổng thể hệ thống — quản lý gói tập, nhân sự (staff/pt), phòng tập, thiết bị, xem báo cáo doanh thu, xem phản hồi hội viên
- **Nhân viên quản lý** (Staff): vận hành hàng ngày — đăng ký/gia hạn gói cho hội viên, check-in/checkout, xem phòng, thiết bị, xem phản hồi hội viên
- **Huấn luyện viên cá nhân** (PT): hỗ trợ tập luyện — xem danh sách hội viên, thực hiện check-in/checkout buổi tập
- **Hội viên** (Member): tự tra thông tin — xem gói tập đang có, xem lịch sử tập luyện, gửi phản hồi/đánh giá dịch vụ

---

## 📋 USE CASES (Điền dần khi code xong từng phần)
> Dùng cho: Use Case Diagram + Đặc tả Use Case (RA)

### UC-01: Đăng ký hội viên mới
- Actor chính: Nhân viên quản lý / Chủ phòng tập
- Luồng chính:
  1. Actor nhập thông tin hội viên (tên, email, mật khẩu, SĐT, ngày sinh, nghề nghiệp)
  2. POST `/api/members` → backend tạo User + Member, sinh `memberCode` tự động (`MEM` + 3 số)
  3. Trả về memberCode, redirect sang trang chi tiết hội viên
- Exception: Email đã tồn tại → lỗi 409; Mật khẩu < 6 ký tự → báo lỗi trước khi gửi
- UI: Modal form trong trang `/members`, validation phía client trước khi gửi
- Ghi chú: Hội viên **không** tự đăng ký — tài khoản được tạo bởi Staff/Owner

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
- Actor phụ (chỉ xem): Nhân viên, PT, Hội viên
- Luồng chính:
  1. Xem danh sách gói tập (card grid) — tất cả role đều xem được
  2. Tạo gói mới (tên, loại, giá, số ngày, mô tả) — POST `/api/packages` — chỉ Owner
  3. Chỉnh sửa thông tin gói — PATCH `/api/packages/:id` — chỉ Owner
  4. Tắt gói (soft-delete `isActive=false`) — DELETE `/api/packages/:id` — chỉ Owner
- Exception: Không thể xóa gói đang có hội viên sử dụng (có subscription active)
- API: GET/POST/PATCH/DELETE `/api/packages`
- UI: Trang `/packages` — card grid, chỉ Owner thấy nút Tạo/Sửa/Tắt

### UC-04: Đăng ký / Gia hạn gói tập cho hội viên
- Actor chính: Nhân viên / Chủ phòng tập
- Luồng chính:
  1. Vào trang chi tiết hội viên `/members/:id`
  2. Chọn gói tập, ngày bắt đầu, phương thức thanh toán
  3. POST `/api/subscriptions` → tạo subscription, tính `endDate` tự động
- Exception: Hội viên đã có gói active → cần hủy trước
- Ghi chú: UC-04 là entry point từ trang hội viên cụ thể; UC-11 là entry point từ trang quản lý tổng hợp — cùng gọi `POST /api/subscriptions`

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
- Luồng chính:
  1. Xem danh sách thiết bị theo phòng — GET `/api/equipment`
  2. Thêm thiết bị mới (mã, tên, phòng, số lượng, ngày nhập, bảo hành, xuất xứ) — POST `/api/equipment`
  3. Cập nhật trạng thái thiết bị (`good` / `damaged` / `maintenance` / `retired`) — PATCH `/api/equipment/:id`
  4. Báo hỏng → tạo MaintenanceRequest (`status=pending`) — POST `/api/maintenance`
  5. Kỹ thuật viên xử lý xong → xác nhận `resolved` — PATCH `/api/maintenance/:id`
- Exception: Thiết bị đang có MaintenanceRequest `pending/in_progress` → không thể báo hỏng thêm lần nữa
- UI: Trang `/equipment` — bảng thiết bị + badge trạng thái + alert đỏ nếu có yêu cầu bảo trì đang chờ

### UC-07: Quản lý nhân sự / PT
- Actor chính: Chủ phòng tập
- Luồng chính:
  1. Xem danh sách staff/pt/owner — GET `/api/users`
  2. Tạo tài khoản mới (gán role staff/pt/owner) — POST `/api/users`
  3. Chỉnh sửa tên, SĐT — PATCH `/api/users/:id`
  4. Vô hiệu hóa / kích hoạt (`isActive` toggle) — PATCH `/api/users/:id`
- Phân quyền: Chỉ `owner` mới truy cập được
- UI: Trang `/users` — bảng có filter theo role, badge màu theo vai trò, toggle active 

### UC-08: Xem báo cáo thống kê doanh thu
- Actor chính: Chủ phòng tập
- Luồng chính: Chọn khoảng ngày, GET `/api/reports/revenue` → hiển thị tổng, phân bổ theo gói
- UI: Trang `/reports` — KPI cards + bar chart + filter ngày 

### UC-09: Gửi phản hồi / đánh giá dịch vụ
- Actor chính: Hội viên
- Luồng chính:
  1. Hội viên chọn loại đánh giá (staff/pt/facility), chọn sao (1-5), nhập comment
  2. POST `/api/feedbacks` → lưu DB
  3. Xem lịch sử phản hồi đã gửi — GET `/api/feedbacks/mine`
- Exception: Chưa chọn số sao → báo lỗi
- UI: Trang `/feedback` — interactive star picker với hover effect 

### UC-10: Xem & Quản lý Phòng tập
- Actor chính: Chủ phòng tập / Nhân viên
- Luồng chính:
  1. Xem danh sách phòng với số thiết bị — GET `/api/rooms`
  2. Thêm phòng mới (mã, tên, loại, sức chứa) — POST `/api/rooms`
  3. Chỉnh sửa / đổi trạng thái phòng — PATCH `/api/rooms/:id`
- UI: Trang `/rooms` — card grid + status badge + modal 

### UC-11: Quản lý tất cả Đăng ký gói tập (Subscriptions)
- Actor chính: Chủ phòng tập / Nhân viên
- Luồng chính:
  1. Xem tất cả gói đăng ký, filter theo status/tên — GET `/api/subscriptions`
  2. Tạo mới: chọn hội viên + gói + ngày + PTTT — POST `/api/subscriptions`
  3. Hủy gói — PATCH `/api/subscriptions/:id/cancel`
- UI: Trang `/subscriptions` — bảng + search + modal 

### UC-12: Hội viên xem Gói tập & Lịch sử tập của mình
- Actor chính: Hội viên
- Luồng chính:
  - Gói tập: GET `/api/subscriptions` (auto-filter theo memberId) → hero card + cảnh báo sắp hết hạn
  - Lịch sử tập: GET `/api/training-logs` (auto-filter theo memberId) → bảng check-in/out + KPI
- UI: `/my-subscription` + `/my-training` 

### UC-13: Xem tổng hợp Phản hồi (Owner/Staff)
- Actor chính: Chủ phòng tập / Nhân viên
- Luồng chính: GET `/api/feedbacks` → bảng + KPI cards đánh giá TB theo loại
- UI: Trang `/feedbacks` — KPI row + star display 

### UC-14: Đăng xuất hệ thống
- Actor: Tất cả (Owner, Staff, PT, Member)
- Luồng chính:
  1. Actor nhấn nút Đăng xuất trên sidebar / bottom nav
  2. Xóa JWT token khỏi `localStorage`
  3. Xóa thông tin user khỏi AuthContext
  4. Redirect về trang `/login`
- Ghi chú: Không cần gọi API — xử lý hoàn toàn phía client

### UC-15: Xem Dashboard tổng quan
- Actor chính: Chủ phòng tập / Nhân viên / PT
- Luồng chính:
  1. Sau đăng nhập, redirect tự động đến `/dashboard`
  2. GET `/api/members`, `/api/subscriptions`, `/api/training-logs`, `/api/reports/revenue` → hiển thị KPI
  3. Hiển thị: tổng hội viên, gói active, check-in hôm nay, doanh thu tháng
  4. Nút quick action: Thêm hội viên, Check-in, Xem báo cáo
- Phân quyền: Member không vào được `/dashboard` — redirect sang `/profile`
- UI: Trang `/dashboard` — KPI cards + quick actions + biểu đồ doanh thu

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
| Đăng ký / Gia hạn | `/subscriptions` | Owner, Staff | ✅ Xong |
| Phòng tập | `/rooms` | Owner, Staff | ✅ Xong |
| Nhân sự | `/users` | Owner | ✅ Xong |
| Phản hồi (quản lý) | `/feedbacks` | Owner, Staff | ✅ Xong |
| Gói tập (Member) | `/my-subscription` | Member | ✅ Xong |
| Lịch sử tập (Member) | `/my-training` | Member | ✅ Xong |
| Gửi Phản hồi (Member) | `/feedback` | Member | ✅ Xong |

---

*File này cập nhật liên tục trong quá trình code. Format lại thành tài liệu chính thức sau.*
