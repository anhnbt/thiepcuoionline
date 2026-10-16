'use client'

import React, { useMemo } from 'react'
import { Check, X } from 'lucide-react'
import { PasswordStrengthResult } from '@/types/admin'

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  const length = password.length >= 8
  const lowercase = /[a-z]/.test(password)
  const uppercase = /[A-Z]/.test(password)
  const specialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password)
  const hasNumber = /[0-9]/.test(password)

  let score = 0
  if (length) score += 1
  if (lowercase) score += 1
  if (uppercase) score += 1
  if (specialChar) score += 1
  if (hasNumber) score += 1

  // Bắt buộc phải có chữ thường, chữ hoa và ký tự đặc biệt
  const isValid = length && lowercase && uppercase && specialChar

  let level: 'weak' | 'fair' | 'strong' = 'weak'
  let label = 'Yếu'
  let color = '#BA1A1A'
  let barWidth = '33%'

  if (password.length === 0) {
    return {
      score: 0,
      level: 'weak',
      label: 'Chưa nhập',
      color: '#6B6A66',
      barWidth: '0%',
      checks: { length, lowercase, uppercase, specialChar },
      isValid: false,
    }
  }

  if (isValid && score >= 5) {
    level = 'strong'
    label = 'Mạnh'
    color = '#516442' // Sage deep
    barWidth = '100%'
  } else if (length && ((lowercase && uppercase) || (lowercase && specialChar) || (uppercase && specialChar))) {
    level = 'fair'
    label = 'An toàn'
    color = '#B08D57' // Gold
    barWidth = '66%'
  } else {
    level = 'weak'
    label = 'Yếu'
    color = '#BA1A1A' // Error red
    barWidth = '33%'
  }

  return {
    score,
    level,
    label,
    color,
    barWidth,
    checks: { length, lowercase, uppercase, specialChar },
    isValid,
  }
}

interface PasswordStrengthIndicatorProps {
  password: string
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const result = useMemo(() => evaluatePasswordStrength(password), [password])

  if (!password) {
    return null
  }

  return (
    <div className="mt-2 space-y-2 text-[12px]">
      {/* Thanh đo trực quan */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[#6B6A66] text-[11px]">Độ phức tạp mật khẩu:</span>
          <span
            className="font-medium text-[11px] px-1.5 py-0.5 rounded-[2px]"
            style={{
              color: result.color,
              backgroundColor: `${result.color}15`,
            }}
          >
            {result.label}
          </span>
        </div>
        <div className="h-1.5 w-full bg-[#EFEEEB] rounded-[2px] overflow-hidden">
          <div
            className="h-full transition-all duration-300 rounded-[2px]"
            style={{
              width: result.barWidth,
              backgroundColor: result.color,
            }}
          />
        </div>
      </div>

      {/* Danh sách tiêu chí chi tiết */}
      <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1 border-t border-[#B08D57]/15">
        <div className={`flex items-center space-x-1 ${result.checks.length ? 'text-[#516442]' : 'text-[#6B6A66]'}`}>
          {result.checks.length ? <Check size={12} className="shrink-0 text-[#516442]" /> : <X size={12} className="shrink-0 text-[#BA1A1A]" />}
          <span>Tối thiểu 8 ký tự</span>
        </div>
        <div className={`flex items-center space-x-1 ${result.checks.lowercase ? 'text-[#516442]' : 'text-[#6B6A66]'}`}>
          {result.checks.lowercase ? <Check size={12} className="shrink-0 text-[#516442]" /> : <X size={12} className="shrink-0 text-[#BA1A1A]" />}
          <span>Chữ cái thường (a-z)</span>
        </div>
        <div className={`flex items-center space-x-1 ${result.checks.uppercase ? 'text-[#516442]' : 'text-[#6B6A66]'}`}>
          {result.checks.uppercase ? <Check size={12} className="shrink-0 text-[#516442]" /> : <X size={12} className="shrink-0 text-[#BA1A1A]" />}
          <span>Chữ cái in hoa (A-Z)</span>
        </div>
        <div className={`flex items-center space-x-1 ${result.checks.specialChar ? 'text-[#516442]' : 'text-[#6B6A66]'}`}>
          {result.checks.specialChar ? <Check size={12} className="shrink-0 text-[#516442]" /> : <X size={12} className="shrink-0 text-[#BA1A1A]" />}
          <span>Ký tự đặc biệt (@, #, !...)</span>
        </div>
      </div>
    </div>
  )
}
