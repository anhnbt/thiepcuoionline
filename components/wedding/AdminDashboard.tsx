'use client'

import React, { useState, useEffect, useMemo, useTransition } from 'react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'
import {
  Users,
  UserCheck,
  UserX,
  Heart,
  Percent,
  RefreshCw,
  Download,
  Search,
  Phone,
  Clock,
  MessageSquare,
  Trash2,
  ArrowLeft,
  AlertCircle,
  Filter,
  CheckCircle2,
  Calendar,
  Sparkles,
  LogOut
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { SupabaseRsvpGuest } from '@/types/rsvp'
import { AdminLogin } from '@/components/wedding/AdminLogin'

export function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isAuthChecking, setIsAuthChecking] = useState(true)
  const [guests, setGuests] = useState<SupabaseRsvpGuest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'yes' | 'no'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  // Kiểm tra phiên đăng nhập Supabase Auth
  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user)
      setIsAuthChecking(false)
      if (user) {
        fetchGuests()
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null
      setCurrentUser(user)
      if (user) {
        fetchGuests()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Hàm tải dữ liệu từ Supabase
  const fetchGuests = async (showRefreshingIndicator = false) => {
    if (showRefreshingIndicator) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }
    setErrorMessage(null)

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('rsvp_guests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setGuests(data || [])
    } catch (err: unknown) {
      console.error('Lỗi khi tải danh sách RSVP từ Supabase:', err)
      const message = err instanceof Error ? err.message : 'Không thể kết nối đến cơ sở dữ liệu Supabase.'
      setErrorMessage(message)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  // Đăng xuất khỏi hệ thống
  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      setCurrentUser(null)
      showToast('Đã đăng xuất khỏi tài khoản quản trị.')
    } catch (err) {
      console.error('Lỗi đăng xuất:', err)
    }
  }

  // Thông báo toast tạm thời
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  // Thao tác xoá khách mời khỏi cơ sở dữ liệu
  const handleDeleteGuest = async (id: number, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xoá phản hồi của khách "${name}" không? Thao tác này sẽ xoá trực tiếp trên Supabase.`)) {
      return
    }

    setDeletingId(id)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('rsvp_guests').delete().eq('id', id)

      if (error) {
        throw error
      }

      // Cập nhật danh sách local
      setGuests((prev) => prev.filter((g) => g.id !== id))
      showToast(`Đã xoá thành công phản hồi của khách "${name}".`)
    } catch (err: unknown) {
      console.error('Lỗi khi xoá khách:', err)
      alert('Không thể xoá phản hồi này. Vui lòng kiểm tra lại quyền truy cập hoặc kết nối mạng.')
    } finally {
      setDeletingId(null)
    }
  }

  // Xuất file CSV hỗ trợ tiếng Việt (UTF-8 BOM)
  const handleExportCSV = () => {
    if (guests.length === 0) {
      alert('Chưa có dữ liệu để xuất file.')
      return
    }

    const headers = ['STT', 'Họ và tên', 'Số điện thoại', 'Trạng thái', 'Số lượng người', 'Lời chúc', 'Thời gian gửi']
    const rows = guests.map((g, idx) => {
      const statusText = g.status === 'yes' ? 'Tham dự' : 'Không thể đến'
      const count = g.status === 'yes' ? (g.guest_count ?? 1) : 0
      const wishesClean = (g.wishes || '').replace(/"/g, '""')
      const formattedDate = new Date(g.created_at).toLocaleString('vi-VN')

      return [
        idx + 1,
        `"${g.guest_name}"`,
        `"${g.phone}"`,
        `"${statusText}"`,
        count,
        `"${wishesClean}"`,
        `"${formattedDate}"`,
      ]
    })

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `danh_sach_rsvp_nam_lan_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Đã xuất file CSV thành công!')
  }

  // Thống kê số liệu
  const stats = useMemo(() => {
    const totalResponses = guests.length
    const attendingResponses = guests.filter((g) => g.status === 'yes')
    const totalAttendingGuests = attendingResponses.reduce(
      (sum, g) => sum + (Number(g.guest_count) || 1),
      0
    )
    const totalDeclined = guests.filter((g) => g.status === 'no').length
    const attendanceRate = totalResponses > 0 ? Math.round((attendingResponses.length / totalResponses) * 100) : 0
    const wishesCount = guests.filter((g) => g.wishes && g.wishes.trim().length > 0).length

    return {
      totalResponses,
      totalAttendingGuests,
      attendingResponsesCount: attendingResponses.length,
      totalDeclined,
      attendanceRate,
      wishesCount,
    }
  }, [guests])

  // Lọc và sắp xếp danh sách
  const filteredAndSortedGuests = useMemo(() => {
    return guests
      .filter((guest) => {
        // Lọc theo trạng thái
        if (statusFilter !== 'all' && guest.status !== statusFilter) {
          return false
        }

        // Lọc theo từ khoá tìm kiếm
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase().trim()
          const nameMatch = guest.guest_name.toLowerCase().includes(term)
          const phoneMatch = guest.phone.toLowerCase().includes(term)
          const wishesMatch = (guest.wishes || '').toLowerCase().includes(term)
          return nameMatch || phoneMatch || wishesMatch
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        }
        if (sortBy === 'oldest') {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        }
        if (sortBy === 'name') {
          return a.guest_name.localeCompare(b.guest_name, 'vi')
        }
        return 0
      })
  }, [guests, statusFilter, searchTerm, sortBy])

  // Định dạng ngày giờ thân thiện
  const formatDateTime = (isoString: string) => {
    try {
      const date = new Date(isoString)
      return date.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    } catch {
      return isoString
    }
  }

  // Khi đang kiểm tra trạng thái đăng nhập
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center font-sans text-[#3A3A38]">
        <RefreshCw size={28} className="animate-spin text-[#8A6B3D] mb-3" />
        <p className="text-[13px] text-[#6B6A66]">Đang kiểm tra quyền quản trị...</p>
      </div>
    )
  }

  // Khi chưa đăng nhập -> hiển thị form đăng nhập
  if (!currentUser) {
    return <AdminLogin onLoginSuccess={() => fetchGuests()} />
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#3A3A38] font-sans antialiased pb-20">
      {/* Toast thông báo */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#3A3A38] text-[#FAF9F6] px-4 py-3 rounded-[2px] shadow-lg flex items-center space-x-2 text-[13px] animate-fade-in border border-[#B08D57]/40">
          <CheckCircle2 size={16} className="text-[#516442]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation & Header */}
      <header className="border-b border-[#B08D57]/20 bg-[#FAF9F6] sticky top-0 z-30 shadow-xs backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left Header */}
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <Link
                  href="/"
                  className="inline-flex items-center text-[12px] font-medium text-[#8A6B3D] hover:text-[#5F7350] transition-colors"
                >
                  <ArrowLeft size={14} className="mr-1" />
                  Về trang thiệp cưới
                </Link>
                <span className="text-[#B08D57]/40">|</span>
                <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 bg-[#8A6B3D]/10 border border-[#8A6B3D]/30 rounded-[2px] text-[10px] uppercase tracking-wider text-[#8A6B3D] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8A6B3D] animate-pulse" />
                  <span>CMS Dashboard</span>
                </span>
              </div>
              <h1 className="font-serif text-[24px] sm:text-[28px] text-[#3A3A38] font-medium leading-tight">
                Quản Trị Khách Mời & Thống Kê RSVP
              </h1>
              <p className="text-[12px] sm:text-[13px] text-[#6B6A66] mt-0.5">
                Dữ liệu khách phản hồi từ thiệp cưới Nam & Lan (Đồng bộ Supabase Database)
              </p>
            </div>

            {/* Right Header: Nút hành động */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0 justify-end">
              {/* Thông tin tài khoản */}
              <div className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1.5 bg-[#EFEEEB] border border-[#B08D57]/30 rounded-[2px] text-[11px] text-[#3A3A38]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#516442]" />
                <span className="font-mono text-[#6B6A66]">{currentUser.email}</span>
              </div>

              <button
                type="button"
                onClick={() => fetchGuests(true)}
                disabled={isRefreshing || isLoading}
                className="inline-flex items-center space-x-1.5 px-3 py-2 border border-[#B08D57]/40 hover:border-[#8A6B3D] hover:bg-[#8A6B3D]/5 text-[12px] text-[#8A6B3D] rounded-[2px] transition-colors cursor-pointer disabled:opacity-50"
                title="Làm mới dữ liệu từ Supabase"
              >
                <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
                <span>{isRefreshing ? 'Đang tải...' : 'Làm mới'}</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                disabled={guests.length === 0}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-[#8A6B3D] hover:bg-[#735730] text-[#FAF9F6] text-[12px] font-medium rounded-[2px] shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                title="Tải file CSV danh sách khách mời"
              >
                <Download size={13} />
                <span>Xuất file Excel</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center space-x-1 px-3 py-2 border border-[#BA1A1A]/30 hover:border-[#BA1A1A] hover:bg-[#BA1A1A]/5 text-[12px] text-[#BA1A1A] rounded-[2px] transition-colors cursor-pointer"
                title="Đăng xuất khỏi tài khoản quản trị"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Banner thông báo lỗi nếu có */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-[#BA1A1A]/10 border border-[#BA1A1A]/30 rounded-[2px] flex items-start space-x-3 text-[#BA1A1A]">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div className="flex-1 text-[13px]">
              <p className="font-semibold">Đã xảy ra lỗi khi kết nối Supabase:</p>
              <p className="font-mono text-[12px] mt-1">{errorMessage}</p>
              <button
                type="button"
                onClick={() => fetchGuests(true)}
                className="mt-2 inline-flex items-center space-x-1 underline text-[12px] hover:font-medium"
              >
                <span>Thử kết nối lại ngay</span>
              </button>
            </div>
          </div>
        )}

        {/* 1. KHỐI THỐNG KÊ (KPI Cards) */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
          {/* Card: Tổng số phản hồi */}
          <div className="bg-[#FAF9F6] border border-[#B08D57]/30 rounded-[2px] p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider text-[#6B6A66] font-medium">Lượt phản hồi</span>
              <div className="w-8 h-8 rounded-full bg-[#8A6B3D]/10 flex items-center justify-center text-[#8A6B3D]">
                <Users size={16} />
              </div>
            </div>
            <p className="text-[26px] sm:text-[30px] font-serif font-semibold text-[#3A3A38] leading-none">
              {stats.totalResponses}
            </p>
            <p className="text-[11px] text-[#6B6A66] mt-2">Tổng số lượt gửi RSVP</p>
          </div>

          {/* Card: Tổng số người tham dự thực tế */}
          <div className="bg-[#FAF9F6] border-2 border-[#516442]/40 rounded-[2px] p-4 sm:p-5 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-12 h-12 bg-[#516442]/10 rounded-bl-full pointer-events-none" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider text-[#516442] font-semibold">Tổng người tham dự</span>
              <div className="w-8 h-8 rounded-full bg-[#516442]/15 flex items-center justify-center text-[#516442]">
                <UserCheck size={16} />
              </div>
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-[26px] sm:text-[30px] font-serif font-bold text-[#516442] leading-none">
                {stats.totalAttendingGuests}
              </span>
              <span className="text-[12px] text-[#516442] font-medium">người</span>
            </div>
            <p className="text-[11px] text-[#6B6A66] mt-2">
              Từ {stats.attendingResponsesCount} lượt đăng ký
            </p>
          </div>

          {/* Card: Số lượt báo vắng */}
          <div className="bg-[#FAF9F6] border border-[#B08D57]/30 rounded-[2px] p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider text-[#6B6A66] font-medium">Không thể đến</span>
              <div className="w-8 h-8 rounded-full bg-[#8A6B3D]/10 flex items-center justify-center text-[#8A6B3D]">
                <UserX size={16} />
              </div>
            </div>
            <p className="text-[26px] sm:text-[30px] font-serif font-semibold text-[#3A3A38] leading-none">
              {stats.totalDeclined}
            </p>
            <p className="text-[11px] text-[#6B6A66] mt-2">Lượt gửi lời cáo lỗi</p>
          </div>

          {/* Card: Tỷ lệ tham dự */}
          <div className="bg-[#FAF9F6] border border-[#B08D57]/30 rounded-[2px] p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider text-[#6B6A66] font-medium">Tỷ lệ tham dự</span>
              <div className="w-8 h-8 rounded-full bg-[#8A6B3D]/10 flex items-center justify-center text-[#8A6B3D]">
                <Percent size={16} />
              </div>
            </div>
            <p className="text-[26px] sm:text-[30px] font-serif font-semibold text-[#8A6B3D] leading-none">
              {stats.attendanceRate}%
            </p>
            <p className="text-[11px] text-[#6B6A66] mt-2">Tỷ lệ đồng ý trên tổng gửi</p>
          </div>

          {/* Card: Lời chúc nhận được */}
          <div className="col-span-2 lg:col-span-1 bg-[#FAF9F6] border border-[#B08D57]/30 rounded-[2px] p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider text-[#6B6A66] font-medium">Lời chúc mừng</span>
              <div className="w-8 h-8 rounded-full bg-[#8A6B3D]/10 flex items-center justify-center text-[#8A6B3D]">
                <Heart size={16} />
              </div>
            </div>
            <p className="text-[26px] sm:text-[30px] font-serif font-semibold text-[#3A3A38] leading-none">
              {stats.wishesCount}
            </p>
            <p className="text-[11px] text-[#6B6A66] mt-2">Lời chúc ấm áp từ khách</p>
          </div>
        </div>

        {/* 2. BỘ ĐIỀU KHIỂN: TÌM KIẾM, BỘ LỌC, SẮP XẾP */}
        <div className="bg-[#FAF9F6] border border-[#B08D57]/30 rounded-[2px] p-4 sm:p-5 mb-6 shadow-xs">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Ô tìm kiếm */}
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#807569]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên khách, số điện thoại, lời chúc..."
                className="w-full pl-9 pr-3 py-2 bg-transparent border border-[#B08D57]/40 rounded-[2px] text-[13px] text-[#3A3A38] placeholder:text-[#6B6A66]/60 focus:outline-hidden focus:border-[#8A6B3D] transition-colors"
              />
            </div>

            {/* Nhóm Filter & Sort */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Lọc theo trạng thái */}
              <div className="flex items-center space-x-1 bg-[#EFEEEB] p-0.5 rounded-[2px] border border-[#B08D57]/20 text-[12px]">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-[2px] transition-colors cursor-pointer ${
                    statusFilter === 'all'
                      ? 'bg-[#FAF9F6] text-[#3A3A38] font-medium shadow-xs'
                      : 'text-[#6B6A66] hover:text-[#3A3A38]'
                  }`}
                >
                  Tất cả ({guests.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('yes')}
                  className={`px-3 py-1.5 rounded-[2px] transition-colors cursor-pointer ${
                    statusFilter === 'yes'
                      ? 'bg-[#FAF9F6] text-[#516442] font-semibold shadow-xs'
                      : 'text-[#6B6A66] hover:text-[#516442]'
                  }`}
                >
                  Tham dự ({stats.attendingResponsesCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('no')}
                  className={`px-3 py-1.5 rounded-[2px] transition-colors cursor-pointer ${
                    statusFilter === 'no'
                      ? 'bg-[#FAF9F6] text-[#8A6B3D] font-semibold shadow-xs'
                      : 'text-[#6B6A66] hover:text-[#8A6B3D]'
                  }`}
                >
                  Không đến ({stats.totalDeclined})
                </button>
              </div>

              {/* Sắp xếp */}
              <div className="flex items-center space-x-1.5 text-[12px] text-[#6B6A66]">
                <Filter size={13} className="text-[#8A6B3D]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'name')}
                  aria-label="Sắp xếp danh sách khách mời"
                  className="bg-transparent border border-[#B08D57]/40 rounded-[2px] px-2.5 py-1.5 text-[12px] text-[#3A3A38] focus:outline-hidden focus:border-[#8A6B3D] cursor-pointer"
                >
                  <option value="newest">Mới nhất trước</option>
                  <option value="oldest">Cũ nhất trước</option>
                  <option value="name">Tên khách (A - Z)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 3. BẢNG DANH SÁCH KHÁCH MỜI */}
        <div className="bg-[#FAF9F6] border border-[#B08D57]/30 rounded-[2px] shadow-xs overflow-hidden">
          {/* Header của bảng */}
          <div className="px-5 py-4 border-b border-[#B08D57]/20 flex items-center justify-between bg-[#EFEEEB]/50">
            <div className="flex items-center space-x-2">
              <Sparkles size={16} className="text-[#8A6B3D]" />
              <h2 className="font-serif text-[16px] text-[#3A3A38] font-medium">
                Danh Sách Khách Đăng Ký
              </h2>
              <span className="text-[12px] text-[#6B6A66]">
                ({filteredAndSortedGuests.length} kết quả)
              </span>
            </div>

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="text-[11px] text-[#8A6B3D] hover:underline"
              >
                Xoá bộ lọc tìm kiếm
              </button>
            )}
          </div>

          {/* Trạng thái Loading */}
          {isLoading ? (
            <div className="text-center py-16 px-4">
              <RefreshCw size={28} className="animate-spin mx-auto text-[#8A6B3D] mb-3" />
              <p className="text-[14px] text-[#6B6A66]">Đang tải dữ liệu từ Supabase Database...</p>
            </div>
          ) : filteredAndSortedGuests.length === 0 ? (
            /* Trạng thái Trống */
            <div className="text-center py-16 px-4">
              <AlertCircle size={36} className="mx-auto text-[#8A6B3D]/50 mb-3" />
              <p className="text-[16px] font-serif text-[#3A3A38]">
                {guests.length === 0
                  ? 'Chưa có bản ghi RSVP nào trong cơ sở dữ liệu.'
                  : 'Không tìm thấy khách nào phù hợp với bộ lọc hiện tại.'}
              </p>
              <p className="text-[13px] text-[#6B6A66] mt-1.5 max-w-md mx-auto">
                {guests.length === 0
                  ? 'Khi khách mời gửi biểu mẫu RSVP từ trang thiệp cưới, dữ liệu sẽ tự động xuất hiện tại đây.'
                  : 'Vui lòng kiểm tra lại từ khóa tìm kiếm hoặc đổi trạng thái bộ lọc.'}
              </p>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE VIEW (Hiện trên màn hình sm trở lên) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left border-collapse text-[13px]">
                  <thead>
                    <tr className="border-b border-[#B08D57]/20 bg-[#FAF9F6] text-[#8A6B3D] text-[11px] uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4 w-12 text-center">STT</th>
                      <th className="py-3 px-4">Khách mời</th>
                      <th className="py-3 px-4">Số điện thoại</th>
                      <th className="py-3 px-4">Trạng thái</th>
                      <th className="py-3 px-4 text-center">Số người</th>
                      <th className="py-3 px-4">Lời chúc</th>
                      <th className="py-3 px-4">Thời gian</th>
                      <th className="py-3 px-4 text-right w-16">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#B08D57]/15">
                    {filteredAndSortedGuests.map((guest, idx) => (
                      <tr
                        key={guest.id}
                        className="hover:bg-[#EFEEEB]/40 transition-colors group"
                      >
                        {/* STT */}
                        <td className="py-3.5 px-4 text-center font-mono text-[12px] text-[#807569]">
                          {idx + 1}
                        </td>

                        {/* Họ và tên */}
                        <td className="py-3.5 px-4 font-serif text-[15px] font-medium text-[#3A3A38]">
                          {guest.guest_name}
                        </td>

                        {/* Số điện thoại */}
                        <td className="py-3.5 px-4">
                          <a
                            href={`tel:${guest.phone}`}
                            className="inline-flex items-center space-x-1.5 text-[#3A3A38] hover:text-[#8A6B3D] font-mono text-[13px] transition-colors"
                            title="Gọi số điện thoại này"
                          >
                            <Phone size={12} className="text-[#8A6B3D]" />
                            <span>{guest.phone}</span>
                          </a>
                        </td>

                        {/* Trạng thái */}
                        <td className="py-3.5 px-4">
                          {guest.status === 'yes' ? (
                            <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase bg-[#516442]/10 border border-[#516442]/30 text-[#516442] rounded-[2px]">
                              Tham dự
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase bg-[#8A6B3D]/10 border border-[#8A6B3D]/30 text-[#8A6B3D] rounded-[2px]">
                              Không thể đến
                            </span>
                          )}
                        </td>

                        {/* Số người */}
                        <td className="py-3.5 px-4 text-center">
                          {guest.status === 'yes' ? (
                            <span className="inline-flex items-center justify-center min-w-6 px-1.5 py-0.5 bg-[#FAF9F6] border border-[#516442]/30 rounded-[2px] font-semibold text-[#516442] text-[12px]">
                              {guest.guest_count ?? 1}
                            </span>
                          ) : (
                            <span className="text-[#807569] text-[12px]">—</span>
                          )}
                        </td>

                        {/* Lời chúc */}
                        <td className="py-3.5 px-4 max-w-xs">
                          {guest.wishes ? (
                            <div className="flex items-start space-x-1.5 text-[#3A3A38]">
                              <MessageSquare size={12} className="text-[#8A6B3D] shrink-0 mt-1" />
                              <span className="italic line-clamp-2 text-[12px]">
                                “{guest.wishes}”
                              </span>
                            </div>
                          ) : (
                            <span className="text-[#807569] italic text-[11px]">Không có</span>
                          )}
                        </td>

                        {/* Thời gian */}
                        <td className="py-3.5 px-4 text-[12px] text-[#6B6A66] whitespace-nowrap">
                          {formatDateTime(guest.created_at)}
                        </td>

                        {/* Thao tác xoá */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteGuest(guest.id, guest.guest_name)}
                            disabled={deletingId === guest.id}
                            className="inline-flex items-center justify-center p-1.5 text-[#807569] hover:text-[#BA1A1A] hover:bg-[#BA1A1A]/10 rounded-[2px] transition-colors cursor-pointer disabled:opacity-50"
                            title="Xoá bản ghi này khỏi Supabase"
                          >
                            <Trash2 size={14} className={deletingId === guest.id ? 'animate-pulse' : ''} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS VIEW (Hiện trên màn hình nhỏ) */}
              <div className="sm:hidden divide-y divide-[#B08D57]/15">
                {filteredAndSortedGuests.map((guest, idx) => (
                  <div key={guest.id} className="p-4 space-y-2.5">
                    {/* Hàng 1: STT, Tên, Trạng thái */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-mono text-[#8A6B3D] font-bold">
                          #{idx + 1}
                        </span>
                        <h3 className="font-serif text-[16px] font-medium text-[#3A3A38]">
                          {guest.guest_name}
                        </h3>
                      </div>

                      {guest.status === 'yes' ? (
                        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-[#516442]/10 border border-[#516442]/30 text-[#516442] rounded-[2px]">
                          Tham dự ({guest.guest_count ?? 1} người)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-[#8A6B3D]/10 border border-[#8A6B3D]/30 text-[#8A6B3D] rounded-[2px]">
                          Không đến
                        </span>
                      )}
                    </div>

                    {/* Hàng 2: SĐT & Ngày giờ */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#6B6A66]">
                      <a
                        href={`tel:${guest.phone}`}
                        className="inline-flex items-center space-x-1 text-[#3A3A38] font-mono hover:text-[#8A6B3D]"
                      >
                        <Phone size={12} className="text-[#8A6B3D]" />
                        <span>{guest.phone}</span>
                      </a>
                      <span className="inline-flex items-center space-x-1 text-[#807569]">
                        <Clock size={12} />
                        <span>{formatDateTime(guest.created_at)}</span>
                      </span>
                    </div>

                    {/* Hàng 3: Lời chúc */}
                    {guest.wishes && (
                      <div className="p-2.5 bg-[#EFEEEB]/60 border border-[#B08D57]/15 rounded-[2px] text-[13px] text-[#3A3A38] italic font-light">
                        “{guest.wishes}”
                      </div>
                    )}

                    {/* Hàng 4: Nút xoá */}
                    <div className="pt-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleDeleteGuest(guest.id, guest.guest_name)}
                        disabled={deletingId === guest.id}
                        className="inline-flex items-center space-x-1 px-2 py-1 text-[11px] text-[#BA1A1A] hover:bg-[#BA1A1A]/10 rounded-[2px] transition-colors"
                      >
                        <Trash2 size={12} />
                        <span>Xoá</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
