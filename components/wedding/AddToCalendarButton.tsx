import React from 'react'
import { CalendarPlus } from 'lucide-react'
import { getWeddingCalendarUrl } from '@/lib/calendar'

interface AddToCalendarButtonProps {
  variant?: 'primary' | 'outline'
  className?: string
  text?: string
}

export function AddToCalendarButton({
  variant = 'outline',
  className = '',
  text = 'Thêm vào Google Calendar',
}: AddToCalendarButtonProps) {
  const calendarUrl = getWeddingCalendarUrl()

  const baseStyles =
    'inline-flex items-center justify-center space-x-2 rounded-[4px] transition-colors duration-300 text-[11px] sm:text-[12px] uppercase tracking-[0.18em] font-semibold cursor-pointer'

  const variantStyles =
    variant === 'primary'
      ? 'bg-[#8A6B3D] text-[#FAF9F6] hover:bg-[#735730] px-6 py-3.5 shadow-xs'
      : 'bg-transparent border border-[#B08D57] text-[#8A6B3D] hover:bg-[#B08D57]/10 px-5 py-2.5'

  return (
    <a
      href={calendarUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseStyles} ${variantStyles} ${className}`}
      aria-label="Thêm sự kiện đám cưới vào Google Calendar"
    >
      <CalendarPlus size={16} className="shrink-0" />
      <span>{text}</span>
    </a>
  )
}
