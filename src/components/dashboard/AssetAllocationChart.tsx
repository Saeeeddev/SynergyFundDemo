'use client'

// [F §2 R3 left] Asset allocation — restyled to the asas "Capital Expenditure
// Breakdown" layout: donut on one side + a legend list (color swatch · name ·
// value · percentage) with a total row beneath.
// [M §6.2] Phone: stacks (donut above, list below).

import { DonutChart } from '@/components/charts/DonutChart'
import { Card } from '@/components/ui/Card'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { formatTomanCompact } from '@/lib/utils/currency'
import { bidiIsolate, formatNumber } from '@/lib/utils/numbers'
import { CATEGORICAL_COLORS } from '@/lib/utils/highchartsBase'

interface AllocationSlice {
  name: string
  value: number
}

interface AssetAllocationChartProps {
  data: AllocationSlice[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export function AssetAllocationChart({ data, isLoading, isError, onRetry }: AssetAllocationChartProps) {
  const total = data.reduce((sum, s) => sum + s.value, 0)
  const donutData = data.map((s) => ({ name: s.name, y: s.value }))

  return (
    <Card className="flex flex-col gap-5 h-full">
      <SectionTitle title="ترکیب دارایی" subtitle="توزیع سرمایه‌گذاری بین پروژه‌ها" />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
        {/* Donut (legend rendered separately, asas style) */}
        <div className="lg:flex-1">
          <DonutChart
            data={donutData}
            showLegend={false}
            height={220}
            isLoading={isLoading}
            isError={isError}
            onRetry={onRetry}
          />
        </div>

        {/* Legend list — swatch · name · value · % */}
        {!isLoading && !isError && (
          <div className="lg:flex-1 flex flex-col gap-2">
            {data.map((slice, i) => {
              const pct = total > 0 ? (slice.value / total) * 100 : 0
              return (
                <div key={slice.name} className="flex items-center gap-2 text-[13px]">
                  <span
                    className="w-3 h-3 rounded-sm shrink-0"
                    style={{ backgroundColor: CATEGORICAL_COLORS[i % CATEGORICAL_COLORS.length] }}
                  />
                  <span className="flex-1 text-text truncate">{slice.name}</span>
                  <span className="font-semibold text-text tabular-nums">
                    {formatTomanCompact(slice.value)}
                  </span>
                  <span className="w-12 text-end text-text-muted tabular-nums">
                    {bidiIsolate(`${formatNumber(pct, 0)}٪`)}
                  </span>
                </div>
              )
            })}

            <div className="flex items-center justify-between border-t border-border mt-2 pt-3 text-[13px] font-semibold">
              <span className="text-text">مجموع سرمایه</span>
              <span className="text-text tabular-nums">{formatTomanCompact(total)}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
