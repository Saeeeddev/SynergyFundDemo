'use client'

// [F §2] Dashboard page — all four rows
// [M §6.2] Phone stack order: Cash → 2×2 KPIs → Area chart → Donut → Activities
// Uses React Query hooks; wired to mock data via useDashboard + useActivities

import { TrendingUp, DollarSign, Zap, BarChart2 } from 'lucide-react'
import { CashCard } from '@/components/dashboard/CashCard'
import { TotalInvestedChart } from '@/components/dashboard/TotalInvestedChart'
import { AssetAllocationChart } from '@/components/dashboard/AssetAllocationChart'
import { RecentActivitiesTable } from '@/components/dashboard/RecentActivitiesTable'
import { StatCard } from '@/components/ui/StatCard'
import { useDashboard, useActivities } from '@/lib/hooks/usePortfolio'
import { formatToman } from '@/lib/utils/currency'
import { bidiIsolate, formatNumber } from '@/lib/utils/numbers'

export default function DashboardPage() {
  const { data: summary, isLoading: summaryLoading, isError: summaryError, refetch: refetchSummary } = useDashboard()
  const { data: activitiesPage, isLoading: activitiesLoading, isError: activitiesError, refetch: refetchActivities } = useActivities(1)

  return (
    <div className="flex flex-col gap-4 p-3 lg:gap-5 lg:p-3">

      {/* Row 1 — Cash card [F §2 R1] */}
      <CashCard
        balance={summary?.cashBalance ?? 0}
      />

      {/* Row 2 — Four KPI StatCards [F §2 R2] — 2×2 on phone, 4-up on desktop [M §6.2] */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard
          label="کل سرمایه‌گذاری"
          value={summaryLoading ? '…' : formatToman(summary?.totalInvested ?? 0)}
          icon={<DollarSign size={20} />}
          role="positive"
        />
        <StatCard
          label="ارزش فعلی"
          value={summaryLoading ? '…' : formatToman(summary?.currentValue ?? 0)}
          change={summary ? ((summary.currentValue - summary.totalInvested) / summary.totalInvested) * 100 : undefined}
          icon={<TrendingUp size={20} />}
          role="info"
        />
        <StatCard
          label="درآمد کسب‌شده"
          value={summaryLoading ? '…' : formatToman(summary?.incomeEarned ?? 0)}
          icon={<BarChart2 size={20} />}
          role="positive"
        />
        <StatCard
          label="انرژی تولیدشده"
          value={summaryLoading ? '…' : `${bidiIsolate(formatNumber(summary?.energyProducedKwh ?? 0))} کیلوواتساعت`}
          icon={<Zap size={20} />}
          role="energy"
        />
      </div>

      {/* Row 3 — Area chart (right/60-70%) + Donut chart (left/30-40%) [F §2 R3] */}
      {/* Phone: chart first, then donut (stacked) [M §6.2] */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-10 lg:gap-4">
        {/* Area chart — 60-70% width on desktop */}
        <div className="lg:col-span-7">
          <TotalInvestedChart
            series={summary?.investedSeries ?? []}
            isLoading={summaryLoading}
            isError={summaryError}
            onRetry={() => refetchSummary()}
          />
        </div>
        {/* Donut chart — 30-40% width on desktop */}
        <div className="lg:col-span-3">
          <AssetAllocationChart
            data={summary?.allocation ?? []}
            isLoading={summaryLoading}
            isError={summaryError}
            onRetry={() => refetchSummary()}
          />
        </div>
      </div>

      {/* Row 4 — Recent Activities [F §2 R4] */}
      <RecentActivitiesTable
        activities={activitiesPage?.data ?? []}
        isLoading={activitiesLoading}
        isError={activitiesError}
        onRetry={() => refetchActivities()}
      />

    </div>
  )
}
