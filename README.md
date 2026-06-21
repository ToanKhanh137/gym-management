# Gym Management System

> **Hệ thống Quản lý Phòng tập Gym**  
> Môn học: Phát triển phần mềm theo chuẩn kỹ năng ITSS — HK 20252  
> Chủ đề 02

---

## Mục lục
- [Tech Stack](#tech-stack)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt và chạy](#cài-đặt-và-chạy)
- [Kiểm thử Backend](#kiểm-thử-backend)
- [Tài khoản test](#tài-khoản-test)
- [API Endpoints](#api-endpoints)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)

---

## Tech Stack

| Tầng | Công nghệ | Phiên bản |
|---|---|---|
| Runtime | Node.js | v24.15.0 |
| Backend | Express | ^4.21.2 |
| ORM | Prisma | ^5.22.0 |
| **Database** | **Neon PostgreSQL (cloud)** | — |
| Auth | JWT (jsonwebtoken) + bcryptjs | ^9.0.2 / ^2.4.3 |
| Frontend | React | ^19.2.6 |
| Build tool | Vite | ^8.0.12 |
| HTTP client | Axios | ^1.17.0 |
| Routing | React Router DOM | ^7.17.0 |
| Data fetching | TanStack Query | ^5.101.0 |
| Icons | Lucide React | latest |
| Package manager | npm | 11.x |

---

## Yêu cầu hệ thống

- **Node.js** >= 18.x ([tải tại nodejs.org](https://nodejs.org))
- **npm** >= 9.x (đi kèm Node.js)
- **Git** ([tải tại git-scm.com](https://git-scm.com))
- Không cần cài database — dùng **Neon PostgreSQL trên cloud** (shared toàn nhóm)

---

## Cài đặt và chạy

### 1. Clone repo về máy

```bash
git clone https://github.com/ToanKhanh137/gym-management.git
cd gym-management
```

### 2. Setup Backend

```bash
cd backend

# Tạo file cấu hình môi trường
cp .env.example .env
# → Mở .env, điền DATABASE_URL và JWT_SECRET (lấy từ nhóm trưởng)

# Cài dependencies
npm install

# Áp dụng schema lên Neon (lần đầu — data đã có sẵn trên cloud)
npx prisma migrate deploy

# Chạy development server
npm run dev
```

> Backend chạy tại: **http://localhost:3001**

### 3. Setup Frontend

```bash
# Mở terminal mới, từ thư mục gốc gym-management/
cd frontend

# Cài dependencies
npm install

# Chạy development server
npm run dev
```

> Frontend chạy tại: **http://localhost:5173** (responsive — hoạt động trên cả desktop và mobile)

### 4. Chạy cả hai cùng lúc

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

---

## Các lệnh hữu ích

```bash
# --- Backend ---
npm run dev              # Chạy backend (nodemon, tự reload khi sửa code)
npm run db:migrate       # Áp dụng migration mới lên Neon
npm run db:seed          # Seed lại dữ liệu mẫu (sẽ ghi đè data hiện tại!)
npm run db:studio        # Mở Prisma Studio — GUI xem DB trên browser
npm test                 # Chạy unit/API test một lần
npm run test:watch       # Chạy test ở chế độ theo dõi
npm run test:coverage    # Chạy test và xuất báo cáo coverage

# --- Frontend ---
npm run dev              # Chạy frontend dev server
npm run build            # Build production
npm run preview          # Preview bản build
npm run lint             # Kiểm tra lỗi ESLint
```

---

## Kiểm thử Backend

### Testing Tools

- **Vitest:** test runner và mock Prisma.
- **Supertest:** gửi HTTP request trực tiếp vào Express app, không cần mở server hoặc kết nối Neon.
- **V8 Coverage:** đo statement, branch, function và line coverage.

```bash
cd backend
npm test
npm run test:coverage
```

Bộ test tập trung vào đăng nhập/phân quyền, Dashboard theo vai trò, gia hạn gói tập, check-in/checkout, xử lý phản hồi, bảo trì thiết bị, lịch Staff và khuyến mãi. Prisma được mock nên test không đọc hoặc sửa dữ liệu Neon.

---

## Tài khoản test

| Email | Mật khẩu | Vai trò | Quyền hạn |
|---|---|---|---|
| `owner@gym.com` | `owner123` | Chủ phòng tập | Toàn quyền, xem báo cáo doanh thu |
| `staff@gym.com` | `staff123` | Nhân viên | Quản lý hội viên, gói tập, thiết bị |
| `pt@gym.com` | `pt123` | Huấn luyện viên | Ghi nhận lịch tập, xem học viên |
| `member@gym.com` | `member123` | Hội viên | Xem gói tập, lịch sử, gửi phản hồi |

---

## API Endpoints

Base URL: `http://localhost:3001/api`

| Method | Endpoint | Mô tả | Role yêu cầu |
|---|---|---|---|
| GET | `/health` | Kiểm tra server | — |
| POST | `/auth/login` | Đăng nhập | — |
| GET | `/auth/me` | Thông tin user hiện tại | Tất cả |
| POST | `/auth/change-password` | Đổi mật khẩu | Tất cả |
| GET | `/users` | Danh sách nhân viên | owner |
| POST | `/users` | Tạo tài khoản staff/pt | owner |
| PATCH | `/users/:id` | Cập nhật thông tin | owner |
| GET | `/members` | Danh sách hội viên | owner, staff, pt |
| GET | `/members/:id` | Chi tiết hội viên | owner, staff, pt |
| POST | `/members` | Tạo hội viên mới | owner, staff |
| PATCH | `/members/:id` | Cập nhật hội viên | owner, staff |
| GET | `/members/my/profile` | Hội viên xem profile | member |
| GET | `/packages` | Danh sách gói tập | Tất cả |
| POST | `/packages` | Tạo gói tập | owner |
| PATCH | `/packages/:id` | Cập nhật gói tập | owner |
| DELETE | `/packages/:id` | Xóa gói tập (soft) | owner |
| GET | `/subscriptions` | Danh sách đăng ký | owner, staff, pt |
| POST | `/subscriptions` | Đăng ký gói tập | owner, staff |
| POST | `/subscriptions/:id/renew` | Gia hạn và ghi giao dịch thanh toán | owner, staff |
| PATCH | `/subscriptions/:id/cancel` | Hủy gói tập | owner, staff |
| GET | `/rooms` | Danh sách phòng | Tất cả |
| POST | `/rooms` | Tạo phòng | owner, staff |
| PATCH | `/rooms/:id` | Cập nhật phòng | owner, staff |
| GET | `/equipment` | Danh sách thiết bị | owner, staff |
| POST | `/equipment` | Thêm thiết bị | owner, staff |
| PATCH | `/equipment/:id` | Cập nhật thiết bị | owner, staff |
| GET | `/training-logs` | Lịch sử tập luyện | Tất cả |
| POST | `/training-logs` | Check-in tập | owner, staff, pt |
| PATCH | `/training-logs/:id/checkout` | Check-out | owner, staff, pt |
| GET | `/feedbacks` | Danh sách phản hồi | owner, staff |
| POST | `/feedbacks` | Gửi phản hồi | member |
| PATCH | `/feedbacks/:id/resolve` | Xử lý và trả lời phản hồi | owner, staff |
| GET | `/maintenance` | Yêu cầu bảo trì | owner, staff |
| POST | `/maintenance` | Báo cáo hỏng thiết bị | owner, staff |
| PATCH | `/maintenance/:id/resolve` | Đánh dấu đã sửa | owner, staff |
| GET | `/reports/dashboard` | Dashboard tổng quan, ẩn doanh thu với staff/PT | owner, staff, pt |
| GET | `/reports/revenue` | Báo cáo doanh thu | owner |
| GET | `/reports/members-summary` | Tóm tắt hội viên | owner, staff |
| GET | `/reports/registrations` | Hội viên mới, đăng ký, gia hạn, buổi tập | owner, staff |
| GET | `/reports/performance` | Hiệu suất nhân viên | owner |
| GET | `/staff-schedules` | Xem lịch làm việc nhân viên | owner, staff |
| PUT | `/staff-schedules/:userId` | Cập nhật lịch làm việc nhân viên | owner |
| GET | `/promotions` | Xem khuyến mãi đang áp dụng | Tất cả |
| POST | `/promotions` | Tạo khuyến mãi | owner |
| PATCH | `/promotions/:id` | Sửa/kích hoạt khuyến mãi | owner |

---

## Cấu trúc thư mục

```
gym-management/
├── README.md
├── CONTRIBUTING.md           # Hướng dẫn setup cho thành viên
├── docs/                     # Tài liệu nội bộ nhóm
├── backend/
│   ├── .env                  # Biến môi trường (KHÔNG commit — chứa DB credentials)
│   ├── .env.example          # Template .env
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma     # Schema database (10 models)
│   │   └── migrations/       # Lịch sử migration PostgreSQL
│   └── src/
│       ├── index.js          # Entry point Express
│       ├── middleware/
│       │   └── auth.middleware.js
│       ├── prisma/
│       │   ├── client.js     # Prisma client singleton
│       │   └── seed.js       # Seed dữ liệu mẫu
│       └── routes/           # 11 route modules
└── frontend/
    ├── vite.config.js        # Proxy /api → localhost:3001
    └── src/
        ├── api/client.js     # Axios + JWT interceptor
        ├── context/          # AuthContext
        ├── components/       # Layout, ProtectedRoute
        └── pages/            # 9 trang chính
```

---

## Ghi chú phát triển

- **Database:** Neon PostgreSQL cloud — tất cả thành viên dùng chung, không cần cài local
- **Sau khi pull** code mới có schema đổi: chạy `npx prisma migrate deploy`
- **Backend** dùng ES Modules (`"type": "module"` trong package.json)
- **JWT token** hết hạn sau 24 giờ — cần đăng nhập lại sau 24h
- **Frontend** responsive — hoạt động trên desktop (sidebar) và mobile (bottom navigation)

---

*Môn: Phát triển phần mềm theo chuẩn kỹ năng ITSS — HK 20252*
