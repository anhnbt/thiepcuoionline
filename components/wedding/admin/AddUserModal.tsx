'use client'

import React, { useState } from 'react'
import { UserPlus, Mail, User, Lock, Eye, EyeOff, X, Shield, AlertCircle, Phone, Heart } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { AdminRole, AdminSide, AdminUser } from '@/types/admin'
import { PasswordStrengthIndicator, evaluatePasswordStrength } from './PasswordStrengthIndicator'

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (user: AdminUser, msg: string) => void
}

export function AddUserModal({ isOpen, onClose, onSuccess }: AddUserModalProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [side, setSide] = useState<AdminSide>('both')
  const [role, setRole] = useState<AdminRole>('viewer')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (!isOpen) return null

  const strength = evaluatePasswordStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!fullName.trim() || !email.trim()) {
      setErrorMessage('Vui lòng điền họ tên và email.')
      return
    }

    if (!strength.isValid) {
      setErrorMessage('Mật khẩu chưa đạt tiêu chuẩn (cần ít nhất 8 ký tự, chữ thường, chữ hoa và ký tự đặc biệt).')
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()

      // 1. Thêm bản ghi vào bảng admin_users
      const { data, error } = await supabase
        .from('admin_users')
        .insert([
          {
            email: email.trim().toLowerCase(),
            full_name: fullName.trim(),
            phone: phone.trim() || null,
            side: side,
            role: role,
            status: 'active',
          },
        ])
        .select()
        .single()

      if (error) {
        if (error.code === '23505') {
          throw new Error('Email này đã tồn tại trong danh sách người dùng.')
        }
        throw error
      }

      onSuccess(
        data as AdminUser,
        `Đã tạo tài khoản "${fullName.trim()}" thành công với vai trò ${role === 'admin' ? 'Quản trị viên' : 'Chỉ xem'}.`
      )
      onClose()
      setFullName('')
      setEmail('')
      setPhone('')
      setSide('both')
      setPassword('')
      setRole('viewer')
    } catch (err: unknown) {
      console.error('Lỗi khi thêm người dùng:', err)
      const msg = err instanceof Error ? err.message : 'Không thể tạo tài khoản. Vui lòng kiểm tra lại quyền truy cập.'
      setErrorMessage(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1C1A]/50 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-[#FAF9F6] border border-[#B08D57] rounded-[2px] shadow-xl w-full max-w-md p-6 sm:p-7 relative overflow-hidden">
        {/* Họa tiết góc truyền thống theo DESIGN.md */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#B08D57]/40 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#B08D57]/40 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#B08D57]/40 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#B08D57]/40 pointer-events-none" />

        {/* Nút đóng */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-[#807569] hover:text-[#3A3A38] transition-colors p-1 cursor-pointer"
          title="Đóng modal"
        >
          <X size={18} />
        </button>

        {/* Header modal */}
        <div className="flex items-center space-x-2.5 mb-5">
          <div className="w-8 h-8 rounded-[2px] bg-[#8A6B3D]/10 flex items-center justify-center text-[#8A6B3D]">
            <UserPlus size={17} />
          </div>
          <div>
            <h3 className="font-serif text-[18px] sm:text-[20px] text-[#3A3A38] font-medium leading-tight">
              Thêm Người Dùng Mới
            </h3>
            <p className="text-[12px] text-[#6B6A66]">Cấp quyền truy cập hệ thống quản trị thiệp cưới</p>
          </div>
        </div>

        {/* Thông báo lỗi nếu có */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-[#BA1A1A]/10 border border-[#BA1A1A]/30 rounded-[2px] flex items-start space-x-2 text-[12px] text-[#BA1A1A]">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Họ và tên */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.16em] text-[#8A6B3D] font-medium mb-1.5">
              Họ và tên <span className="text-[#BA1A1A]">*</span>
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#807569]" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="VD: Nguyễn Văn A (Đón khách)"
                required
                className="w-full pl-9 pr-3 py-2 bg-transparent border border-[#B08D57]/40 rounded-[2px] text-[13px] text-[#3A3A38] placeholder:text-[#6B6A66]/50 focus:outline-hidden focus:border-[#8A6B3D] transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.16em] text-[#8A6B3D] font-medium mb-1.5">
              Email đăng nhập <span className="text-[#BA1A1A]">*</span>
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#807569]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="w-full pl-9 pr-3 py-2 bg-transparent border border-[#B08D57]/40 rounded-[2px] text-[13px] text-[#3A3A38] placeholder:text-[#6B6A66]/50 focus:outline-hidden focus:border-[#8A6B3D] transition-colors"
              />
            </div>
          </div>

          {/* Số điện thoại liên hệ */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.16em] text-[#8A6B3D] font-medium mb-1.5">
              Số điện thoại liên hệ
            </label>
            <div className="relative">
              <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#807569]" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="VD: 0912 345 678"
                className="w-full pl-9 pr-3 py-2 bg-transparent border border-[#B08D57]/40 rounded-[2px] text-[13px] text-[#3A3A38] placeholder:text-[#6B6A66]/50 focus:outline-hidden focus:border-[#8A6B3D] transition-colors"
              />
            </div>
          </div>

          {/* Phía đại diện (Nhà Trai / Nhà Gái / Chung) */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.16em] text-[#8A6B3D] font-medium mb-1.5">
              Đại diện họ hàng <span className="text-[#BA1A1A]">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSide('groom')}
                className={`py-2 px-1 text-center border rounded-[2px] transition-colors cursor-pointer ${
                  side === 'groom'
                    ? 'border-[#516442] bg-[#516442]/10 text-[#516442] font-semibold'
                    : 'border-[#B08D57]/30 text-[#6B6A66] hover:border-[#B08D57]/60'
                }`}
              >
                <span className="block text-[11px]">Nhà Trai</span>
              </button>
              <button
                type="button"
                onClick={() => setSide('bride')}
                className={`py-2 px-1 text-center border rounded-[2px] transition-colors cursor-pointer ${
                  side === 'bride'
                    ? 'border-[#8A6B3D] bg-[#8A6B3D]/10 text-[#8A6B3D] font-semibold'
                    : 'border-[#B08D57]/30 text-[#6B6A66] hover:border-[#B08D57]/60'
                }`}
              >
                <span className="block text-[11px]">Nhà Gái</span>
              </button>
              <button
                type="button"
                onClick={() => setSide('both')}
                className={`py-2 px-1 text-center border rounded-[2px] transition-colors cursor-pointer ${
                  side === 'both'
                    ? 'border-[#3A3A38] bg-[#3A3A38]/10 text-[#3A3A38] font-semibold'
                    : 'border-[#B08D57]/30 text-[#6B6A66] hover:border-[#B08D57]/60'
                }`}
              >
                <span className="block text-[11px]">Ban Lễ Tân</span>
              </button>
            </div>
          </div>

          {/* Vai trò */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.16em] text-[#8A6B3D] font-medium mb-1.5">
              Phân quyền <span className="text-[#BA1A1A]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label
                className={`flex items-start p-2.5 border rounded-[2px] cursor-pointer transition-colors ${
                  role === 'admin'
                    ? 'border-[#8A6B3D] bg-[#8A6B3D]/5 text-[#3A3A38]'
                    : 'border-[#B08D57]/30 hover:border-[#B08D57]/60'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={() => setRole('admin')}
                  className="mt-0.5 text-[#8A6B3D] focus:ring-0"
                />
                <div className="ml-2">
                  <span className="block text-[12px] font-medium text-[#3A3A38]">Quản trị viên</span>
                  <span className="block text-[10px] text-[#6B6A66] leading-tight mt-0.5">
                    Toàn quyền RSVP và tài khoản
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start p-2.5 border rounded-[2px] cursor-pointer transition-colors ${
                  role === 'viewer'
                    ? 'border-[#8A6B3D] bg-[#8A6B3D]/5 text-[#3A3A38]'
                    : 'border-[#B08D57]/30 hover:border-[#B08D57]/60'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="viewer"
                  checked={role === 'viewer'}
                  onChange={() => setRole('viewer')}
                  className="mt-0.5 text-[#8A6B3D] focus:ring-0"
                />
                <div className="ml-2">
                  <span className="block text-[12px] font-medium text-[#3A3A38]">Chỉ xem</span>
                  <span className="block text-[10px] text-[#6B6A66] leading-tight mt-0.5">
                    Chỉ xem danh sách & thống kê
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Mật khẩu khởi tạo */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.16em] text-[#8A6B3D] font-medium mb-1.5">
              Mật khẩu khởi tạo <span className="text-[#BA1A1A]">*</span>
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#807569]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 8 ký tự..."
                required
                className="w-full pl-9 pr-10 py-2 bg-transparent border border-[#B08D57]/40 rounded-[2px] text-[13px] text-[#3A3A38] placeholder:text-[#6B6A66]/50 focus:outline-hidden focus:border-[#8A6B3D] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#807569] hover:text-[#3A3A38] cursor-pointer"
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Đo độ phức tạp mật khẩu */}
            <PasswordStrengthIndicator password={password} />
          </div>

          {/* Nút submit */}
          <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-[#B08D57]/20">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-[12px] text-[#6B6A66] hover:text-[#3A3A38] border border-[#B08D57]/30 rounded-[2px] transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading || !strength.isValid}
              className="px-4 py-2 bg-[#8A6B3D] hover:bg-[#735730] text-[#FAF9F6] text-[12px] font-medium rounded-[2px] transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Đang tạo...' : 'Tạo Tài Khoản'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
