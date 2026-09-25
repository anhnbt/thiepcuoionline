'use client'

import React, { useState } from 'react'
import { CheckCircle, Heart, Send, RefreshCw, AlertCircle } from 'lucide-react'
import { weddingData } from '@/data/wedding-data'
import { createClient } from '@/utils/supabase/client'

export function RsvpSection() {
  const { event, groom, bride } = weddingData

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    attendance: 'yes' as 'yes' | 'no',
    guestCount: 1,
    wishes: '',
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Validate Vietnamese phone number format
  const validatePhone = (phone: string): boolean => {
    const vnPhoneRegex = /^(0|\+84)(3[2-9]|5[25689]|7[06-9]|8[1-9]|9[0-46-9])[0-9]{7}$/
    return vnPhoneRegex.test(phone.replace(/\s+/g, ''))
  }

  const validate = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ và tên của bạn.'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Họ và tên cần có ít nhất 2 ký tự.'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại liên hệ.'
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Số điện thoại chưa đúng định dạng VN (VD: 0912345678).'
    }

    if (formData.attendance === 'yes') {
      if (!formData.guestCount || Number(formData.guestCount) < 1) {
        newErrors.guestCount = 'Số lượng khách tham dự phải từ 1 người trở lên.'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)
    setErrors((prev) => {
      const copy = { ...prev }
      delete copy.submit
      return copy
    })

    // Lưu dữ liệu vào Supabase Database
    try {
      const supabase = createClient()
      const { error } = await supabase.from('rsvp_guests').insert([
        {
          guest_name: formData.name.trim(),
          phone: formData.phone.trim(),
          status: formData.attendance,
          guest_count: formData.attendance === 'yes' ? Number(formData.guestCount) || 1 : 0,
          wishes: formData.wishes.trim(),
        },
      ])

      if (error) {
        console.error('Lỗi khi lưu RSVP vào Supabase:', error)
        setErrors((prev) => ({
          ...prev,
          submit: 'Có lỗi xảy ra khi lưu thông tin vào hệ thống. Vui lòng thử lại hoặc liên hệ với cô dâu chú rể.',
        }))
        setIsSubmitting(false)
        return
      }

      // Giữ hiệu ứng phản hồi mượt mà
      setTimeout(() => {
        setIsSubmitting(false)
        setIsSubmitted(true)
      }, 400)
    } catch (err) {
      console.error('Lỗi ngoại lệ khi gửi RSVP lên Supabase:', err)
      setErrors((prev) => ({
        ...prev,
        submit: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng.',
      }))
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      attendance: 'yes',
      guestCount: 1,
      wishes: '',
    })
    setErrors({})
    setIsSubmitted(false)
  }

  return (
    <section id="rsvp" className="py-20 md:py-28 bg-[#FAF9F6] border-t border-[#B08D57]/20">
      <div className="wedding-container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-[11px] md:text-[12px] uppercase tracking-[0.25em] text-[#8A6B3D] font-medium mb-3">
            Xác nhận tham dự
          </p>
          <h2 className="font-serif text-[28px] sm:text-[36px] md:text-[40px] text-[#3A3A38] font-normal leading-tight">
            Sự Hiện Diện Của Bạn
          </h2>
          <p className="font-serif italic text-[17px] text-[#8A6B3D] mt-2">
            là món quà quý giá nhất đối với chúng mình
          </p>
          <p className="text-[13px] text-[#6B6A66] mt-3 font-light">
            Xin vui lòng phản hồi trước ngày{' '}
            <span className="font-medium text-[#3A3A38]">{event.rsvpDeadline}</span> để chúng mình đón tiếp chu đáo nhất.
          </p>
        </div>

        {/* Floating Paper Envelope Card with cast shadow per DESIGN.md */}
        <div className="max-w-[580px] mx-auto bg-[#FAF9F6] border border-[#B08D57] rounded-[2px] shadow-rsvp p-7 sm:p-10 relative">
          {/* Ornamental corner lines */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#B08D57]/40 pointer-events-none" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#B08D57]/40 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#B08D57]/40 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#B08D57]/40 pointer-events-none" />

          {isSubmitted ? (
            /* Confirmation Success State */
            <div className="text-center py-6 animate-fade-in space-y-5">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#516442]/10 border border-[#516442]/30 flex items-center justify-center text-[#516442]">
                <CheckCircle size={32} />
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#8A6B3D] font-medium block mb-1">
                  Xác nhận thành công
                </span>
                <h3 className="font-serif text-[24px] sm:text-[28px] text-[#3A3A38] font-medium">
                  Cảm ơn bạn, {formData.name}!
                </h3>
              </div>

              <div className="p-4 bg-[#EFEEEB]/70 border border-[#B08D57]/20 rounded-[2px] text-[14px] text-[#6B6A66] max-w-[420px] mx-auto text-left space-y-2">
                <p>
                  <strong>Trạng thái:</strong>{' '}
                  {formData.attendance === 'yes' ? (
                    <span className="text-[#516442] font-medium">Sẽ tham dự ({formData.guestCount} người)</span>
                  ) : (
                    <span className="text-[#8A6B3D] font-medium">Không thể tham dự</span>
                  )}
                </p>
                <p>
                  <strong>Số điện thoại:</strong> {formData.phone}
                </p>
                {formData.wishes && (
                  <p className="italic text-[#3A3A38]">
                    <strong>Lời chúc:</strong> “{formData.wishes}”
                  </p>
                )}
              </div>

              <p className="text-[14px] text-[#6B6A66] leading-relaxed max-w-[400px] mx-auto font-light">
                {formData.attendance === 'yes'
                  ? `${groom.shortName} & ${bride.shortName} rất nóng lòng được chào đón bạn vào ngày 25/12/2026!`
                  : `Cảm ơn bạn đã gửi lời chúc yêu thương đến ${groom.shortName} & ${bride.shortName}!`}
              </p>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center space-x-2 text-[11px] uppercase tracking-[0.18em] font-semibold text-[#8A6B3D] hover:text-[#735730] transition-colors border-b border-[#8A6B3D]/30 pb-1"
                >
                  <RefreshCw size={13} />
                  <span>Gửi lại phản hồi khác</span>
                </button>
              </div>
            </div>
          ) : (
            /* RSVP Form */
            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Field: Full Name */}
              <div>
                <label className="block text-[11px] uppercase tracking-[0.18em] text-[#8A6B3D] font-medium mb-1">
                  Họ và tên của bạn <span className="text-[#BA1A1A]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value })
                    if (errors.name) setErrors({ ...errors, name: '' })
                  }}
                  placeholder="VD: Nguyễn Văn An"
                  className="w-full py-2.5 bg-transparent border-0 border-b border-[#B08D57] text-[#3A3A38] text-[16px] placeholder:text-[#6B6A66]/60 focus:outline-hidden focus:border-b-2 focus:border-[#8A6B3D] transition-all"
                />
                {errors.name && (
                  <p className="flex items-center space-x-1.5 text-[12px] text-[#BA1A1A] mt-1.5">
                    <AlertCircle size={13} />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* Field: Phone Number */}
              <div>
                <label className="block text-[11px] uppercase tracking-[0.18em] text-[#8A6B3D] font-medium mb-1">
                  Số điện thoại liên hệ <span className="text-[#BA1A1A]">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value })
                    if (errors.phone) setErrors({ ...errors, phone: '' })
                  }}
                  placeholder="VD: 0988 123 456"
                  className="w-full py-2.5 bg-transparent border-0 border-b border-[#B08D57] text-[#3A3A38] text-[16px] placeholder:text-[#6B6A66]/60 focus:outline-hidden focus:border-b-2 focus:border-[#8A6B3D] transition-all"
                />
                {errors.phone && (
                  <p className="flex items-center space-x-1.5 text-[12px] text-[#BA1A1A] mt-1.5">
                    <AlertCircle size={13} />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>

              {/* Field: Attendance Radio */}
              <div>
                <label className="block text-[11px] uppercase tracking-[0.18em] text-[#8A6B3D] font-medium mb-3">
                  Bạn sẽ tham dự chung vui cùng chúng mình chứ? <span className="text-[#BA1A1A]">*</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-center p-3.5 border rounded-[2px] cursor-pointer transition-all ${formData.attendance === 'yes'
                      ? 'border-[#8A6B3D] bg-[#8A6B3D]/8'
                      : 'border-[#B08D57]/40 hover:border-[#B08D57]'
                      }`}
                  >
                    <input
                      type="radio"
                      name="attendance"
                      value="yes"
                      checked={formData.attendance === 'yes'}
                      onChange={() => setFormData({ ...formData, attendance: 'yes' })}
                      className="accent-[#8A6B3D] w-4 h-4 mr-3"
                    />
                    <span className="text-[14px] text-[#3A3A38] font-medium">
                      Có, mình sẽ đến chung vui
                    </span>
                  </label>

                  <label
                    className={`flex items-center p-3.5 border rounded-[2px] cursor-pointer transition-all ${formData.attendance === 'no'
                      ? 'border-[#8A6B3D] bg-[#8A6B3D]/8'
                      : 'border-[#B08D57]/40 hover:border-[#B08D57]'
                      }`}
                  >
                    <input
                      type="radio"
                      name="attendance"
                      value="no"
                      checked={formData.attendance === 'no'}
                      onChange={() => setFormData({ ...formData, attendance: 'no' })}
                      className="accent-[#8A6B3D] w-4 h-4 mr-3"
                    />
                    <span className="text-[14px] text-[#6B6A66]">
                      Rất tiếc, mình không thể đến
                    </span>
                  </label>
                </div>
              </div>

              {/* Field: Number of guests (Cho nhập tự do per user feedback) */}
              {formData.attendance === 'yes' && (
                <div className="animate-fade-in">
                  <label className="block text-[11px] uppercase tracking-[0.18em] text-[#8A6B3D] font-medium mb-1">
                    Số lượng người tham dự (nhập tự do) <span className="text-[#BA1A1A]">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={formData.guestCount}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10)
                      setFormData({ ...formData, guestCount: isNaN(val) ? 1 : val })
                      if (errors.guestCount) setErrors({ ...errors, guestCount: '' })
                    }}
                    placeholder="VD: 1, 2, 3..."
                    className="w-full py-2.5 bg-transparent border-0 border-b border-[#B08D57] text-[#3A3A38] text-[16px] placeholder:text-[#6B6A66]/60 focus:outline-hidden focus:border-b-2 focus:border-[#8A6B3D] transition-all"
                  />
                  <p className="text-[12px] text-[#6B6A66] italic mt-1">
                    (Bao gồm cả bạn và người thân / bạn bè đi cùng)
                  </p>
                  {errors.guestCount && (
                    <p className="flex items-center space-x-1.5 text-[12px] text-[#BA1A1A] mt-1.5">
                      <AlertCircle size={13} />
                      <span>{errors.guestCount}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Field: Wishes / Message */}
              <div>
                <label className="block text-[11px] uppercase tracking-[0.18em] text-[#8A6B3D] font-medium mb-1">
                  Gửi lời chúc đến Tuấn Anh &amp; Hoa
                </label>
                <textarea
                  rows={3}
                  value={formData.wishes}
                  onChange={(e) => setFormData({ ...formData, wishes: e.target.value })}
                  placeholder="Gửi gắm lời chúc ngọt ngào đến cô dâu & chú rể..."
                  className="w-full py-2.5 bg-transparent border-0 border-b border-[#B08D57] text-[#3A3A38] text-[15px] placeholder:text-[#6B6A66]/60 focus:outline-hidden focus:border-b-2 focus:border-[#8A6B3D] transition-all resize-none"
                />
              </div>

              {/* Thông báo lỗi khi gửi dữ liệu lên Supabase (nếu có) */}
              {errors.submit && (
                <div className="p-3 bg-[#BA1A1A]/10 border border-[#BA1A1A]/30 rounded-[2px] flex items-center space-x-2 text-[13px] text-[#BA1A1A]">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{errors.submit}</span>
                </div>
              )}

              {/* Submit CTA Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#8A6B3D] hover:bg-[#735730] text-[#FAF9F6] text-[12px] tracking-[0.2em] font-semibold rounded-[4px] uppercase transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-75 cursor-pointer shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#FAF9F6] border-t-transparent rounded-full animate-spin" />
                      <span>Đang gửi xác nhận...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Gửi Xác Nhận Tham Dự</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center space-x-2 text-[12px] text-[#6B6A66] italic pt-1">
                <Heart size={13} className="text-[#B08D57] fill-[#B08D57]/20" />
                <span>Trân trọng cảm ơn sự hiện diện và chúc phúc của bạn!</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
