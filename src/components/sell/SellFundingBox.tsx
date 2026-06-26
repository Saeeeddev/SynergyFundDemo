'use client'

import { Card } from '@/components/ui/Card'
import { formatToman } from '@/lib/utils/currency'
import { cn } from '@/lib/utils/cn'

// [F §12, D §11] Where proceeds go (Platform balance / Bank transfer) + fee breakdown
// Mirrors FundingSourceBox but recolored to Red/sell semantic [D §11 Sell recipe]

export type ProceedsDestination = 'platform' | 'bank'

interface SellFundingBoxProps {
  destination: ProceedsDestination
  onDestinationChange: (v: ProceedsDestination) => void
  proceeds: number
  fee: number
  netProceeds: number
  feeRate: number
}

const OPTIONS: { value: ProceedsDestination; label: string }[] = [
  { value: 'platform', label: 'موجودی پلتفرم' },
  { value: 'bank',     label: 'انتقال بانکی'  },
]

export function SellFundingBox({
  destination,
  onDestinationChange,
  proceeds,
  fee,
  netProceeds,
  feeRate,
}: SellFundingBoxProps) {
  const feeLabel = `${(feeRate * 100).toFixed(1)}٪`

  return (
    <Card className="p-4 flex flex-col gap-4">
      <h3 className="text-[13px] font-medium text-text-muted">واریز عواید به</h3>

      {/* Destination toggle — red active state */}
      <div className="grid grid-cols-2 gap-2">
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => onDestinationChange(opt.value)}
            className={cn(
              'min-h-[44px] rounded-md border text-[13px] font-medium px-2 py-2',
              'transition-colors duration-[120ms] motion-reduce:transition-none',
              destination === opt.value
                ? 'bg-red-tint border-red-base text-red-deep'
                : 'bg-surface border-border text-text-muted hover:bg-hover',
            )}
            aria-pressed={destination === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Fee breakdown well */}
      <div className="bg-surface-2 border border-border rounded-md p-3 flex flex-col gap-2">
        <FeeRow label="عواید فروش"                value={formatToman(proceeds)} />
        <FeeRow label={`کارمزد (${feeLabel})`}    value={`- ${formatToman(fee)}`} />
        <div className="h-px bg-border" />
        <FeeRow label="خالص دریافتی" value={formatToman(netProceeds)} bold />
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
