'use client'

// [F §8, D §9.14] Notification item: role icon chip + title + snippet + timestamp
// Gold=payout, Green=performance

import { cn } from '@/lib/utils/cn'
import { formatJalali } from '@/lib/utils/jalali'
import { TrendingUp, Clock } from 'lucide-react'
import type { Notification } from '@/lib/schemas/user'

const TYPE_CONFIG = {
  payout: {
    icon: Clock,
    classes: 'bg-gold-tint text-gold-deep',
  },
  performance: {
    icon: TrendingUp,
    classes: 'bg-green-tint text-green-deep',
  },
}

interface NotificationItemProps {
  notification: Notification
}

export function NotificationItem({ notification: n }: NotificationItemProps) {
  const { icon: Icon, classes } = TYPE_CONFIG[n.type]

  return (
    <div
      className={cn(
        'flex gap-3 px-4 py-4 border-b border-border last:border-0',
        !n.read && 'bg-surface-2',
      )}
    >
      {/* Role icon chip [D §9.14] */}
      <div className={cn('w-10 h-10 rounded-chip flex items-center justify-center shrink-0', classes)}>
        <Icon size={16} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn('text-[14px] font-semibold leading-snug', n.read ? 'text-text-2' : 'text-text')}>
            {n.title}
          </p>
          {!n.read && (
            <span className="mt-1 shrink-0 w-2 h-2 rounded-pill bg-blue-base" />
          )}
        </div>
        <p className="text-[13px] text-text-muted mt-0.5 line-clamp-2">{n.body}</p>
        <p className="text-[11px] text-text-subtle mt-1 tabular-nums">{formatJalali(n.timestamp)}</p>
      </div>
    </div>
  )
}
