# Sổ Tay Tra Cứu & Khắc Phục Lỗi Supabase (Vibe Coding Lab)

> **Tài liệu dành cho Giảng viên & Học viên**: Dùng để tra cứu nhanh khi gặp lỗi trong quá trình kết nối Next.js/React với Supabase (Form RSVP, Quản trị Admin, Dashboard Thống kê).

---

## ⚡ Giải pháp nhanh nhất khi bị kẹt lỗi ("Chữa bách bệnh")

Nếu học viên bị lỗi database mà không rõ nguyên nhân (thiếu cột, thiếu quyền RLS, thiếu bảng, thiếu hàm RPC):
1. Mở [Supabase Dashboard](https://supabase.com/dashboard) ➔ chọn dự án của bạn.
2. Vào **SQL Editor** ➔ Bấm **New query**.
3. Mở tệp [`docs/sql/00-migration-tron-goi.sql`](./sql/00-migration-tron-goi.sql) trong dự án, copy toàn bộ nội dung, dán vào và bấm **RUN**.
4. Toàn bộ bảng, cột, hàm và chính sách bảo mật sẽ được tự động đồng bộ chuẩn xác 100% trong 2 giây.

---

## 🔍 Bảng Tra Cứu Mã Lỗi Nhanh

| Mã lỗi | Dấu hiệu / Thông báo | Ý nghĩa dễ hiểu | Nguyên nhân phổ biến | Cách khắc phục trong 5 giây |
|---|---|---|---|---|
| **`PGRST204`** | `Could not find the 'xyz' column of 'table' in the schema cache` | Supabase API không tìm thấy cột `xyz` trong bảng. | 1. Bảng trên Supabase thiếu cột đó (ví dụ thiếu `guest_count`).<br>2. Vừa thêm cột xong nhưng Supabase chưa kịp làm mới cache. | Chạy lệnh SQL:<br>`alter table <tên_bảng> add column if not exists <cột> <kiểu>;`<br>`notify pgrst, 'reload schema';` |
| **`42501`** | `new row violates row-level security policy for table "xyz"` | Vi phạm chính sách bảo mật dòng (RLS). | Bảng đã bật Row Level Security nhưng chưa có policy cấp quyền `INSERT` cho khách vãng lai (`public` / `anon`). | Chạy lệnh SQL:<br>`create policy "cho_phep_insert" on <bảng> for insert to public with check (true);` |
| **`PGRST205`** hoặc **`42P01`** | `relation "xyz" does not exist` | Không tìm thấy bảng trong cơ sở dữ liệu. | 1. Chưa chạy lệnh `create table`.<br>2. Gõ lệch tên bảng (ví dụ trong code gọi `rsvp_guests` nhưng trên DB đặt là `rsvps`). | Chạy lại lệnh tạo bảng trong SQL Editor hoặc kiểm tra lại tên bảng trong code. |
| **`PGRST202`** hoặc **`42883`** | `Could not find the function xyz in the schema cache` | Không tìm thấy hàm RPC trên Supabase. | Chưa chạy lệnh tạo hàm `create or replace function xyz()`. | Chạy file tạo hàm RPC tương ứng (ví dụ hàm `cap_nhat_thong_ke()`). |
| **`schema "cron" does not exist`** | `function cron.schedule(...) does not exist` hoặc `schema "cron" does not exist` | Chưa bật extension hẹn giờ tự động `pg_cron`. | Lên lịch chạy bằng `cron.schedule` khi extension `pg_cron` chưa được kích hoạt trên Supabase. | 👉 Vào **Supabase → Database → Extensions → gạt BẬT pg_cron**.<br>✅ **Bật được 100% trên gói FREE!** |
| **`200 OK` nhưng mảng `[]` rỗng** | Màn hình rỗng, không báo lỗi, mạng trả về 200 | **Bẫy RLS**: Khách không có quyền đọc dữ liệu. | Supabase mặc định không báo lỗi khi bị RLS chặn `SELECT` mà trả về mảng rỗng để bảo mật. | Chạy lệnh SQL:<br>`create policy "cho_phep_doc" on <bảng> for select to public using (true);` |
| **`401`** | `Invalid API key` hoặc `JWT expired` | Không xác thực được với Supabase. | 1. Chưa cấu hình `.env` hoặc `.env.local`.<br>2. Copy sai `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` hoặc URL. | Kiểm tra lại Project Settings → API Keys trên Supabase, dán vào `.env` rồi restart server `npm run dev`. |
| **`23505`** | `duplicate key value violates unique constraint` | Trùng khoá chính hoặc trường `unique`. | Bản ghi đã tồn tại (ví dụ email admin đã có trong bảng `admin_users` hoặc ngày đã có trong `thong_ke_ngay`). | Sử dụng cú pháp `on conflict (...) do update` hoặc nhập giá trị khác. |

---

## 🎯 4 Bẫy Kinh Điển Cần Nhớ Trong Lớp Học

### Bẫy 1: Bẫy RLS trả về mã 200 kèm mảng rỗng
* **Hiện tượng:** Mở trang Dashboard hoặc danh sách thấy trắng trơn. Bật DevTools (F12) tab Network thấy request trả về `200 OK`.
* **Cách phân biệt:** Vào Supabase SQL Editor chạy `select * from ten_bang;`. Nếu trong SQL Editor có dữ liệu mà ngoài web rỗng thì **chắc chắn 100% do RLS chặn quyền đọc**.
* **Xử lý:** Mở quyền `SELECT` cho `public` hoặc `authenticated`.

### Bẫy 2: Bẫy Schema Cache (`PGRST204`)
* **Hiện tượng:** Đã thêm cột vào bảng trên Table Editor của Supabase nhưng code vẫn báo lỗi `Could not find column in the schema cache`.
* **Nguyên nhân:** PostgREST lưu cache cấu trúc bảng trong bộ nhớ để tăng tốc truy vấn, chưa kịp cập nhật cột mới.
* **Xử lý:** Chạy lệnh `notify pgrst, 'reload schema';` trong SQL Editor để xoá cache ngay lập tức.

### Bẫy 3: Quên bật extension `pg_cron` trước khi hẹn giờ
* **Hiện tượng:** Chạy file `05-hen-gio-cron.sql` thì bị lỗi `schema "cron" does not exist`.
* **Nguyên nhân:** pg_cron là extension của PostgreSQL, phải kích hoạt bằng giao diện quản trị Supabase.
* **Xử lý:** Vào **Supabase → Database → Extensions → Tìm "pg_cron" và BẬT** (Hoàn toàn miễn phí trên gói FREE!).

### Bẫy 4: Đổi file `.env` nhưng quên khởi động lại máy chủ Dev
* **Hiện tượng:** Đã sửa đúng key trong `.env` nhưng web vẫn báo lỗi `401 Unauthorized` hoặc `supabaseUrl is required`.
* **Nguyên nhân:** Next.js chỉ nạp biến môi trường khi máy chủ bắt đầu chạy.
* **Xử lý:** Bấm `Ctrl + C` ở terminal và chạy lại `npm run dev`.
