'use client'

// واریز وجه — deposit drawer with two modes (mirrors the reference):
//   • واریز آنی        → choose a bank gateway, enter amount, pay
//   • ثبت فیش واریزی   → amount + receipt no. + date + account + upload
// UI-only: submitting shows a confirmation toast and closes.

import { useState } from 'react'
import { Drawer } from '@/components/ui/Drawer'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { UploadCloud } from 'lucide-react'
import { groupDigits, onlyDigits } from '@/lib/utils/numbers'
import { toast } from '@/lib/toast'
import { useCashConfig } from '@/lib/hooks/useCash'

type Mode = 'instant' | 'receipt'

const MODE_OPTIONS = [
  { value: 'instant' as const, label: 'واریز آنی' },
  { value: 'receipt' as const, label: 'ثبت فیش واریزی' },
]

interface DepositPanelProps {
  open: boolean
  onClose: () => void
}

export function DepositPanel({ open, onClose }: DepositPanelProps) {
  const { data: config } = useCashConfig()
  const gateways = config?.gateways ?? []
  // "به کدام حساب واریز کرده‌اید؟" = which PLATFORM account you paid the receipt to.
  const platformAccounts = config?.platformAccounts ?? []

  const [mode, setMode] = useState<Mode>('instant')
  const [amount, setAmount] = useState('')
  const [gateway, setGateway] = useState('')
  const [receiptNo, setReceiptNo] = useState('')
  const [account, setAccount] = useState('')
  const [fileName, setFileName] = useState('')

  const gatewayValue = gateway || gateways[0]?.id || ''
  const accountValue = account || platformAccounts[0]?.id || ''
  const amountValid = (parseFloat(onlyDigits(amount)) || 0) > 0

  function handleInstant() {
    if (!amountValid) {
      toast.error('لطفاً مبلغ را وارد کنید.')
      return
    }
    toast.success('در حال انتقال به درگاه پرداخت…')
    onClose()
  }

  function handleReceipt() {
    if (!amountValid || !receiptNo) {
      toast.error('مبلغ و شماره فیش را کامل کنید.')
      return
    }
    toast.success('فیش واریزی ثبت شد و پس از بررسی اعمال می‌شود.')
    onClose()
  }

  return (
    <Drawer open={open} onClose={onClose} title="واریز وجه">
      <div className="flex flex-col gap-5">
        <SegmentedControl options={MODE_OPTIONS} value={mode} onChange={setMode} className="w-full" />

        {/* ── واریز آنی ─────────────────────────────────────────────── */}
        {mode === 'instant' && (
          <div className="flex flex-col gap-4">
            <Field label="درگاه پرداخت">
              <Select value={gatewayValue} onChange={setGateway}>
                {gateways.map((g) => (
                  <option key={g.id} value={g.id}>{g.label}</option>
                ))}
              </Select>
            </Field>

            <Input
              label="مبلغ (ریال)"
              dir="ltr"
              inputMode="numeric"
              placeholder="مبلغ را وارد کنید"
              value={groupDigits(amount)}
              onChange={(e) => setAmount(onlyDigits(e.target.value))}
            />

            <div className="rounded-md bg-surface-2 border border-border p-4 text-[12px] text-text-muted leading-relaxed">
              <p className="font-semibold text-text-2 mb-1">شرایط واریز وجه از طریق درگاه‌های بانکی:</p>
              واریز وجه از طریق تمامی درگاه‌ها با کارت‌های بانکی به نام خود کاربر و بدون محدودیت در سقف مبلغ امکان‌پذیر است.
            </div>

            <Button variant="primary" size="wide" fullWidth onClick={handleInstant}>
              پرداخت
            </Button>
          </div>
        )}

        {/* ── ثبت فیش واریزی ────────────────────────────────────────── */}
        {mode === 'receipt' && (
          <div className="flex flex-col gap-4">
            <Input
              label="مبلغ (ریال)"
              dir="ltr"
              inputMode="numeric"
              placeholder="مبلغ را وارد کنید"
              value={groupDigits(amount)}
              onChange={(e) => setAmount(onlyDigits(e.target.value))}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="شماره فیش"
                inputMode="numeric"
                placeholder="شماره فیش"
                value={receiptNo}
                onChange={(e) => setReceiptNo(onlyDigits(e.target.value))}
              />
              <Input label="تاریخ فیش" defaultValue="۱۴۰۵/۰۴/۰۷" readOnly />
            </div>

            <Field label="به کدام حساب واریز کرده‌اید؟">
              <Select value={accountValue} onChange={setAccount}>
                {platformAccounts.map((a) => (
                  <option key={a.id} value={a.id}>{`${a.bankName} — ${a.cardNumber}`}</option>
                ))}
              </Select>
            </Field>

            {/* Upload (UI-only) */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium text-text-muted">بارگذاری تصویر فیش واریزی</span>
              <label className="flex items-center justify-between gap-3 rounded-md border border-dashed border-border-strong bg-surface-2 px-4 py-3 cursor-pointer hover:bg-hover transition-colors">
                <span className="text-[13px] text-text-muted truncate">
                  {fileName || 'فرمت‌های مجاز: png ,jpg ,jpeg ,tif/tiff'}
                </span>
                <span className="flex items-center gap-1.5 text-[13px] font-medium text-blue-deep shrink-0">
                  <UploadCloud size={16} /> انتخاب تصویر
                </span>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.tif,.tiff"
                  className="hidden"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
                />
              </label>
            </div>

            <Button variant="primary" size="wide" fullWidth onClick={handleReceipt}>
              ثبت
            </Button>
          </div>
        )}
      </div>
    </Drawer>
  )
}

/* ── small local helpers ─────────────────────────────────────────────── */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-text-muted">{label}</span>
      {children}
    </div>
  )
}

function Select({
  value,
  onChange,
  children,
}: {
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-12 md:h-10 rounded-md border border-border-strong bg-surface px-3 text-[14px] text-text focus:outline-none focus:ring-2 focus:ring-green-tint focus:border-green-base"
    >
      {children}
    </select>
  )
}
