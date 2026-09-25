import { Metadata } from 'next'
import { AdminDashboard } from '@/components/wedding/AdminDashboard'

export const metadata: Metadata = {
  title: 'Quản Trị Khách Mời & Thống Kê RSVP — Thiệp Cưới',
  description: 'Trang CMS quản trị danh sách phản hồi RSVP và thống kê số lượng người tham dự lễ cưới.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminPage() {
  return <AdminDashboard />
}
