'use client'

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { weddingData } from '@/data/wedding-data'

interface WeddingEnvelopeProps {
  onOpened?: () => void
}

export function WeddingEnvelope({ onOpened }: WeddingEnvelopeProps) {
  const { groom, bride, monogram, event } = weddingData
  const [isVisible, setIsVisible] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const hasOpened = sessionStorage.getItem('wedding_envelope_opened')
    if (!hasOpened) {
      setIsVisible(true)
    }
  }, [])

  const handleOpen = () => {
    if (isOpen) return
    setIsOpen(true)
    sessionStorage.setItem('wedding_envelope_opened', 'true')

    // Sau khi nắp lật và thiệp trượt lên hoàn tất, bắt đầu làm mờ và ẩn overlay
    setTimeout(() => {
      setIsFadingOut(true)
    }, 1800)

    setTimeout(() => {
      setIsVisible(false)
      setIsOpen(false)
      setIsFadingOut(false)
      if (onOpened) onOpened()
    }, 2600)
  }

  // Lắng nghe sự kiện mở lại từ nút trên Navbar
  useEffect(() => {
    const handleReopen = () => {
      setIsOpen(false)
      setIsFadingOut(false)
      setIsVisible(true)
    }
    window.addEventListener('reopen-wedding-envelope', handleReopen)
    return () => window.removeEventListener('reopen-wedding-envelope', handleReopen)
  }, [])

  if (!isMounted || !isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e1914]/50 backdrop-blur-md transition-opacity duration-800 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* CSS Nhúng trực tiếp cho các cánh gấp 3D, bóng đổ và chuyển động */}
      <style jsx>{`
        .envelope-perspective {
          perspective: 1200px;
        }

        .envelope-box {
          transform-style: preserve-3d;
          transition: transform 0.4s ease;
        }

        .flap-left {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 0;
          height: 0;
          border-top: 110px solid transparent;
          border-bottom: 110px solid transparent;
          border-left: 165px solid #ede7d8;
          z-index: 3;
          pointer-events: none;
          filter: drop-shadow(2px 0 2px rgba(0, 0, 0, 0.03));
        }

        .flap-right {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 0;
          height: 0;
          border-top: 110px solid transparent;
          border-bottom: 110px solid transparent;
          border-right: 165px solid #ede7d8;
          z-index: 3;
          pointer-events: none;
          filter: drop-shadow(-2px 0 2px rgba(0, 0, 0, 0.03));
        }

        .flap-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          width: 0;
          height: 0;
          border-left: 165px solid transparent;
          border-right: 165px solid transparent;
          border-bottom: 120px solid #e5dfcf;
          z-index: 3;
          pointer-events: none;
          filter: drop-shadow(0 -2px 3px rgba(0, 0, 0, 0.04));
        }

        .flap-top {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          width: 0;
          height: 0;
          border-left: 165px solid transparent;
          border-right: 165px solid transparent;
          border-top: 125px solid #f2edd8;
          transform-origin: top center;
          transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1), z-index 0.2s 0.3s;
          z-index: 4;
          filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.08));
        }

        @media (min-width: 640px) {
          .flap-left {
            border-top: 130px solid transparent;
            border-bottom: 130px solid transparent;
            border-left: 200px solid #ede7d8;
          }
          .flap-right {
            border-top: 130px solid transparent;
            border-bottom: 130px solid transparent;
            border-right: 200px solid #ede7d8;
          }
          .flap-bottom {
            border-left: 200px solid transparent;
            border-right: 200px solid transparent;
            border-bottom: 145px solid #e5dfcf;
          }
          .flap-top {
            border-left: 200px solid transparent;
            border-right: 200px solid transparent;
            border-top: 150px solid #f2edd8;
          }
        }

        .envelope-box.is-open .flap-top {
          transform: rotateX(180deg);
          z-index: 1;
          filter: drop-shadow(0 -4px 6px rgba(0, 0, 0, 0.06));
        }

        .wax-seal {
          position: absolute;
          top: 52%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: linear-gradient(135deg, #b8860b 0%, #d4af37 50%, #8b6508 100%);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35), inset 0 2px 4px rgba(255, 255, 255, 0.4);
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease;
        }

        .wax-seal-inner {
          width: 44px;
          height: 44px;
          border: 1.5px dashed rgba(255, 255, 255, 0.75);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 15px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
        }

        .envelope-box.is-open .wax-seal {
          transform: translate(-50%, -50%) scale(0.3);
          opacity: 0;
          pointer-events: none;
        }

        .letter-card {
          position: absolute;
          top: 10px;
          left: 12px;
          right: 12px;
          bottom: 10px;
          background: #ffffff;
          border-radius: 4px;
          border: 1px solid rgba(176, 141, 87, 0.35);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          padding: 16px;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          transition: transform 0.85s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .envelope-box.is-open .letter-card {
          transform: translateY(-115px) scale(1.04);
          z-index: 5;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.22);
        }

        @media (min-width: 640px) {
          .envelope-box.is-open .letter-card {
            transform: translateY(-140px) scale(1.05);
          }
        }

        .btn-open-envelope {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 28px;
          background: rgba(255, 255, 255, 0.98);
          color: #2c3e50;
          font-weight: 600;
          font-size: 15px;
          letter-spacing: 0.04em;
          border-radius: 9999px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(212, 175, 55, 0.4);
          cursor: pointer;
          transition: all 0.3s ease;
          animation: pulseOpenBtn 2s infinite ease-in-out;
        }

        .btn-open-envelope:hover {
          transform: scale(1.05);
          background: #ffffff;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22), 0 0 0 2px rgba(212, 175, 55, 0.7);
        }

        @keyframes pulseOpenBtn {
          0%, 100% {
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16), 0 0 0 0 rgba(212, 175, 55, 0.55);
          }
          50% {
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16), 0 0 0 14px rgba(212, 175, 55, 0);
          }
        }

        .hand-icon {
          display: inline-block;
          font-size: 18px;
          animation: bounceHand 1.4s infinite ease-in-out;
        }

        @keyframes bounceHand {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
      `}</style>

      {/* Nút thoát / bỏ qua xem trang ngay */}
      <button
        type="button"
        onClick={() => {
          sessionStorage.setItem('wedding_envelope_opened', 'true')
          setIsVisible(false)
        }}
        className="absolute top-6 right-6 p-2 rounded-full text-[#FAF9F6]/80 hover:text-[#FAF9F6] hover:bg-[#FAF9F6]/10 transition-colors z-50 flex items-center space-x-1.5 text-[12px] uppercase tracking-wider"
        title="Vào xem trang ngay"
      >
        <span>Vào trang</span>
        <X size={16} />
      </button>

      {/* Wrapper chính của phong bì với hiệu ứng 3D Perspective */}
      <div className="envelope-perspective relative flex flex-col items-center gap-7 select-none">
        {/* Lời tựa thanh nhã bên trên */}
        <div className="text-center text-[#FAF9F6] animate-fadeIn">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-medium block mb-1">
            Thiệp Mời Cưới Trực Tuyến
          </span>
          <h2 className="font-script text-[40px] sm:text-[48px] text-[#FAF9F6] leading-none">
            {groom.shortName} &amp; {bride.shortName}
          </h2>
        </div>

        {/* Khung phong bì 3D */}
        <div
          onClick={handleOpen}
          className={`envelope-box relative w-[330px] sm:w-[400px] h-[220px] sm:h-[260px] bg-[#f7f3e8] rounded-[6px] shadow-[0_20px_45px_rgba(0,0,0,0.3),0_0_0_1px_rgba(176,141,87,0.3)] cursor-pointer ${
            isOpen ? 'is-open' : 'hover:scale-[1.02]'
          }`}
        >
          {/* Cánh gập trái (Flap Left) */}
          <div className="flap-left" />

          {/* Cánh gập phải (Flap Right) */}
          <div className="flap-right" />

          {/* Cánh gập đáy (Flap Bottom) */}
          <div className="flap-bottom" />

          {/* Cánh nắp trên lật 3D 180 độ (Flap Top) */}
          <div className="flap-top" />

          {/* Con dấu sáp niêm phong Hoàng kim (Wax Seal) */}
          <div className="wax-seal">
            <div className="wax-seal-inner">
              <span>{monogram}</span>
            </div>
          </div>

          {/* Tấm thiệp bên trong (Inner Letter Card) trượt lên khi nắp mở */}
          <div className="letter-card">
            <div className="w-full h-full border border-[#B08D57]/40 rounded-[2px] p-4 flex flex-col items-center justify-between bg-gradient-to-b from-[#ffffff] to-[#FAF9F6]">
              <span className="px-3 py-1 bg-[#8A6B3D]/10 text-[#8A6B3D] text-[10px] uppercase tracking-[0.2em] font-semibold rounded-full">
                HÂN HẠNH ĐÓN TIẾP
              </span>

              <div className="my-1">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#6B6A66] block">
                  Lễ Thành Hôn
                </span>
                <p className="font-script text-[30px] sm:text-[36px] text-[#3A3A38] leading-tight my-0.5">
                  {groom.shortName} &amp; {bride.shortName}
                </p>
                <span className="font-serif text-[12px] sm:text-[13px] text-[#8A6B3D] font-medium tracking-wider">
                  {event.solarDate}
                </span>
              </div>

              <div className="w-12 h-[1px] bg-[#B08D57]/50" />

              <span className="text-[11px] text-[#6B6A66] italic">
                Trống Đồng Palace Linh Đàm
              </span>
            </div>
          </div>
        </div>

        {/* Nút bấm hình viên thuốc phát sáng nhịp nhàng với bàn tay nhấp nhô */}
        <div
          className={`transition-all duration-400 ${
            isOpen ? 'opacity-0 translate-y-3 pointer-events-none' : 'opacity-100 translate-y-0'
          }`}
        >
          <button
            type="button"
            onClick={handleOpen}
            className="btn-open-envelope"
          >
            <span className="hand-icon">👆</span>
            <span>Nhấn để mở thiệp</span>
          </button>
        </div>
      </div>
    </div>
  )
}
