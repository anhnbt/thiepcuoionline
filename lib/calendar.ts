import { weddingData } from '@/data/wedding-data'

export interface CalendarEventParams {
  title: string
  details?: string
  location?: string
  startDateUtc: string // Định dạng: YYYYMMDDTHHmmssZ
  endDateUtc: string   // Định dạng: YYYYMMDDTHHmmssZ
  timeZone?: string
}

/**
 * Sinh liên kết thêm sự kiện vào Google Calendar với các tham số mã hoá URL chuẩn.
 */
export function generateGoogleCalendarUrl(params: CalendarEventParams): string {
  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
  const searchParams = new URLSearchParams()

  searchParams.set('text', params.title)
  searchParams.set('dates', `${params.startDateUtc}/${params.endDateUtc}`)
  if (params.details) searchParams.set('details', params.details)
  if (params.location) searchParams.set('location', params.location)
  if (params.timeZone) searchParams.set('ctz', params.timeZone)

  return `${baseUrl}&${searchParams.toString()}`
}

/**
 * Lấy URL Google Calendar dành riêng cho sự kiện cưới của cặp đôi.
 * Khóa cứng ngày 26/12/2026 từ 17:00 đến 21:30 (GMT+7: 10:00 - 14:30 UTC).
 */
export function getWeddingCalendarUrl(): string {
  const { groom, bride, venues } = weddingData
  const venue = venues[0]
  const location = venue
    ? `${venue.venueName}, ${venue.address}`
    : 'Trung tâm Tiệc cưới Trống Đồng Palace Linh Đàm, Hoàng Mai, Hà Nội'

  return generateGoogleCalendarUrl({
    title: `Đám cưới ${groom.shortName} & ${bride.shortName}`,
    startDateUtc: '20261226T100000Z',
    endDateUtc: '20261226T143000Z',
    location,
    details: `Trân trọng kính mời bạn đến chung vui cùng gia đình ${groom.shortName} & ${bride.shortName} vào lúc 17:00 Thứ Bảy, ngày 26/12/2026 tại ${venue?.venueName || 'Trống Đồng Palace Linh Đàm'}.`,
    timeZone: 'Asia/Ho_Chi_Minh',
  })
}
