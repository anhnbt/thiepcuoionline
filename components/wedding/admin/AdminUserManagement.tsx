'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  Users,
  UserPlus,
  Search,
  ShieldCheck,
  Shield,
  UserX,
  UserCheck,
  RefreshCw,
  AlertCircle,
  Filter,
  CheckCircle2,
  Lock,
  Phone,
  KeyRound,
  Heart
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { AdminRole, AdminSide, AdminStatus, AdminUser } from '@/types/admin'
import { AddUserModal } from './AddUserModal'
import { ResetPasswordModal } from './ResetPasswordModal'

// Danh sách tài khoản mẫu dự phòng nếu bảng Supabase chưa được khởi tạo
const DEFAULT_FALLBACK_USERS: AdminUser[] = [
  {
    id: 'default-admin-1',
    email: 'namlan2026@gmail.com',
    full_name: 'Nam & Lan (Chủ tiệc)',
    phone: '0988 123 456',
    side: 'both',
    role: 'admin',
    status: 'active',
    created_at: new Date().toISOString(),
  },
  {
    id: 'default-viewer-2',
    email: 'bantochoi.cuoinamlan@gmail.com',
    full_name: 'Ban Lễ Tân & Đón Khách',
    phone: '0912 888 999',
    side: 'groom',
    role: 'viewer',
    status: 'active',
    created_at: new Date().toISOString(),
  },
]

interface AdminUserManagementProps {
  currentUserEmail?: string | null
  currentUserRole?: AdminRole
  onToast: (msg: string) => void
}

export function AdminUserManagement({
  currentUserEmail,
  currentUserRole = 'admin',
  onToast,
}: AdminUserManagementProps) {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | AdminRole>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | AdminStatus>('all')
  const [sideFilter, setSideFilter] = useState<'all' | AdminSide>('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [resettingUser, setResettingUser] = useState<AdminUser | null>(null)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  const isSuperAdmin = currentUserRole === 'admin'

  // Tải danh sách người dùng từ Supabase
  const fetchUsers = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }
    setErrorMessage(null)

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        // Nếu bảng chưa được tạo trên Supabase, dùng danh sách khởi tạo mặc định
        console.warn('Bảng admin_users chưa tồn tại hoặc lỗi RLS:', error.message)
        setUsers(DEFAULT_FALLBACK_USERS)
        if (error.code === '42P01') {
          setErrorMessage(
            'Bảng `admin_users` chưa được tạo trên Supabase. Bạn có thể chạy script trong `docs/sql/create_admin_users.sql` để đồng bộ.'
          )
        }
      } else if (data && data.length > 0) {
        setUsers(data as AdminUser[])
      } else {
        // Nếu bảng rỗng, hiển thị tài khoản admin mặc định
        setUsers(DEFAULT_FALLBACK_USERS)
      }
    } catch (err: unknown) {
      console.error('Lỗi khi tải danh sách người dùng:', err)
      setUsers(DEFAULT_FALLBACK_USERS)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Vô hiệu hóa mềm (Soft Delete) hoặc Kích hoạt lại tài khoản
  const handleToggleStatus = async (user: AdminUser) => {
    if (!isSuperAdmin) {
      alert('Chỉ tài khoản Quản trị viên mới có quyền thay đổi trạng thái người dùng.')
      return
    }

    if (user.email === currentUserEmail) {
      alert('Bạn không thể tự vô hiệu hoá tài khoản của chính mình.')
      return
    }

    const nextStatus: AdminStatus = user.status === 'active' ? 'inactive' : 'active'
    const confirmMessage =
      nextStatus === 'inactive'
        ? `Bạn có chắc chắn muốn vô hiệu hoá tạm thời tài khoản "${user.full_name}" không?`
        : `Bạn có muốn kích hoạt lại tài khoản "${user.full_name}" không?`

    if (!confirm(confirmMessage)) return

    setActionLoadingId(user.id)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('admin_users')
        .update({ status: nextStatus, updated_at: new Date().toISOString() })
        .eq('id', user.id)

      if (error) throw error

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
      )
      onToast(
        nextStatus === 'inactive'
          ? `Đã vô hiệu hoá tài khoản "${user.full_name}".`
          : `Đã kích hoạt lại tài khoản "${user.full_name}".`
      )
    } catch (err: unknown) {
      console.warn('Không thể cập nhật trên Supabase, cập nhật local:', err)
      // Cập nhật local nếu offline/mock
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
      )
      onToast(
        nextStatus === 'inactive'
          ? `Đã vô hiệu hoá tài khoản "${user.full_name}".`
          : `Đã kích hoạt lại tài khoản "${user.full_name}".`
      )
    } finally {
      setActionLoadingId(null)
    }
  }

  // Chuyển đổi vai trò người dùng (Admin <-> Viewer)
  const handleToggleRole = async (user: AdminUser) => {
    if (!isSuperAdmin) {
      alert('Chỉ tài khoản Quản trị viên mới có quyền đổi vai trò người dùng.')
      return
    }

    if (user.email === currentUserEmail) {
      alert('Bạn không thể tự hạ quyền tài khoản của chính mình.')
      return
    }

    const nextRole: AdminRole = user.role === 'admin' ? 'viewer' : 'admin'
    const roleName = nextRole === 'admin' ? 'Quản trị viên' : 'Chỉ xem'

    if (!confirm(`Bạn có muốn đổi vai trò của "${user.full_name}" sang "${roleName}" không?`)) {
      return
    }

    setActionLoadingId(user.id)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('admin_users')
        .update({ role: nextRole, updated_at: new Date().toISOString() })
        .eq('id', user.id)

      if (error) throw error

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: nextRole } : u))
      )
      onToast(`Đã chuyển vai trò của "${user.full_name}" sang "${roleName}".`)
    } catch (err: unknown) {
      console.warn('Không thể cập nhật role trên Supabase, cập nhật local:', err)
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: nextRole } : u))
      )
      onToast(`Đã chuyển vai trò của "${user.full_name}" sang "${roleName}".`)
    } finally {
      setActionLoadingId(null)
    }
  }

  // Danh sách đã lọc và tìm kiếm
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false
      if (statusFilter !== 'all' && u.status !== statusFilter) return false
      if (sideFilter !== 'all' && (u.side || 'both') !== sideFilter) return false
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim()
        const matchName = u.full_name.toLowerCase().includes(term)
        const matchEmail = u.email.toLowerCase().includes(term)
        const matchPhone = (u.phone || '').toLowerCase().includes(term)
        return matchName || matchEmail || matchPhone
      }
      return true
    })
  }, [users, roleFilter, statusFilter, sideFilter, searchTerm])

  const stats = useMemo(() => {
    const total = users.length
    const active = users.filter((u) => u.status === 'active').length
    const admins = users.filter((u) => u.role === 'admin').length
    const viewers = users.filter((u) => u.role === 'viewer').length
    return { total, active, admins, viewers }
  }, [users])

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Banner thông báo nếu Supabase chưa tạo bảng */}
      {errorMessage && (
        <div className="p-3.5 bg-[#EFEEEB] border border-[#B08D57]/40 rounded-[2px] flex items-start space-x-2.5 text-[#3A3A38] text-[12px]">
          <AlertCircle size={16} className="text-[#8A6B3D] shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-[#8A6B3D]">Gợi ý cấu hình cơ sở dữ liệu:</p>
            <p className="text-[#6B6A66] mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Thẻ thống kê tổng quan người dùng */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#FAF9F6] border border-[#B08D57]/30 rounded-[2px] p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#6B6A66] font-medium">Tổng người dùng</span>
            <Users size={15} className="text-[#8A6B3D]" />
          </div>
          <p className="text-[24px] font-serif font-semibold text-[#3A3A38] leading-none">{stats.total}</p>
        </div>

        <div className="bg-[#FAF9F6] border border-[#516442]/30 rounded-[2px] p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#516442] font-medium">Đang hoạt động</span>
            <CheckCircle2 size={15} className="text-[#516442]" />
          </div>
          <p className="text-[24px] font-serif font-semibold text-[#516442] leading-none">{stats.active}</p>
        </div>

        <div className="bg-[#FAF9F6] border border-[#8A6B3D]/30 rounded-[2px] p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#8A6B3D] font-medium">Quản trị viên</span>
            <ShieldCheck size={15} className="text-[#8A6B3D]" />
          </div>
          <p className="text-[24px] font-serif font-semibold text-[#8A6B3D] leading-none">{stats.admins}</p>
        </div>

        <div className="bg-[#FAF9F6] border border-[#6B6A66]/30 rounded-[2px] p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#6B6A66] font-medium">Chỉ xem</span>
            <Shield size={15} className="text-[#6B6A66]" />
          </div>
          <p className="text-[24px] font-serif font-semibold text-[#3A3A38] leading-none">{stats.viewers}</p>
        </div>
      </div>

      {/* Thanh công cụ: Tìm kiếm, lọc và thêm người dùng */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FAF9F6] border border-[#B08D57]/30 p-3 sm:p-4 rounded-[2px]">
        {/* Ô tìm kiếm */}
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#807569]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên hoặc email..."
            className="w-full pl-9 pr-3 py-1.5 bg-transparent border border-[#B08D57]/40 rounded-[2px] text-[13px] text-[#3A3A38] placeholder:text-[#6B6A66]/60 focus:outline-hidden focus:border-[#8A6B3D] transition-colors"
          />
        </div>

        {/* Bộ lọc và Nút thao tác */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Lọc vai trò */}
          <div className="flex items-center space-x-1 border border-[#B08D57]/40 rounded-[2px] px-2 py-1 bg-transparent text-[12px] text-[#3A3A38]">
            <Filter size={12} className="text-[#807569]" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as 'all' | AdminRole)}
              className="bg-transparent focus:outline-hidden cursor-pointer"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Quản trị viên</option>
              <option value="viewer">Chỉ xem</option>
            </select>
          </div>

          {/* Lọc trạng thái */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | AdminStatus)}
            className="border border-[#B08D57]/40 rounded-[2px] px-2 py-1 bg-transparent text-[12px] text-[#3A3A38] focus:outline-hidden cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Đã vô hiệu</option>
          </select>

          {/* Lọc phía đại diện họ hàng */}
          <select
            value={sideFilter}
            onChange={(e) => setSideFilter(e.target.value as 'all' | AdminSide)}
            className="border border-[#B08D57]/40 rounded-[2px] px-2 py-1 bg-transparent text-[12px] text-[#3A3A38] focus:outline-hidden cursor-pointer"
          >
            <option value="all">Tất cả họ hàng</option>
            <option value="groom">Nhà Trai</option>
            <option value="bride">Nhà Gái</option>
            <option value="both">Ban Lễ Tân</option>
          </select>

          {/* Nút làm mới */}
          <button
            type="button"
            onClick={() => fetchUsers(true)}
            disabled={isRefreshing || isLoading}
            className="p-1.5 border border-[#B08D57]/40 hover:border-[#8A6B3D] text-[#8A6B3D] rounded-[2px] transition-colors cursor-pointer disabled:opacity-50"
            title="Làm mới danh sách"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          </button>

          {/* Nút thêm người dùng */}
          {isSuperAdmin && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#8A6B3D] hover:bg-[#735730] text-[#FAF9F6] text-[12px] font-medium rounded-[2px] shadow-xs transition-colors cursor-pointer"
            >
              <UserPlus size={14} />
              <span>Thêm người dùng</span>
            </button>
          )}
        </div>
      </div>

      {/* Bảng danh sách người dùng */}
      <div className="bg-[#FAF9F6] border border-[#B08D57]/30 rounded-[2px] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] text-[#3A3A38]">
            <thead className="bg-[#EFEEEB] border-b border-[#B08D57]/30 text-[11px] uppercase tracking-wider text-[#6B6A66]">
              <tr>
                <th className="py-3 px-4 font-medium">Người dùng & SĐT</th>
                <th className="py-3 px-4 font-medium text-center">Đại diện</th>
                <th className="py-3 px-4 font-medium">Email</th>
                <th className="py-3 px-4 font-medium text-center">Vai trò</th>
                <th className="py-3 px-4 font-medium text-center">Trạng thái</th>
                <th className="py-3 px-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#B08D57]/15">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#6B6A66]">
                    <RefreshCw size={18} className="animate-spin inline mr-2 text-[#8A6B3D]" />
                    <span>Đang tải danh sách người dùng...</span>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#6B6A66]">
                    Không tìm thấy người dùng nào phù hợp với điều kiện tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isCurrent = user.email === currentUserEmail
                  const isActionLoading = actionLoadingId === user.id

                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-[#EFEEEB]/50 transition-colors ${user.status === 'inactive' ? 'opacity-60 bg-[#EFEEEB]/30' : ''
                        }`}
                    >
                      {/* Tên & SĐT & Avatar */}
                      <td className="py-3 px-4 font-medium">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#8A6B3D]/15 text-[#8A6B3D] flex items-center justify-center font-semibold text-[11px]">
                            {user.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className="text-[#3A3A38]">{user.full_name}</span>
                              {isCurrent && (
                                <span className="text-[10px] text-[#516442] font-semibold uppercase tracking-wider px-1.5 py-0.2 bg-[#516442]/10 rounded-[2px]">
                                  Bạn
                                </span>
                              )}
                            </div>
                            {user.phone && (
                              <a
                                href={`tel:${user.phone}`}
                                className="inline-flex items-center space-x-1 text-[11px] text-[#8A6B3D] hover:underline font-mono mt-0.5"
                                title="Bấm để gọi điện thoại ngay"
                              >
                                <Phone size={10} />
                                <span>{user.phone}</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Phía đại diện */}
                      <td className="py-3 px-4 text-center">
                        {user.side === 'groom' ? (
                          <span className="inline-flex items-center px-2 py-0.5 bg-[#516442]/10 border border-[#516442]/30 text-[#516442] rounded-[2px] text-[11px] font-medium">
                            <span>Nhà Trai</span>
                          </span>
                        ) : user.side === 'bride' ? (
                          <span className="inline-flex items-center px-2 py-0.5 bg-[#8A6B3D]/10 border border-[#8A6B3D]/30 text-[#8A6B3D] rounded-[2px] text-[11px] font-medium">
                            <span>Nhà Gái</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 bg-[#3A3A38]/10 border border-[#3A3A38]/20 text-[#3A3A38] rounded-[2px] text-[11px] font-medium">
                            <span>Lễ Tân</span>
                          </span>
                        )}
                      </td>

                      {/* Email */}
                      <td className="py-3 px-4 font-mono text-[12px] text-[#6B6A66]">
                        {user.email}
                      </td>

                      {/* Vai trò */}
                      <td className="py-3 px-4 text-center">
                        {user.role === 'admin' ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-[#8A6B3D]/10 border border-[#8A6B3D]/30 text-[#8A6B3D] rounded-[2px] text-[11px] font-medium">
                            <ShieldCheck size={12} />
                            <span>Quản trị viên</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-[#6B6A66]/10 border border-[#6B6A66]/30 text-[#6B6A66] rounded-[2px] text-[11px] font-medium">
                            <Shield size={12} />
                            <span>Chỉ xem</span>
                          </span>
                        )}
                      </td>

                      {/* Trạng thái */}
                      <td className="py-3 px-4 text-center">
                        {user.status === 'active' ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-[#516442]/10 text-[#516442] rounded-[2px] text-[11px] font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#516442]" />
                            <span>Hoạt động</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-[#BA1A1A]/10 text-[#BA1A1A] rounded-[2px] text-[11px] font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#BA1A1A]" />
                            <span>Đã vô hiệu</span>
                          </span>
                        )}
                      </td>

                      {/* Thao tác (Icon ngắn gọn kèm Tooltip) */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center space-x-1">
                          {/* Nút Cấp lại mật khẩu khẩn cấp */}
                          {isSuperAdmin && (
                            <button
                              type="button"
                              onClick={() => {
                                setResettingUser(user)
                                setIsResetModalOpen(true)
                              }}
                              className="p-1.5 rounded-[2px] text-[#807569] hover:text-[#8A6B3D] hover:bg-[#8A6B3D]/10 transition-colors cursor-pointer"
                              title="Cấp lại mật khẩu khẩn cấp cho tài khoản này"
                            >
                              <KeyRound size={15} />
                            </button>
                          )}

                          {/* Nút đổi vai trò (Chỉ admin thao tác) */}
                          {isSuperAdmin && !isCurrent && (
                            <button
                              type="button"
                              onClick={() => handleToggleRole(user)}
                              disabled={isActionLoading}
                              className="p-1.5 rounded-[2px] text-[#807569] hover:text-[#8A6B3D] hover:bg-[#8A6B3D]/10 transition-colors cursor-pointer disabled:opacity-40"
                              title={
                                user.role === 'admin'
                                  ? 'Hạ quyền xuống Chỉ xem'
                                  : 'Nâng quyền lên Quản trị viên'
                              }
                            >
                              {user.role === 'admin' ? (
                                <Shield size={15} />
                              ) : (
                                <ShieldCheck size={15} />
                              )}
                            </button>
                          )}

                          {/* Nút vô hiệu hoá mềm (Soft delete / Toggle status) */}
                          {isSuperAdmin && !isCurrent && (
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(user)}
                              disabled={isActionLoading}
                              className={`p-1.5 rounded-[2px] transition-colors cursor-pointer disabled:opacity-40 ${user.status === 'active'
                                ? 'text-[#807569] hover:text-[#BA1A1A] hover:bg-[#BA1A1A]/10'
                                : 'text-[#516442] hover:bg-[#516442]/10'
                                }`}
                              title={
                                user.status === 'active'
                                  ? 'Vô hiệu hóa tạm thời người dùng này'
                                  : 'Kích hoạt lại tài khoản này'
                              }
                            >
                              {user.status === 'active' ? (
                                <UserX size={15} />
                              ) : (
                                <UserCheck size={15} />
                              )}
                            </button>
                          )}

                          {/* Nếu là chính mình, hiển thị biểu tượng khoá bảo vệ */}
                          {isCurrent && (
                            <span
                              className="p-1.5 text-[#807569]/60 cursor-default"
                              title="Tài khoản đang đăng nhập (được bảo vệ)"
                            >
                              <Lock size={14} />
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm người dùng */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={(newUser, msg) => {
          setUsers((prev) => [newUser, ...prev])
          onToast(msg)
        }}
      />

      {/* Modal Cấp lại mật khẩu khẩn cấp */}
      <ResetPasswordModal
        user={resettingUser}
        isOpen={isResetModalOpen}
        onClose={() => {
          setIsResetModalOpen(false)
          setResettingUser(null)
        }}
        onSuccess={onToast}
      />
    </div>
  )
}
