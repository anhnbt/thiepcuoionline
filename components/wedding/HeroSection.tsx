'use client'

import React from 'react'
import { Calendar, MapPin, ArrowDown } from 'lucide-react'
import { weddingData } from '@/data/wedding-data'
import { CountdownTimer } from './CountdownTimer'

export function HeroSection() {
  const { groom, bride, event, quotes } = weddingData

  return (
    <section id="top" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Decorative hairline corner accents */}
      <div className="wedding-container relative text-center">
        {/* Top Eyebrow Tag */}
        <div className="inline-flex items-center justify-center space-x-3 mb-6">
          <span className="w-8 h-[1px] bg-[#B08D57]" />
          <span className="text-[11px] md:text-[12px] uppercase tracking-[0.22em] text-[#8A6B3D] font-medium">
            Save The Date • Lễ Thành Hôn
          </span>
          <span className="w-8 h-[1px] bg-[#B08D57]" />
        </div>

        {/* Formal Invitation Heading */}
        <p className="text-[13px] md:text-[14px] uppercase tracking-[0.25em] text-[#6B6A66] mb-3 font-light">
          Trân trọng kính mời tới dự ngày chung đôi
        </p>

        {/* Couple's Names in Calligraphic Great Vibes */}
        <div className="py-2 md:py-4">
          <h1 className="font-script text-[#3A3A38] text-[56px] sm:text-[76px] md:text-[92px] leading-[1.05] tracking-wide">
            {groom.shortName}{' '}
            <span className="font-serif text-[32px] sm:text-[44px] md:text-[54px] text-[#B08D57] font-normal mx-1 sm:mx-2 align-middle">
              &amp;
            </span>{' '}
            {bride.shortName}
          </h1>
        </div>

        {/* Subtle subline */}
        <p className="max-w-[480px] mx-auto text-[#6B6A66] text-[15px] md:text-[16px] leading-relaxed font-light mt-3 mb-8">
          {quotes.hero}
        </p>

        {/* Formal Date Display Card */}
        <div className="my-8 max-w-[420px] mx-auto p-6 bg-[#FAF9F6] border border-[#B08D57] rounded-[2px] relative">
          <div className="flex items-center justify-center space-x-6">
            <div className="text-right">
              <span className="block text-[11px] uppercase tracking-[0.2em] text-[#8A6B3D] font-medium">
                {event.dayOfWeek}
              </span>
              <span className="block font-serif text-[15px] text-[#6B6A66]">
                {event.time}
              </span>
            </div>

            <div className="px-5 border-x border-[#B08D57]/40 text-center">
              <span className="font-serif text-5xl md:text-6xl text-[#8A6B3D] font-medium leading-none block">
                {event.day}
              </span>
            </div>

            <div className="text-left">
              <span className="block text-[11px] uppercase tracking-[0.2em] text-[#8A6B3D] font-medium">
                Tháng {event.month}
              </span>
              <span className="block font-serif text-[15px] text-[#6B6A66]">
                Năm {event.year}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#B08D57]/30 text-center">
            <p className="text-[12px] text-[#6B6A66] tracking-wider italic">
              (Tức ngày {event.lunarDate})
            </p>
          </div>
        </div>

        {/* Live Countdown Timer to Wedding Day */}
        <CountdownTimer />

        {/* Venue Quick Tag */}
        <div className="flex items-center justify-center space-x-2 text-[13px] md:text-[14px] text-[#3A3A38] mb-10">
          <MapPin size={16} className="text-[#8A6B3D] shrink-0" />
          <span>Trống Đồng Palace Linh Đàm — Bán đảo Linh Đàm, Hoàng Mai, Hà Nội</span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#rsvp"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#8A6B3D] hover:bg-[#735730] text-[#FAF9F6] text-[12px] tracking-[0.2em] font-semibold rounded-[4px] uppercase transition-all duration-300 shadow-sm"
          >
            Xác nhận tham dự (RSVP)
          </a>
          <a
            href="#timeline"
            className="w-full sm:w-auto px-7 py-3.5 bg-transparent border border-[#B08D57] hover:bg-[#B08D57]/10 text-[#8A6B3D] text-[12px] tracking-[0.2em] font-semibold rounded-[4px] uppercase transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Calendar size={15} />
            <span>Xem lịch trình</span>
          </a>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-14 flex justify-center">
          <a
            href="#story"
            aria-label="Cuộn xuống xem câu chuyện"
            className="text-[#B08D57] hover:text-[#8A6B3D] transition-colors flex flex-col items-center"
          >
            <span className="text-[10px] uppercase tracking-[0.25em] mb-2 font-medium">Cuộn xuống</span>
            <ArrowDown size={16} className="animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  )
}
