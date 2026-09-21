import { Analytics } from '@vercel/analytics/next'
import { Be_Vietnam_Pro, Playfair_Display, Great_Vibes } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const beVietnam = Be_Vietnam_Pro({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-be-vietnam',
  display: 'swap',
})

const playfair = Playfair_Display({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-playfair',
  display: 'swap',
})

const greatVibes = Great_Vibes({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-great-vibes',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Tuấn Anh & Hoa — Thiệp Cưới & RSVP Online',
  description:
    'Trân trọng kính mời bạn đến chung vui cùng Tuấn Anh & Hoa vào lúc 17:30 ngày 25 tháng 12, 2026 tại Trống Đồng Palace Linh Đàm, Hà Nội.',
  openGraph: {
    title: 'Tuấn Anh & Hoa — Thiệp Cưới & RSVP Online',
    description:
      'Trân trọng kính mời bạn đến chung vui cùng Tuấn Anh & Hoa vào ngày 25 tháng 12, 2026 tại Trống Đồng Palace Linh Đàm, Hà Nội.',
    type: 'website',
    locale: 'vi_VN',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
        width: 1200,
        height: 630,
        alt: 'Thiệp cưới Tuấn Anh & Hoa',
      },
    ],
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#FAF9F6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="vi"
      className={`scroll-smooth ${beVietnam.variable} ${playfair.variable} ${greatVibes.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="font-sans bg-[#FAF9F6] text-[#3A3A38] antialiased selection:bg-[#B08D57]/20 selection:text-[#3A3A38]"
      >
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
