'use client'

// Owns the deposit / withdraw drawer state and wires them to the CashCard buttons.
// Also auto-opens the deposit drawer (prefilled) when redirected here with a
// ?deposit=<toman> query param — e.g. from the Invest flow when the platform
// balance is insufficient. Read via window.location to avoid forcing the static
// dashboard route into a Suspense boundary.
import { useEffect, useState } from 'react'
import { onlyDigits } from '@/lib/utils/numbers'
import { CashCard } from './CashCard'
import { DepositPanel } from './DepositPanel'
import { WithdrawPanel } from './WithdrawPanel'

interface CashSectionProps {
  balance: number
}

export function CashSection({ balance }: CashSectionProps) {
  const [depositOpen, setDepositOpen] = useState(false)
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [depositPrefill, setDepositPrefill] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const dep = params.get('deposit')
    if (dep) {
      setDepositPrefill(onlyDigits(dep))
      setDepositOpen(true)
      // Clean the URL so a refresh doesn't reopen the drawer
      const url = new URL(window.location.href)
      url.searchParams.delete('deposit')
      window.history.replaceState({}, '', url.toString())
    }
  }, [])

  return (
    <>
      <CashCard
        balance={balance}
        onDeposit={() => setDepositOpen(true)}
        onWithdraw={() => setWithdrawOpen(true)}
      />
      <DepositPanel
        open={depositOpen}
        onClose={() => setDepositOpen(false)}
        initialAmount={depositPrefill}
      />
      <WithdrawPanel open={withdrawOpen} onClose={() => setWithdrawOpen(false)} balance={balance} />
    </>
  )
}
