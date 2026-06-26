'use client'

// [F §2 R3 left] Dashboard Row 3 left (30-40%): DonutChart + legend
// [M §6.2] Phone: full-width below area chart; legend moves below donut (handled by DonutChart responsive rule)

import { DonutChart } from '@/components/charts/DonutChart'
import { Card } from '@/components/ui/Card'
import { formatTomanCompact } from '@/lib/utils/currency'

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
    <Card className="flex flex-col gap-4 h-full">
      <h2 className="text-[15px] font-semibold text-text">ترکیب دارایی</h2>

      <DonutChart
        data={donutData}
        centerText={formatTomanCompact(total)}
        height={260}
        isLoading={isLoading}
        isError={isError}
        onRetry={onRetry}
      />
    </Card>
  )
}
