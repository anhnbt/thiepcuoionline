'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn, Pause, Play } from 'lucide-react'
import { GalleryPhoto } from '@/data/wedding-data'

interface PhotoCarouselProps {
  photos: GalleryPhoto[]
  onPhotoClick: (index: number) => void
}

export function PhotoCarousel({ photos, onPhotoClick }: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length)
  }, [photos.length])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }, [photos.length])

  // Tự động chuyển ảnh sau mỗi 3.5 giây nếu đang bật phát và không rê chuột
  useEffect(() => {
    if (!isPlaying || isHovered) return

    const interval = setInterval(() => {
      goToNext()
    }, 3500)

    return () => clearInterval(interval)
  }, [isPlaying, isHovered, goToNext])

  // Xử lý vuốt chạm trên thiết bị di động (swipe)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return
    const distance = touchStartX.current - touchEndX.current
    const minSwipeDistance = 50

    if (distance > minSwipeDistance) {
      goToNext()
    } else if (distance < -minSwipeDistance) {
      goToPrev()
    }

    touchStartX.current = null
    touchEndX.current = null
  }

  const activePhoto = photos[currentIndex]

  return (
    <div
      className="relative w-full max-w-[720px] mx-auto select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Khung ảnh chính */}
      <div
        className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-[2px] border border-[#B08D57] bg-[#EFEEEB] shadow-[0_4px_20px_rgba(58,58,56,0.06)] group cursor-pointer"
        onClick={() => onPhotoClick(currentIndex)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Hình ảnh với hiệu ứng chuyển tiếp */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={activePhoto.id}
          src={activePhoto.url}
          alt={activePhoto.alt}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 animate-fadeIn"
        />

        {/* Lớp phủ gradient chữ và chú thích */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C1A]/80 via-transparent to-transparent flex flex-col justify-end p-5 sm:p-6 text-[#FAF9F6] pointer-events-none">
          <div className="flex items-end justify-between">
            <div className="max-w-[80%]">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#B08D57] block mb-1">
                Ảnh kỷ niệm
              </span>
              <p className="font-serif text-[15px] sm:text-[17px] font-light italic leading-snug">
                {activePhoto.caption || activePhoto.alt}
              </p>
            </div>

            {/* Nút gợi ý phóng to */}
            <div className="px-3 py-1.5 rounded-[2px] bg-[#FAF9F6]/20 backdrop-blur-xs text-[#FAF9F6] text-[11px] tracking-wider uppercase font-medium flex items-center space-x-1.5 pointer-events-auto shrink-0">
              <ZoomIn size={14} />
              <span className="hidden sm:inline">Phóng to</span>
            </div>
          </div>
        </div>

        {/* Bộ đếm ảnh (vd: 1 / 6) */}
        <div className="absolute top-4 right-4 px-2.5 py-1 rounded-[2px] bg-[#1A1C1A]/60 backdrop-blur-xs text-[#FAF9F6] text-[11px] font-serif tracking-wider">
          {currentIndex + 1} / {photos.length}
        </div>
      </div>

      {/* Nút điều hướng Trước / Sau */}
      <button
        type="button"
        onClick={goToPrev}
        aria-label="Xem ảnh trước"
        className="absolute left-2 sm:-left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-[2px] bg-[#FAF9F6] border border-[#B08D57] text-[#8A6B3D] hover:bg-[#8A6B3D] hover:text-[#FAF9F6] transition-all duration-300 shadow-md flex items-center justify-center z-10"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        type="button"
        onClick={goToNext}
        aria-label="Xem ảnh tiếp theo"
        className="absolute right-2 sm:-right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-[2px] bg-[#FAF9F6] border border-[#B08D57] text-[#8A6B3D] hover:bg-[#8A6B3D] hover:text-[#FAF9F6] transition-all duration-300 shadow-md flex items-center justify-center z-10"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dải chỉ báo (Pagination Dots) và Nút Tạm dừng / Phát */}
      <div className="mt-4 flex items-center justify-center space-x-3">
        {/* Nút Play/Pause tự động chạy */}
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? 'Tạm dừng trượt ảnh' : 'Tiếp tục tự chạy'}
          className="p-1.5 text-[#8A6B3D] hover:text-[#735730] transition-colors"
          title={isPlaying ? 'Tạm dừng tự chạy' : 'Bật tự chạy'}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>

        {/* Các chấm tròn chuyển ảnh */}
        <div className="flex items-center space-x-2">
          {photos.map((photo, idx) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Xem ảnh ${idx + 1}`}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                idx === currentIndex
                  ? 'w-6 bg-[#8A6B3D]'
                  : 'w-2 bg-[#B08D57]/40 hover:bg-[#B08D57]'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
