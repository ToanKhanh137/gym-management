# 🏋️ PROJECT TRACKER — Hệ thống Quản lý Phòng tập Gym
> **Môn học:** Phát triển phần mềm theo chuẩn kỹ năng ITSS — HK 20252  
> **Chủ đề:** Chủ đề 02 — Hệ thống Quản lý Phòng tập Gym  
> **Deadline:** 14/06/2026  
> **Cập nhật lần cuối:** 09/06/2026  
> **File này dành cho:** Cả nhóm + AI agents tham chiếu và bám sát tiến độ

---

## 📌 MỤC LỤC
1. [Thông tin chung](#1-thông-tin-chung)
2. [Yêu cầu bài tập (đầy đủ từ đề)](#2-yêu-cầu-bài-tập-đầy-đủ-từ-đề)
3. [Phân tích hệ thống Gym (từ đề)](#3-phân-tích-hệ-thống-gym-từ-đề)
4. [Danh sách việc cần làm theo giai đoạn](#4-danh-sách-việc-cần-làm-theo-giai-đoạn)
5. [Phân công công việc](#5-phân-công-công-việc)
6. [Kế hoạch Sprint (Scrum)](#6-kế-hoạch-sprint-scrum)
7. [Tech Stack đề xuất](#7-tech-stack-đề-xuất)
8. [Ghi chú / Quyết định nhóm](#8-ghi-chú--quyết-định-nhóm)

---

## 1. Thông tin chung

| Mục | Thông tin |
|---|---|
| Chủ đề | Chủ đề 02 — Hệ thống Quản lý Phòng tập Gym |
| Số thành viên | _(nhóm điền)_ |
| Link repo GitHub | _(nhóm điền)_ |
| Link Google Drive nộp bài | _(nhóm điền)_ |
| Deadline cứng | **14/06/2026** |

---

## 2. Yêu cầu bài tập (đầy đủ từ đề)

> Nguồn: `Huong dan thuc hien bai tap nhom.docx`

### 2.1 Các giai đoạn phải nộp (thư mục trên Google Drive)

| Thư mục | Nội dung yêu cầu | Trạng thái |
|---|---|---|
| **RA** — Requirement Analysis | User story, Kế hoạch Scrum, SRS (Use case tổng quan, Use case phân rã, Đặc tả use case nghiệp vụ, Từ điển thuật ngữ, Đặc tả phi chức năng) | ⬜ Chưa làm |
| **AD** — Architectural Design | Phân tích từng use case, Biểu đồ tương tác, Biểu đồ lớp phân tích, Biểu đồ lớp phân tích gộp | ⬜ Chưa làm |
| **DD** — Detailed Design | Thiết kế giao diện (GUI + SystemInterface), Thiết kế lớp chi tiết, ER Diagram, Database Design | ⬜ Chưa làm |
| **PP** — Programming | Toàn bộ mã nguồn hiện thực hoá thiết kế | ⬜ Chưa làm |
| **UT** — Unit Test | Test case thiết kế (Excel), Mã nguồn unit test tách biệt với project chính | ⬜ Chưa làm |
| **GD** — Good Design | Thiết kế & mã nguồn cải tiến theo Design Principles / Design Patterns | ⬜ Chưa làm |

### 2.2 Quy tắc nộp bài

- Mỗi thành viên phụ trách **use case cụ thể** + các thành phần phần mềm tương ứng (lớp, bảng/document, unit test)
- Sử dụng **Git repository chung** — giáo viên theo dõi commit từng người
- **Tạo link repo chung** điền vào danh sách nhóm
- Không tạo thư mục riêng cho từng người trong repo

---

## 3. Phân tích hệ thống Gym (từ đề)

> Nguồn: `Topics-Phat trien phan mem ITSS-20252.pdf` — Chủ đề 02

### 3.1 Đối tượng sử dụng (Actors)

| Actor | Vai trò |
|---|---|
| **Chủ phòng tập** | Quản lý tổng thể kinh doanh: doanh thu, nhân sự, hội viên, thiết bị, phản hồi |
| **Nhân viên quản lý** | Theo dõi hoạt động hàng ngày, kiểm soát đăng ký/gia hạn, xử lý phản hồi hội viên |
| **Huấn luyện viên cá nhân (PT)** | Quản lý học viên, lịch tập, hướng dẫn, đánh giá tiến độ |
| **Hội viên** | Đăng ký, theo dõi gói tập, lịch sử tập luyện, đánh giá dịch vụ |

### 3.2 Chức năng chính (từ đề — BẮT BUỘC có)

#### 3.2.1 Quản lý phòng tập
- [ ] Quản lý thông tin phòng tập (mã phòng, tên phòng, loại: gym/yoga/fitness, số lượng, tình trạng)
- [ ] Quản lý thiết bị tập luyện (mã, tên, số lượng, ngày nhập, bảo hành, xuất xứ, trạng thái)
- [ ] Quản lý nhân sự (phân quyền: nhân viên KD, CSKH, PT; lịch làm việc; đánh giá hiệu suất)
- [ ] Quản lý phản hồi hội viên (tiếp nhận, xử lý đánh giá về nhân viên và cơ sở)

#### 3.2.2 Quản lý hội viên
- [ ] Lưu thông tin cá nhân (họ tên, tuổi, nghề nghiệp, liên hệ, sinh nhật, loại thành viên)
- [ ] Quản lý đăng ký và gia hạn (ngày đăng ký, loại: buổi/tháng/năm, tình trạng gia hạn)
- [ ] Lịch sử sử dụng dịch vụ (số buổi, thời gian, dịch vụ đã dùng, mức độ tham gia)
- [ ] Tài khoản hội viên (đăng nhập, theo dõi gói tập, lịch tập, phản hồi, thông tin khuyến mãi)

#### 3.2.3 Quản lý gói tập
- [ ] Thiết lập gói tập (3 tháng, 6 tháng, 1 năm, theo buổi, VIP, PT cá nhân)
- [ ] Quản lý đăng ký và thanh toán (xác nhận, ghi nhận TT, cấp biên lai, gia hạn)

#### 3.2.4 Báo cáo thống kê
- [ ] Doanh thu (theo ngày/tuần/tháng/quý/năm)
- [ ] Đăng ký mới và gia hạn (số hội viên mới, gia hạn, buổi tập đã dùng)
- [ ] Hiệu suất nhân viên (dựa trên phản hồi hội viên + hoạt động quản lý)

### 3.3 Quy trình nghiệp vụ (từ đề)

#### QT1: Đăng ký hội viên mới
1. Hội viên cung cấp thông tin cá nhân + chọn gói tập
2. Nhân viên tiếp nhận, tạo hồ sơ hội viên trên hệ thống
3. Hội viên thanh toán (tiền mặt / thẻ ngân hàng / ví điện tử)
4. Hệ thống cấp mã hội viên + cập nhật danh sách

#### QT2: Ghi nhận lịch sử tập luyện & theo dõi gói tập
1. Hội viên đăng nhập qua app/website
2. Hệ thống hiển thị thông tin gói tập, lịch sử, số buổi còn lại
3. Nhân viên/PT ghi nhận lịch sử tập luyện
4. Hội viên có thể gia hạn gói tập trực tuyến

#### QT3: Bảo trì thiết bị
1. Nhân viên kiểm tra thiết bị định kỳ
2. Nếu phát hiện lỗi, báo cáo trên hệ thống
3. Hệ thống thông báo bộ phận bảo trì
4. Sau sửa chữa, cập nhật trạng thái thiết bị

---

## 4. Danh sách việc cần làm theo giai đoạn

> ✅ Xong | 🔄 Đang làm | ⬜ Chưa làm | ❌ Bỏ qua/Không làm

### Phase 0 — Khởi động (Deadline: 09/06)
- ⬜ Tạo GitHub repo chung
- ⬜ Điền link repo vào danh sách nhóm (nộp cho GV)
- ⬜ Xác định tech stack (xem mục 7)
- ⬜ Phân công use case cho từng thành viên
- ⬜ Tạo project board (GitHub Projects / Trello / Jira)

### Phase 1 — RA (Requirement Analysis) — Deadline: 10/06
- ⬜ Viết User Stories cho toàn bộ chức năng
- ⬜ Lập kế hoạch Sprint (Scrum): Kế hoạch + phân chia + dashboard
- ⬜ Vẽ Use Case Diagram tổng quan
- ⬜ Vẽ Use Case Diagram phân rã (nếu cần)
- ⬜ Đặc tả use case nghiệp vụ (từng use case)
- ⬜ Từ điển thuật ngữ (Glossary)
- ⬜ Đặc tả phi chức năng (hiệu năng, bảo mật, v.v.)
- ⬜ Nộp lên Google Drive / thư mục RA

### Phase 2 — AD (Architectural Design) — Deadline: 11/06
- ⬜ Phân tích từng use case
- ⬜ Vẽ Sequence Diagram / Collaboration Diagram cho từng use case
- ⬜ Vẽ Class Diagram phân tích (từng use case)
- ⬜ Vẽ Class Diagram phân tích gộp (tổng hợp)
- ⬜ Nộp lên Google Drive / thư mục AD

### Phase 3 — DD (Detailed Design) — Deadline: 12/06
- ⬜ Thiết kế giao diện (wireframe/mockup cho từng màn hình)
  - ⬜ Màn hình hội viên (đăng ký, login, dashboard, gói tập, lịch sử)
  - ⬜ Màn hình nhân viên quản lý (quản lý hội viên, thiết bị, báo cáo)
  - ⬜ Màn hình PT (danh sách học viên, lịch tập)
  - ⬜ Màn hình chủ phòng tập (dashboard, báo cáo doanh thu, nhân sự)
  - ⬜ Màn hình Admin (quản trị tài khoản)
- ⬜ Thiết kế lớp chi tiết (Class Diagram đầy đủ method/attribute)
- ⬜ ER Diagram
- ⬜ Database Design (schema chi tiết từng bảng)
- ⬜ Nộp lên Google Drive / thư mục DD

### Phase 4 — PP (Programming) — Deadline: 13/06
- ⬜ Setup project (framework, cấu trúc thư mục, DB)
- ⬜ Module Auth (đăng ký, đăng nhập, phân quyền 4 role)
- ⬜ Module Hội viên (CRUD, tìm kiếm, lịch sử)
- ⬜ Module Gói tập (CRUD, đăng ký, gia hạn, thanh toán)
- ⬜ Module Phòng & Thiết bị (CRUD, trạng thái, bảo trì)
- ⬜ Module Nhân sự / PT (quản lý, lịch làm việc)
- ⬜ Module Lịch sử tập luyện (check-in, ghi nhận buổi tập)
- ⬜ Module Phản hồi & Đánh giá
- ⬜ Module Báo cáo thống kê (doanh thu, hội viên, nhân viên)
- ⬜ Push code lên GitHub (commit thường xuyên - GV theo dõi)

### Phase 5 — UT (Unit Test) — Deadline: 13/06
- ⬜ Thiết kế test case (Excel): danh sách test cho từng use case
- ⬜ Viết unit test cho module Auth
- ⬜ Viết unit test cho module Hội viên
- ⬜ Viết unit test cho module Gói tập
- ⬜ Viết unit test cho module Báo cáo
- ⬜ Nộp file Excel test case + project test lên Google Drive / thư mục UT

### Phase 6 — GD (Good Design) — Deadline: 14/06
- ⬜ Review code, áp dụng Design Principles (SOLID, DRY, v.v.)
- ⬜ Áp dụng Design Patterns (ít nhất 2-3 patterns phù hợp)
- ⬜ Refactor code và cập nhật tài liệu thiết kế tương ứng
- ⬜ Nộp lên Google Drive / thư mục GD

---

## 5. Phân công công việc

> ⚠️ **Nhóm cần điền vào bảng này.** Mỗi thành viên phụ trách use case + code + unit test tương ứng.

| Thành viên | Use Case phụ trách | Module code | Unit Test |
|---|---|---|---|
| _(tên 1)_ | _(UC...)_ | _(module...)_ | _(test...)_ |
| _(tên 2)_ | _(UC...)_ | _(module...)_ | _(test...)_ |
| _(tên 3)_ | _(UC...)_ | _(module...)_ | _(test...)_ |
| _(tên 4)_ | _(UC...)_ | _(module...)_ | _(test...)_ |

---

## 6. Kế hoạch Sprint (Scrum)

> Thời gian còn lại: **~5 ngày** (09/06 — 14/06)

| Sprint | Thời gian | Mục tiêu | Trạng thái |
|---|---|---|---|
| Sprint 0 | 09/06 (hôm nay) | Khởi động, phân công, setup repo & tech stack | 🔄 |
| Sprint 1 | 09–10/06 | Hoàn thành RA (User story, Use case, SRS) | ⬜ |
| Sprint 2 | 10–11/06 | Hoàn thành AD + DD | ⬜ |
| Sprint 3 | 11–13/06 | Hoàn thành code (PP) + Unit Test (UT) | ⬜ |
| Sprint 4 | 13–14/06 | GD (refactor, design patterns) + kiểm tra tổng thể + nộp | ⬜ |

---

## 7. Tech Stack đề xuất

> ⚠️ **Nhóm cần thống nhất và điền vào đây.**

| Tầng | Công nghệ đề xuất | Quyết định nhóm |
|---|---|---|
| Frontend | React / Next.js / Vue / HTML-CSS-JS thuần | _(nhóm chọn)_ |
| Backend | Node.js (Express) / Spring Boot / Django / Laravel | _(nhóm chọn)_ |
| Database | MySQL / PostgreSQL / MongoDB | _(nhóm chọn)_ |
| Authentication | JWT / Session | _(nhóm chọn)_ |
| Hosting (dev) | Localhost / Docker | _(nhóm chọn)_ |
| Công cụ vẽ UML | draw.io / StarUML / PlantUML / Astah | _(nhóm chọn)_ |
| Quản lý task | GitHub Projects / Trello | _(nhóm chọn)_ |

---

## 8. Ghi chú / Quyết định nhóm

> Ghi lại các quyết định quan trọng ở đây để AI agents và thành viên khác nắm được.

### 09/06/2026
- Nhóm quyết định làm **Chủ đề 02 — Hệ thống Quản lý Phòng tập Gym**
- Chiến lược: **Code trước, tài liệu sau** (reverse engineering documentation)
- File tracker này được tạo để AI agents và các thành viên bám sát tiến độ

---

## 📎 Tài liệu tham chiếu

| File | Mô tả |
|---|---|
| [Topics-ITSS-20252.md](./Topics-ITSS-20252.md) | Danh sách toàn bộ chủ đề (đã convert từ PDF) |
| [Huong-dan-bai-tap-nhom.md](./Huong-dan-bai-tap-nhom.md) | Hướng dẫn chi tiết bài tập nhóm (đã convert từ DOCX) |
| `Topics-Phat trien phan mem ITSS-20252.pdf` | File gốc PDF đề bài |
| `Huong dan thuc hien bai tap nhom.docx` | File gốc DOCX hướng dẫn |

---

*File này được tạo tự động bởi AI Agent vào 09/06/2026. Cập nhật thường xuyên khi có tiến độ mới.*
