'use client'

// Functional monthly bar chart with the asas SolarResource look (gradient bars,
// gridlines) PLUS a proper left Y-axis price scale. Always renders left-to-right
// (dir="ltr") with the value indicator on the LEFT, regardless of the RTL app.
// Pure CSS/SVG — every data point + label always renders.

import { cn } from '@/lib/utils/cn'

export interface MonthlyBarDatum {
  label: string
  value: number
}

interface MonthlyBarChartProps {
  data: MonthlyBarDatum[]
  height?: number
  valueFormatter?: (n: number) => string
  /** 'fat' = chunky bars (e.g. درآمد ماهانه), 'normal' = slim bars */
  barSize?: 'normal' | 'fat'
  className?: string
}

const TICKS = [1, 0.75, 0.5, 0.25, 0] // top → bottom

export function MonthlyBarChart({
  data,
  height = 220,
  valueFormatter = (n) => String(n),
  barSize = 'normal',
  className,
}: MonthlyBarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    // dir=ltr → axis on the left, time progresses left→right (normal chart)
    <div dir="ltr" className={cn('w-full', className)}>
      <div className="flex" style={{ height }}>
        {/* Y-axis price scale (left) */}
        <div className="flex w-14 shrink-0 flex-col justify-between pe-2 text-right">
          {TICKS.map((t) => (
            <span key={t} className="text-[10px] leading-none text-text-muted tabular-nums">
              {valueFormatter(max * t)}
            </span>
          ))}
        </div>

        {/* Plot area */}
        <div className="relative flex-1">
          {/* gridlines aligned to the y ticks */}
          {TICKS.map((t) => (
            <div
              key={t}
              className="absolute inset-x-0 border-t border-dashed border-border"
              style={{ top: `${(1 - t) * 100}%` }}
            />
          ))}

          {/* bars */}
          <div className="absolute inset-0 flex items-end justify-between gap-1.5 px-1">
            {data.map((d, i) => (
              <div key={i} className="group/bar relative flex h-full flex-1 items-end justify-center">
                {/* hover value bubble */}
                <span className="pointer-events-none absolute -top-1 left-1/2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded bg-blue-base px-2 py-0.5 text-[10px] font-medium text-white opacity-0 transition-opacity duration-200 group-hover/bar:opacity-100 tabular-nums">
                  {valueFormatter(d.value)}
                </span>
                <div
                  className={cn(
                    'w-full rounded-t-md bg-gradient-to-t from-[#4361ee] to-[#5DADE2] shadow-[0_0_8px_rgba(67,97,238,0.12)] transition-transform duration-300 group-hover/bar:-translate-y-1',
                    barSize === 'fat' ? 'max-w-[44px]' : 'max-w-[24px]',
                  )}
                  style={{ height: `${Math.max((d.value / max) * 100, 2)}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* X-axis labels (aligned under the plot, offset by the y-axis width) */}
      <div className="flex">
        <div className="w-14 shrink-0" />
        <div className="flex flex-1 justify-between gap-1.5 px-1 pt-2">
          {data.map((d, i) => (
            <span
              key={i}
              className="flex-1 truncate text-center text-[10px] font-medium text-text-muted tabular-nums"
            >
              {d.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
