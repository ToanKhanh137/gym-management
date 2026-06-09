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
- Mô tả ngắn: _(ghi khi code xong)_
- Luồng chính: _(ghi khi code xong)_
- Exception: _(ghi khi code xong)_

### UC-02: Đăng nhập hệ thống
- Actor: Tất cả
- Mô tả ngắn:
- Luồng chính:
- Exception:

### UC-03: Quản lý gói tập (CRUD)
- Actor chính: Chủ phòng tập / Nhân viên
- Mô tả ngắn:
- Luồng chính:

### UC-04: Đăng ký / Gia hạn gói tập cho hội viên
- Actor chính: Nhân viên
- Actor phụ: Hội viên
- Mô tả ngắn:
- Luồng chính:

### UC-05: Ghi nhận lịch sử tập luyện (Check-in)
- Actor chính: Nhân viên / PT
- Mô tả ngắn:

### UC-06: Quản lý thiết bị phòng tập
- Actor chính: Nhân viên / Chủ phòng tập
- Mô tả ngắn:

### UC-07: Quản lý nhân sự / PT
- Actor chính: Chủ phòng tập
- Mô tả ngắn:

### UC-08: Xem báo cáo thống kê doanh thu
- Actor chính: Chủ phòng tập
- Mô tả ngắn:

### UC-09: Gửi phản hồi / đánh giá dịch vụ
- Actor chính: Hội viên
- Mô tả ngắn:

### UC-10: Quản lý tài khoản người dùng
- Actor chính: Chủ phòng tập / Admin
- Mô tả ngắn:

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

- **Pattern:** _(ghi khi quyết định — MVC / Layered / Clean Architecture)_
- **Frontend:** _(ghi khi chọn)_
- **Backend:** _(ghi khi chọn)_
- **DB:** _(ghi khi chọn)_
- **Auth:** JWT / Session — _(ghi khi chọn)_

---

## 🎨 DESIGN PATTERNS ĐÃ DÙNG
> Dùng cho: Good Design (GD)

| Pattern | Nơi áp dụng | Lý do |
|---|---|---|
| _(ghi khi dùng)_ | | |

---

## 🔒 PHI CHỨC NĂNG (Non-functional Requirements)
> Dùng cho: SRS

- **Bảo mật:** Mật khẩu hash bcrypt, JWT expire 24h, phân quyền theo role
- **Hiệu năng:** _(ghi thêm)_
- **Khả dụng:** _(ghi thêm)_
- **Khả năng mở rộng:** _(ghi thêm)_

---

## 📐 GIAO DIỆN — Màn hình đã làm
> Dùng cho: GUI Design (DD)

| Màn hình | Route/URL | Actor | Trạng thái |
|---|---|---|---|
| Login | /login | Tất cả | ⬜ |
| Dashboard Member | /member/dashboard | Hội viên | ⬜ |
| Dashboard Staff | /staff/dashboard | Nhân viên | ⬜ |
| Dashboard Owner | /owner/dashboard | Chủ phòng | ⬜ |
| Quản lý Hội viên | /staff/members | Nhân viên | ⬜ |
| Chi tiết Hội viên | /staff/members/:id | Nhân viên | ⬜ |
| Đăng ký Gói tập | /staff/subscriptions/new | Nhân viên | ⬜ |
| Quản lý Thiết bị | /staff/equipment | Nhân viên | ⬜ |
| Báo cáo Doanh thu | /owner/reports | Chủ phòng | ⬜ |

---

*File này cập nhật liên tục trong quá trình code. Format lại thành tài liệu chính thức sau.*
