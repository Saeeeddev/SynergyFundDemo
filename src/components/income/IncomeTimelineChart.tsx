'use client'

// [F §5 R2] Income Row 2: Monthly bar chart with range selector
// [D §10] Gold bars, energy identity, SegmentedControl for time range

import { useState } from 'react'
import { BarChart } from '@/components/charts/BarChart'
import { SegmentedControl, SegmentOption } from '@/components/ui/SegmentedControl'
import { Card } from '@/components/ui/Card'
import { formatTomanCompact } from '@/lib/utils/currency'
import type { IncomeSummary } from '@/lib/schemas/payout'

type Range = '6m' | '1y' | 'all'

const RANGE_OPTIONS: SegmentOption<Range>[] = [
  { value: '6m', label: '۶ ماه' },
  { value: '1y', label: '۱ سال' },
  { value: 'all', label: 'همه' },
]

const RANGE_COUNT: Record<Range, number> = { '6m': 6, '1y': 12, 'all': 9999 }

interface IncomeTimelineChartProps {
  monthlyBars: IncomeSummary['monthlyBars']
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export function IncomeTimelineChart({
  monthlyBars,
  isLoading,
  isError,
  onRetry,
}: IncomeTimelineChartProps) {
  const [range, setRange] = useState<Range>('6m')

  const sliced = monthlyBars.slice(-RANGE_COUNT[range])
  const chartData = sliced.map((b) => ({ name: b.month, y: b.amount }))

  return (
    <Card className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-[15px] font-semibold text-text">درآمد ماهانه</h2>
        <SegmentedControl options={RANGE_OPTIONS} value={range} onChange={setRange} />
      </div>
      <BarChart
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
