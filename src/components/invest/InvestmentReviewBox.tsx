'use client'

import { useState } from 'react'
import { X, ChevronUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Checkbox, CheckboxLink } from '@/components/ui/Input'
import { formatToman } from '@/lib/utils/currency'
import { formatNumber, bidiIsolate } from '@/lib/utils/numbers'
import { cn } from '@/lib/utils/cn'
import type { FundingSource } from './FundingSourceBox'

const FUNDING_OPTIONS: { value: FundingSource; label: string }[] = [
  { value: 'platform', label: 'موجودی پلتفرم' },
  { value: 'bank', label: 'انتقال بانکی' },
]

// [F §10 Step1 Left] Live investment review + agreement checkboxes
// Desktop: tall card (left side of the grid)
// Mobile: sticky bottom summary bar — tap to expand to bottom sheet [M §6.8]
// CTA disabled until both checkboxes checked [M §6.8]

interface InvestmentReviewBoxProps {
  shares: number
  ownershipPct: number
  annualIncome: number
  monthlyPayout: number
  investmentAmount: number
  fee: number
  total: number
  fundingSource: FundingSource
  onFundingSourceChange: (v: FundingSource) => void
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

export function InvestmentReviewBox({
  shares,
  ownershipPct,
  annualIncome,
  monthlyPayout,
  investmentAmount,
  fee,
  total,
  fundingSource,
  onFundingSourceChange,
  rules1,
  rules2,
  onRules1Change,
  onRules2Change,
  canProceed,
  onNext,
}: InvestmentReviewBoxProps) {
  const [sheetOpen, setSheetOpen] = useState(false)

  const summaryItems: SummaryItem[] = [
    { label: 'مبلغ سرمایه‌گذاری', value: formatToman(investmentAmount) },
    { label: 'تعداد سهام',    value: `${bidiIsolate(formatNumber(shares / 1000, 1))} کیلو وات` },
    { label: 'درصد مالکیت',   value: `${bidiIsolate(formatNumber(ownershipPct, 4))}٪` },
    { label: 'درآمد سالانه',  value: formatToman(annualIncome) },
    { label: 'پرداخت ماهانه', value: formatToman(monthlyPayout) },
    { label: 'کارمزد',        value: formatToman(fee) },
    { label: 'مجموع پرداختی', value: formatToman(total) },
  ]

  // Funding source — two buttons only, shown above the agreement checkboxes.
  const fundingToggle = (
    <div className="flex flex-col gap-2">
      <span className="text-[13px] font-medium text-text-muted">منبع تأمین مالی</span>
      <div className="grid grid-cols-2 gap-2">
        {FUNDING_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onFundingSourceChange(opt.value)}
            aria-pressed={fundingSource === opt.value}
            className={cn(
              'min-h-[44px] rounded-md border text-[13px] font-medium px-2 py-2 transition-colors',
              fundingSource === opt.value
                ? 'bg-green-tint border-green-base text-green-deep'
                : 'bg-surface border-border text-text-muted hover:bg-hover',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )

  const checkboxes = (
    <div className="flex flex-col gap-3">
      <Checkbox
        checked={rules1}
        onChange={onRules1Change}
        label={
          <span>
            قوانین و مقررات{' '}
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
            <CheckboxLink href="/risk-disclosure">اعلامیه ریسک‌های سرمایه‌گذاری</CheckboxLink>
            {' '}آشنا هستم
          </span>
        }
      />
    </div>
  )

  return (
    <>
      {/* ── Desktop: tall left-rail card [F §10, D §11] ── */}
      <Card className="hidden lg:flex flex-col gap-5 p-5">
        <h3 className="text-[15px] font-semibold text-text">خلاصه سرمایه‌گذاری</h3>

        {/* Live computed values — two columns to keep the card short */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          {summaryItems.map(item => (
            <SummaryRow key={item.label} label={item.label} value={item.value} />
          ))}
        </div>

        <div className="h-px bg-border" />

        {/* Funding source (two buttons) above the agreement checkboxes */}
        {fundingToggle}

        {/* Checkboxes */}
        {checkboxes}

        {/* CTA — disabled until both checked [M §6.8] */}
        <Button
          variant="primary"
          size="wide"
          fullWidth
          disabled={!canProceed}
          onClick={onNext}
          className="mt-auto"
        >
          ادامه — بررسی سفارش
        </Button>
      </Card>

      {/* ── Mobile: sticky bottom summary bar [M §6.8, M §7.6, M §10] ── */}
      <div
        className={cn(
          'lg:hidden fixed bottom-0 inset-x-0 z-50 bg-surface',
          'border-t border-border shadow-[0_-4px_16px_rgba(3,8,14,.10)]',
          'sticky-cta',  // adds safe-area-inset-bottom padding from globals.css
        )}
      >
        {/* Compact tap area: shows 3 key figures, opens sheet on tap */}
        <button
          className="w-full flex items-center justify-between px-4 py-2 gap-2"
          onClick={() => setSheetOpen(true)}
          aria-label="نمایش خلاصه کامل سرمایه‌گذاری"
        >
          <div className="flex gap-5 text-start">
            <MiniStat label="سهام"   value={`${bidiIsolate(formatNumber(shares / 1000, 1))} ک.و`} />
            <MiniStat label="ماهانه" value={formatToman(monthlyPayout)} />
            <MiniStat label="مجموع"  value={formatToman(investmentAmount)} />
          </div>
          <ChevronUp size={16} className="text-text-muted shrink-0" aria-hidden="true" />
        </button>

        {/* Funding + Checkboxes + CTA */}
        <div className="flex flex-col gap-2.5 px-4 pt-1 pb-2">
          {fundingToggle}
          {/* Compact mobile checkboxes */}
          <Checkbox
            checked={rules1}
            onChange={onRules1Change}
            label={<span className="text-[13px]">قوانین پلتفرم را می‌پذیرم</span>}
          />
          <Checkbox
            checked={rules2}
            onChange={onRules2Change}
            label={<span className="text-[13px]">با ریسک‌های سرمایه‌گذاری آشنا هستم</span>}
          />
          <Button
            variant="primary"
            size="wide"
            fullWidth
            disabled={!canProceed}
            onClick={onNext}
          >
            ادامه — بررسی سفارش
          </Button>
        </div>
      </div>

      {/* Mobile expansion sheet — all 4 figures [M §6.8] */}
      {sheetOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-[55] bg-black/50 motion-reduce:bg-black/40"
            onClick={() => setSheetOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="خلاصه سرمایه‌گذاری"
            className={cn(
              'lg:hidden fixed inset-x-0 bottom-0 z-[60]',
              'bg-surface rounded-t-[24px] p-5',
              'flex flex-col gap-4',
            )}
          >
            {/* Drag handle */}
            <div className="mx-auto w-10 h-1 rounded-pill bg-border" aria-hidden="true" />

            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-text">خلاصه سرمایه‌گذاری</h3>
              <button
                onClick={() => setSheetOpen(false)}
                className="p-2 -me-2 text-text-muted min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="بستن"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
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
    <div className="flex flex-col gap-0.5">
      <span className="text-[12px] text-text-muted">{label}</span>
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
