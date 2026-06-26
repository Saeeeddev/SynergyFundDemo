'use client'

import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { formatToman } from '@/lib/utils/currency'
import { formatNumber, formatCompact, bidiIsolate } from '@/lib/utils/numbers'
import type { Project } from '@/types/domain'

// [F §10 Step1 Right-middle] Amount input + presets + green investment summary
// [D §9.18] Input, preset pills, green summary well
// [M §7.5] inputMode="numeric", 48px on phone

interface InvestmentAmountBoxProps {
  project: Project
  amount: string
  onAmountChange: (v: string) => void
  cashBalance: number
  shares: number
  ownershipPct: number
  annualIncome: number
  monthlyPayout: number
}

// Presets: 1×, 2×, 5×, 10× min investment
function buildPresets(minInvestment: number) {
  return [1, 2, 5, 10].map(m => minInvestment * m)
}

export function InvestmentAmountBox({
  project,
  amount,
  onAmountChange,
  cashBalance,
  shares,
  ownershipPct,
  annualIncome,
  monthlyPayout,
}: InvestmentAmountBoxProps) {
  const parsed = parseFloat(amount.replace(/[^0-9.]/g, '')) || 0
  const presets = buildPresets(project.minInvestment)

  const amountError =
    parsed > 0 && parsed < project.minInvestment
      ? `حداقل سرمایه‌گذاری ${formatToman(project.minInvestment)} است`
      : parsed > cashBalance && parsed > 0
      ? 'موجودی کافی نیست'
      : undefined

  const showSummary = parsed >= project.minInvestment && shares > 0

  return (
    <Card className="p-4 flex flex-col gap-4">
      <h3 className="text-[13px] font-medium text-text-muted">مبلغ سرمایه‌گذاری</h3>

      {/* Amount input [D §9.18, M §7.5] */}
      <Input
        label="مبلغ (تومان)"
        value={amount}
        onChange={e => onAmountChange(e.target.value.replace(/[^0-9]/g, ''))}
        inputMode="numeric"
        placeholder="مبلغ را وارد کنید"
        error={amountError}
        dir="ltr"
      />

      {/* Min + balance info */}
      <div className="flex justify-between text-[12px] text-text-muted -mt-2">
        <span>حداقل: {formatToman(project.minInvestment)}</span>
        <span>موجودی: {formatToman(cashBalance)}</span>
      </div>

      {/* 4 preset pills [F §10, D §9.18] — each ≥44px tap target [M §4] */}
      <div className="grid grid-cols-4 gap-2">
        {presets.map((preset, i) => {
          const isActive = parsed === preset
          return (
            <Button
              key={i}
              variant={isActive ? 'primary' : 'secondary'}
              size="compact"
              shape="pill"
              onClick={() => onAmountChange(String(preset))}
              className="text-[11px] px-1"
            >
              {formatCompact(preset)}
            </Button>
          )
        })}
      </div>

      {/* Green Investment Summary well [D §9.18, F §10] */}
      {showSummary && (
        <div
          className="bg-green-tint border-s-2 border-green-base rounded-md p-3 flex flex-col gap-2.5"
          aria-label="خلاصه سرمایه‌گذاری"
        >
          <p className="text-[12px] font-semibold text-green-deep">خلاصه سرمایه‌گذاری</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <SummaryRow label="تعداد سهام"    value={`${bidiIsolate(formatNumber(shares))} وات`} />
            <SummaryRow label="درصد مالکیت"   value={`${bidiIsolate(formatNumber(ownershipPct, 4))}٪`} />
            <SummaryRow label="درآمد سالانه"  value={formatToman(annualIncome)} />
            <SummaryRow label="پرداخت ماهانه" value={formatToman(monthlyPayout)} />
          </div>
        </div>
      )}
    </Card>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-green-soft">{label}</span>
      <span className="text-[12px] font-semibold text-green-deep tabular-nums">{value}</span>
    </div>
  )
}
