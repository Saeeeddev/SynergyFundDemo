'use client'

// [F §4 R3] Portfolio Row 3: Current Holdings with per-row Sell button
// [D §9.10] ListRow per holding
// [M §6.4] Sell button must be ≥44px tap target; if row crowded, keep as compact pill on end side

import { useRouter } from 'next/navigation'
import { ListRow } from '@/components/ui/ListRow'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { Empty } from '@/components/ui/Empty'
import { Wallet } from 'lucide-react'
import { formatToman } from '@/lib/utils/currency'
import type { Holding } from '@/lib/schemas/portfolio'

interface HoldingsTableProps {
  holdings: Holding[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export function HoldingsTable({ holdings, isLoading, isError, onRetry }: HoldingsTableProps) {
  const router = useRouter()

  return (
    <Card className="flex flex-col gap-1">
      <h2 className="text-[15px] font-semibold text-text mb-3">دارایی‌های فعلی</h2>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-md" />
          ))}
        </div>
      )}

      {!isLoading && isError && <ErrorState scope="inline" onRetry={onRetry} />}

      {!isLoading && !isError && holdings.length === 0 && (
        <Empty
          icon={<Wallet size={48} />}
          message="هنوز سرمایه‌گذاری‌ای ندارید — اولین پروژه را انتخاب کنید"
          action={
            <Button variant="primary" onClick={() => router.push('/marketplace')}>
              رفتن به بازار
            </Button>
          }
        />
      )}

      {!isLoading && !isError && holdings.length > 0 && (
        <div className="divide-y divide-border">
          {holdings.map((h) => (
            <ListRow
              key={h.projectId}
              chipInitials={h.projectName.slice(0, 2)}
              chipRole="positive"
              name={h.projectName}
              sub={h.projectLocation}
              value={formatToman(h.totalValue)}
              barValue={h.ownershipPercent * 10}
              barRole="positive"
              change={h.pnlPercent}
              trailing={
                <Button
                  variant="destructive"
                  size="compact"
                  onClick={() => router.push(`/sell/${h.projectId}`)}
                  className="min-h-[44px] px-3"
                >
                  فروش
                </Button>
              }
            />
          ))}
        </div>
      )}
    </Card>
  )
}
