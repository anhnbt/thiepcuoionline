'use client'

import React, { useState, useEffect } from 'react'
import { Menu, X, Mail } from 'lucide-react'
import { weddingData } from '@/data/wedding-data'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Câu chuyện', href: '#story' },
    { label: 'Lịch trình', href: '#timeline' },
    { label: 'Địa điểm', href: '#location' },
    { label: 'Album ảnh', href: '#gallery' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#B08D57]/20 shadow-xs py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand Monogram */}
        <a
          href="#top"
          className="font-serif text-xl md:text-2xl tracking-widest text-[#3A3A38] hover:text-[#8A6B3D] transition-colors shrink-0"
          aria-label="Về đầu trang"
        >
          <span className="font-script text-2xl md:text-3xl text-[#8A6B3D]">
            {weddingData.groom.shortName.charAt(0)}
          </span>
          <span className="text-[#B08D57] mx-1 text-sm">&amp;</span>
          <span className="font-script text-2xl md:text-3xl text-[#8A6B3D]">
            {weddingData.bride.shortName.charAt(0)}
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <nav className="flex items-center space-x-5 lg:space-x-7 text-[11px] font-medium tracking-[0.18em] uppercase text-[#6B6A66]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-[#8A6B3D] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#8A6B3D] hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 shrink-0">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('reopen-wedding-envelope'))}
              className="w-9 h-9 rounded-[4px] border border-[#B08D57] text-[#8A6B3D] hover:bg-[#8A6B3D] hover:text-[#FAF9F6] transition-all duration-200 flex items-center justify-center shrink-0"
              title="Mở lại phong bì thiệp mời"
              aria-label="Mở lại phong bì thiệp mời"
            >
              <Mail size={15} />
            </button>
            <a
              href="#rsvp"
              className="px-5 py-2.5 bg-[#8A6B3D] hover:bg-[#735730] text-[#FAF9F6] text-[10px] tracking-[0.2em] font-semibold rounded-[4px] uppercase transition-all duration-200 shrink-0"
            >
              Xác nhận tham dự
            </a>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#3A3A38] hover:text-[#8A6B3D] focus:outline-hidden"
          aria-label="Bật tắt menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF9F6]/98 backdrop-blur-lg border-b border-[#B08D57]/30 px-6 py-5 animate-fade-in shadow-lg">
          <nav className="flex flex-col space-y-4 text-center">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[12px] font-medium tracking-[0.18em] uppercase text-[#3A3A38] hover:text-[#8A6B3D] py-2 border-b border-[#B08D57]/10"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false)
                window.dispatchEvent(new CustomEvent('reopen-wedding-envelope'))
              }}
              className="flex items-center justify-center space-x-2 py-2.5 border border-[#B08D57] text-[#8A6B3D] text-[11px] tracking-[0.18em] uppercase font-semibold rounded-[4px]"
            >
              <Mail size={14} />
              <span>Mở lại phong bì thiệp mời</span>
            </button>
            <a
              href="#rsvp"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-1 inline-block px-5 py-3 bg-[#8A6B3D] text-[#FAF9F6] text-[11px] tracking-[0.2em] font-semibold rounded-[4px] uppercase"
            >
              Xác nhận tham dự (RSVP)
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
