'use client'

// Owns the deposit / withdraw drawer state and wires them to the CashCard buttons.
import { useState } from 'react'
import { CashCard } from './CashCard'
import { DepositPanel } from './DepositPanel'
import { WithdrawPanel } from './WithdrawPanel'

interface CashSectionProps {
  balance: number
}

export function CashSection({ balance }: CashSectionProps) {
  const [depositOpen, setDepositOpen] = useState(false)
  const [withdrawOpen, setWithdrawOpen] = useState(false)

  return (
    <>
      <CashCard
        balance={balance}
        onDeposit={() => setDepositOpen(true)}
        onWithdraw={() => setWithdrawOpen(true)}
      />
      <DepositPanel open={depositOpen} onClose={() => setDepositOpen(false)} />
      <WithdrawPanel open={withdrawOpen} onClose={() => setWithdrawOpen(false)} balance={balance} />
    </>
  )
}
