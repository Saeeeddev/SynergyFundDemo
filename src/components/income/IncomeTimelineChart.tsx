'use client'

// [F §5 R2] "درآمد ماهانه" — asas SolarResource-style monthly bar chart showing
// ALL months (no range filter, no hidden labels).

import { MonthlyBarChart, type MonthlyBarDatum } from '@/components/charts/MonthlyBarChart'
import { Card } from '@/components/ui/Card'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { formatTomanCompact } from '@/lib/utils/currency'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import type { IncomeSummary } from '@/lib/schemas/payout'

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
  const data: MonthlyBarDatum[] = monthlyBars.map((b) => ({
    label: b.month,
    value: b.amount,
  }))

  return (
    <Card className="flex flex-col gap-5 h-full">
      <SectionTitle title="درآمد ماهانه" subtitle="درآمد دریافتی شما به تفکیک ماه" />

      {isLoading ? (
        <Skeleton className="h-[260px] w-full rounded-card" />
      ) : isError ? (
        <div className="flex items-center justify-center h-[260px]">
          <ErrorState scope="inline" onRetry={onRetry} />
        </div>
      ) : (
        <MonthlyBarChart data={data} height={240} valueFormatter={formatTomanCompact} barSize="fat" rotateLabels />
      )}
    </Card>
  )
}
