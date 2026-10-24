-- ============================================================================
-- BƯỚC 3: TẠO BẢNG TỔNG HỢP THEO NGÀY (thong_ke_ngay)
-- Tệp: docs/sql/03-bang-thong-ke-ngay.sql
-- 
-- Vì sao cần bảng riêng thay vì đếm trực tiếp mỗi lần mở dashboard:
-- đếm trực tiếp thì mỗi lần mở trang lại quét toàn bộ bảng gốc rsvp_guests,
-- càng nhiều dữ liệu càng chậm. Bảng tổng hợp được tính sẵn một lần mỗi ngày.
-- ============================================================================

create table if not exists public.thong_ke_ngay (
  ngay          date primary key,
  so_luong      integer not null default 0,
  cap_nhat_luc  timestamptz not null default now()
);

-- Bật bảo vệ dòng dữ liệu (RLS)
alter table public.thong_ke_ngay enable row level security;

-- Cho phép đọc bảng thống kê (Select)
drop policy if exists "Cho phép đọc thống kê ngày" on public.thong_ke_ngay;
create policy "Cho phép đọc thống kê ngày"
  on public.thong_ke_ngay for select
  to public
  using (true);

-- Kiểm chứng: câu này phải trả về bảng rỗng, không báo lỗi.
select * from public.thong_ke_ngay;
