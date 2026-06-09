# 📅 WORK LOG — Nhật ký làm việc

> Ghi lại những gì đã làm mỗi ngày.  
> Format mỗi entry: `[HH:MM] Tên - Mô tả việc đã làm`  
> AI agents đọc file này để biết context hiện tại trước khi làm việc.

---

## 09/06/2026 (Ngày 1 — Còn 5 ngày)

### Buổi sáng

- `[09:00]` _(AI Agent)_ — Đọc và phân tích đề bài từ PDF + DOCX
- `[09:05]` _(AI Agent)_ — Convert PDF → `Topics-ITSS-20252.md`, DOCX → `Huong-dan-bai-tap-nhom.md`
- `[09:06]` _(AI Agent)_ — Tạo `PROJECT_TRACKER.md`, `DOC_NOTES.md`, `WORK_LOG.md`
- `[09:13]` _(Nhóm + AI)_ — Quyết định chủ đề Gym (Chủ đề 02), chiến lược code-first
- `[09:14]` _(AI Agent)_ — Chọn tech stack: Node.js + Express + Prisma + PostgreSQL + React + Vite
- `[09:15]` _(AI Agent)_ — Tạo cấu trúc thư mục `gym-management/backend/` và `frontend/`
- `[09:16]` _(AI Agent)_ — Tạo `package.json`, `.env`, `.env.example` cho backend
- `[09:16]` _(AI Agent)_ — Tạo Prisma schema đầy đủ (10 models: User, Member, Trainer, MembershipPackage, Subscription, Room, Equipment, MaintenanceRequest, TrainingLog, Feedback)
- `[09:17]` _(AI Agent)_ — Tạo `src/index.js` (Express app, 11 routes)
- `[09:17]` _(AI Agent)_ — Tạo `auth.middleware.js` (JWT authenticate + authorize theo role)
- `[09:17]` _(AI Agent)_ — Tạo toàn bộ 11 route files: auth, user, member, package, subscription, room, equipment, trainingLog, feedback, maintenance, report
- `[09:19]` _(AI Agent)_ — Tạo `seed.js` với 4 tài khoản test (owner/staff/pt/member) + dữ liệu mẫu
- `[09:20]` _(AI Agent)_ — `npm install` backend, `prisma migrate dev` (SQLite), seed DB
- `[09:20]` _(AI Agent)_ — Setup frontend: `create-vite` React, cài axios + react-router-dom + tanstack-query
- `[09:24]` _(AI Agent)_ — Tạo `README.md` đầy đủ (tech stack, setup, API endpoints, folder structure)
- `[09:25]` _(AI Agent)_ — Tạo `.gitignore` 3 cấp (root, backend, frontend)
- `[09:26]` _(AI Agent)_ — `git init`, add remote, commit đầu tiên, push lên GitHub
- `[09:28]` _(AI Agent)_ — Tạo `CONTRIBUTING.md` (hướng dẫn cho team)
- `[09:29]` _(AI Agent)_ — Gom tài liệu vào `docs/` trong repo
- `[09:32]` _(Nhóm + AI)_ — Đánh giá DB: chọn **Neon** thay SQLite (PostgreSQL cloud, free, không pause)
- `[09:34]` _(AI Agent)_ — Đổi Prisma provider từ `sqlite` → `postgresql`, cập nhật `.env.example`
- `[09:39]` _(Nhóm)_ — Tạo Neon project, cung cấp connection string
- `[09:39]` _(AI Agent)_ — Cập nhật `.env` với Neon URL, xóa SQLite migrations, tạo PostgreSQL migration mới
- `[09:40]` _(AI Agent)_ — Seed Neon DB thành công, test login API trả JWT token OK
- `[09:43]` _(AI Agent)_ — Xóa thư mục `docs/` ngoài repo (đã move vào trong repo)
- `[09:47]` _(AI Agent)_ — Cập nhật `CONTRIBUTING.md`: thêm JWT_SECRET note, workflow, hướng dẫn ghi docs
- `[09:54]` _(AI Agent)_ — Cập nhật `WORK_LOG.md` và `DOC_NOTES.md` (file này)
- `[09:56]` _(AI Agent)_ — Bắt đầu code UI frontend
- `[09:56]` _(AI Agent)_ — Generate ảnh background phòng gym cho Login page (AI image)
- `[09:58]` _(AI Agent)_ — Config `vite.config.js` proxy → backend `:3001`
- `[09:58]` _(AI Agent)_ — Viết toàn bộ `index.css` (design system: CSS variables, dark theme, layout, cards, table, modal, buttons, forms)
- `[09:59]` _(AI Agent)_ — Tạo `src/api/client.js` (axios + JWT interceptor + auto-logout 401)
- `[09:59]` _(AI Agent)_ — Tạo `src/context/AuthContext.jsx` (login/logout + persist localStorage)
- `[10:00]` _(AI Agent)_ — Tạo `src/components/ProtectedRoute.jsx` (guard route theo role)
- `[10:00]` _(AI Agent)_ — Tạo `src/components/Layout.jsx` (sidebar với nav theo role, user info, logout)
- `[10:00]` _(AI Agent)_ — Tạo `src/pages/Login.jsx` (gym background + form + quick login demo)
- `[10:01]` _(AI Agent)_ — Tạo `src/pages/Dashboard.jsx` (stats cards + revenue chart + quick actions)
- `[10:01]` _(AI Agent)_ — Tạo `src/pages/Members.jsx` (table + search + add modal)
- `[10:02]` _(AI Agent)_ — Tạo `src/pages/MemberDetail.jsx` (profile + tab subs/logs/feedback + register package modal)
- `[10:03]` _(AI Agent)_ — Tạo `src/pages/Packages.jsx` (card grid + create/edit modal)
- `[10:04]` _(AI Agent)_ — Tạo `src/pages/CheckIn.jsx` (live search + today log table + checkout)
- `[10:05]` _(AI Agent)_ — Tạo `src/pages/Equipment.jsx` (table + báo hỏng modal + resolve bảo trì)
- `[10:05]` _(AI Agent)_ — Tạo `src/pages/Reports.jsx` (KPI cards + revenue date filter + bar chart)
- `[10:06]` _(AI Agent)_ — Tạo `src/pages/MemberProfile.jsx` (self-service: stats + training log)
- `[10:06]` _(AI Agent)_ — Tạo `src/App.jsx` (routing đầy đủ, role-based redirect)
- `[10:06]` _(AI Agent)_ — Khởi chạy `npm run dev` frontend thành công tại port 5173
- `[10:03]` _(AI Agent)_ — Fix lỗi import path (`../../` → `../`) cho tất cả pages
- `[12:09]` _(AI Agent)_ — Cài `lucide-react`, thay emoji bằng SVG icon chuyên nghiệp (Dashboard + Layout)
- `[12:09]` _(AI Agent)_ — Cập nhật WORK_LOG và DOC_NOTES
- `[12:15]` _(AI Agent)_ — Sửa `README.md`: xóa toàn bộ reference SQLite → Neon PostgreSQL, cập nhật setup steps, thêm lucide-react vào tech stack
- `[12:15]` _(AI Agent)_ — Thêm mobile-responsive CSS vào `index.css`: breakpoint 768px, mobile header, bottom navigation, sidebar overlay, card stacking
- `[12:18]` _(AI Agent)_ — Cập nhật `Layout.jsx` hỗ trợ mobile: hamburger menu, sidebar slide-in, overlay, bottom nav bar với 4 item chính theo role
- `[12:19]` _(AI Agent)_ — Thay emoji trong `Members.jsx`, `CheckIn.jsx`, `Equipment.jsx` bằng Lucide icons (Search, Plus, ChevronRight, Wrench...)
- `[12:20]` _(AI Agent)_ — Fix bottom nav item sizing (flex:1, max-width:80px)
- `[12:24]` _(AI Agent)_ — Cập nhật WORK_LOG và DOC_NOTES

### Tổng kết ngày 09/06
- ✅ Đã làm: Toàn bộ backend API (11 modules, 30+ endpoints), DB Neon PostgreSQL live, seed data, repo GitHub, docs hệ thống
- ✅ Đã làm: Frontend 9 trang chính, dark theme, lucide-react icons nhất quán
- ✅ Đã làm: Responsive layout — desktop sidebar + mobile bottom nav + hamburger
- ✅ Đã làm: Sửa README phản ánh đúng Neon PostgreSQL
- ⬜ Chưa làm: Rooms, Users, Feedbacks, Subscriptions pages; unit test; phân công thành viên
- 🔜 Ngày mai cần: Hoàn thiện các trang còn lại, test end-to-end

---

## 10/06/2026 (Ngày 2 — Còn 4 ngày)

### Buổi sáng
- _(nhóm ghi vào đây)_

### Buổi chiều
- _(nhóm ghi vào đây)_

### Tổng kết ngày 10/06
- ✅ Đã làm:
- ⬜ Chưa làm:
- 🔜 Ngày mai cần:

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
