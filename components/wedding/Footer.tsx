import React from 'react'
import { Heart } from 'lucide-react'
import { weddingData } from '@/data/wedding-data'

export function Footer() {
  const { groom, bride, event } = weddingData

  return (
    <footer className="py-16 md:py-24 bg-[#FAF9F6] border-t border-[#B08D57]/20 text-center">
      <div className="wedding-container">
        {/* Monogram Brand Mark */}
        <div className="mb-4">
          <span className="font-script text-4xl md:text-5xl text-[#8A6B3D]">
            {groom.shortName.charAt(0)}
          </span>
          <span className="font-serif text-[#B08D57] text-xl mx-2">&amp;</span>
          <span className="font-script text-4xl md:text-5xl text-[#8A6B3D]">
            {bride.shortName.charAt(0)}
          </span>
        </div>

        {/* Closing Note */}
        <h4 className="font-serif text-[20px] md:text-[22px] text-[#3A3A38] font-normal mb-2">
          {groom.shortName} &amp; {bride.shortName}
        </h4>
        <p className="text-[14px] text-[#6B6A66] max-w-[420px] mx-auto leading-relaxed font-light mb-6">
          Hẹn gặp bạn trong ngày hạnh phúc nhất của chúng mình. Sự hiện diện của bạn là niềm vinh hạnh to lớn cho gia đình chúng mình.
        </p>

        {/* Date Milestone */}
        <div className="inline-flex items-center space-x-3 text-[11px] uppercase tracking-[0.3em] text-[#8A6B3D] font-medium border-y border-[#B08D57]/30 py-2 px-6">
          <span>{event.day}</span>
          <span>•</span>
          <span>{event.month}</span>
          <span>•</span>
          <span>{event.year}</span>
        </div>

        {/* Bottom copyright */}
        <div className="mt-10 flex items-center justify-center space-x-1 text-[11px] text-[#6B6A66]/60">
          <span>Được tạo với</span>
          <Heart size={11} className="text-[#8A6B3D] fill-[#8A6B3D]/30 inline" />
          <span>cho ngày trọng đại của Tuấn Anh &amp; Dâu Tây</span>
        </div>
      </div>
    </footer>
  )
}
