export type AdminRole = 'admin' | 'viewer'
export type AdminStatus = 'active' | 'inactive'
export type AdminSide = 'groom' | 'bride' | 'both'

export interface AdminUser {
  id: string
  auth_id?: string | null
  email: string
  full_name: string
  phone?: string | null
  side?: AdminSide
  role: AdminRole
  status: AdminStatus
  created_at: string
  updated_at?: string
}

export type PasswordStrengthLevel = 'weak' | 'fair' | 'strong'

export interface PasswordStrengthResult {
  score: number // 0 to 4
  level: PasswordStrengthLevel
  label: string
  color: string
  barWidth: string
  checks: {
    length: boolean
    lowercase: boolean
    uppercase: boolean
    specialChar: boolean
  }
  isValid: boolean
}
