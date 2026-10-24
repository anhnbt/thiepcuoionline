-- ============================================================================
-- BƯỚC 2: TẠO BẢNG QUẢN TRỊ TÀI KHOẢN (admin_users) & PHÂN QUYỀN
-- Tệp: docs/sql/02-bang-admin-users.sql
-- ============================================================================

create table if not exists public.admin_users (
  id uuid default gen_random_uuid() primary key,
  auth_id uuid references auth.users(id) on delete set null,
  email text not null unique,
  full_name text not null,
  phone text,
  side text not null default 'both' check (side in ('groom', 'bride', 'both')),
  role text not null default 'viewer' check (role in ('admin', 'viewer')),
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Kích hoạt Row Level Security (RLS)
alter table public.admin_users enable row level security;

-- Cho phép người dùng đã đăng nhập (authenticated) xem danh sách người dùng
drop policy if exists "Cho phép tài khoản đăng nhập xem danh sách admin" on public.admin_users;
create policy "Cho phép tài khoản đăng nhập xem danh sách admin"
  on public.admin_users for select
  to authenticated
  using (true);

-- Cho phép tài khoản đã đăng nhập thực hiện thêm/sửa/cập nhật người dùng
drop policy if exists "Cho phép tài khoản đăng nhập thao tác bảng admin_users" on public.admin_users;
create policy "Cho phép tài khoản đăng nhập thao tác bảng admin_users"
  on public.admin_users for all
  to authenticated
  using (true)
  with check (true);

-- Thêm tài khoản admin mặc định ban đầu
insert into public.admin_users (email, full_name, role, status)
values ('namlan2026@gmail.com', 'Nam & Lan (Chủ tiệc)', 'admin', 'active')
on conflict (email) do update 
set full_name = excluded.full_name,
    role = excluded.role,
    status = excluded.status;
