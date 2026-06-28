'use client'

// [F §11 R2 left 25%] Investment Calculator — live, NOT backend-connected
// Amount → Shares / Ownership% / Est. Annual Income / Monthly Payout + Invest Now button
// [M §6.7] Phone: placed ABOVE the tabs (directly under stats)
// [D §9.18] Inset well with Green accent

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Calculator } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { formatToman, formatTomanCompact } from '@/lib/utils/currency'
import { formatNumber, formatPercent, groupDigits, onlyDigits } from '@/lib/utils/numbers'
import type { Project } from '@/types/domain'

interface InvestmentCalculatorProps {
  project: Project
  /** Raw digit string — controlled, shared with the ROI forecast + Invest flow */
  amount: string
  onAmountChange: (raw: string) => void
}

export function InvestmentCalculator({ project, amount, onAmountChange }: InvestmentCalculatorProps) {
  const router = useRouter()

  const numAmount = parseFloat(onlyDigits(amount)) || 0
  const shares = project.sharePrice > 0 ? Math.floor(numAmount / project.sharePrice) : 0
  const totalWatts = project.totalCapacityWatts
  const ownershipPct = totalWatts > 0 ? (shares / totalWatts) * 100 : 0
  const annualIncome = numAmount * (project.targetYield / 100)
  const monthlyPayout = annualIncome / 12

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onAmountChange(onlyDigits(e.target.value))
  }, [onAmountChange])

  const isValid = numAmount >= project.minInvestment && shares > 0

  return (
    // Taller floating card: holds its height in the reserved right-side column
    // even before results show, so the column stays a stable "always there" panel.
    <Card className="flex flex-col gap-4 p-5 lg:min-h-[520px]">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="w-8 h-8 rounded-chip bg-[var(--sidebar-hover)] text-[var(--sidebar-active)] flex items-center justify-center shrink-0">
          <Calculator size={16} />
        </span>
        <h3 className="text-[15px] font-semibold text-text">ماشین‌حساب سرمایه‌گذاری</h3>
      </div>

      {/* Amount input */}
      <Input
        label="مبلغ سرمایه‌گذاری (تومان)"
        placeholder="مبلغ را وارد کنید"
        inputMode="numeric"
        dir="ltr"
        value={groupDigits(amount)}
        onChange={handleAmountChange}
        helper={`حداقل: ${formatTomanCompact(project.minInvestment)}`}
      />

      {/* Live calculation results — green inset well [D §9.18] */}
      {numAmount > 0 && (
        <div className="rounded-md bg-green-tint border-s-2 border-green-base p-4 flex flex-col gap-2.5">
          <CalcRow label="تعداد سهام (وات)" value={formatNumber(shares)} />
          <CalcRow label="درصد مالکیت" value={formatPercent(ownershipPct)} />
          <CalcRow label="درآمد سالانه تخمینی" value={formatToman(annualIncome)} />
          <CalcRow label="پرداخت ماهانه" value={formatToman(monthlyPayout)} />
        </div>
      )}

      {/* Invest Now — carries the entered amount through to the Invest flow */}
      <Button
        variant="primary"
        size="wide"
        fullWidth
        disabled={!isValid}
        onClick={() => router.push(`/invest/${project.id}?amount=${onlyDigits(amount)}`)}
      >
        سرمایه‌گذاری کنید
      </Button>

      {!isValid && numAmount > 0 && numAmount < project.minInvestment && (
        <p className="text-[12px] text-red-base text-center">
          مبلغ کمتر از حداقل سرمایه‌گذاری است
        </p>
      )}
    </Card>
  )
}

function CalcRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[12px] text-green-deep">{label}</span>
      <span className="text-[13px] font-semibold text-green-deep tabular-nums">{value}</span>
    </div>
  )
}
