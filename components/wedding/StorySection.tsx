import React from 'react'
import { Heart } from 'lucide-react'
import { weddingData } from '@/data/wedding-data'

export function StorySection() {
  const { groom, bride, quotes } = weddingData

  return (
    <section id="story" className="py-20 md:py-28 bg-[#FAF9F6] border-t border-[#B08D57]/20">
      <div className="wedding-container text-center">
        {/* Eyebrow */}
        <p className="text-[11px] md:text-[12px] uppercase tracking-[0.25em] text-[#8A6B3D] font-medium mb-3">
          {quotes.storyEyebrow}
        </p>

        {/* Section Heading */}
        <h2 className="font-serif text-[28px] sm:text-[36px] md:text-[40px] text-[#3A3A38] font-normal leading-tight mb-8">
          {quotes.storyTitle}
        </h2>

        {/* Family representation (Nhà trai & Nhà gái) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-10 max-w-[620px] mx-auto text-center">
          {/* Groom side */}
          <div className="p-6 border border-[#B08D57]/40 bg-[#FAF9F6] rounded-[2px]">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8A6B3D] font-semibold block mb-2">
              Nhà Trai
            </span>
            <p className="text-[14px] text-[#6B6A66] mb-3 leading-relaxed">
              {groom.parents}
            </p>
            <div className="border-t border-[#B08D57]/20 pt-3">
              <span className="text-[11px] text-[#6B6A66] uppercase tracking-wider block mb-1">
                {groom.title}
              </span>
              <h3 className="font-serif text-[22px] text-[#3A3A38] font-medium">
                {groom.name}
              </h3>
            </div>
          </div>

          {/* Bride side */}
          <div className="p-6 border border-[#B08D57]/40 bg-[#FAF9F6] rounded-[2px]">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8A6B3D] font-semibold block mb-2">
              Nhà Gái
            </span>
            <p className="text-[14px] text-[#6B6A66] mb-3 leading-relaxed">
              {bride.parents}
            </p>
            <div className="border-t border-[#B08D57]/20 pt-3">
              <span className="text-[11px] text-[#6B6A66] uppercase tracking-wider block mb-1">
                {bride.title}
              </span>
              <h3 className="font-serif text-[22px] text-[#3A3A38] font-medium">
                {bride.name}
              </h3>
            </div>
          </div>
        </div>

        {/* Story Narrative */}
        <div className="max-w-[560px] mx-auto mt-8 mb-6">
          <p className="text-[15px] md:text-[16px] text-[#6B6A66] leading-relaxed font-light">
            {quotes.storyContent}
          </p>
        </div>

        {/* Verse Quote */}
        <p className="font-serif italic text-[16px] md:text-[17px] text-[#8A6B3D] max-w-[480px] mx-auto my-6">
          {quotes.storyVerse}
        </p>

        {/* Delicate Golden Ornament */}
        <div className="flex items-center justify-center space-x-4 my-8">
          <span className="w-16 h-[1px] bg-[#B08D57]/50" />
          <Heart size={14} className="text-[#B08D57] fill-[#B08D57]/20" />
          <span className="w-16 h-[1px] bg-[#B08D57]/50" />
        </div>
      </div>
    </section>
  )
}
