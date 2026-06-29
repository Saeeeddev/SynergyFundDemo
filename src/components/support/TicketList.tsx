'use client'

import { Empty } from '@/components/ui/Empty'
import { MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { CATEGORY_LABELS, type Ticket } from '@/lib/schemas/support'
import { StatusPill } from './StatusPill'

// Bare (no Card) — rendered inside the shared support card.
interface TicketListProps {
  tickets: Ticket[]
  isLoading?: boolean
  selectedId: string | null
  onSelect: (id: string) => void
}

export function TicketList({ tickets, isLoading, selectedId, onSelect }: TicketListProps) {
  return (
    <div className="flex flex-col gap-3 h-full">
      <h2 className="text-[15px] font-semibold text-text shrink-0">تیکت‌های من</h2>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-md" />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <Empty icon={<MessageSquare size={36} />} message="هنوز تیکتی ندارید" />
      ) : (
        <div className="flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto pe-1">
          {tickets.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t.id)}
              className={cn(
                'text-start rounded-md border p-3 transition-colors shrink-0',
                selectedId === t.id
                  ? 'border-blue-base bg-blue-tint'
                  : 'border-border bg-surface hover:bg-hover',
              )}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[11px] font-semibold text-blue-deep">
                  {CATEGORY_LABELS[t.category]}
                </span>
                <StatusPill status={t.status} />
              </div>
              <p className="text-[13px] font-semibold text-text truncate">{t.subject}</p>
              <p className="text-[12px] text-text-muted truncate">
                {t.messages[t.messages.length - 1]?.text}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
