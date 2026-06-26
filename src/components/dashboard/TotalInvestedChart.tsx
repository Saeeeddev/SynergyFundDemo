'use client'

// [F §2 R3 right] Dashboard Row 3 right (60-70%): AreaChart + SegmentedControl
// [D §10] Area chart visual spec
// [M §6.2] Phone: full-width below KPI cards

import { useState } from 'react'
import { AreaChart } from '@/components/charts/AreaChart'
import { SegmentedControl, SegmentOption } from '@/components/ui/SegmentedControl'
import { Card } from '@/components/ui/Card'
import { formatTomanCompact } from '@/lib/utils/currency'
import type { PerformanceSeries } from '@/lib/schemas/portfolio'

type Range = '1m' | '3m' | '6m' | '1y' | 'all'

const RANGE_OPTIONS: SegmentOption<Range>[] = [
  { value: '1m', label: '۱ ماه' },
  { value: '3m', label: '۳ ماه' },
  { value: '6m', label: '۶ ماه' },
  { value: '1y', label: '۱ سال' },
  { value: 'all', label: 'همه' },
]

const RANGE_MONTHS: Record<Range, number> = {
  '1m': 1, '3m': 3, '6m': 6, '1y': 12, 'all': 9999,
}

interface TotalInvestedChartProps {
  series: PerformanceSeries[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export function TotalInvestedChart({ series, isLoading, isError, onRetry }: TotalInvestedChartProps) {
  const [range, setRange] = useState<Range>('6m')

  const cutoff = Date.now() - RANGE_MONTHS[range] * 30 * 24 * 60 * 60 * 1000
  const chartData: [number, number][] = series
    .filter((p) => range === 'all' || new Date(p.date).getTime() >= cutoff)
    .map((p) => [new Date(p.date).getTime(), p.value])

  return (
    <Card className="flex flex-col gap-4 h-full">
      {/* Card header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-[15px] font-semibold text-text">ارزش کل سرمایه‌گذاری</h2>
        <SegmentedControl
          options={RANGE_OPTIONS}
          value={range}
          onChange={setRange}
        />
      </div>

      <AreaChart
        data={chartData}
        height={260}
        yFormatter={formatTomanCompact}
        tooltipFormatter={formatTomanCompact}
        isLoading={isLoading}
        isError={isError}
        onRetry={onRetry}
      />
    </Card>
  )
}
