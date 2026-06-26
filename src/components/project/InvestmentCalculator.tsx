'use client'

// [F §11 R2 left 25%] Investment Calculator — live, NOT backend-connected
// Amount → Shares / Ownership% / Est. Annual Income / Monthly Payout + Invest Now button
// [M §6.7] Phone: placed ABOVE the tabs (directly under stats)
// [D §9.18] Inset well with Green accent

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Calculator } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { formatToman, formatTomanCompact } from '@/lib/utils/currency'
import { formatNumber, formatPercent } from '@/lib/utils/numbers'
import type { Project } from '@/types/domain'

interface InvestmentCalculatorProps {
  project: Project
}

export function InvestmentCalculator({ project }: InvestmentCalculatorProps) {
  const router = useRouter()
  const [amount, setAmount] = useState('')

  const numAmount = parseFloat(amount.replace(/[^0-9.]/g, '')) || 0
  const shares = project.sharePrice > 0 ? Math.floor(numAmount / project.sharePrice) : 0
  const totalWatts = project.totalCapacityWatts
  const ownershipPct = totalWatts > 0 ? (shares / totalWatts) * 100 : 0
  const annualIncome = numAmount * (project.targetYield / 100)
  const monthlyPayout = annualIncome / 12

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    setAmount(raw)
  }, [])

  const isValid = numAmount >= project.minInvestment && shares > 0

  return (
    <Card className="flex flex-col gap-4 p-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="w-8 h-8 rounded-chip bg-green-tint text-green-deep flex items-center justify-center shrink-0">
          <Calculator size={16} />
        </span>
        <h3 className="text-[15px] font-semibold text-text">ماشین‌حساب سرمایه‌گذاری</h3>
      </div>

      {/* Amount input */}
      <Input
        label="مبلغ سرمایه‌گذاری (تومان)"
        placeholder="مبلغ را وارد کنید"
        inputMode="numeric"
        value={amount}
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

      {/* Invest Now button — navigates to /invest/[projectId] */}
      <Button
        variant="primary"
        size="wide"
        fullWidth
        disabled={!isValid}
        onClick={() => router.push(`/invest/${project.id}`)}
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
