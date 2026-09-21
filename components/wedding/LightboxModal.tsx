'use client'

import React, { useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { GalleryPhoto } from '@/data/wedding-data'

interface LightboxModalProps {
  photos: GalleryPhoto[]
  activeIndex: number | null
  onClose: () => void
  onSelectIndex: (index: number) => void
}

export function LightboxModal({
  photos,
  activeIndex,
  onClose,
  onSelectIndex,
}: LightboxModalProps) {
  const isOpen = activeIndex !== null
  const currentPhoto = isOpen ? photos[activeIndex] : null

  const handleNext = useCallback(() => {
    if (activeIndex !== null) {
      onSelectIndex((activeIndex + 1) % photos.length)
    }
  }, [activeIndex, onSelectIndex, photos.length])

  const handlePrev = useCallback(() => {
    if (activeIndex !== null) {
      onSelectIndex((activeIndex - 1 + photos.length) % photos.length)
    }
  }, [activeIndex, onSelectIndex, photos.length])

  // Handle keyboard events (Escape, ArrowRight, ArrowLeft)
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
    }

    window.addEventListener('keydown', handleKeyDown)
    // Lock body scroll
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose, handleNext, handlePrev])

  if (!isOpen || !currentPhoto) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Xem ảnh cưới phóng to"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1C1A]/90 backdrop-blur-md transition-opacity duration-300 animate-fade-in p-4 sm:p-6"
      onClick={onClose}
    >
      {/* Top action bar: index indicator & close button */}
      <div
        className="absolute top-4 left-0 right-0 px-6 flex items-center justify-between text-[#FAF9F6] z-50 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="font-serif text-[14px] tracking-widest text-[#B08D57]">
          {activeIndex + 1} / {photos.length}
        </span>

        <button
          onClick={onClose}
          className="p-2 rounded-[4px] bg-[#FAF9F6]/10 hover:bg-[#FAF9F6]/20 text-[#FAF9F6] transition-colors focus:outline-hidden"
          aria-label="Đóng xem ảnh"
        >
          <X size={24} />
        </button>
      </div>

      {/* Prev Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          handlePrev()
        }}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-[4px] bg-[#FAF9F6]/10 hover:bg-[#FAF9F6]/25 text-[#FAF9F6] transition-all z-50 focus:outline-hidden"
        aria-label="Ảnh trước"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Image and Caption Container */}
      <div
        className="relative max-w-[90vw] max-h-[82vh] flex flex-col items-center justify-center pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentPhoto.url}
          alt={currentPhoto.alt}
          className="max-h-[75vh] max-w-[90vw] object-contain rounded-[2px] border border-[#B08D57]/40 shadow-2xl transition-all duration-300"
        />

        {currentPhoto.caption && (
          <p className="mt-4 text-center font-serif text-[14px] md:text-[16px] text-[#FAF9F6]/90 font-light italic max-w-[600px] px-4">
            {currentPhoto.caption}
          </p>
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          handleNext()
        }}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-[4px] bg-[#FAF9F6]/10 hover:bg-[#FAF9F6]/25 text-[#FAF9F6] transition-all z-50 focus:outline-hidden"
        aria-label="Ảnh tiếp theo"
      >
        <ChevronRight size={28} />
      </button>
    </div>
  )
}
