export interface TimelineItem {
  time: string
  title: string
  description: string
  icon: 'welcome' | 'ceremony' | 'banquet' | 'music' | 'photo'
}

export interface VenueItem {
  id: string
  type: 'Lễ Thành Hôn' | 'Tiệc Cưới' | 'Lễ Vu Quy'
  title: string
  venueName: string
  hall?: string
  address: string
  date: string
  time: string
  mapUrl: string
  embedMapUrl: string
}

export interface GalleryPhoto {
  id: string
  url: string
  alt: string
  caption?: string
  aspectRatio?: 'portrait' | 'landscape' | 'square'
}

export interface WeddingData {
  groom: {
    name: string
    shortName: string
    title: string
    parents: string
  }
  bride: {
    name: string
    shortName: string
    title: string
    parents: string
  }
  monogram: string
  event: {
    solarDate: string
    lunarDate: string
    dayOfWeek: string
    year: number
    month: number
    day: number
    time: string
    rsvpDeadline: string
  }
  quotes: {
    hero: string
    storyEyebrow: string
    storyTitle: string
    storyContent: string
    storyVerse: string
  }
  venues: VenueItem[]
  timeline: TimelineItem[]
  gallery: GalleryPhoto[]
  audio: {
    title: string
    artist: string
    src: string
  }
}

export const weddingData: WeddingData = {
  groom: {
    name: 'Tuấn Anh',
    shortName: 'Tuấn Anh',
    title: 'Chú rể',
    parents: 'Ông Nguyễn Văn Hùng & Bà Trần Thị Mai',
  },
  bride: {
    name: 'Hoa',
    shortName: 'Hoa',
    title: 'Cô dâu',
    parents: 'Ông Lê Văn Dũng & Bà Phạm Thị Lan',
  },
  monogram: 'T & H',
  event: {
    solarDate: '25 Tháng 12, 2026',
    lunarDate: '17 Tháng 11 năm Bính Ngọ',
    dayOfWeek: 'Thứ Sáu',
    year: 2026,
    month: 12,
    day: 25,
    time: '17:30',
    rsvpDeadline: '15 Tháng 12, 2026',
  },
  quotes: {
    hero: 'Một ngày thật đẹp sẽ trọn vẹn hơn khi có sự hiện diện và lời chúc phúc từ những người thân yêu.',
    storyEyebrow: 'Hành trình của chúng mình',
    storyTitle: 'Hai trái tim, chung một nhịp đập',
    storyContent:
      'Gặp nhau giữa dòng người tấp nập của Hà Nội, cùng nhau đi qua những mùa hoa sữa thơm nồng và những chiều thu lộng gió bên bờ hồ. Hôm nay, sau chặng đường cùng sẻ chia ngọt bùi, Tuấn Anh và Hoa vô cùng hạnh phúc khi được bước sang một trang mới của cuộc đời.',
    storyVerse: '“Hạnh phúc không phải là điểm đến, mà là một hành trình cùng nhau bước đi.”',
  },
  venues: [
    {
      id: 'banquet',
      type: 'Tiệc Cưới',
      title: 'Lễ Thành Hôn & Tiệc Cưới',
      venueName: 'Trung tâm Tiệc cưới Trống Đồng Palace Linh Đàm',
      hall: 'Sảnh Grand Ballroom — Tầng 2',
      address: 'Khu đô thị Bán đảo Linh Đàm, Phường Hoàng Liệt, Quận Hoàng Mai, Hà Nội',
      date: 'Thứ Sáu, ngày 25 tháng 12 năm 2026',
      time: '17:30 (Đón khách từ 17:00)',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Tr%E1%BB%91ng+%C4%90%E1%BB%93ng+Palace+Linh+%C4%90%C3%A0m,+H%C3%A0+N%E1%BB%99i',
      embedMapUrl: 'https://maps.google.com/maps?q=Tr%E1%BB%91ng+%C4%90%E1%BB%93ng+Palace+Linh+%C4%90%C3%A0m,+Ho%C3%A0ng+Mai,+H%C3%A0+N%E1%BB%99i&t=&z=15&ie=UTF8&iwloc=&output=embed',
    },
  ],
  timeline: [
    {
      time: '17:00',
      title: 'Đón tiếp khách quý',
      description: 'Chụp hình kỷ niệm tại sảnh hoa & ký tên chúc phúc cho cô dâu chú rể.',
      icon: 'welcome',
    },
    {
      time: '17:45',
      title: 'Lễ Thành Hôn trang trọng',
      description: 'Nghi thức trao nhẫn cưới, cắt bánh, rót rượu và nhận lời chúc từ hai bên gia đình.',
      icon: 'ceremony',
    },
    {
      time: '18:15',
      title: 'Khai tiệc mừng',
      description: 'Thưởng thức tiệc tối thân mật cùng bạn bè và người thân.',
      icon: 'banquet',
    },
    {
      time: '19:30',
      title: 'Khoảnh khắc giao lưu & Âm nhạc',
      description: 'Trò chơi gắn kết, chia sẻ kỷ niệm và những giai điệu acoustic ngọt ngào.',
      icon: 'music',
    },
    {
      time: '20:30',
      title: 'Cảm tạ & Tạm biệt',
      description: 'Trao gửi quà cảm ơn và chụp ảnh kỷ niệm trước khi ra về.',
      icon: 'photo',
    },
  ],
  gallery: [
    {
      id: 'g1',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
      alt: 'Khoảnh khắc ngọt ngào của Tuấn Anh và Hoa',
      caption: 'Khoảnh khắc ngọt ngào bên thềm hạnh phúc',
      aspectRatio: 'landscape',
    },
    {
      id: 'g2',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=85',
      alt: 'Cô dâu Hoa trong tà váy cưới tinh khôi',
      caption: 'Nụ cười rạng rỡ của cô dâu trong ngày thử váy',
      aspectRatio: 'portrait',
    },
    {
      id: 'g3',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=85',
      alt: 'Chiếc nhẫn cưới minh chứng tình yêu',
      caption: 'Kỷ vật trao tay, hẹn ước trăm năm',
      aspectRatio: 'portrait',
    },
    {
      id: 'g4',
      url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=85',
      alt: 'Nắm chặt tay nhau cùng bước về phía trước',
      caption: 'Nắm tay nhau đi qua ngàn mùa hoa',
      aspectRatio: 'landscape',
    },
    {
      id: 'g5',
      url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=85',
      alt: 'Bó hoa cưới cầm tay trang nhã',
      caption: 'Hoa hồng trắng và cành olive tinh tế',
      aspectRatio: 'portrait',
    },
    {
      id: 'g6',
      url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=85',
      alt: 'Ánh mắt trìu mến dành cho nhau',
      caption: 'Ánh mắt thay ngàn lời yêu thương',
      aspectRatio: 'portrait',
    },
  ],
  audio: {
    title: 'Until I Found You (Piano Acoustic)',
    artist: 'Wedding Melody',
    src: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=piano-moment-9835.mp3',
  },
}
