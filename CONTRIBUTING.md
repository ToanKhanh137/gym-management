# 🤝 Contributing Guide — Gym Management System

> Đọc file này **trước khi bắt đầu làm việc** mỗi ngày.

---

## 🆕 Lần đầu clone repo về máy

```bash
git clone https://github.com/ToanKhanh137/gym-management.git
cd gym-management
```

### 1️⃣ Lấy thông tin môi trường từ nhóm trưởng

> Nhóm dùng **Neon** (PostgreSQL cloud) — mọi người dùng chung 1 database.  
> Hỏi nhóm trưởng lấy 2 giá trị sau (gửi qua tin nhắn riêng):

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
```

> ⚠️ **JWT_SECRET phải giống nhau trên mọi máy** — nếu khác nhau thì token của người này không dùng được trên máy người kia khi test chung.

### 2️⃣ Setup Backend
```bash
cd backend

# Tạo file .env từ template
cp .env.example .env
# → Mở .env, dán DATABASE_URL và JWT_SECRET vào

# Cài dependencies
npm install

# Áp dụng schema lên Neon (lần đầu, không cần seed — data đã có trên cloud)
npx prisma migrate deploy

# Chạy development server
npm run dev
```

### 3️⃣ Setup Frontend (terminal mới)
```bash
cd frontend
npm install
npm run dev
```

Backend: `http://localhost:3001` | Frontend: `http://localhost:5173`

> 📁 **Tài liệu nhóm** trong thư mục [`docs/`](./docs/) — có tracker, phân công, log làm việc.

---

## 🔄 Mỗi khi pull code mới về

```bash
git pull origin master
```

Nếu `prisma/schema.prisma` thay đổi, chạy thêm:
```bash
cd backend && npx prisma migrate deploy
```

Nếu `package.json` thay đổi:
```bash
cd backend && npm install
# hoặc
cd frontend && npm install
```

---

## ✅ Workflow hàng ngày (QUAN TRỌNG)

```
Sáng bắt đầu làm:
  git pull origin master           ← Luôn pull trước khi code

Trong khi code xong 1 chức năng:
  → Mở docs/WORK_LOG.md            ← Ghi vào log hôm nay
  → Mở docs/DOC_NOTES.md           ← Ghi note tài liệu (xem hướng dẫn bên dưới)

Khi push:
  git add .
  git commit -m "feat: tên chức năng vừa làm"
  git push origin master
```

### Cách đặt tên commit (GV xem log — ghi rõ ràng)

| Prefix | Dùng khi |
|---|---|
| `feat:` | Thêm tính năng mới |
| `fix:` | Sửa bug |
| `refactor:` | Cải thiện code, không đổi chức năng |
| `docs:` | Cập nhật tài liệu |
| `test:` | Thêm unit test |
| `chore:` | Config, cài package |

**Ví dụ:**
```
feat: add member registration endpoint
fix: correct subscription end date calculation
test: add unit test for JWT middleware
docs: update DOC_NOTES with member use case
```

---

## 📝 Cách ghi docs trong lúc code

> Mục tiêu: Code xong đâu → ghi note ngay → cuối project "đổ" vào tài liệu chính thức, không phải nhớ lại.

### `docs/WORK_LOG.md` — Ghi mỗi ngày

Mỗi khi làm xong một việc, ghi vào đúng ngày hôm đó:

```
- [09:30] Tên bạn — Làm xong route GET /api/members với search theo tên/SĐT
- [10:15] Tên bạn — Fix bug: JWT không trả đúng role khi login
- [14:00] Tên bạn — Thêm bảng TrainingLog vào seed.js
```

### `docs/DOC_NOTES.md` — Ghi khi xong 1 tính năng

**Làm xong API/route nào → điền vào đúng section:**

```markdown
### UC-01: Đăng ký hội viên mới
- Actor chính: Nhân viên
- Luồng chính:
  1. Nhân viên nhập thông tin hội viên (tên, email, SĐT, gói tập)
  2. Hệ thống tạo User + Member record, sinh memberCode tự động
  3. Trả về memberCode
- Exception: Email đã tồn tại → lỗi 409
```

**Thêm bảng DB mới → ghi vào phần DATABASE SCHEMA:**
```markdown
### Table: members
- id, user_id, member_code, occupation, created_at
```

**Dùng design pattern nào → ghi vào DESIGN PATTERNS:**
```markdown
| Singleton | prisma/client.js — DB connection | Tránh tạo nhiều connection |
```

> 💡 **Không cần đẹp, không cần đúng format** — chỉ cần đủ thông tin để sau này convert sang Word/UML không phải ngồi nhớ lại.

---

## 🗂️ Phân công (cập nhật khi có)

| Thành viên | Phụ trách module | Use Case |
|---|---|---|
| _(nhóm điền)_ | _(module...)_ | _(UC...)_ |

---

## 🧰 Lệnh hay dùng

```bash
# Xem database trực quan trên browser — rất tiện khi debug
cd backend && npm run db:studio

# Seed lại dữ liệu mẫu (nếu cần)
cd backend && node src/prisma/seed.js

# Kiểm tra lỗi ESLint
cd frontend && npm run lint
```

---

## ❓ Tài khoản test

| Email | Password | Role |
|---|---|---|
| `owner@gym.com` | `owner123` | Chủ phòng tập |
| `staff@gym.com` | `staff123` | Nhân viên |
| `pt@gym.com` | `pt123` | Huấn luyện viên |
| `member@gym.com` | `member123` | Hội viên |
