'use client'

import React, { useState } from 'react'
import { Lock, Eye, EyeOff, X, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { PasswordStrengthIndicator, evaluatePasswordStrength } from './PasswordStrengthIndicator'

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (message: string) => void
}

export function ChangePasswordModal({ isOpen, onClose, onSuccess }: ChangePasswordModalProps) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (!isOpen) return null

  const strength = evaluatePasswordStrength(newPassword)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!strength.isValid) {
      setErrorMessage('Mật khẩu chưa đạt tiêu chuẩn an toàn (cần tối thiểu 8 ký tự, có chữ thường, chữ hoa và ký tự đặc biệt).')
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp.')
      return
    }

    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        throw error
      }

      onSuccess('Đổi mật khẩu thành công! Hãy lưu lại mật khẩu mới.')
      onClose()
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: unknown) {
      console.error('Lỗi đổi mật khẩu:', err)
      const msg = err instanceof Error ? err.message : 'Không thể đổi mật khẩu. Vui lòng thử lại.'
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

        {/* Tiêu đề */}
        <div className="flex items-center space-x-2.5 mb-5">
          <div className="w-8 h-8 rounded-[2px] bg-[#8A6B3D]/10 flex items-center justify-center text-[#8A6B3D]">
            <KeyRound size={17} />
          </div>
          <div>
            <h3 className="font-serif text-[18px] sm:text-[20px] text-[#3A3A38] font-medium leading-tight">
              Đổi Mật Khẩu Cá Nhân
            </h3>
            <p className="text-[12px] text-[#6B6A66]">Cập nhật mật khẩu bảo vệ tài khoản quản trị</p>
          </div>
        </div>

        {/* Thông báo lỗi */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-[#BA1A1A]/10 border border-[#BA1A1A]/30 rounded-[2px] flex items-start space-x-2 text-[12px] text-[#BA1A1A]">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mật khẩu mới */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.16em] text-[#8A6B3D] font-medium mb-1.5">
              Mật khẩu mới <span className="text-[#BA1A1A]">*</span>
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#807569]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới..."
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

            {/* Bộ đo độ phức tạp mật khẩu */}
            <PasswordStrengthIndicator password={newPassword} />
          </div>

          {/* Xác nhận mật khẩu */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.16em] text-[#8A6B3D] font-medium mb-1.5">
              Xác nhận mật khẩu mới <span className="text-[#BA1A1A]">*</span>
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#807569]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới..."
                required
                className="w-full pl-9 pr-3 py-2 bg-transparent border border-[#B08D57]/40 rounded-[2px] text-[13px] text-[#3A3A38] placeholder:text-[#6B6A66]/50 focus:outline-hidden focus:border-[#8A6B3D] transition-colors"
              />
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-[11px] text-[#BA1A1A] mt-1">Mật khẩu xác nhận không khớp.</p>
            )}
            {confirmPassword && newPassword === confirmPassword && (
              <p className="text-[11px] text-[#516442] mt-1 flex items-center space-x-1">
                <CheckCircle2 size={12} className="inline mr-1" />
                <span>Mật khẩu xác nhận trùng khớp</span>
              </p>
            )}
          </div>

          {/* Nút hành động */}
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
              disabled={isLoading || !strength.isValid || newPassword !== confirmPassword}
              className="px-4 py-2 bg-[#8A6B3D] hover:bg-[#735730] text-[#FAF9F6] text-[12px] font-medium rounded-[2px] transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Đang lưu...' : 'Lưu Mật Khẩu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
