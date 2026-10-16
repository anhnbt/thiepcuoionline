'use client'

import React, { useState } from 'react'
import { KeyRound, Copy, Check, X, ShieldAlert, Sparkles, Send } from 'lucide-react'
import { AdminUser } from '@/types/admin'

interface ResetPasswordModalProps {
  user: AdminUser | null
  isOpen: boolean
  onClose: () => void
  onSuccess: (msg: string) => void
}

// Hàm sinh mật khẩu ngẫu nhiên đạt chuẩn: hoa, thường, số, ký tự đặc biệt
function generateSecurePassword(): string {
  const uppers = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const lowers = 'abcdefghijkmnpqrstuvwxyz'
  const numbers = '23456789'
  const specials = '!@#$%^&*_'

  const getRandomChar = (str: string) => str.charAt(Math.floor(Math.random() * str.length))

  const base = [
    getRandomChar(uppers),
    getRandomChar(uppers),
    getRandomChar(lowers),
    getRandomChar(lowers),
    getRandomChar(lowers),
    getRandomChar(numbers),
    getRandomChar(numbers),
    getRandomChar(specials),
  ]

  // Trộn ngẫu nhiên
  return 'NL@' + base.sort(() => Math.random() - 0.5).join('')
}

export function ResetPasswordModal({ user, isOpen, onClose, onSuccess }: ResetPasswordModalProps) {
  const [generatedPassword, setGeneratedPassword] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen || !user) return null

  const handleGenerate = () => {
    setIsLoading(true)
    setTimeout(() => {
      const pwd = generateSecurePassword()
      setGeneratedPassword(pwd)
      setIsLoading(false)
    }, 200)
  }

  const handleCopy = () => {
    if (!generatedPassword) return
    const message = `[Thiệp cưới Nam & Lan] Xin chào ${user.full_name}, mật khẩu truy cập trang quản trị của bạn đã được cấp lại:\n- Email: ${user.email}\n- Mật khẩu mới: ${generatedPassword}\n- Link đăng nhập: ${window.location.origin}/admin`
    navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
    onSuccess(`Đã sao chép thông tin đăng nhập của "${user.full_name}".`)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1C1A]/50 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-[#FAF9F6] border border-[#B08D57] rounded-[2px] shadow-xl w-full max-w-md p-6 sm:p-7 relative overflow-hidden">
        {/* Họa tiết góc */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#B08D57]/40 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#B08D57]/40 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#B08D57]/40 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#B08D57]/40 pointer-events-none" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-[#807569] hover:text-[#3A3A38] transition-colors p-1 cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Tiêu đề */}
        <div className="flex items-center space-x-2.5 mb-4">
          <div className="w-8 h-8 rounded-[2px] bg-[#8A6B3D]/10 flex items-center justify-center text-[#8A6B3D]">
            <KeyRound size={17} />
          </div>
          <div>
            <h3 className="font-serif text-[18px] sm:text-[20px] text-[#3A3A38] font-medium leading-tight">
              Cấp Lại Mật Khẩu Khẩn Cấp
            </h3>
            <p className="text-[12px] text-[#6B6A66]">Tạo mật khẩu mới cho người nhà / ban lễ tân</p>
          </div>
        </div>

        {/* Thông tin tài khoản nhận */}
        <div className="p-3 bg-[#EFEEEB] border border-[#B08D57]/20 rounded-[2px] mb-4 text-[12px] space-y-1">
          <div className="flex justify-between">
            <span className="text-[#6B6A66]">Người nhận:</span>
            <span className="font-medium text-[#3A3A38]">{user.full_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B6A66]">Email:</span>
            <span className="font-mono text-[#3A3A38]">{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex justify-between">
              <span className="text-[#6B6A66]">SĐT liên hệ:</span>
              <span className="font-mono text-[#8A6B3D] font-medium">{user.phone}</span>
            </div>
          )}
        </div>

        {/* Kết quả mật khẩu */}
        {!generatedPassword ? (
          <div className="text-center py-4 space-y-3">
            <p className="text-[13px] text-[#6B6A66]">
              Bấm nút bên dưới để tạo ngay một mật khẩu mới ngẫu nhiên và an toàn cho tài khoản này.
            </p>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-[#8A6B3D] hover:bg-[#735730] text-[#FAF9F6] text-[13px] font-medium rounded-[2px] transition-colors cursor-pointer"
            >
              <Sparkles size={15} />
              <span>{isLoading ? 'Đang tạo...' : 'Tạo Mật Khẩu Mới Ngay'}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#8A6B3D] font-semibold mb-1">
                Mật khẩu mới khởi tạo:
              </label>
              <div className="flex items-center justify-between p-3 bg-[#FAF9F6] border-2 border-[#516442]/40 rounded-[2px]">
                <span className="font-mono font-bold text-[16px] text-[#516442] tracking-wider select-all">
                  {generatedPassword}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] bg-[#516442]/10 hover:bg-[#516442]/20 text-[#516442] font-medium rounded-[2px] transition-colors cursor-pointer"
                  title="Sao chép nội dung gửi"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-[#6B6A66] leading-relaxed">
              💡 Bạn có thể bấm <strong className="text-[#3A3A38]">Sao chép</strong> để gửi nhanh tin nhắn kèm link đăng nhập cho <strong className="text-[#3A3A38]">{user.full_name}</strong> qua Zalo hoặc tin nhắn SMS.
            </p>

            <div className="flex justify-end space-x-2 pt-2 border-t border-[#B08D57]/20">
              <button
                type="button"
                onClick={() => {
                  onClose()
                  setGeneratedPassword('')
                }}
                className="px-4 py-2 text-[12px] bg-[#8A6B3D] text-[#FAF9F6] hover:bg-[#735730] rounded-[2px] transition-colors cursor-pointer"
              >
                Hoàn tất
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
