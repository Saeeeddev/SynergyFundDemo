'use client'

// [F §6] Reports filter — date range + search
// [M §6.6] Phone: «فیلتر» button → bottom sheet

import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SearchField } from '@/components/ui/SearchField'
import { cn } from '@/lib/utils/cn'

export interface FilterState {
  search: string
  dateFrom: string
  dateTo: string
}

interface ReportsFilterProps {
  value: FilterState
  onChange: (f: FilterState) => void
}

export function ReportsFilter({ value, onChange }: ReportsFilterProps) {
  const [sheetOpen, setSheetOpen] = useState(false)

  const hasActiveFilter = Boolean(value.dateFrom || value.dateTo)
  const set = (patch: Partial<FilterState>) => onChange({ ...value, ...patch })
  const clear = () => onChange({ search: '', dateFrom: '', dateTo: '' })

  return (
    <>
      {/* ── Desktop (md+): inline filter bar ──────────────────────────────── */}
      <div className="hidden md:flex items-center gap-3 flex-wrap">
        <SearchField
          value={value.search}
          onChange={(e) => set({ search: e.target.value })}
          className="w-56"
          placeholder="جستجوی گزارش…"
        />
        <div className="flex items-center gap-2">
          <label className="text-[13px] text-text-muted whitespace-nowrap">از تاریخ</label>
          <input
            type="date"
            value={value.dateFrom}
            onChange={(e) => set({ dateFrom: e.target.value })}
            className="h-9 rounded-md border border-border bg-surface text-[13px] text-text px-2 focus:outline-2 focus:outline-border-strong"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[13px] text-text-muted whitespace-nowrap">تا تاریخ</label>
          <input
            type="date"
            value={value.dateTo}
            onChange={(e) => set({ dateTo: e.target.value })}
            className="h-9 rounded-md border border-border bg-surface text-[13px] text-text px-2 focus:outline-2 focus:outline-border-strong"
          />
        </div>
        {hasActiveFilter && (
          <Button variant="ghost" size="compact" onClick={clear}>
            پاک‌کردن فیلتر
          </Button>
        )}
      </div>

      {/* ── Mobile (<md): search inline + «فیلتر» button → sheet ─────────── */}
      <div className="flex md:hidden items-center gap-2">
        <SearchField
          value={value.search}
          onChange={(e) => set({ search: e.target.value })}
          className="flex-1"
          placeholder="جستجو…"
        />
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className={cn(
            'flex items-center gap-1.5 px-3 rounded-md border min-h-[44px]',
            'text-[13px] font-medium transition-colors duration-[120ms]',
            hasActiveFilter
              ? 'bg-green-tint text-green-deep border-transparent'
              : 'bg-surface border-border text-text-muted hover:bg-hover',
          )}
        >
          <SlidersHorizontal size={16} />
          <span>فیلتر</span>
        </button>
      </div>

      {/* ── Filter bottom sheet (mobile) ─────────────────────────────────── */}
      {sheetOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSheetOpen(false)} aria-hidden="true" />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="فیلتر گزارش‌ها"
            className="relative bg-surface rounded-t-[var(--r-card)] shadow-[var(--shadow-pop)] w-full flex flex-col"
          >
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-pill bg-border-strong" />
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="font-semibold text-[15px] text-text">فیلتر گزارش‌ها</span>
              <button
                onClick={() => setSheetOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-md text-text-muted hover:bg-hover"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex flex-col gap-4 p-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-text-muted">از تاریخ</label>
                <input
                  type="date"
                  value={value.dateFrom}
                  onChange={(e) => set({ dateFrom: e.target.value })}
                  className="h-12 rounded-md border border-border bg-surface text-[14px] text-text px-3"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-text-muted">تا تاریخ</label>
                <input
                  type="date"
                  value={value.dateTo}
                  onChange={(e) => set({ dateTo: e.target.value })}
                  className="h-12 rounded-md border border-border bg-surface text-[14px] text-text px-3"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="ghost" className="flex-1 min-h-[44px]" onClick={clear}>
                  پاک‌کردن
                </Button>
                <Button variant="primary" className="flex-1 min-h-[44px]" onClick={() => setSheetOpen(false)}>
                  اعمال فیلتر
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
