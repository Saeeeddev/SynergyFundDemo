'use client'

// برداشت وجه — withdraw drawer (mirrors the reference):
//   destination account · settlement date (instant/today/next days) ·
//   amount · recent-amount chips · submit.
// UI-only: submitting shows a confirmation toast and closes.

import { useState } from 'react'
import { Drawer } from '@/components/ui/Drawer'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Dropdown } from '@/components/ui/Dropdown'
import { formatToman } from '@/lib/utils/currency'
import { groupDigits, onlyDigits } from '@/lib/utils/numbers'
import { toast } from '@/lib/toast'
import { useCashConfig } from '@/lib/hooks/useCash'

interface WithdrawPanelProps {
  open: boolean
  onClose: () => void
  balance: number
}

export function WithdrawPanel({ open, onClose, balance }: WithdrawPanelProps) {
  const { data: config } = useCashConfig()
  const accounts = config?.userAccounts ?? []
  const recentAmounts = config?.recentWithdrawAmounts ?? []

  const [account, setAccount] = useState('')
  const [amount, setAmount] = useState('')

  const numAmount = parseFloat(onlyDigits(amount)) || 0

  function handleSubmit() {
    if (!account) {
      toast.error('لطفاً حساب مقصد را انتخاب کنید.')
      return
    }
    if (numAmount <= 0) {
      toast.error('لطفاً مبلغ برداشت را وارد کنید.')
      return
    }
    if (numAmount > balance) {
      toast.error('مبلغ برداشت بیشتر از موجودی نقدی است.')
      return
    }
    toast.success('درخواست برداشت شما ثبت شد.')
    onClose()
  }

  return (
    <Drawer open={open} onClose={onClose} title="برداشت وجه">
      <div className="flex flex-col gap-5">
        {/* Destination account */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium text-text-muted">واریز به:</span>
          <Dropdown
            fullWidth
            placeholder="حساب خود را انتخاب کنید"
            value={account}
            onChange={setAccount}
            options={accounts.map((a) => ({ value: a.id, label: `${a.bankName} — ${a.cardNumber}` }))}
          />
        </div>

        {/* Amount */}
        <Input
          label="مبلغ (ریال)"
          dir="ltr"
          inputMode="numeric"
          placeholder="مبلغ را وارد کنید"
          value={groupDigits(amount)}
          onChange={(e) => setAmount(onlyDigits(e.target.value))}
          helper={`موجودی نقدی: ${formatToman(balance)}`}
        />

        {/* Recent amounts */}
        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-medium text-text-muted">تراکنش‌های اخیر:</span>
          <div className="flex flex-wrap gap-2">
            {recentAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmount(String(amt))}
                className="rounded-pill border border-border bg-surface px-3 py-1.5 text-[12px] font-medium text-text-2 tabular-nums hover:bg-hover transition-colors"
              >
                {formatToman(amt)}
              </button>
            ))}
          </div>
        </div>

        <Button variant="primary" size="wide" fullWidth onClick={handleSubmit}>
          ثبت درخواست
        </Button>
      </div>
    </Drawer>
  )
}
