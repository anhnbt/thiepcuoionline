import { Navbar } from '@/components/wedding/Navbar'
import { HeroSection } from '@/components/wedding/HeroSection'
import { StorySection } from '@/components/wedding/StorySection'
import { TimelineSection } from '@/components/wedding/TimelineSection'
import { LocationSection } from '@/components/wedding/LocationSection'
import { GallerySection } from '@/components/wedding/GallerySection'
import { RsvpSection } from '@/components/wedding/RsvpSection'
import { AdminRsvpList } from '@/components/wedding/AdminRsvpList'
import { Footer } from '@/components/wedding/Footer'
import { MusicPlayer } from '@/components/wedding/MusicPlayer'
import { WeddingEnvelope } from '@/components/wedding/WeddingEnvelope'
import { FallingEffects } from '@/components/wedding/FallingEffects'

export default function Page() {
  return (
    <div className="relative min-h-screen bg-[#FAF9F6] text-[#3A3A38]">
      {/* Màn hình mở phong bì thiệp cưới trang trọng */}
      <WeddingEnvelope />

      {/* Hiệu ứng rơi lãng mạn (Cánh hoa / Trái tim / Bông tuyết Giáng sinh) */}
      <FallingEffects />

      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Content Sections */}
      <main id="main-content" className="relative">
        {/* Hero Section with Wedding Date, Countdown Timer and Call to Action */}
        <HeroSection />

        {/* Love Story & Family Presentation */}
        <StorySection />

        {/* Wedding Day Schedule & Timeline */}
        <TimelineSection />

        {/* Venue Location & Google Maps */}
        <LocationSection />

        {/* Photo Gallery & Auto-playing Carousel */}
        <GallerySection />

        {/* Interactive RSVP Form & Confirmation */}
        <RsvpSection />

        {/* Admin Guest List from LocalStorage */}
        <AdminRsvpList />
      </main>

      {/* Page Footer */}
      <Footer />

      {/* Floating Ambient Music Player */}
      <MusicPlayer />
    </div>
  )
}
