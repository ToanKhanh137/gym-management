# 🤝 Contributing Guide — Gym Management System

> Đọc file này **trước khi bắt đầu làm việc** mỗi ngày.

---

## 🆕 Lần đầu clone repo về máy

```bash
git clone https://github.com/ToanKhanh137/gym-management.git
cd gym-management
```

### Setup Backend
```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
node src/prisma/seed.js
npm run dev
```

### Setup Frontend (terminal mới)
```bash
cd frontend
npm install
npm run dev
```

Xong. Backend: `http://localhost:3001` | Frontend: `http://localhost:5173`

---

## 🔄 Mỗi khi pull code mới của người khác về

```bash
git pull origin master
```

Nếu thấy file `prisma/schema.prisma` thay đổi, chạy thêm:
```bash
cd backend
npx prisma migrate dev
```

> ⚠️ **Không cần** chạy lại `npm install` hay seed trừ khi `package.json` thay đổi.

---

## ✅ Quy trình làm việc hàng ngày

```
1. git pull origin master          ← Lấy code mới nhất
2. (chạy migrate nếu schema đổi)
3. code bình thường...
4. git add .
5. git commit -m "feat/fix: mô tả ngắn gọn"
6. git push origin master
```

### Cách đặt tên commit (quan trọng — GV xem log)
| Prefix | Dùng khi |
|---|---|
| `feat:` | Thêm tính năng mới |
| `fix:` | Sửa bug |
| `refactor:` | Sửa cấu trúc code, không đổi chức năng |
| `docs:` | Cập nhật tài liệu |
| `test:` | Thêm unit test |
| `chore:` | Cài package, config |

**Ví dụ:**
```
feat: add member check-in endpoint
fix: correct subscription expiry date calculation
test: add unit test for auth middleware
```

---

## 🗂️ Phân công (cập nhật khi có)

| Thành viên | Phụ trách module |
|---|---|
| _(nhóm điền)_ | _(module...)_ |

---

## 🧰 Lệnh hay dùng

```bash
# Xem DB trực quan trên browser (rất tiện)
cd backend && npm run db:studio

# Reset và tạo lại dữ liệu mẫu
cd backend && node src/prisma/seed.js

# Kiểm tra lỗi ESLint frontend
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
