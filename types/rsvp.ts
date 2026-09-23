export interface RsvpGuest {
  id: string
  name: string
  phone: string
  attendance: 'yes' | 'no'
  guestCount: number
  wishes: string
  createdAt: string
}

export const RSVP_STORAGE_KEY = 'wedding_rsvp_guests'
export const RSVP_UPDATE_EVENT = 'wedding_rsvp_updated'
