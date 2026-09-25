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

export interface SupabaseRsvpGuest {
  id: number
  guest_name: string
  phone: string
  status: 'yes' | 'no' | string
  guest_count: number | null
  wishes: string | null
  created_at: string
}
