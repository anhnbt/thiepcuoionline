'use client'

import React, { useState, useEffect } from 'react'
import { weddingData } from '@/data/wedding-data'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  isCompleted: boolean
}

export function CountdownTimer() {
  const { event } = weddingData
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false,
  })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Đám cưới lúc 17:30 ngày 25 tháng 12 năm 2026 (Giờ Việt Nam UTC+7)
    const targetDate = new Date(`${event.year}-${String(event.month).padStart(2, '0')}-${String(event.day).padStart(2, '0')}T17:30:00+07:00`).getTime()

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isCompleted: true,
        })
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isCompleted: false,
      })
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [event.year, event.month, event.day])

  const timeUnits = [
    { label: 'Ngày', value: isMounted ? timeLeft.days : 0 },
    { label: 'Giờ', value: isMounted ? timeLeft.hours : 0 },
    { label: 'Phút', value: isMounted ? timeLeft.minutes : 0 },
    { label: 'Giây', value: isMounted ? timeLeft.seconds : 0 },
  ]

  if (timeLeft.isCompleted) {
    return (
      <div className="my-6 p-4 bg-[#FAF9F6] border border-[#B08D57] rounded-[2px] max-w-[420px] mx-auto text-center">
        <p className="font-serif text-[18px] text-[#8A6B3D] tracking-wide">
          Hôm nay là ngày chung đôi của chúng mình!
        </p>
      </div>
    )
  }

  return (
    <div className="my-6 max-w-[460px] mx-auto">
      {/* Tiêu đề nhỏ dẫn nhập */}
      <div className="flex items-center justify-center space-x-2 mb-3">
        <span className="w-4 h-[1px] bg-[#B08D57]/60" />
        <span className="text-[11px] uppercase tracking-[0.2em] text-[#8A6B3D] font-medium">
          Cùng đếm ngược khoảnh khắc
        </span>
        <span className="w-4 h-[1px] bg-[#B08D57]/60" />
      </div>

      {/* 4 khối đếm ngược */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {timeUnits.map((unit, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-2.5 sm:p-3 bg-[#FAF9F6] border border-[#B08D57]/50 rounded-[2px] shadow-[0_2px_8px_rgba(58,58,56,0.04)]"
          >
            <span className="font-serif text-[26px] sm:text-[34px] md:text-[38px] text-[#8A6B3D] font-medium leading-none tabular-nums">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-[#6B6A66] mt-1.5 font-medium">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
