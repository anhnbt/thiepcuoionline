'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Music, VolumeX, Disc } from 'lucide-react'
import { weddingData } from '@/data/wedding-data'

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showTooltip, setShowTooltip] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Auto-hide tooltip after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false)
    }, 6000)
    return () => clearTimeout(timer)
  }, [])

  const toggleMusic = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true)
          setShowTooltip(false)
        })
        .catch((err) => {
          console.warn('Audio autoplay or playback prevented:', err)
        })
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3">
      {/* Gentle helper tooltip */}
      {showTooltip && (
        <div className="hidden sm:block bg-[#FAF9F6] border border-[#B08D57] px-3 py-1.5 rounded-[2px] shadow-sm text-[11px] text-[#6B6A66] tracking-wide animate-fade-in pointer-events-none">
          <span className="text-[#8A6B3D] font-medium">Nhạc nền cưới</span> — Bật để trải nghiệm ♫
        </div>
      )}

      {/* Floating Audio Controller */}
      <button
        onClick={toggleMusic}
        aria-label={isPlaying ? 'Tắt nhạc cưới' : 'Bật nhạc cưới'}
        title={isPlaying ? 'Tắt nhạc cưới' : 'Bật nhạc cưới'}
        className="w-[40px] h-[40px] rounded-[4px] bg-[#FAF9F6] border border-[#B08D57] hover:border-[#8A6B3D] flex items-center justify-center text-[#3A3A38] shadow-md transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-hidden cursor-pointer relative"
      >
        {isPlaying ? (
          <Disc size={18} className="text-[#8A6B3D] animate-spin-slow" />
        ) : (
          <div className="relative">
            <Music size={18} className="text-[#6B6A66]" />
            <VolumeX size={10} className="absolute -top-1 -right-1.5 text-[#8A6B3D]" />
          </div>
        )}

        {/* Small subtle active pulse dot */}
        {isPlaying && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#8A6B3D] animate-ping" />
        )}
      </button>

      {/* HTML5 Audio element */}
      <audio
        ref={audioRef}
        src={weddingData.audio.src}
        preload="none"
        loop
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  )
}
