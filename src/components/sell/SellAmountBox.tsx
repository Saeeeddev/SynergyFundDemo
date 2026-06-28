'use client'

import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { formatToman } from '@/lib/utils/currency'
import { formatNumber, bidiIsolate, groupDigits, onlyDigits } from '@/lib/utils/numbers'
import type { Holding } from '@/types/domain'

// [F §12, D §11, M §6.9] Quantity input + 4 sell presets + red summary well
// Presets: 25%, 50%, 75%, 100% of sharesOwned

interface SellAmountBoxProps {
  holding: Holding
  quantity: string
  onQuantityChange: (v: string) => void
  proceeds: number
  fee: number
  netProceeds: number
}

function buildPresets(sharesOwned: number): number[] {
  return [0.25, 0.5, 0.75, 1].map(pct => Math.floor(sharesOwned * pct))
}

function presetLabel(pct: number): string {
  return `${Math.round(pct * 100)}٪`
}

const PRESET_PCTS = [0.25, 0.5, 0.75, 1]

export function SellAmountBox({
  holding,
  quantity,
  onQuantityChange,
  proceeds,
  fee,
  netProceeds,
}: SellAmountBoxProps) {
  const parsed   = parseInt(quantity, 10) || 0
  const presets  = buildPresets(holding.sharesOwned)

  const qtyError =
    parsed > holding.sharesOwned
      ? `حداکثر ${bidiIsolate(formatNumber(holding.sharesOwned))} وات`
      : parsed < 0
      ? 'مقدار نامعتبر'
      : undefined

  const showSummary = parsed > 0 && parsed <= holding.sharesOwned

  return (
    <Card className="p-4 flex flex-col gap-4">
      <h3 className="text-[13px] font-medium text-text-muted">مقدار فروش</h3>

      {/* Quantity input — numeric, whole shares (watts) */}
      <Input
        label="تعداد سهام (وات)"
        value={groupDigits(quantity)}
        onChange={e => onQuantityChange(onlyDigits(e.target.value))}
        inputMode="numeric"
        placeholder="تعداد سهام برای فروش"
        error={qtyError}
        helper={`موجودی: ${bidiIsolate(formatNumber(holding.sharesOwned))} وات`}
        dir="ltr"
      />

      {/* Preset pills [F §12, D §11] — 25% / 50% / 75% / 100% */}
      <div className="grid grid-cols-4 gap-2">
        {PRESET_PCTS.map((pct, i) => {
          const preset  = presets[i]
          const isActive = parsed === preset
          return (
            <Button
              key={pct}
              variant={isActive ? 'destructive' : 'secondary'}
              size="compact"
              shape="pill"
              onClick={() => onQuantityChange(String(preset))}
              className="text-[11px] px-1"
            >
              {presetLabel(pct)}
            </Button>
          )
        })}
      </div>

      {/* Red sell summary well [D §11 Sell recipe] */}
      {showSummary && (
        <div
          className="bg-red-tint border-s-2 border-red-base rounded-md p-3 flex flex-col gap-2.5"
          aria-label="خلاصه فروش"
        >
          <p className="text-[12px] font-semibold text-red-deep">خلاصه فروش</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <SummaryRow label="تعداد سهام"    value={`${bidiIsolate(formatNumber(parsed))} وات`} />
            <SummaryRow label="قیمت فعلی"     value={formatToman(holding.currentPrice)} />
            <SummaryRow label="عواید فروش"    value={formatToman(proceeds)} />
            <SummaryRow label="خالص دریافتی"  value={formatToman(netProceeds)} />
          </div>
        </div>
      )}
    </Card>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-red-soft">{label}</span>
      <span className="text-[12px] font-semibold text-red-deep tabular-nums">{value}</span>
    </div>
  )
}
