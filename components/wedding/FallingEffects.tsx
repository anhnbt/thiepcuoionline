'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Flower2, Heart, Snowflake, EyeOff } from 'lucide-react'

type EffectType = 'petals' | 'hearts' | 'snow' | 'off'

interface Particle {
  x: number
  y: number
  size: number
  speedY: number
  speedX: number
  rotation: number
  rotationSpeed: number
  opacity: number
  color: string
}

export function FallingEffects() {
  const [effectType, setEffectType] = useState<EffectType>('petals')
  const [isOpenMenu, setIsOpenMenu] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Đọc cấu hình từ localStorage nếu có
  useEffect(() => {
    const saved = localStorage.getItem('wedding_falling_effect') as EffectType | null
    if (saved && ['petals', 'hearts', 'snow', 'off'].includes(saved)) {
      setEffectType(saved)
    }

    // Kiểm tra prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setEffectType('off')
    }
  }, [])

  const handleSelectEffect = (type: EffectType) => {
    setEffectType(type)
    localStorage.setItem('wedding_falling_effect', type)
    setIsOpenMenu(false)
  }

  useEffect(() => {
    if (effectType === 'off') {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    // Khởi tạo các hạt (giữ số lượng 22-26 hạt để vừa lãng mạn vừa nhẹ nhàng)
    const particleCount = 24
    const particles: Particle[] = []

    const petalColors = ['rgba(230, 160, 160, 0.7)', 'rgba(215, 130, 140, 0.65)', 'rgba(240, 185, 185, 0.75)', 'rgba(200, 110, 120, 0.6)']
    const heartColors = ['rgba(220, 100, 110, 0.65)', 'rgba(200, 80, 95, 0.6)', 'rgba(235, 140, 150, 0.7)']
    const snowColors = ['rgba(255, 255, 255, 0.85)', 'rgba(235, 240, 245, 0.75)', 'rgba(220, 230, 240, 0.9)']

    const colors = effectType === 'petals' ? petalColors : effectType === 'hearts' ? heartColors : snowColors

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: effectType === 'snow' ? Math.random() * 3.5 + 2 : Math.random() * 8 + 8,
        speedY: effectType === 'snow' ? Math.random() * 1 + 0.8 : Math.random() * 1.2 + 0.6,
        speedX: (Math.random() - 0.5) * 0.8,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.5,
        opacity: Math.random() * 0.4 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    // Hàm vẽ cánh hoa
    const drawPetal = (p: Particle) => {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rotation * Math.PI) / 180)
      ctx.beginPath()
      ctx.fillStyle = p.color
      ctx.moveTo(0, 0)
      ctx.bezierCurveTo(-p.size / 2, -p.size, -p.size, p.size / 2, 0, p.size)
      ctx.bezierCurveTo(p.size, p.size / 2, p.size / 2, -p.size, 0, 0)
      ctx.fill()
      ctx.restore()
    }

    // Hàm vẽ trái tim
    const drawHeart = (p: Particle) => {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rotation * Math.PI) / 180)
      ctx.scale(p.size / 15, p.size / 15)
      ctx.beginPath()
      ctx.fillStyle = p.color
      ctx.moveTo(0, 0)
      ctx.bezierCurveTo(-7, -7, -12, 4, 0, 12)
      ctx.bezierCurveTo(12, 4, 7, -7, 0, 0)
      ctx.fill()
      ctx.restore()
    }

    // Hàm vẽ bông tuyết tròn mờ
    const drawSnow = (p: Particle) => {
      ctx.save()
      ctx.beginPath()
      ctx.fillStyle = p.color
      ctx.shadowBlur = 4
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)'
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    // Vòng lặp chuyển động
    const render = () => {
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        p.y += p.speedY
        p.x += p.speedX + Math.sin(p.y * 0.01) * 0.4
        p.rotation += p.rotationSpeed

        if (p.y > height + 20) {
          p.y = -20
          p.x = Math.random() * width
        }
        if (p.x > width + 20) p.x = -20
        if (p.x < -20) p.x = width + 20

        if (effectType === 'petals') drawPetal(p)
        else if (effectType === 'hearts') drawHeart(p)
        else if (effectType === 'snow') drawSnow(p)
      }

      animationFrameRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [effectType])

  return (
    <>
      {/* Canvas rơi hạt toàn màn hình */}
      {effectType !== 'off' && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-30 w-full h-full"
        />
      )}

      {/* Bộ điều khiển hiệu ứng rơi tinh tế (nằm góc trái dưới) */}
      <div className="fixed bottom-6 left-6 z-40">
        <div className="relative">
          {/* Nút bật/tắt chính */}
          <button
            type="button"
            onClick={() => setIsOpenMenu(!isOpenMenu)}
            aria-label="Tùy chọn hiệu ứng rơi lãng mạn"
            className="w-10 h-10 rounded-[4px] bg-[#FAF9F6] border border-[#B08D57] text-[#8A6B3D] hover:bg-[#8A6B3D] hover:text-[#FAF9F6] transition-all duration-300 shadow-md flex items-center justify-center group"
            title="Tùy chỉnh hiệu ứng rơi: Cánh hoa, Trái tim, Bông tuyết"
          >
            {effectType === 'petals' && <Flower2 size={18} className="animate-spin-slow" />}
            {effectType === 'hearts' && <Heart size={18} className="animate-pulse" />}
            {effectType === 'snow' && <Snowflake size={18} />}
            {effectType === 'off' && <EyeOff size={18} className="text-[#6B6A66]" />}
          </button>

          {/* Menu chọn hiệu ứng popup */}
          {isOpenMenu && (
            <div className="absolute bottom-12 left-0 mb-2 p-2 bg-[#FAF9F6] border border-[#B08D57] rounded-[4px] shadow-[0_8px_24px_rgba(58,58,56,0.12)] min-w-[160px] animate-fadeIn">
              <span className="block px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-[#8A6B3D] font-medium border-b border-[#B08D57]/20 mb-1">
                Hiệu ứng rơi
              </span>
              <button
                type="button"
                onClick={() => handleSelectEffect('petals')}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 text-[12px] rounded-[2px] text-left transition-colors ${
                  effectType === 'petals' ? 'bg-[#8A6B3D] text-[#FAF9F6]' : 'text-[#3A3A38] hover:bg-[#B08D57]/10'
                }`}
              >
                <Flower2 size={14} />
                <span>Cánh hoa hồng</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectEffect('hearts')}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 text-[12px] rounded-[2px] text-left transition-colors ${
                  effectType === 'hearts' ? 'bg-[#8A6B3D] text-[#FAF9F6]' : 'text-[#3A3A38] hover:bg-[#B08D57]/10'
                }`}
              >
                <Heart size={14} />
                <span>Trái tim tình yêu</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectEffect('snow')}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 text-[12px] rounded-[2px] text-left transition-colors ${
                  effectType === 'snow' ? 'bg-[#8A6B3D] text-[#FAF9F6]' : 'text-[#3A3A38] hover:bg-[#B08D57]/10'
                }`}
              >
                <Snowflake size={14} />
                <span>Tuyết Giáng sinh</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectEffect('off')}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 text-[12px] rounded-[2px] text-left transition-colors mt-1 border-t border-[#B08D57]/20 pt-1.5 ${
                  effectType === 'off' ? 'bg-[#8A6B3D] text-[#FAF9F6]' : 'text-[#6B6A66] hover:bg-[#B08D57]/10'
                }`}
              >
                <EyeOff size={14} />
                <span>Tắt hiệu ứng</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
