'use client'

import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverLift?: boolean
}

export function Card({ hoverLift = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-card shadow-[var(--shadow-sm)] p-6',
        hoverLift && [
          'cursor-pointer',
          'transition-[box-shadow,border-color] duration-[120ms] ease-out',
          'hover:shadow-[var(--shadow-md)] hover:border-border-strong',
        ].join(' '),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
