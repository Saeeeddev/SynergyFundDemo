'use client'

// [F §11 R3] Yearly Income / Payout Projection — Bar Chart (Gold)
// Shows panel degradation: later years slightly lower
// [D §10] Gold bars, --r-md top corners, grow-from-baseline once
// [M §8] Mobile: ~220px height

import { useEffect, useState, useMemo } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { CHART_COLORS, CHART_FONT } from '@/lib/utils/highchartsBase'
import type { ForecastYearData } from '@/types/domain'

interface YearlyIncomeChartProps {
  yearlyData: ForecastYearData[]
  height?: number
}

export function YearlyIncomeChart({ yearlyData, height = 280 }: YearlyIncomeChartProps) {
  const [HighchartsReact, setHighchartsReact] = useState<React.ComponentType<Record<string, unknown>> | null>(null)
  const [Highcharts, setHighcharts] = useState<unknown>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    Promise.all([import('highcharts'), import('highcharts-react-official')]).then(
      ([hc, hcr]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const H = (hc as any).default ?? hc
        setHighcharts(H)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setHighchartsReact(() => (hcr as any).default)
      }
    )
  }, [])

  const options = useMemo(() => ({
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      animation: !reducedMotion,
      height,
      style: { fontFamily: CHART_FONT },
    },
    title: { text: '' },
    xAxis: {
      categories: yearlyData.map((d) => `سال ${d.year}`),
      reversed: false, // LTR: year 1 on the left → latest on the right
      lineColor: 'transparent',
      tickColor: 'transparent',
      // step:1 → never skip a year label (fixes hidden dates)
      labels: { step: 1, style: { color: CHART_COLORS.textSubtle, fontSize: '11px', fontFamily: CHART_FONT } },
    },
    yAxis: {
      title: { text: '' },
      opposite: false,
      gridLineDashStyle: 'Dash',
      gridLineColor: CHART_COLORS.border,
      labels: {
        style: { color: CHART_COLORS.textSubtle, fontSize: '11px', fontFamily: CHART_FONT },
        formatter() {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const v = (this as any).value as number
          if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(0)}م`
          if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(0)}ه`
          return String(v)
        },
      },
    },
    series: [{
      name: 'درآمد سالانه',
      data: yearlyData.map((d) => d.annualIncome),
      color: CHART_COLORS.gold,
      borderRadius: { radius: 10, where: 'end' },
      states: { hover: { color: CHART_COLORS.goldBase, brightness: 0 } },
    }],
    tooltip: {
      backgroundColor: 'white',
      borderColor: CHART_COLORS.border,
      borderRadius: 12,
      style: { color: CHART_COLORS.text, fontFamily: CHART_FONT, fontSize: '13px' },
      stickyTracking: false,
      followTouchMove: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter(): string {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const self = this as any
        const v = self.y as number
        const m = v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)} میلیون تومان` : `${(v / 1_000).toFixed(0)} هزار تومان`
        return `<b>${self.x}</b><br/>درآمد: ${m}`
      },
    },
    legend: { enabled: false },
    credits: { enabled: false },
    responsive: {
      rules: [{
        condition: { maxWidth: 768 },
        chartOptions: { chart: { height: 220 } },
      }],
    },
  }), [yearlyData, reducedMotion, height])

  if (!HighchartsReact || !Highcharts) {
    return (
      <div style={{ height }}>
        <Skeleton className="h-full w-full rounded-card" />
      </div>
    )
  }

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  )
}
