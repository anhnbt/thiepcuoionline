'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Lock, Mail, Eye, EyeOff, LogIn, ArrowLeft, AlertCircle, ShieldCheck, Sparkles } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface AdminLoginProps {
  onLoginSuccess: () => void
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('admin@namlan.wedding')
  const [password, setPassword] = useState('NamLan@2026')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email.trim() || !password) {
      setErrorMessage('Vui lòng nhập đầy đủ email và mật khẩu.')
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      if (error) {
        console.error('Lỗi đăng nhập Supabase Auth:', error)
        if (error.message.includes('Invalid login credentials')) {
          setErrorMessage('Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.')
        } else if (error.message.includes('Email not confirmed')) {
          setErrorMessage('Tài khoản email này chưa được xác nhận kích hoạt.')
        } else {
          setErrorMessage(error.message || 'Không thể đăng nhập. Vui lòng thử lại.')
        }
        setIsLoading(false)
        return
      }

      if (data?.user) {
        onLoginSuccess()
      }
    } catch (err: unknown) {
      console.error('Lỗi ngoại lệ khi đăng nhập:', err)
      setErrorMessage('Không thể kết nối đến máy chủ xác thực. Vui lòng kiểm tra lại mạng.')
      setIsLoading(false)
    }
  }

  // Nút điền nhanh tài khoản có sẵn
  const fillDefaultCredentials = () => {
    setEmail('admin@namlan.wedding')
    setPassword('NamLan@2026')
    setErrorMessage(null)
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-[#3A3A38] antialiased">
      {/* Nút quay lại trang chủ */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
        <Link
          href="/"
          className="inline-flex items-center text-[12px] font-medium text-[#8A6B3D] hover:text-[#5F7350] transition-colors"
        >
          <ArrowLeft size={14} className="mr-1" />
          <span>Quay lại trang thiệp cưới</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Card đăng nhập */}
        <div className="bg-[#FAF9F6] border border-[#B08D57] rounded-[2px] shadow-rsvp p-7 sm:p-9 relative overflow-hidden">
          {/* Họa tiết góc truyền thống theo DESIGN.md */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#B08D57]/40 pointer-events-none" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#B08D57]/40 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#B08D57]/40 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#B08D57]/40 pointer-events-none" />

          {/* Header Card */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-[#8A6B3D]/10 border border-[#8A6B3D]/30 rounded-[2px] mb-3">
              <ShieldCheck size={14} className="text-[#8A6B3D]" />
              <span className="text-[10px] uppercase tracking-wider text-[#8A6B3D] font-semibold">
                Khu Vực Quản Trị
              </span>
            </div>

            <h2 className="font-serif text-[24px] sm:text-[28px] text-[#3A3A38] font-medium leading-tight">
              Đăng Nhập Hệ Thống
            </h2>
            <p className="text-[13px] text-[#6B6A66] mt-1.5 font-light">
              Xác thực quyền quản trị để truy cập danh sách RSVP và thống kê khách mời.
            </p>
          </div>

          {/* Hộp gợi ý tài khoản có sẵn */}
          <div className="mb-6 p-3.5 bg-[#EFEEEB] border border-[#B08D57]/30 rounded-[2px] text-[12px] text-[#3A3A38] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#8A6B3D] flex items-center space-x-1">
                <Sparkles size={13} className="mr-1 inline text-[#8A6B3D]" />
                Tài khoản quản trị có sẵn:
              </span>
              <button
                type="button"
                onClick={fillDefaultCredentials}
                className="text-[11px] text-[#8A6B3D] hover:underline cursor-pointer font-medium"
              >
                Tự động điền
              </button>
            </div>
            <div className="font-mono text-[11px] text-[#6B6A66] space-y-0.5 pt-1 border-t border-[#B08D57]/20">
              <p>Email: <span className="text-[#3A3A38] font-medium">admin@namlan.wedding</span></p>
              <p>Mật khẩu: <span className="text-[#3A3A38] font-medium">NamLan@2026</span></p>
            </div>
          </div>

          {/* Form đăng nhập */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Input Email */}
            <div>
              <label className="block text-[11px] uppercase tracking-[0.18em] text-[#8A6B3D] font-medium mb-1.5">
                Email Quản Trị <span className="text-[#BA1A1A]">*</span>
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#807569]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@namlan.wedding"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-transparent border border-[#B08D57]/40 rounded-[2px] text-[14px] text-[#3A3A38] placeholder:text-[#6B6A66]/50 focus:outline-hidden focus:border-[#8A6B3D] transition-colors"
                />
              </div>
            </div>

            {/* Input Mật khẩu */}
            <div>
              <label className="block text-[11px] uppercase tracking-[0.18em] text-[#8A6B3D] font-medium mb-1.5">
                Mật Khẩu <span className="text-[#BA1A1A]">*</span>
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#807569]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-10 py-2.5 bg-transparent border border-[#B08D57]/40 rounded-[2px] text-[14px] text-[#3A3A38] placeholder:text-[#6B6A66]/50 focus:outline-hidden focus:border-[#8A6B3D] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#807569] hover:text-[#3A3A38] transition-colors cursor-pointer"
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Thông báo lỗi */}
            {errorMessage && (
              <div className="p-3 bg-[#BA1A1A]/10 border border-[#BA1A1A]/30 rounded-[2px] flex items-center space-x-2 text-[12px] text-[#BA1A1A] animate-fade-in">
                <AlertCircle size={15} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Nút bấm Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-[#8A6B3D] hover:bg-[#735730] text-[#FAF9F6] text-[13px] font-medium uppercase tracking-wider rounded-[2px] shadow-xs transition-colors cursor-pointer disabled:opacity-60"
              >
                <LogIn size={15} />
                <span>{isLoading ? 'Đang xác thực...' : 'Đăng Nhập'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
