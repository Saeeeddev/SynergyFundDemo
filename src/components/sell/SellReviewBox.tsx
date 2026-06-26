'use client'

import { useState } from 'react'
import { X, ChevronUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Checkbox, CheckboxLink } from '@/components/ui/Input'
import { formatToman } from '@/lib/utils/currency'
import { formatNumber, bidiIsolate } from '@/lib/utils/numbers'
import { cn } from '@/lib/utils/cn'

// [F §12, D §11, M §6.9] Sell review: shares to sell + estimated proceeds summary + checkboxes
// Desktop: tall left-rail card (red accent)
// Mobile: sticky bottom summary bar (red) + expandable sheet [M §6.8 mirrored]

interface SellReviewBoxProps {
  quantity: number
  proceeds: number
  fee: number
  netProceeds: number
  rules1: boolean
  rules2: boolean
  onRules1Change: (v: boolean) => void
  onRules2Change: (v: boolean) => void
  canProceed: boolean
  onNext: () => void
}

interface SummaryItem {
  label: string
  value: string
}

export function SellReviewBox({
  quantity,
  proceeds,
  fee,
  netProceeds,
  rules1,
  rules2,
  onRules1Change,
  onRules2Change,
  canProceed,
  onNext,
}: SellReviewBoxProps) {
  const [sheetOpen, setSheetOpen] = useState(false)

  const summaryItems: SummaryItem[] = [
    { label: 'تعداد سهام فروخته‌شده', value: `${bidiIsolate(formatNumber(quantity))} وات` },
    { label: 'عواید فروش',             value: formatToman(proceeds) },
    { label: 'کارمزد',                 value: formatToman(fee) },
    { label: 'خالص دریافتی',           value: formatToman(netProceeds) },
  ]

  const checkboxes = (
    <div className="flex flex-col gap-3">
      <Checkbox
        checked={rules1}
        onChange={onRules1Change}
        label={
          <span>
            قوانین فروش سهام{' '}
            <CheckboxLink href="/rules">پلتفرم سینرجی</CheckboxLink>
            {' '}را خوانده و می‌پذیرم
          </span>
        }
      />
      <Checkbox
        checked={rules2}
        onChange={onRules2Change}
        label={
          <span>
            با{' '}
            <CheckboxLink href="/risk-disclosure">ریسک‌های فروش زودهنگام</CheckboxLink>
            {' '}آشنا هستم
          </span>
        }
      />
    </div>
  )

  return (
    <>
      {/* ── Desktop: tall left-rail card (red) ── */}
      <Card className="hidden lg:flex flex-col gap-5 p-5">
        <h3 className="text-[15px] font-semibold text-text">خلاصه فروش</h3>

        <div className="flex flex-col gap-4">
          {summaryItems.map(item => (
            <SummaryRow key={item.label} label={item.label} value={item.value} />
          ))}
        </div>

        <div className="h-px bg-border" />

        {checkboxes}

        {/* Red CTA [D §11 Sell recipe] */}
        <Button
          variant="destructive"
          size="wide"
          fullWidth
          disabled={!canProceed}
          onClick={onNext}
          className="mt-auto"
        >
          ادامه — بررسی سفارش فروش
        </Button>
      </Card>

      {/* ── Mobile: sticky bottom bar (red) [M §6.9, M §7.6] ── */}
      <div
        className={cn(
          'lg:hidden fixed bottom-0 inset-x-0 z-50 bg-surface',
          'border-t border-border shadow-[0_-4px_16px_rgba(3,8,14,.10)]',
          'sticky-cta',
        )}
      >
        <button
          className="w-full flex items-center justify-between px-4 py-2 gap-2"
          onClick={() => setSheetOpen(true)}
          aria-label="نمایش خلاصه فروش"
        >
          <div className="flex gap-5 text-start">
            <MiniStat label="سهام"    value={`${bidiIsolate(formatNumber(quantity))} وات`} />
            <MiniStat label="عواید"   value={formatToman(proceeds)} />
            <MiniStat label="خالص"    value={formatToman(netProceeds)} />
          </div>
          <ChevronUp size={16} className="text-text-muted shrink-0" aria-hidden="true" />
        </button>

        <div className="flex flex-col gap-2.5 px-4 pt-1 pb-2">
          <Checkbox
            checked={rules1}
            onChange={onRules1Change}
            label={<span className="text-[13px]">قوانین فروش را می‌پذیرم</span>}
          />
          <Checkbox
            checked={rules2}
            onChange={onRules2Change}
            label={<span className="text-[13px]">با ریسک‌های فروش آشنا هستم</span>}
          />
          <Button
            variant="destructive"
            size="wide"
            fullWidth
            disabled={!canProceed}
            onClick={onNext}
          >
            ادامه — بررسی سفارش فروش
          </Button>
        </div>
      </div>

      {/* Mobile sheet — full details */}
      {sheetOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-[55] bg-black/50"
            onClick={() => setSheetOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="خلاصه فروش"
            className={cn(
              'lg:hidden fixed inset-x-0 bottom-0 z-[60]',
              'bg-surface rounded-t-[24px] p-5',
              'flex flex-col gap-4',
            )}
          >
            <div className="mx-auto w-10 h-1 rounded-pill bg-border" aria-hidden="true" />
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-text">خلاصه فروش</h3>
              <button
                onClick={() => setSheetOpen(false)}
                className="p-2 -me-2 text-text-muted min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="بستن"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {summaryItems.map(item => (
                <SummaryRow key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
            <Button variant="secondary" fullWidth onClick={() => setSheetOpen(false)}>
              بستن
            </Button>
          </div>
        </>
      )}
    </>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center gap-2">
      <span className="text-[13px] text-text-muted">{label}</span>
      <span className="text-[14px] font-semibold text-text tabular-nums">{value}</span>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-text-muted">{label}</span>
      <span className="text-[12px] font-semibold text-text tabular-nums">{value}</span>
    </div>
  )
}
