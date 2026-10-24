-- ============================================================================
-- BƯỚC 5: HẸN GIỜ CHẠY TỰ ĐỘNG BẰNG pg_cron
-- Tệp: docs/sql/05-hen-gio-cron.sql
-- 
-- ⚠️ BẮT BUỘC TRƯỚC KHI CHẠY FILE NÀY:
-- 1. Vào Supabase Dashboard → chọn dự án của bạn.
-- 2. Vào mục Database (menu bên trái) → Extensions.
-- 3. Tìm từ khoá "pg_cron" và gạt công tắc BẬT (Toggle ON).
-- 
-- ✅ LƯU Ý CHO HỌC VIÊN: Extension pg_cron hoàn toàn BẬT ĐƯỢC TRÊN GÓI FREE!
-- ============================================================================

-- Hẹn giờ 01:00 UTC hằng ngày (tương đương 08:00 sáng giờ Việt Nam GMT+7)
select cron.schedule(
  'thong-ke-hang-ngay',
  '0 1 * * *',
  $$ select public.cap_nhat_thong_ke(); $$
);

-- Kiểm chứng công việc đã lên lịch thành công:
select jobid, jobname, schedule, active from cron.job;

-- Xem lịch sử các lần chạy tự động:
select jobid, status, return_message, start_time
from cron.job_run_details
order by start_time desc
limit 10;

-- (Tham khảo) Lệnh huỷ lịch nếu cần cấu hình lại:
-- select cron.unschedule('thong-ke-hang-ngay');

-- ----------------------------------------------------------------------------
-- DỰ PHÒNG NẾU KHÔNG DÙNG pg_cron:
-- 1. Nút "Cập nhật ngay (RPC)" trên Dashboard: Học viên hoặc chủ tiệc có thể
--    bấm nút trực tiếp trên trang quản trị để gọi hàm cap_nhat_thong_ke().
-- 2. Database Webhook: Tự động kích hoạt khi có bản ghi mới trong rsvp_guests.
-- ----------------------------------------------------------------------------
