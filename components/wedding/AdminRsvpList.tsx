'use client'

import React, { useState, useEffect } from 'react'
import { Users, UserCheck, UserX, Trash2, Clock, Phone, MessageSquare, AlertCircle, RefreshCw, Search } from 'lucide-react'
import { RsvpGuest, RSVP_STORAGE_KEY, RSVP_UPDATE_EVENT } from '@/types/rsvp'

export function AdminRsvpList() {
  const [guests, setGuests] = useState<RsvpGuest[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  // Đọc danh sách từ LocalStorage
  const loadGuests = () => {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(RSVP_STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw)
          setGuests(Array.isArray(parsed) ? parsed : [])
        } else {
          setGuests([])
        }
      }
    } catch (e) {
      console.error('Lỗi khi đọc danh sách khách từ LocalStorage:', e)
    }
  }

  useEffect(() => {
    setIsMounted(true)
    loadGuests()

    const handleUpdate = () => {
      loadGuests()
    }

    // Lắng nghe sự kiện cùng trang và sự kiện giữa các tab
    window.addEventListener(RSVP_UPDATE_EVENT, handleUpdate)
    window.addEventListener('storage', handleUpdate)

    return () => {
      window.removeEventListener(RSVP_UPDATE_EVENT, handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  // Xoá một khách
  const handleDeleteGuest = (id: string, name: string) => {
    if (confirm(`Bạn có chắc muốn xoá phản hồi của khách "${name}" không?`)) {
      const updated = guests.filter((g) => g.id !== id)
      setGuests(updated)
      localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(updated))
      window.dispatchEvent(new Event(RSVP_UPDATE_EVENT))
    }
  }

  // Xoá tất cả khách
  const handleClearAll = () => {
    if (confirm('Bạn có chắc chắn muốn xoá toàn bộ danh sách RSVP trong LocalStorage không? Thao tác này không thể hoàn tác.')) {
      setGuests([])
      localStorage.removeItem(RSVP_STORAGE_KEY)
      window.dispatchEvent(new Event(RSVP_UPDATE_EVENT))
    }
  }

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

  // Tính toán số liệu thống kê
  const totalResponses = guests.length
  const totalAttendingGuests = guests
    .filter((g) => g.attendance === 'yes')
    .reduce((sum, g) => sum + (Number(g.guestCount) || 1), 0)
  const totalDeclined = guests.filter((g) => g.attendance === 'no').length

  // Lọc theo từ khoá tìm kiếm
  const filteredGuests = guests.filter((g) => {
    const term = searchTerm.toLowerCase().trim()
    if (!term) return true
    return (
      g.name.toLowerCase().includes(term) ||
      g.phone.toLowerCase().includes(term) ||
      g.wishes.toLowerCase().includes(term)
    )
  })

  if (!isMounted) {
    return null
  }

  return (
    <section id="admin-rsvp" className="py-16 md:py-24 bg-[#FAF9F6] border-t-2 border-[#B08D57]/30">
      <div className="wedding-container">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#8A6B3D]/10 border border-[#8A6B3D]/30 rounded-[2px] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8A6B3D] animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#8A6B3D] font-semibold">
              Quản Trị Khách Mời (Admin View)
            </span>
          </div>
          <h2 className="font-serif text-[26px] sm:text-[32px] md:text-[36px] text-[#3A3A38] font-normal leading-tight">
            Danh Sách Đăng Ký RSVP
          </h2>
          <p className="text-[13px] text-[#6B6A66] mt-2 font-light max-w-xl mx-auto">
            Dữ liệu được lưu trực tiếp vào <code className="bg-[#EFEEEB] px-1.5 py-0.5 rounded-[2px] text-[#3A3A38] font-mono text-[12px]">LocalStorage</code> của trình duyệt. Tự động đồng bộ ngay khi khách gửi biểu mẫu.
          </p>
        </div>

        {/* Thống kê nhanh */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
          {/* Card: Tổng lượt gửi */}
          <div className="bg-[#FAF9F6] border border-[#B08D57]/30 rounded-[2px] p-4 text-center shadow-xs">
            <div className="w-9 h-9 mx-auto rounded-full bg-[#8A6B3D]/10 border border-[#8A6B3D]/20 flex items-center justify-center text-[#8A6B3D] mb-2">
              <Users size={18} />
            </div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-[#6B6A66] font-medium">Lượt Phản Hồi</p>
            <p className="text-[24px] font-serif font-semibold text-[#3A3A38] mt-1">{totalResponses}</p>
          </div>

          {/* Card: Tham dự */}
          <div className="bg-[#FAF9F6] border border-[#516442]/30 rounded-[2px] p-4 text-center shadow-xs">
            <div className="w-9 h-9 mx-auto rounded-full bg-[#516442]/10 border border-[#516442]/20 flex items-center justify-center text-[#516442] mb-2">
              <UserCheck size={18} />
            </div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-[#516442] font-medium">Số Người Tham Dự</p>
            <p className="text-[24px] font-serif font-semibold text-[#516442] mt-1">
              {totalAttendingGuests}{' '}
              <span className="text-[13px] font-normal text-[#6B6A66]">khách</span>
            </p>
          </div>

          {/* Card: Báo vắng */}
          <div className="bg-[#FAF9F6] border border-[#8A6B3D]/30 rounded-[2px] p-4 text-center shadow-xs">
            <div className="w-9 h-9 mx-auto rounded-full bg-[#8A6B3D]/10 border border-[#8A6B3D]/20 flex items-center justify-center text-[#8A6B3D] mb-2">
              <UserX size={18} />
            </div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-[#8A6B3D] font-medium">Không Thể Đến</p>
            <p className="text-[24px] font-serif font-semibold text-[#3A3A38] mt-1">
              {totalDeclined}{' '}
              <span className="text-[13px] font-normal text-[#6B6A66]">lượt</span>
            </p>
          </div>
        </div>

        {/* Thanh công cụ tìm kiếm và xoá dữ liệu */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 max-w-4xl mx-auto">
          {/* Ô tìm kiếm */}
          <div className="relative w-full sm:w-80">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#807569]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên, SĐT, lời chúc..."
              className="w-full pl-9 pr-3 py-2 bg-transparent border border-[#B08D57]/40 rounded-[2px] text-[13px] text-[#3A3A38] placeholder:text-[#6B6A66]/60 focus:outline-hidden focus:border-[#8A6B3D] transition-colors"
            />
          </div>

          {/* Nút hành động */}
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={loadGuests}
              className="inline-flex items-center space-x-1.5 px-3 py-2 border border-[#B08D57]/40 hover:border-[#8A6B3D] text-[12px] text-[#8A6B3D] rounded-[2px] transition-colors cursor-pointer"
              title="Tải lại dữ liệu"
            >
              <RefreshCw size={13} />
              <span>Làm mới</span>
            </button>

            {guests.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex items-center space-x-1.5 px-3 py-2 border border-[#BA1A1A]/30 hover:border-[#BA1A1A] text-[12px] text-[#BA1A1A] hover:bg-[#BA1A1A]/5 rounded-[2px] transition-colors cursor-pointer"
                title="Xoá tất cả bản ghi để test lại"
              >
                <Trash2 size={13} />
                <span>Xoá tất cả</span>
              </button>
            )}
          </div>
        </div>

        {/* Nội dung danh sách */}
        <div className="max-w-4xl mx-auto">
          {filteredGuests.length === 0 ? (
            <div className="text-center py-12 px-4 bg-[#FAF9F6] border border-dashed border-[#B08D57]/40 rounded-[2px]">
              <AlertCircle size={32} className="mx-auto text-[#8A6B3D]/60 mb-2" />
              <p className="text-[15px] font-serif text-[#3A3A38]">
                {guests.length === 0
                  ? 'Chưa có lượt đăng ký RSVP nào được lưu.'
                  : 'Không tìm thấy khách nào khớp với từ khoá tìm kiếm.'}
              </p>
              <p className="text-[13px] text-[#6B6A66] mt-1 font-light">
                {guests.length === 0
                  ? 'Hãy cuộn lên phần biểu mẫu RSVP phía trên và thử gửi một phản hồi!'
                  : 'Vui lòng kiểm tra lại từ khóa tìm kiếm.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredGuests.map((guest, index) => (
                <div
                  key={guest.id || index}
                  className="bg-[#FAF9F6] border border-[#B08D57]/40 rounded-[2px] p-4 sm:p-5 hover:border-[#B08D57] transition-all shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    {/* Thông tin chính */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[12px] font-mono text-[#8A6B3D] font-semibold">
                          #{filteredGuests.length - index}
                        </span>
                        <h4 className="font-serif text-[17px] sm:text-[18px] text-[#3A3A38] font-medium">
                          {guest.name}
                        </h4>

                        {/* Huy hiệu trạng thái */}
                        {guest.attendance === 'yes' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase bg-[#516442]/10 border border-[#516442]/30 text-[#516442] rounded-[2px]">
                            Tham dự ({guest.guestCount || 1} người)
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase bg-[#8A6B3D]/10 border border-[#8A6B3D]/30 text-[#8A6B3D] rounded-[2px]">
                            Không thể đến
                          </span>
                        )}
                      </div>

                      {/* Chi tiết phụ: SĐT & Thời gian */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[#6B6A66]">
                        <span className="inline-flex items-center space-x-1">
                          <Phone size={13} className="text-[#8A6B3D]" />
                          <span>{guest.phone}</span>
                        </span>
                        <span className="inline-flex items-center space-x-1">
                          <Clock size={13} className="text-[#807569]" />
                          <span>{formatDateTime(guest.createdAt)}</span>
                        </span>
                      </div>

                      {/* Lời chúc */}
                      {guest.wishes && (
                        <div className="mt-2.5 pt-2 border-t border-[#B08D57]/15 flex items-start space-x-2 text-[14px] text-[#3A3A38]">
                          <MessageSquare size={14} className="text-[#8A6B3D] shrink-0 mt-0.5" />
                          <p className="italic font-light">“{guest.wishes}”</p>
                        </div>
                      )}
                    </div>

                    {/* Nút thao tác xoá */}
                    <div className="sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#B08D57]/10 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleDeleteGuest(guest.id, guest.name)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] text-[#6B6A66] hover:text-[#BA1A1A] hover:bg-[#BA1A1A]/5 rounded-[2px] transition-colors cursor-pointer"
                        title="Xoá lượt đăng ký này"
                      >
                        <Trash2 size={13} />
                        <span>Xoá</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
