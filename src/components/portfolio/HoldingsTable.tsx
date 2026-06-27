'use client'

// [F §4 R3] Portfolio Row 3: Current Holdings with per-row Sell button
// [D §9.10] ListRow per holding
// [M §6.4] Sell button must be ≥44px tap target; if row crowded, keep as compact pill on end side

import { useRouter } from 'next/navigation'
import { IconChip } from '@/components/ui/IconChip'
import { ChangeIndicator } from '@/components/ui/ChangeIndicator'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { Empty } from '@/components/ui/Empty'
import { Wallet } from 'lucide-react'
import { formatToman } from '@/lib/utils/currency'
import { bidiIsolate, formatNumber, formatPercent } from '@/lib/utils/numbers'
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

      {!isLoading && !isError && holdings.length > 0 && (() => {
        const totalValue = holdings.reduce((s, h) => s + h.totalValue, 0)
        return (
        <div className="divide-y divide-border">
          {holdings.map((h) => {
            // bar = this holding's weight in the overall portfolio (meaningful 0–100)
            const weight = totalValue > 0 ? (h.totalValue / totalValue) * 100 : 0
            return (
              <div key={h.projectId} className="flex flex-col gap-2.5 py-4">
                {/* Top line: asset + value + P/L + sell */}
                <div className="flex items-center gap-3">
                  <IconChip
                    role="positive"
                    size="sm"
                    icon={<span className="text-[11px] font-bold leading-none">{h.projectName.slice(0, 2)}</span>}
                  />
                  <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-text leading-tight truncate">
                      {h.projectName}
                    </span>
                    <span className="text-xs text-text-muted leading-tight truncate">
                      {h.projectLocation}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-sm font-semibold text-text tabular-nums whitespace-nowrap">
                      {formatToman(h.totalValue)}
                    </span>
                    <ChangeIndicator value={h.pnlPercent} variant="pill" />
                  </div>
                  <Button
                    variant="destructive"
                    size="compact"
                    onClick={() => router.push(`/sell/${h.projectId}`)}
                    className="min-h-[44px] px-3 shrink-0"
                  >
                    فروش
                  </Button>
                </div>

                {/* Ownership share + portfolio-weight bar */}
                <div className="flex items-center gap-3 ps-11">
                  <span className="text-[12px] text-text-muted whitespace-nowrap">
                    مالکیت شما:{' '}
                    <span className="font-semibold text-text-2 tabular-nums">
                      {bidiIsolate(formatNumber(h.sharesOwned))} وات
                    </span>{' '}
                    <span className="tabular-nums">({bidiIsolate(formatPercent(h.ownershipPercent))} پروژه)</span>
                  </span>
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    <div className="flex-1 h-2 rounded-pill bg-hover overflow-hidden">
                      <div
                        className="h-full rounded-pill bg-blue-base transition-[width] duration-500"
                        style={{ width: `${weight}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-text-muted tabular-nums shrink-0 w-20 text-end">
                      {bidiIsolate(formatPercent(weight))} سبد
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        )
      })()}
    </Card>
  )
}
