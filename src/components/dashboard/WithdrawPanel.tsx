'use client'

// برداشت وجه — withdraw drawer (mirrors the reference):
//   destination account · settlement date (instant/today/next days) ·
//   amount · recent-amount chips · submit.
// UI-only: submitting shows a confirmation toast and closes.

import { useState } from 'react'
import { Drawer } from '@/components/ui/Drawer'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { formatToman } from '@/lib/utils/currency'
import { groupDigits, onlyDigits, formatNumber, bidiIsolate } from '@/lib/utils/numbers'
import { toast } from '@/lib/toast'
import { useCashConfig } from '@/lib/hooks/useCash'

interface WithdrawPanelProps {
  open: boolean
  onClose: () => void
  balance: number
}

const DATE_OPTIONS = [
  { id: 'instant', label: 'آنی' },
  { id: 'today',   label: 'امروز' },
  { id: 'tomorrow', label: 'فردا — ۸ تیر' },
  { id: 'next',    label: 'سه‌شنبه — ۹ تیر' },
]

export function WithdrawPanel({ open, onClose, balance }: WithdrawPanelProps) {
  const { data: config } = useCashConfig()
  const accounts = config?.userAccounts ?? []
  const recentAmounts = config?.recentWithdrawAmounts ?? []
  const dailyCap = config?.dailyWithdrawCap ?? 0

  const [account, setAccount] = useState('')
  const [dateOption, setDateOption] = useState('today')
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
          <select
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className="w-full h-12 md:h-10 rounded-md border border-border-strong bg-surface px-3 text-[14px] text-text focus:outline-none focus:ring-2 focus:ring-green-tint focus:border-green-base"
          >
            <option value="">حساب خود را انتخاب کنید</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>{`${a.bankName} — ${a.cardNumber}`}</option>
            ))}
          </select>
        </div>

        {/* Settlement date options */}
        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-medium text-text-muted">تاریخ برداشت:</span>
          {DATE_OPTIONS.map((opt) => {
            const active = dateOption === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setDateOption(opt.id)}
                className={cn(
                  'flex items-center justify-between gap-3 rounded-md border px-4 py-3 text-start transition-colors',
                  active ? 'border-blue-base bg-blue-tint' : 'border-border bg-surface hover:bg-hover',
                )}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      'w-4 h-4 rounded-full border-2 shrink-0',
                      active ? 'border-blue-base bg-blue-base' : 'border-border-strong',
                    )}
                  />
                  <span className="text-[13px] font-medium text-text">{opt.label}</span>
                </span>
                <span className="text-[11px] text-text-muted tabular-nums">
                  تا سقف {bidiIsolate(formatNumber(dailyCap))} ریال
                </span>
              </button>
            )
          })}
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

        <p className="text-[12px] text-text-muted leading-relaxed">
          درخواست برداشت وجه روزهای کاری بانک‌های ملت، ملی، تجارت، صادرات، خاورمیانه، سامان و
          پاسارگاد طبق سقف و ساعات اعلام‌شده پردازش می‌شود.
        </p>
      </div>
    </Drawer>
  )
}
