'use client'

// [F §11 R3] Scenario Comparison — Line Chart overlaying 3 curves (Conservative/Base/Optimistic)
// [D §10] LineChart style: solid primary + dashed variants, dark multi-series tooltip
// [M §8] Mobile: ~220px height

import { useEffect, useState, useMemo } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { CHART_COLORS, CHART_FONT } from '@/lib/utils/highchartsBase'
import type { ForecastYearData } from '@/types/domain'

interface ScenarioData {
  conservative: ForecastYearData[]
  base: ForecastYearData[]
  optimistic: ForecastYearData[]
}

interface ScenarioComparisonChartProps {
  scenarios: ScenarioData
}

export function ScenarioComparisonChart({ scenarios }: ScenarioComparisonChartProps) {
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

  const options = useMemo(() => {
    const categories = scenarios.base.map((d) => `سال ${d.year}`)
    return {
      chart: {
        type: 'line',
        backgroundColor: 'transparent',
        animation: !reducedMotion,
        height: 280,
        style: { fontFamily: CHART_FONT },
      },
      title: { text: '' },
      xAxis: {
        categories,
        reversed: true,
        lineColor: 'transparent',
        tickColor: 'transparent',
        labels: { style: { color: CHART_COLORS.textSubtle, fontSize: '11px', fontFamily: CHART_FONT } },
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
      series: [
        {
          name: 'پایه',
          data: scenarios.base.map((d) => d.cumulativeReturn),
          color: CHART_COLORS.green,
          lineWidth: 2.5,
          dashStyle: 'Solid',
          marker: { enabled: false },
        },
        {
          name: 'خوش‌بینانه',
          data: scenarios.optimistic.map((d) => d.cumulativeReturn),
          color: CHART_COLORS.blue,
          lineWidth: 1.5,
          dashStyle: 'ShortDash',
          marker: { enabled: false },
        },
        {
          name: 'محافظه‌کارانه',
          data: scenarios.conservative.map((d) => d.cumulativeReturn),
          color: CHART_COLORS.gray,
          lineWidth: 1.5,
          dashStyle: 'ShortDot',
          marker: { enabled: false },
        },
      ],
      tooltip: {
        backgroundColor: '#03080E',
        borderColor: 'transparent',
        borderRadius: 12,
        style: { color: '#FFFFFF', fontFamily: CHART_FONT, fontSize: '12px' },
        shared: true,
        stickyTracking: false,
        followTouchMove: true,
        useHTML: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter(): string {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const self = this as any
          const header = `<div style="font-size:11px;color:#73736F;margin-bottom:4px">${self.x}</div>`
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rows = self.points.map((p: any) => {
            const v = p.y as number
            const m = v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}م` : `${(v / 1_000).toFixed(0)}ه`
            return `<div style="display:flex;align-items:center;gap:6px;margin:2px 0">
              <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color}"></span>
              <span style="color:#73736F">${p.series.name}:</span>
              <span style="font-weight:600;color:white">${m} تومان</span>
            </div>`
          }).join('')
          return `<div style="font-family:${CHART_FONT}">${header}${rows}</div>`
        },
      },
      legend: {
        enabled: true,
        align: 'right',
        verticalAlign: 'top',
        itemStyle: { color: CHART_COLORS.text, fontFamily: CHART_FONT, fontSize: '11px', fontWeight: '500' },
      },
      credits: { enabled: false },
      responsive: {
        rules: [{
          condition: { maxWidth: 768 },
          chartOptions: {
            chart: { height: 220 },
            legend: { align: 'center', verticalAlign: 'bottom' },
          },
        }],
      },
    }
  }, [scenarios, reducedMotion])

  if (!HighchartsReact || !Highcharts) {
    return <Skeleton className="h-[280px] w-full rounded-card" />
  }

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  )
}
