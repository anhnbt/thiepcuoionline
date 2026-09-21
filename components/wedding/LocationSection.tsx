import React from 'react'
import { MapPin, Navigation, Clock, Building2 } from 'lucide-react'
import { weddingData } from '@/data/wedding-data'

export function LocationSection() {
  const { venues } = weddingData

  return (
    <section id="location" className="py-20 md:py-28 bg-[#FAF9F6] border-t border-[#B08D57]/20">
      <div className="wedding-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-[11px] md:text-[12px] uppercase tracking-[0.25em] text-[#8A6B3D] font-medium mb-3">
            Địa điểm &amp; Chỉ đường
          </p>
          <h2 className="font-serif text-[28px] sm:text-[36px] md:text-[40px] text-[#3A3A38] font-normal leading-tight">
            Nơi Hạnh Phúc Đơm Hoa
          </h2>
          <p className="text-[14px] text-[#6B6A66] mt-3 font-light max-w-[420px] mx-auto">
            Chúng mình rất mong được đón tiếp bạn tại không gian ấm cúng và sang trọng của Trống Đồng Palace.
          </p>
        </div>

        {/* Venues Grid / Cards */}
        <div className="space-y-8">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="bg-[#FAF9F6] border border-[#B08D57] rounded-[2px] p-6 sm:p-8 md:p-10 transition-all duration-300 hover:border-[#8A6B3D]"
            >
              {/* Badge & Title */}
              <div className="text-center sm:text-left border-b border-[#B08D57]/25 pb-6 mb-6">
                <span className="inline-block px-3 py-1 bg-[#8A6B3D]/10 text-[#8A6B3D] text-[11px] uppercase tracking-[0.2em] font-semibold rounded-[2px] mb-3">
                  {venue.type}
                </span>
                <h3 className="font-serif text-[24px] sm:text-[28px] text-[#3A3A38] font-medium">
                  {venue.venueName}
                </h3>
                {venue.hall && (
                  <p className="text-[15px] text-[#8A6B3D] font-serif italic mt-1">
                    {venue.hall}
                  </p>
                )}
              </div>

              {/* Information Rows */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-[14px] text-[#6B6A66]">
                <div className="flex items-start space-x-3">
                  <Clock size={18} className="text-[#8A6B3D] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#3A3A38] font-medium text-[13px] uppercase tracking-wider mb-0.5">
                      Thời gian
                    </strong>
                    <span>{venue.time}</span>
                    <span className="block text-[13px] text-[#8A6B3D]">{venue.date}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin size={18} className="text-[#8A6B3D] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#3A3A38] font-medium text-[13px] uppercase tracking-wider mb-0.5">
                      Địa chỉ
                    </strong>
                    <span>{venue.address}</span>
                  </div>
                </div>
              </div>

              {/* Parking and Note */}
              <div className="bg-[#EFEEEB]/60 border border-[#B08D57]/20 p-4 rounded-[2px] mb-8 text-[13px] text-[#6B6A66] flex items-start space-x-3">
                <Building2 size={16} className="text-[#8A6B3D] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Ghi chú bãi đỗ xe:</strong> Trống Đồng Palace có khu vực đỗ xe ô tô và xe máy rộng rãi ngay trước sảnh tiệc. Quý khách vui lòng đi theo sự hướng dẫn của ban quản lý tòa nhà.
                </p>
              </div>

              {/* Embedded Interactive Map Frame */}
              <div className="relative w-full h-[280px] sm:h-[320px] rounded-[2px] overflow-hidden border border-[#B08D57]/40 mb-6 bg-[#EFEEEB]">
                <iframe
                  title={`Bản đồ chỉ đường đến ${venue.venueName}`}
                  src={venue.embedMapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  aria-label={`Bản đồ vị trí ${venue.venueName}`}
                />
              </div>

              {/* Action Button: Open Google Maps Navigation */}
              <div className="text-center sm:text-right">
                <a
                  href={venue.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3 border border-[#B08D57] hover:bg-[#8A6B3D] hover:text-[#FAF9F6] text-[#8A6B3D] text-[11px] tracking-[0.18em] font-semibold uppercase rounded-[4px] transition-all duration-300"
                >
                  <Navigation size={15} />
                  <span>Mở Google Maps chỉ đường</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
