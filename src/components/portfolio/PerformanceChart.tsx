'use client'

// [F §4 R2 right] Portfolio Row 2 right (70%): LineChart + SegmentedControl
// [D §10] Primary green line, dark multi-series tooltip
// [M §6.4] Phone: full-width, SegmentedControl scrollable

import { useState } from 'react'
import { LineChart } from '@/components/charts/LineChart'
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

interface PerformanceChartProps {
  series: PerformanceSeries[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export function PerformanceChart({ series, isLoading, isError, onRetry }: PerformanceChartProps) {
  const [range, setRange] = useState<Range>('6m')

  const cutoff = Date.now() - RANGE_MONTHS[range] * 30 * 24 * 60 * 60 * 1000
  const chartData: [number, number][] = series
    .filter((p) => range === 'all' || new Date(p.date).getTime() >= cutoff)
    .map((p) => [new Date(p.date).getTime(), p.value])

  return (
    <Card className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-[15px] font-semibold text-text">عملکرد سبد دارایی</h2>
        <SegmentedControl
          options={RANGE_OPTIONS}
          value={range}
          onChange={setRange}
        />
      </div>

      <LineChart
        series={[{ name: 'ارزش سبد', data: chartData, variant: 'primary' }]}
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
