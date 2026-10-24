# Mục Lục Tài Liệu Hướng Dẫn & Mã Nguồn (Vibe Coding Lab)

Thư mục này chứa toàn bộ tài liệu hướng dẫn kỹ thuật, đặc tả sản phẩm, và các script cơ sở dữ liệu Supabase cho dự án **Thiệp Cưới Online Nam & Lan**.

---

## 📂 Cấu Trúc Thư Mục Chuẩn

```
docs/
├── README.md                      ← Bản đồ mục lục tài liệu (File này)
├── tra-cuu-loi-supabase.md        ← Sổ tay tra cứu & khắc phục nhanh mã lỗi Supabase
├── huong-dan-tich-hop-supabase.md ← Hướng dẫn kết nối form RSVP vào Supabase
├── spec.md                        ← Đặc tả tính năng và luồng tương tác của khách mời
├── ke-hoach-quan-ly-user.md       ← Kế hoạch và thiết kế hệ thống quản trị người dùng
│
├── sql/                           ← Toàn bộ script SQL cơ sở dữ liệu Supabase
│   ├── 00-migration-tron-goi.sql  ← ⭐ Script All-in-one chạy 1 lần tự động hoàn tất 100% DB
│   ├── 01-bang-rsvp-guests.sql    ← Bước 1: Tạo bảng khách mời RSVP + RLS
│   ├── 02-bang-admin-users.sql    ← Bước 2: Tạo bảng tài khoản quản trị + RLS
│   ├── 03-bang-thong-ke-ngay.sql  ← Bước 3: Tạo bảng tổng hợp số liệu theo ngày + RLS
│   ├── 04-ham-tong-hop.sql        ← Bước 4: Tạo hàm RPC gom dữ liệu cap_nhat_thong_ke()
│   └── 05-hen-gio-cron.sql        ← Bước 5: Lên lịch hẹn giờ tự động chạy bằng pg_cron
│
└── integrations/                  ← Các tiện ích mở rộng bên ngoài Supabase
    └── apps-script-google-sheets.gs ← Cầu nối Webhook tự động ghi dữ liệu vào Google Sheets
```

---

## 🚀 Hướng Dẫn Nhanh Cho Học Viên & Giảng Viên

### Cách 1: Thiết lập cơ sở dữ liệu nhanh nhất ("Chữa bách bệnh")
1. Mở [Supabase Dashboard](https://supabase.com/dashboard) ➔ chọn dự án của bạn.
2. Vào **SQL Editor** ➔ Bấm **New query**.
3. Copy toàn bộ nội dung tệp [`docs/sql/00-migration-tron-goi.sql`](./sql/00-migration-tron-goi.sql) ➔ dán vào và bấm **RUN**.
4. Toàn bộ bảng, cột, hàm và chính sách bảo mật RLS sẽ được tự động tạo và làm mới cache.

### Cách 2: Giảng dạy theo từng bước nhỏ sư phạm
* **Bước 1**: Chạy [`01-bang-rsvp-guests.sql`](./sql/01-bang-rsvp-guests.sql) để tạo bảng phản hồi RSVP và mở quyền ghi cho khách.
* **Bước 2**: Chạy [`02-bang-admin-users.sql`](./sql/02-bang-admin-users.sql) để tạo bảng quản lý tài khoản admin.
* **Bước 3**: Chạy [`03-bang-thong-ke-ngay.sql`](./sql/03-bang-thong-ke-ngay.sql) để tạo bảng lưu báo cáo 14 ngày.
* **Bước 4**: Chạy [`04-ham-tong-hop.sql`](./sql/04-ham-tong-hop.sql) để tạo hàm RPC tự động tính toán.
* **Bước 5 (Tự động hoá)**: 
  * 👉 **BẮT BUỘC TRƯỚC TIÊN**: Vào **Supabase → Database → Extensions → Tìm "pg_cron" và BẬT** (✅ *Hoàn toàn hỗ trợ trên gói FREE!*).
  * Chạy [`05-hen-gio-cron.sql`](./sql/05-hen-gio-cron.sql) để hẹn giờ 08:00 sáng mỗi ngày tự động tổng hợp.

---

## 🛠️ Xử Lý Lỗi Thường Gặp
Khi gặp các mã lỗi như `PGRST204` (thiếu cột `guest_count`), `42501` (bị RLS chặn), `relation does not exist` hoặc bẫy `200 OK mảng rỗng`, hãy mở ngay tệp **[`tra-cuu-loi-supabase.md`](./tra-cuu-loi-supabase.md)** để tra cứu và sửa lỗi trong 5 giây.
