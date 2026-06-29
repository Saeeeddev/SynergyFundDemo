'use client'

// [F §2 R3] "ارزش کل سرمایه‌گذاری" — ascending area/line chart (green line over a
// soft gradient fill), matching the reference "Total Invested Value" design.

import { AreaChart } from '@/components/charts/AreaChart'
import { Card } from '@/components/ui/Card'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { formatToman, formatTomanCompact } from '@/lib/utils/currency'
import { formatJalaliMonth } from '@/lib/utils/jalali'
import type { PerformanceSeries } from '@/lib/schemas/portfolio'

interface TotalInvestedChartProps {
  series: PerformanceSeries[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export function TotalInvestedChart({ series, isLoading, isError, onRetry }: TotalInvestedChartProps) {
  // [epoch_ms, value] pairs sorted ascending (oldest → newest)
  const data: [number, number][] = series
    .map((p) => [Date.parse(p.date), p.value] as [number, number])
    .sort((a, b) => a[0] - b[0])

  return (
    <Card className="flex flex-col gap-5 h-full">
      <SectionTitle title="ارزش کل سرمایه‌گذاری" subtitle="روند ماهانه ارزش سرمایه‌گذاری شما" />

      <AreaChart
        data={data}
        height={280}
        reversed={false}
        yFormatter={formatTomanCompact}
        xFormatter={(ms) => formatJalaliMonth(new Date(ms).toISOString())}
        tooltipFormatter={formatToman}
        isLoading={isLoading}
        isError={isError}
        onRetry={onRetry}
      />
    </Card>
  )
}
