'use client'

import { Card } from '@/components/ui/Card'
import { formatToman } from '@/lib/utils/currency'
import { cn } from '@/lib/utils/cn'

// [F §10 Step1 Right-bottom] Funding source toggle + fee breakdown + total
// Platform fee: 0.5%  |  Bank transfer fee: 1.5%
// [D §9.18] fee breakdown as a surface-2 inset well

export type FundingSource = 'platform' | 'bank'

interface FundingSourceBoxProps {
  fundingSource: FundingSource
  onFundingSourceChange: (v: FundingSource) => void
  amount: number
  platformFeeRate: number
  bankFeeRate: number
}

const FUNDING_OPTIONS: { value: FundingSource; label: string }[] = [
  { value: 'platform', label: 'موجودی پلتفرم' },
  { value: 'bank',     label: 'انتقال بانکی'  },
]

export function FundingSourceBox({
  fundingSource,
  onFundingSourceChange,
  amount,
  platformFeeRate,
  bankFeeRate,
}: FundingSourceBoxProps) {
  const feeRate = fundingSource === 'platform' ? platformFeeRate : bankFeeRate
  const fee   = amount * feeRate
  const total = amount + fee
  const feeLabel = `${(feeRate * 100).toFixed(1)}٪`

  return (
    <Card className="p-4 flex flex-col gap-4">
      <h3 className="text-[13px] font-medium text-text-muted">منبع تأمین مالی</h3>

      {/* Toggle [M §4] ≥44px touch targets */}
      <div className="grid grid-cols-2 gap-2">
        {FUNDING_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => onFundingSourceChange(opt.value)}
            className={cn(
              'min-h-[44px] rounded-md border text-[13px] font-medium px-2 py-2',
              'transition-colors duration-[120ms] motion-reduce:transition-none',
              fundingSource === opt.value
                ? 'bg-green-tint border-green-base text-green-deep'
                : 'bg-surface border-border text-text-muted hover:bg-hover',
            )}
            aria-pressed={fundingSource === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Fee breakdown well [D §9.18] */}
      <div className="bg-surface-2 border border-border rounded-md p-3 flex flex-col gap-2">
        <FeeRow label="مبلغ سرمایه‌گذاری"     value={formatToman(amount)} />
        <FeeRow label={`کارمزد (${feeLabel})`} value={formatToman(fee)} />
        <div className="h-px bg-border" />
        <FeeRow label="مجموع پرداختی" value={formatToman(total)} bold />
      </div>
    </Card>
  )
}

function FeeRow({
  label,
  value,
  bold,
}: {
  label: string
  value: string
  bold?: boolean
}) {
  return (
    <div className={cn('flex justify-between tabular-nums', bold ? 'text-text font-semibold text-[14px]' : 'text-text-muted text-[12px]')}>
      <span className={bold ? 'font-semibold' : ''}>{label}</span>
      <span>{value}</span>
    </div>
  )
}
