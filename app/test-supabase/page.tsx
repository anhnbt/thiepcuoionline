import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: guests, error } = await supabase.from('rsvp_guests').select()

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-8 text-[#3A3A38] font-sans">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-[#B08D57]/20">
        <h1 className="text-2xl font-serif font-bold text-[#3A3A38] mb-4">
          Kiểm tra kết nối Supabase
        </h1>

        {error ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-lg mb-6">
            <p className="font-semibold">Trạng thái kết nối:</p>
            <p className="text-sm mt-1 font-mono">{error.message}</p>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg mb-6">
            <p className="font-semibold">✓ Kết nối Supabase thành công!</p>
            <p className="text-sm mt-1">Đã tìm thấy {guests?.length ?? 0} bản ghi trong bảng rsvp_guests.</p>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-2">
            Danh sách khách mời (rsvp_guests):
          </h2>
          {guests && guests.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {guests.map((g: Record<string, unknown>, index: number) => (
                <li key={(g.id as string | number) || index}>
                  <strong>{String(g.guest_name)}</strong> ({String(g.phone)}) — Trạng thái: {String(g.status)}
                  {g.wishes ? ` — Lời chúc: "${String(g.wishes)}"` : ''}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-stone-400 italic">Chưa có bản ghi nào.</p>
          )}
        </div>

        <div className="pt-4 border-t border-stone-200">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-[#8A6B3D] hover:underline"
          >
            ← Quay lại trang thiệp cưới chính
          </Link>
        </div>
      </div>
    </div>
  )
}
