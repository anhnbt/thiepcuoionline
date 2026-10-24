-- ============================================================================
-- BƯỚC 4: HÀM TỔNG HỢP DỮ LIỆU RPC (cap_nhat_thong_ke)
-- Tệp: docs/sql/04-ham-tong-hop.sql
-- 
-- Gom nhóm số lượng khách mời từ bảng rsvp_guests theo từng ngày
-- và lưu vào bảng thong_ke_ngay.
-- ============================================================================

create or replace function public.cap_nhat_thong_ke()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.thong_ke_ngay (ngay, so_luong, cap_nhat_luc)
  select
    created_at::date      as ngay,
    count(*)              as so_luong,
    now()                 as cap_nhat_luc
  from public.rsvp_guests
  group by created_at::date
  on conflict (ngay) do update
    set so_luong     = excluded.so_luong,
        cap_nhat_luc = excluded.cap_nhat_luc;
end;
$$;

-- Kiểm chứng ngay sau khi tạo hàm:
select public.cap_nhat_thong_ke();
select * from public.thong_ke_ngay order by ngay desc;
