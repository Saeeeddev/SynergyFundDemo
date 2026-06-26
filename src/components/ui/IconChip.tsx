'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

export type ChipRole = 'positive' | 'negative' | 'info' | 'energy' | 'special' | 'gray'

// [D §9.2] bg = role tint, icon = role deep
const roleClasses: Record<ChipRole, { bg: string; icon: string }> = {
  positive: { bg: 'bg-green-tint', icon: 'text-green-deep' },
  negative: { bg: 'bg-red-tint',   icon: 'text-red-deep'   },
  info:     { bg: 'bg-blue-tint',  icon: 'text-blue-deep'  },
  energy:   { bg: 'bg-gold-tint',  icon: 'text-gold-deep'  },
  special:  { bg: 'bg-purple-tint',icon: 'text-purple-deep'},
  gray:     { bg: 'bg-gray-tint',  icon: 'text-gray-deep'  },
}

interface IconChipProps {
  role?: ChipRole
  icon: ReactNode
  size?: 'sm' | 'md'   // 36px / 40px [D §9.2]
  className?: string
}

export function IconChip({ role = 'positive', icon, size = 'md', className }: IconChipProps) {
  const { bg, icon: iconColor } = roleClasses[role]

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center shrink-0',
        'rounded-chip',          // --r-chip = 10px [D §4.3]
        size === 'md' ? 'w-10 h-10' : 'w-9 h-9',
        bg,
        iconColor,
        className,
      )}
    >
      {icon}
    </span>
  )
}
