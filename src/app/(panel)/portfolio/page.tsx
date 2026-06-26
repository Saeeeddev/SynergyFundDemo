'use client'

// [F §4] Portfolio page — all four rows
// [M §6.4] Phone: 2×2 KPIs → chart → geo → holdings → order history (collapsible)

import { TrendingUp, DollarSign, BarChart2, TrendingDown } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { PerformanceChart } from '@/components/portfolio/PerformanceChart'
import { GeographicalDistribution } from '@/components/portfolio/GeographicalDistribution'
import { HoldingsTable } from '@/components/portfolio/HoldingsTable'
import { OrderHistoryTable } from '@/components/portfolio/OrderHistoryTable'
import {
  usePortfolioSummary,
  useHoldings,
  usePerformance,
  useGeo,
  useOrders,
} from '@/lib/hooks/usePortfolio'
import { formatToman } from '@/lib/utils/currency'
import { bidiIsolate, formatPercent } from '@/lib/utils/numbers'

export default function PortfolioPage() {
  const { data: summary, isLoading: summaryLoading, isError: summaryError, refetch: refetchSummary } = usePortfolioSummary()
  const { data: holdings, isLoading: holdingsLoading, isError: holdingsError, refetch: refetchHoldings } = useHoldings()
  const { data: performance, isLoading: perfLoading, isError: perfError, refetch: refetchPerf } = usePerformance()
  const { data: geo, isLoading: geoLoading, isError: geoError, refetch: refetchGeo } = useGeo()
  const { data: ordersPage, isLoading: ordersLoading, isError: ordersError, refetch: refetchOrders } = useOrders(1)

  const netReturnSign = (summary?.netReturnPercent ?? 0) >= 0 ? 'positive' : 'negative'

  return (
    <div className="flex flex-col gap-4 p-3 lg:gap-5 lg:p-4">

      {/* Row 1 — 4 KPI cards [F §4 R1] — 2×2 phone / 4-up desktop */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard
          label="ارزش کل دارایی‌ها"
          value={summaryLoading ? '…' : formatToman(summary?.totalAssetsValue ?? 0)}
          icon={<DollarSign size={20} />}
          role="positive"
        />
        <StatCard
          label="کل سرمایه‌گذاری"
          value={summaryLoading ? '…' : formatToman(summary?.totalInvested ?? 0)}
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
          label="بازده خالص"
          value={summaryLoading ? '…' : formatToman(summary?.netReturn ?? 0)}
          change={summary?.netReturnPercent}
          icon={<TrendingDown size={20} />}
          role={netReturnSign}
        />
      </div>

      {/* Row 2 — Performance chart (70%) + Geo distribution (30%) [F §4 R2] */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-10 lg:gap-4">
        <div className="lg:col-span-7">
          <PerformanceChart
            series={performance ?? []}
            isLoading={perfLoading}
            isError={perfError}
            onRetry={() => refetchPerf()}
          />
        </div>
        <div className="lg:col-span-3">
          <GeographicalDistribution
            data={geo ?? []}
            isLoading={geoLoading}
            isError={geoError}
            onRetry={() => refetchGeo()}
          />
        </div>
      </div>

      {/* Row 3 — Holdings [F §4 R3] */}
      <HoldingsTable
        holdings={holdings ?? []}
        isLoading={holdingsLoading}
        isError={holdingsError}
        onRetry={() => refetchHoldings()}
      />

      {/* Row 4 — Order History [F §4 R4] */}
      <OrderHistoryTable
        orders={ordersPage?.data ?? []}
        isLoading={ordersLoading}
        isError={ordersError}
        onRetry={() => refetchOrders()}
      />

    </div>
  )
}
