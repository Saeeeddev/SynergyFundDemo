'use client'

// [F §2 R1] Cash card — balance + Deposit (green) + Withdraw (red)
// [D §11]: wide card; buttons on the start side; big balance in display/metric
// [M §6.2]: phone → two half-width 48px buttons BELOW the balance

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { formatToman } from '@/lib/utils/currency'

interface CashCardProps {
  balance: number
  onDeposit?: () => void
  onWithdraw?: () => void
}

export function CashCard({ balance, onDeposit, onWithdraw }: CashCardProps) {
  return (
    <Card className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Balance — hero; reads first in RTL (right/start side) [D §11] */}
      <div className="flex flex-col gap-1">
        <span className="text-[13px] font-medium text-text-muted">موجودی نقدی</span>
        {/* display size on desktop, metric (24px) on phone [M §6.2, D §3.2] */}
        <span className="text-[24px] lg:text-[30px] font-bold text-text tabular-nums leading-none">
          {formatToman(balance)}
        </span>
      </div>

      {/* Buttons — two side-by-side half-width on phone (48px), inline on desktop [M §6.2] */}
      <div className="flex gap-3">
        <Button
          variant="primary"
          size="wide"
          onClick={onDeposit}
          className="flex-1 lg:flex-none"
        >
          واریز
        </Button>
        <Button
          variant="destructive"
          size="wide"
          onClick={onWithdraw}
          className="flex-1 lg:flex-none"
        >
          برداشت
        </Button>
      </div>
    </Card>
  )
}
