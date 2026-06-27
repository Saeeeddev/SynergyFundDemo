'use client'

// [F §2 R3 right] "ارزش کل سرمایه‌گذاری" — asas SolarResource-style monthly bar
// chart showing ALL dates (no range filter, no hidden labels).

import { MonthlyBarChart, type MonthlyBarDatum } from '@/components/charts/MonthlyBarChart'
import { Card } from '@/components/ui/Card'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { formatTomanCompact } from '@/lib/utils/currency'
import { formatJalaliMonth } from '@/lib/utils/jalali'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import type { PerformanceSeries } from '@/lib/schemas/portfolio'

interface TotalInvestedChartProps {
  series: PerformanceSeries[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export function TotalInvestedChart({ series, isLoading, isError, onRetry }: TotalInvestedChartProps) {
  const data: MonthlyBarDatum[] = series.map((p) => ({
    label: formatJalaliMonth(p.date),
    value: p.value,
  }))

  return (
    <Card className="flex flex-col gap-5 h-full">
      <SectionTitle title="ارزش کل سرمایه‌گذاری" subtitle="روند ماهانه ارزش سرمایه‌گذاری شما" />

      {isLoading ? (
        <Skeleton className="h-[260px] w-full rounded-card" />
      ) : isError ? (
        <div className="flex items-center justify-center h-[260px]">
          <ErrorState scope="inline" onRetry={onRetry} />
        </div>
      ) : (
        <MonthlyBarChart data={data} height={240} valueFormatter={formatTomanCompact} />
      )}
    </Card>
  )
}
