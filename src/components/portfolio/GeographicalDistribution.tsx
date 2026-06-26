'use client'

// [F §4 R2 left] Portfolio Row 2 left (30%): city list with ownership-share bars
// [D §9.10] ListRow-like pattern: city name + ownership% bar
// [M §6.4] Full-width below chart on phone

import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { bidiIsolate, formatPercent } from '@/lib/utils/numbers'
import type { GeoDistribution } from '@/lib/schemas/portfolio'

interface GeographicalDistributionProps {
  data: GeoDistribution[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export function GeographicalDistribution({ data, isLoading, isError, onRetry }: GeographicalDistributionProps) {
  return (
    <Card className="flex flex-col gap-4 h-full">
      <h2 className="text-[15px] font-semibold text-text">توزیع جغرافیایی</h2>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-12 rounded-md" />
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <ErrorState scope="inline" onRetry={onRetry} />
      )}

      {!isLoading && !isError && (
        <div className="flex flex-col gap-3">
          {data.map((item) => (
            <div key={item.city} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-medium text-text">{item.city}</span>
                <span className="text-[13px] tabular-nums text-text-muted">
                  {bidiIsolate(formatPercent(item.ownershipPercent))}
                </span>
              </div>
              <ProgressBar
                value={item.ownershipPercent}
                role="info"
              />
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
