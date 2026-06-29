'use client'

// [F §2] Dashboard page — all four rows
// [M §6.2] Phone stack order: Cash → 2×2 KPIs → Area chart → Donut → Activities
// Uses React Query hooks; wired to mock data via useDashboard + useActivities

import { TrendingUp, DollarSign, Zap, BarChart2, LayoutDashboard } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { CashSection } from '@/components/dashboard/CashSection'
import { ProjectShowcaseCard } from '@/components/dashboard/ProjectShowcaseCard'
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

      {/* asas-style page header — desktop only (mobile shows the title in the TopBar) */}
      <PageHeader
        className="hidden lg:flex"
        icon={<LayoutDashboard size={22} strokeWidth={1.75} />}
        title="داشبورد"
        subtitle="نمای کلی سرمایه‌گذاری‌ها، دارایی‌ها و درآمد شما"
      />

      {/* Row 1 — Cash + my-projects showcase (start) beside ترکیب دارایی (end) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-4 lg:items-stretch">
        <div className="flex flex-col gap-4">
          <CashSection balance={summary?.cashBalance ?? 0} />
          {/* flex-1 so the showcase image grows to match the donut card height */}
          <div className="flex-1 flex flex-col">
            <ProjectShowcaseCard />
          </div>
        </div>
        <div>
          <AssetAllocationChart
            data={summary?.allocation ?? []}
            isLoading={summaryLoading}
            isError={summaryError}
            onRetry={() => refetchSummary()}
          />
        </div>
      </div>

      {/* Row 2 — Four KPI StatCards [F §2 R2] — 2×2 on phone, 4-up on desktop [M §6.2] */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard
          label="کل سرمایه‌گذاری اولیه"
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
          value={summaryLoading ? '…' : `${bidiIsolate(formatNumber(summary?.energyProducedKwh ?? 0))} کیلووات ساعت`}
          icon={<Zap size={20} />}
          role="energy"
        />
      </div>

      {/* Row 3 — Total invested area chart (full width) [F §2 R3] */}
      <TotalInvestedChart
        series={summary?.investedSeries ?? []}
        isLoading={summaryLoading}
        isError={summaryError}
        onRetry={() => refetchSummary()}
      />



      {/* Row 6 — Recent Activities [F §2 R4] */}
      <RecentActivitiesTable
        activities={activitiesPage?.data ?? []}
        isLoading={activitiesLoading}
        isError={activitiesError}
        onRetry={() => refetchActivities()}
      />

    </div>
  )
}
