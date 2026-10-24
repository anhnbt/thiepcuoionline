'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import {
  BarChart3,
  RefreshCw,
  AlertTriangle,
  Info,
  Calendar,
  Sparkles,
  Database
} from 'lucide-react'

export interface ThongKeRow {
  ngay: string
  so_luong: number
  cap_nhat_luc: string
}

export function DailyStatsDashboard() {
  const [rows, setRows] = useState<ThongKeRow[]>([])
  const [loi, setLoi] = useState<string | null>(null)
  const [dangTai, setDangTai] = useState(true)
  const [dangCapNhat, setDangCapNhat] = useState(false)

  // Đọc dữ liệu từ bảng thong_ke_ngay
  async function tai() {
    setDangTai(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('thong_ke_ngay')
        .select('ngay, so_luong, cap_nhat_luc')
        .order('ngay', { ascending: false })
        .limit(14)

      // Hiện lỗi thật ra màn hình. Đừng nuốt lỗi — buổi này dạy đọc lỗi.
      if (error) {
        setLoi(error.message)
      } else {
        setRows((data as ThongKeRow[]) || [])
        setLoi(null)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Lỗi không xác định khi kết nối Supabase'
      setLoi(message)
    } finally {
      setDangTai(false)
    }
  }

  // Nút dự phòng khi chưa bật được pg_cron: tự gọi hàm tổng hợp RPC
  async function capNhatNgay() {
    setDangCapNhat(true)
    setLoi(null)
    try {
      const supabase = createClient()
      const { error } = await supabase.rpc('cap_nhat_thong_ke')
      if (error) {
        setLoi(error.message)
      } else {
        await tai()
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Lỗi khi gọi RPC cap_nhat_thong_ke'
      setLoi(message)
    } finally {
      setDangCapNhat(false)
    }
  }

  useEffect(() => {
    tai()
  }, [])

  return (
    <div className="space-y-6">
      {/* Tiêu đề & Nút thao tác */}
      <div className="bg-white border border-[#B08D57]/30 rounded-[2px] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[12px] uppercase tracking-wider text-[#8A6B3D] font-semibold mb-1">
            <BarChart3 size={15} />
            <span>Báo Cáo Bảng Tổng Hợp (Buổi 4)</span>
          </div>
          <h2 className="font-serif text-[20px] sm:text-[22px] text-[#3A3A38] font-medium">
            Thống Kê Phản Hồi 14 Ngày Gần Nhất
          </h2>
          {rows.length > 0 && rows[0]?.cap_nhat_luc && (
            <p className="text-[12px] text-[#6B6A66] mt-0.5">
              Cập nhật lần cuối:{' '}
              <span className="font-mono text-[#3A3A38]">
                {new Date(rows[0].cap_nhat_luc).toLocaleString('vi-VN')}
              </span>
            </p>
          )}
        </div>

        {/* Nút hành động */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={tai}
            disabled={dangTai}
            className="inline-flex items-center space-x-1.5 px-3 py-2 border border-[#B08D57]/40 hover:border-[#8A6B3D] hover:bg-[#8A6B3D]/5 text-[12px] text-[#8A6B3D] rounded-[2px] transition-colors cursor-pointer disabled:opacity-50"
            title="Đọc lại dữ liệu từ bảng thong_ke_ngay"
          >
            <RefreshCw size={13} className={dangTai ? 'animate-spin' : ''} />
            <span>{dangTai ? 'Đang tải...' : 'Tải lại dữ liệu'}</span>
          </button>

          <button
            type="button"
            onClick={capNhatNgay}
            disabled={dangCapNhat || dangTai}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-[#8A6B3D] hover:bg-[#735730] text-[#FAF9F6] text-[12px] font-medium rounded-[2px] shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            title="Gọi hàm RPC cap_nhat_thong_ke() trên Supabase để gom dữ liệu mới nhất"
          >
            <Sparkles size={13} className={dangCapNhat ? 'animate-spin' : ''} />
            <span>{dangCapNhat ? 'Đang tính toán...' : 'Cập nhật ngay (RPC)'}</span>
          </button>
        </div>
      </div>

      {/* 1. MÀN HÌNH ĐANG TẢI */}
      {dangTai && (
        <div className="p-8 bg-white border border-[#B08D57]/20 rounded-[2px] flex flex-col items-center justify-center text-[#6B6A66]">
          <RefreshCw size={24} className="animate-spin text-[#8A6B3D] mb-2" />
          <p className="text-[13px]">Đang tải thống kê từ Supabase...</p>
        </div>
      )}

      {/* 2. HIỆN LỖI THẬT RA MÀN HÌNH (Đúng theo thiết kế bài giảng: tập đọc mã lỗi) */}
      {!dangTai && loi && (
        <div className="p-5 border border-[#BA1A1A]/40 bg-[#BA1A1A]/5 rounded-[2px] text-[#BA1A1A]">
          <div className="flex items-start space-x-2.5">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <div className="text-[13px] space-y-2">
              <p className="font-semibold">Chưa đọc được dữ liệu từ Supabase:</p>
              <div className="p-2.5 bg-white border border-[#BA1A1A]/20 rounded-[2px] font-mono text-[12px] text-[#BA1A1A] break-all">
                {loi}
              </div>
              <p className="text-[12px] text-[#3A3A38] leading-relaxed">
                💡 <strong>Gợi ý đọc lỗi:</strong> Mở DevTools (F12) → tab <strong>Network</strong>, tìm request tới{' '}
                <code className="bg-[#EFEEEB] px-1 py-0.5 rounded text-[11px] font-mono text-[#8A6B3D]">thong_ke_ngay</code> hoặc{' '}
                <code className="bg-[#EFEEEB] px-1 py-0.5 rounded text-[11px] font-mono text-[#8A6B3D]">rpc/cap_nhat_thong_ke</code>:
              </p>
              <ul className="list-disc pl-5 text-[12px] text-[#6B6A66] space-y-1">
                <li><strong>401:</strong> Sai hoặc thiếu API key / Publishable key trong file <code>.env</code>.</li>
                <li><strong>404 / relation does not exist:</strong> Chưa chạy file <code>01-bang-thong-ke.sql</code> trên Supabase SQL Editor.</li>
                <li><strong>function does not exist:</strong> Chưa chạy file <code>02-ham-tong-hop.sql</code> để tạo hàm <code>cap_nhat_thong_ke()</code>.</li>
                <li><strong>400 / 500:</strong> Lỗi truy vấn hoặc quyền bảo mật phía database.</li>
              </ul>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={capNhatNgay}
                  className="px-3 py-1.5 bg-[#BA1A1A] text-white text-[12px] rounded-[2px] hover:bg-[#93000A] transition-colors cursor-pointer"
                >
                  Thử gọi lại cap_nhat_thong_ke()
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. BẢNG RỖNG (Cảnh báo bẫy RLS) */}
      {!dangTai && !loi && rows.length === 0 && (
        <div className="p-5 border border-[#B08D57]/30 bg-[#FAF9F6] rounded-[2px] text-[#3A3A38]">
          <div className="flex items-start space-x-2.5">
            <Info size={18} className="shrink-0 mt-0.5 text-[#8A6B3D]" />
            <div className="text-[13px] space-y-2">
              <p className="font-semibold text-[#8A6B3D]">
                Bảng thống kê đang rỗng — Request đã thành công (200) nhưng không có dòng nào trả về.
              </p>
              <p className="text-[12px] text-[#6B6A66] leading-relaxed">
                Hai nguyên nhân, phân biệt được mới sửa đúng:
              </p>
              <ol className="list-decimal pl-5 text-[12px] text-[#6B6A66] space-y-1">
                <li>
                  <strong>Bảng thật sự chưa có dữ liệu:</strong> Bạn chưa gom dữ liệu từ <code>rsvp_guests</code> sang. Hãy bấm nút <strong>"Cập nhật ngay (RPC)"</strong> bên dưới hoặc chạy lệnh <code>select cap_nhat_thong_ke();</code> trong SQL Editor.
                </li>
                <li>
                  <strong className="text-[#3A3A38]">Policy RLS đang chặn (Bẫy kinh điển):</strong> Đây là chỗ bẫy nhất, vì request vẫn trả về <code>200 OK</code> với mảng rỗng <code>[]</code> chứ không báo lỗi gì. Kiểm tra bằng cách chạy <code>select * from thong_ke_ngay;</code> trong Supabase SQL Editor: nếu trong SQL ra kết quả mà trên trang web này vẫn rỗng thì 100% do RLS chặn quyền đọc!
                </li>
              </ol>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={capNhatNgay}
                  disabled={dangCapNhat}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-[#8A6B3D] hover:bg-[#735730] text-[#FAF9F6] text-[12px] font-medium rounded-[2px] transition-colors cursor-pointer"
                >
                  <Sparkles size={13} className={dangCapNhat ? 'animate-spin' : ''} />
                  <span>Kích hoạt hàm cap_nhat_thong_ke() ngay</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. BIỂU ĐỒ CỘT CSS THUẦN (Cố tình KHÔNG dùng thư viện ngoài) */}
      {!dangTai && !loi && rows.length > 0 && (
        <div className="space-y-6">
          <div className="bg-white border border-[#B08D57]/30 rounded-[2px] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#B08D57]/20">
              <div className="flex items-center space-x-2">
                <BarChart3 size={18} className="text-[#8A6B3D]" />
                <h3 className="font-serif text-[17px] text-[#3A3A38] font-medium">
                  Biểu đồ số lượng phản hồi theo ngày
                </h3>
              </div>
              <span className="text-[11px] text-[#6B6A66] bg-[#EFEEEB] px-2 py-0.5 rounded-[2px] font-mono">
                CSS Thuần • 14 ngày gần nhất
              </span>
            </div>

            {/* Khung Biểu Đồ Cột Ngang Dựng Bằng CSS Thuần */}
            {(() => {
              const maxCount = Math.max(...rows.map((r) => r.so_luong), 1)
              return (
                <div className="space-y-3 pt-2">
                  {rows.map((r) => {
                    const percentage = Math.round((r.so_luong / maxCount) * 100)
                    const formattedDate = new Date(r.ngay).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })

                    return (
                      <div
                        key={r.ngay}
                        className="flex items-center space-x-3 group hover:bg-[#FAF9F6] p-1.5 rounded transition-colors"
                      >
                        {/* Cột Ngày */}
                        <div className="w-24 shrink-0 text-[12px] font-mono text-[#6B6A66] flex items-center space-x-1">
                          <Calendar size={12} className="text-[#8A6B3D]/70 shrink-0" />
                          <span>{formattedDate}</span>
                        </div>

                        {/* Thanh Biểu Đồ CSS */}
                        <div className="flex-1 bg-[#EFEEEB] h-6 rounded-[2px] overflow-hidden flex items-center relative">
                          <div
                            style={{
                              width: `${percentage}%`,
                              minWidth: r.so_luong > 0 ? '8px' : '0px'
                            }}
                            className="h-full bg-[#8A6B3D] group-hover:bg-[#735730] transition-all duration-500 rounded-[2px] flex items-center justify-end pr-2"
                          />
                        </div>

                        {/* Nhãn Số Lượng */}
                        <div className="w-12 text-right shrink-0">
                          <span className="font-mono text-[13px] font-semibold text-[#3A3A38]">
                            {r.so_luong}
                          </span>
                          <span className="text-[10px] text-[#6B6A66] ml-1">lượt</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })()}

            {/* Chú thích biểu đồ */}
            <div className="mt-6 pt-4 border-t border-[#B08D57]/15 flex items-center justify-between text-[11px] text-[#6B6A66]">
              <span>Tỷ lệ chiều dài cột phản ánh số lượng tương đối giữa các ngày.</span>
              <span className="font-medium text-[#8A6B3D]">Tối đa 14 ngày</span>
            </div>
          </div>

          {/* BẢNG CHI TIẾT SỐ LIỆU */}
          <div className="bg-white border border-[#B08D57]/30 rounded-[2px] overflow-hidden shadow-xs">
            <div className="p-4 bg-[#FAF9F6] border-b border-[#B08D57]/20 flex items-center space-x-2">
              <Database size={15} className="text-[#8A6B3D]" />
              <h4 className="font-serif text-[15px] font-medium text-[#3A3A38]">
                Bảng dữ liệu chi tiết từ <code>thong_ke_ngay</code>
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="border-b border-[#B08D57]/20 bg-[#FAF9F6]/50 text-[#6B6A66] text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-2.5 px-4">Ngày</th>
                    <th className="py-2.5 px-4 text-center">Số lượng phản hồi</th>
                    <th className="py-2.5 px-4">Thời gian tổng hợp gần nhất</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#B08D57]/10 font-mono text-[12px]">
                  {rows.map((row) => (
                    <tr key={row.ngay} className="hover:bg-[#FAF9F6]/60 transition-colors">
                      <td className="py-2.5 px-4 font-semibold text-[#3A3A38]">
                        {new Date(row.ngay).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <span className="inline-block px-2.5 py-0.5 bg-[#8A6B3D]/10 text-[#8A6B3D] font-bold rounded-[2px]">
                          {row.so_luong}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-[#6B6A66]">
                        {new Date(row.cap_nhat_luc).toLocaleString('vi-VN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DailyStatsDashboard
