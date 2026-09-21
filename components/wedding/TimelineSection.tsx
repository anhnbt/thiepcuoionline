import React from 'react'
import {
  Camera,
  Heart,
  Wine,
  Music,
  Users,
  Clock,
} from 'lucide-react'
import { weddingData, TimelineItem } from '@/data/wedding-data'

function getTimelineIcon(icon: TimelineItem['icon']) {
  switch (icon) {
    case 'welcome':
      return <Camera size={18} className="text-[#8A6B3D]" />
    case 'ceremony':
      return <Heart size={18} className="text-[#8A6B3D] fill-[#8A6B3D]/10" />
    case 'banquet':
      return <Wine size={18} className="text-[#8A6B3D]" />
    case 'music':
      return <Music size={18} className="text-[#8A6B3D]" />
    case 'photo':
      return <Users size={18} className="text-[#8A6B3D]" />
    default:
      return <Clock size={18} className="text-[#8A6B3D]" />
  }
}

export function TimelineSection() {
  const { timeline } = weddingData

  return (
    <section id="timeline" className="py-20 md:py-28 bg-[#FAF9F6] border-t border-[#B08D57]/20">
      <div className="wedding-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-[11px] md:text-[12px] uppercase tracking-[0.25em] text-[#8A6B3D] font-medium mb-3">
            Chương trình ngày vui
          </p>
          <h2 className="font-serif text-[28px] sm:text-[36px] md:text-[40px] text-[#3A3A38] font-normal leading-tight">
            Lịch trình Lễ Cưới
          </h2>
          <p className="text-[14px] text-[#6B6A66] mt-3 font-light max-w-[400px] mx-auto">
            Kính mong quý khách có mặt đúng giờ để cùng sẻ chia trọn vẹn những khoảnh khắc ý nghĩa.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative max-w-[580px] mx-auto">
          {/* Vertical Golden Center Line */}
          <div className="absolute left-[28px] sm:left-1/2 top-4 bottom-4 w-[1px] bg-[#B08D57]/35 -translate-x-1/2" />

          <div className="space-y-12">
            {timeline.map((item, index) => {
              const isEven = index % 2 === 0
              return (
                <div
                  key={item.time}
                  className={`relative flex items-start ${
                    isEven ? 'sm:flex-row-reverse' : 'sm:flex-row'
                  } pl-14 sm:pl-0`}
                >
                  {/* Timeline Badge Node */}
                  <div className="absolute left-[28px] sm:left-1/2 -translate-x-1/2 top-0.5 z-10 w-9 h-9 rounded-[4px] bg-[#FAF9F6] border border-[#B08D57] flex items-center justify-center shadow-xs">
                    {getTimelineIcon(item.icon)}
                  </div>

                  {/* Content Box */}
                  <div
                    className={`w-full sm:w-1/2 ${
                      isEven ? 'sm:pl-10 text-left' : 'sm:pr-10 sm:text-right text-left'
                    }`}
                  >
                    <div className="inline-block px-3 py-1 bg-[#8A6B3D]/10 border border-[#8A6B3D]/25 rounded-[2px] mb-2">
                      <span className="font-serif text-[14px] font-semibold text-[#8A6B3D] tracking-wider">
                        {item.time}
                      </span>
                    </div>

                    <h3 className="font-serif text-[19px] md:text-[20px] text-[#3A3A38] font-medium mt-1 mb-1.5">
                      {item.title}
                    </h3>

                    <p className="text-[13px] md:text-[14px] text-[#6B6A66] leading-relaxed font-light">
                      {item.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Timeline Bottom Note */}
        <div className="mt-16 text-center">
          <span className="inline-block text-[12px] uppercase tracking-[0.2em] text-[#8A6B3D] border-b border-[#B08D57]/40 pb-1 font-medium">
            25 • 12 • 2026 • Trống Đồng Palace Linh Đàm
          </span>
        </div>
      </div>
    </section>
  )
}
