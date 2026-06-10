# 📅 WORK LOG — Nhật ký làm việc

> Ghi lại những gì đã làm mỗi ngày.  
> Format mỗi entry: `[HH:MM] Tên - Mô tả việc đã làm`  
> AI agents đọc file này để biết context hiện tại trước khi làm việc.

---

## 09/06/2026 (Ngày 1 — Còn 5 ngày)

### Buổi sáng

- `[09:00]` Toàn — Đọc và phân tích đề bài từ PDF + DOCX
- `[09:05]` Toàn — Convert PDF → `Topics-ITSS-20252.md`, DOCX → `Huong-dan-bai-tap-nhom.md`
- `[09:06]` Toàn — Tạo `PROJECT_TRACKER.md`, `DOC_NOTES.md`, `WORK_LOG.md`
- `[09:13]` _(Nhóm + AI)_ — Quyết định chủ đề Gym (Chủ đề 02), chiến lược code-first
- `[09:14]` Toàn — Chọn tech stack: Node.js + Express + Prisma + PostgreSQL + React + Vite
- `[09:15]` Toàn — Tạo cấu trúc thư mục `gym-management/backend/` và `frontend/`
- `[09:16]` Toàn — Tạo `package.json`, `.env`, `.env.example` cho backend
- `[09:16]` Toàn — Tạo Prisma schema đầy đủ (10 models: User, Member, Trainer, MembershipPackage, Subscription, Room, Equipment, MaintenanceRequest, TrainingLog, Feedback)
- `[09:17]` Toàn — Tạo `src/index.js` (Express app, 11 routes)
- `[09:17]` Toàn — Tạo `auth.middleware.js` (JWT authenticate + authorize theo role)
- `[09:17]` Toàn — Tạo toàn bộ 11 route files: auth, user, member, package, subscription, room, equipment, trainingLog, feedback, maintenance, report
- `[09:19]` Toàn — Tạo `seed.js` với 4 tài khoản test (owner/staff/pt/member) + dữ liệu mẫu
- `[09:20]` Toàn — `npm install` backend, `prisma migrate dev` (SQLite), seed DB
- `[09:20]` Toàn — Setup frontend: `create-vite` React, cài axios + react-router-dom + tanstack-query
- `[09:24]` Toàn — Tạo `README.md` đầy đủ (tech stack, setup, API endpoints, folder structure)
- `[09:25]` Toàn — Tạo `.gitignore` 3 cấp (root, backend, frontend)
- `[09:26]` Toàn — `git init`, add remote, commit đầu tiên, push lên GitHub
- `[09:28]` Toàn — Tạo `CONTRIBUTING.md` (hướng dẫn cho team)
- `[09:29]` Toàn — Gom tài liệu vào `docs/` trong repo
- `[09:32]` _(Nhóm + AI)_ — Đánh giá DB: chọn **Neon** thay SQLite (PostgreSQL cloud, free, không pause)
- `[09:34]` Toàn — Đổi Prisma provider từ `sqlite` → `postgresql`, cập nhật `.env.example`
- `[09:39]` _(Nhóm)_ — Tạo Neon project, cung cấp connection string
- `[09:39]` Toàn — Cập nhật `.env` với Neon URL, xóa SQLite migrations, tạo PostgreSQL migration mới
- `[09:40]` Toàn — Seed Neon DB thành công, test login API trả JWT token OK
- `[09:43]` Toàn — Xóa thư mục `docs/` ngoài repo (đã move vào trong repo)
- `[09:47]` Toàn — Cập nhật `CONTRIBUTING.md`: thêm JWT_SECRET note, workflow, hướng dẫn ghi docs
- `[09:54]` Toàn — Cập nhật `WORK_LOG.md` và `DOC_NOTES.md` (file này)
- `[09:56]` Toàn — Bắt đầu code UI frontend
- `[09:56]` Toàn — Generate ảnh background phòng gym cho Login page (AI image)
- `[09:58]` Toàn — Config `vite.config.js` proxy → backend `:3001`
- `[09:58]` Toàn — Viết toàn bộ `index.css` (design system: CSS variables, dark theme, layout, cards, table, modal, buttons, forms)
- `[09:59]` Toàn — Tạo `src/api/client.js` (axios + JWT interceptor + auto-logout 401)
- `[09:59]` Toàn — Tạo `src/context/AuthContext.jsx` (login/logout + persist localStorage)
- `[10:00]` Toàn — Tạo `src/components/ProtectedRoute.jsx` (guard route theo role)
- `[10:00]` Toàn — Tạo `src/components/Layout.jsx` (sidebar với nav theo role, user info, logout)
- `[10:00]` Toàn — Tạo `src/pages/Login.jsx` (gym background + form + quick login demo)
- `[10:01]` Toàn — Tạo `src/pages/Dashboard.jsx` (stats cards + revenue chart + quick actions)
- `[10:01]` Toàn — Tạo `src/pages/Members.jsx` (table + search + add modal)
- `[10:02]` Toàn — Tạo `src/pages/MemberDetail.jsx` (profile + tab subs/logs/feedback + register package modal)
- `[10:03]` Toàn — Tạo `src/pages/Packages.jsx` (card grid + create/edit modal)
- `[10:04]` Toàn — Tạo `src/pages/CheckIn.jsx` (live search + today log table + checkout)
- `[10:05]` Toàn — Tạo `src/pages/Equipment.jsx` (table + báo hỏng modal + resolve bảo trì)
- `[10:05]` Toàn — Tạo `src/pages/Reports.jsx` (KPI cards + revenue date filter + bar chart)
- `[10:06]` Toàn — Tạo `src/pages/MemberProfile.jsx` (self-service: stats + training log)
- `[10:06]` Toàn — Tạo `src/App.jsx` (routing đầy đủ, role-based redirect)
- `[10:06]` Toàn — Khởi chạy `npm run dev` frontend thành công tại port 5173
- `[10:03]` Toàn — Fix lỗi import path (`../../` → `../`) cho tất cả pages
- `[12:09]` Toàn — Cài `lucide-react`, thay emoji bằng SVG icon chuyên nghiệp (Dashboard + Layout)
- `[12:09]` Toàn — Cập nhật WORK_LOG và DOC_NOTES
- `[12:15]` Toàn — Sửa `README.md`: xóa toàn bộ reference SQLite → Neon PostgreSQL, cập nhật setup steps, thêm lucide-react vào tech stack
- `[12:15]` Toàn — Thêm mobile-responsive CSS vào `index.css`: breakpoint 768px, mobile header, bottom navigation, sidebar overlay, card stacking
- `[12:18]` Toàn — Cập nhật `Layout.jsx` hỗ trợ mobile: hamburger menu, sidebar slide-in, overlay, bottom nav bar với 4 item chính theo role
- `[12:19]` Toàn — Thay emoji trong `Members.jsx`, `CheckIn.jsx`, `Equipment.jsx` bằng Lucide icons (Search, Plus, ChevronRight, Wrench...)
- `[12:20]` Toàn — Fix bottom nav item sizing (flex:1, max-width:80px)
- `[12:40]` Toàn — Fix lỗi tự động zoom trên mobile: thêm `viewport-fit=cover, user-scalable=no`, `touch-action: manipulation`
- `[12:45]` Toàn — Fix lỗi overflow ngang trên trang Check-in mobile: thêm `overflow-x: hidden`, chuyển form từ 2 cột sang 1 cột
- `[12:55]` Toàn — Cập nhật CSS: chuyển toàn bộ `@media (max-width: 768px)` xuống cuối file `index.css` để tránh bị base class ghi đè
- `[13:05]` Toàn — Cập nhật WORK_LOG (file này)

### Tổng kết ngày 09/06
- ✅ Đã làm: Toàn bộ backend API (11 modules, 30+ endpoints), DB Neon PostgreSQL live, seed data, repo GitHub, docs hệ thống
- ✅ Đã làm: Frontend 9 trang (dashboard/members/packages/checkin/equipment/reports/profile/memberDetail) + dark theme + lucide-react
- ✅ Đã làm: Responsive layout — desktop sidebar + mobile bottom nav + hamburger
- ✅ Đã làm: Sửa README phản ánh đúng Neon PostgreSQL
- ✅ Đã làm: 7 trang còn lại: Rooms, Users, Feedbacks, Subscriptions, MySubscription, MyTraining, MemberFeedback
- ✅ Đã làm: Bổ sung backend (training-log member filter, subscription member filter, feedbacks/mine endpoint)
- ✅ Đã làm: Cập nhật DOC_NOTES + WORK_LOG
- 🔜 Ngày mai cần: Test end-to-end, phân công viết tài liệu chính thức (RA/AD/DD/GD/UT)

---

## 10/06/2026 (Ngày 2 — Còn 4 ngày)

### Buổi sáng
- `[09:00]` Khánh — Code 7 trang frontend còn thiếu:
  - `/rooms` — Quản lý phòng tập (CRUD, status badge, thiết bị count)
  - `/users` — Nhân sự (filter role, toggle isActive, add/edit modal)
  - `/feedbacks` — Tổng hợp đánh giá (KPI cards + star rating table)
  - `/subscriptions` — Đăng ký gói tập (CRUD + cancel + search/filter)
  - `/my-subscription` — Member xem gói tập (hero card + cảnh báo hết hạn)
  - `/my-training` — Member xem lịch sử tập (KPI + bảng check-in/out)
  - `/feedback` — Member gửi đánh giá (interactive star picker + lịch sử)
- `[09:30]` Khánh — Cập nhật App.jsx đăng ký toàn bộ routes mới
- `[09:35]` Khánh — Bổ sung backend:
  - `GET /api/training-logs`: member tự động filter theo memberId của mình
  - `GET /api/subscriptions`: member tự động filter theo memberId
  - `GET /api/feedbacks/mine`: endpoint mới cho member xem phản hồi đã gửi
  - `GET /api/training-logs`: include subscription.package để hiển thị tên gói tập
- `[09:45]` Khánh — Cập nhật DOC_NOTES.md (UC-07 → UC-13, UI table 100% xong)
- `[09:50]` Khánh — Fix lỗi demo login: interceptor 401 không reload trang khi đang ở /login
- `[09:55]` Khánh — Cập nhật WORK_LOG.md

### Buổi chiều
- `[12:15]` Khánh — Review DOC_NOTES.md: kiểm tra Actors và Use Cases
  - Phát hiện lỗi: UC-01 ghi sai actor phụ (Hội viên không tự đăng ký)
  - Phát hiện thiếu: Actor Owner/Staff/PT mô tả chưa đầy đủ quyền
  - Phát hiện thiếu: UC-03 thiếu actor phụ xem (Staff/Member), thiếu exception
  - Phát hiện thiếu: UC-04 thiếu Owner trong actor chính
  - Phát hiện thiếu: UC-06 luồng quá ngắn, bổ sung 5 bước + exception
  - Phát hiện thiếu: UC-04 và UC-11 trùng API, ghi chú rõ điểm khác
  - Bổ sung mới: UC-14 (Đăng xuất), UC-15 (Xem Dashboard KPI)
- `[12:20]` Khánh — Cập nhật DOC_NOTES.md: sửa Actors, sửa/bổ sung UC-01/03/04/06/11, thêm UC-14/UC-15
- `[12:21]` Khánh — Phát hiện chức năng thiếu: UC-06 Equipment.jsx chưa có nút Sửa thiết bị (backend PATCH đã có)
- `[12:22]` Khánh — Bổ sung `Equipment.jsx`:
  - Thêm state `showEditModal`, `editTarget`, `editForm`
  - Thêm mutation `updateEq` → PATCH `/api/equipment/:id`
  - Thêm hàm `openEdit()` pre-fill form từ row hiện tại
  - Thêm nút ✏️ Sửa trên mỗi row (kế bên nút Báo hỏng)
  - Thêm modal Edit với đầy đủ fields: tên, phòng, số lượng, trạng thái, ngày nhập, bảo hành, xuất xứ
  - Fix statusColor map: `broken` → `damaged` cho đúng với enum DB
- `[12:22]` Khánh — Cập nhật WORK_LOG.md

### Tổng kết ngày 10/06
- ✅ Đã làm: Hoàn chỉnh 100% các trang frontend (16/16 màn hình)
- ✅ Đã làm: Bổ sung 3 backend endpoints/fixes cho member self-service
- ✅ Đã làm: Review và sửa DOC_NOTES — Actors đầy đủ, 15 Use Cases (thêm UC-14/15), luồng chính xác
- ✅ Đã làm: Bổ sung chức năng sửa thiết bị (UC-06 hoàn chỉnh 100%) — modal Edit + PATCH API
- ⬜ Chưa làm: Viết tài liệu chính thức (RA, AD, DD, GD, PP), unit test
- 🔜 Ngày mai cần: Bắt đầu viết tài liệu chính thức, test end-to-end toàn hệ thống

---

## 11/06/2026 (Ngày 3 — Còn 3 ngày)

### Buổi sáng
- _(nhóm ghi vào đây)_

### Tổng kết ngày 11/06
- ✅ Đã làm:
- ⬜ Chưa làm:
- 🔜 Ngày mai cần:

---

## 12/06/2026 (Ngày 4 — Còn 2 ngày)

### Tổng kết ngày 12/06
- ✅ Đã làm:
- ⬜ Chưa làm:
- 🔜 Ngày mai cần:

---

## 13/06/2026 (Ngày 5 — Còn 1 ngày)

### Tổng kết ngày 13/06
- ✅ Đã làm:
- ⬜ Chưa làm:
- 🔜 Ngày mai: NỘP BÀI

---

## 14/06/2026 (DEADLINE 🔥)

### Checklist nộp bài cuối cùng
- ⬜ Push code lên GitHub lần cuối
- ⬜ Nộp thư mục RA lên Google Drive
- ⬜ Nộp thư mục AD lên Google Drive
- ⬜ Nộp thư mục DD lên Google Drive
- ⬜ Nộp thư mục PP lên Google Drive
- ⬜ Nộp thư mục UT lên Google Drive
- ⬜ Nộp thư mục GD lên Google Drive
- ⬜ Kiểm tra link repo đã điền đúng chưa

---

## 📌 CONTEXT CHO AI AGENTS
> Đọc phần này trước khi bắt đầu làm việc

**Trạng thái hiện tại (cập nhật bởi nhóm):**
- Đang làm: _(nhóm điền)_
- Vừa xong: _(nhóm điền)_
- Cần tiếp theo: _(nhóm điền)_
- Tech stack đã chọn: _(nhóm điền)_
- Repo GitHub: _(nhóm điền)_
