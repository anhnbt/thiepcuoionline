'use client'

import React, { useState } from 'react'
import { ZoomIn, Sliders, LayoutGrid } from 'lucide-react'
import { weddingData } from '@/data/wedding-data'
import { LightboxModal } from './LightboxModal'
import { PhotoCarousel } from './PhotoCarousel'

export function GallerySection() {
  const { gallery } = weddingData
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider')

  return (
    <section id="gallery" className="py-20 md:py-28 bg-[#FAF9F6] border-t border-[#B08D57]/20">
      <div className="wedding-container">
        {/* Section Header */}
        <div className="text-center mb-10">
          <p className="text-[11px] md:text-[12px] uppercase tracking-[0.25em] text-[#8A6B3D] font-medium mb-3">
            Khoảnh khắc đáng nhớ
          </p>
          <h2 className="font-serif text-[28px] sm:text-[36px] md:text-[40px] text-[#3A3A38] font-normal leading-tight">
            Album Ảnh Cưới
          </h2>
          <p className="text-[14px] text-[#6B6A66] mt-3 font-light max-w-[420px] mx-auto">
            Từng bức ảnh ghi dấu những nụ cười, ánh mắt và khoảnh khắc hạnh phúc nhất của chúng mình.
          </p>

          {/* View Mode Toggle Switch */}
          <div className="inline-flex items-center p-1 bg-[#EFEEEB] border border-[#B08D57]/40 rounded-[4px] mt-8">
            <button
              type="button"
              onClick={() => setViewMode('slider')}
              className={`flex items-center space-x-2 px-4 py-1.5 text-[11px] tracking-[0.15em] uppercase font-medium rounded-[2px] transition-all duration-300 ${
                viewMode === 'slider'
                  ? 'bg-[#8A6B3D] text-[#FAF9F6] shadow-xs'
                  : 'text-[#6B6A66] hover:text-[#3A3A38]'
              }`}
            >
              <Sliders size={13} />
              <span>Dạng Trượt (Slider)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center space-x-2 px-4 py-1.5 text-[11px] tracking-[0.15em] uppercase font-medium rounded-[2px] transition-all duration-300 ${
                viewMode === 'grid'
                  ? 'bg-[#8A6B3D] text-[#FAF9F6] shadow-xs'
                  : 'text-[#6B6A66] hover:text-[#3A3A38]'
              }`}
            >
              <LayoutGrid size={13} />
              <span>Dạng Lưới (Grid)</span>
            </button>
          </div>
        </div>

        {/* Content View: Slider or Grid */}
        {viewMode === 'slider' ? (
          <div className="mt-4">
            <PhotoCarousel
              photos={gallery}
              onPhotoClick={(index) => setActivePhotoIndex(index)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 mt-6 animate-fadeIn">
            {gallery.map((photo, index) => {
              const isSpan = index === 0 || index === 3
              return (
                <div
                  key={photo.id}
                  onClick={() => setActivePhotoIndex(index)}
                  className={`group relative overflow-hidden rounded-[2px] border border-[#B08D57]/40 bg-[#EFEEEB] cursor-pointer transition-all duration-300 hover:border-[#8A6B3D] hover:shadow-md ${
                    isSpan ? 'sm:col-span-2 aspect-16/10' : 'aspect-3/4'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={photo.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Hover overlay with caption & zoom icon */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C1A]/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-[#FAF9F6]">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-[13px] sm:text-[14px] font-light italic truncate pr-2">
                        {photo.caption || photo.alt}
                      </span>
                      <div className="p-1.5 rounded-[2px] bg-[#FAF9F6]/20 text-[#FAF9F6] shrink-0">
                        <ZoomIn size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Sub-note */}
        <p className="text-center text-[12px] text-[#6B6A66] italic mt-8 tracking-wider">
          (Nhấp vào bất kỳ ảnh nào để xem kích thước lớn toàn màn hình)
        </p>

        {/* Lightbox Modal */}
        <LightboxModal
          photos={gallery}
          activeIndex={activePhotoIndex}
          onClose={() => setActivePhotoIndex(null)}
          onSelectIndex={(index) => setActivePhotoIndex(index)}
        />
      </div>
    </section>
  )
}
