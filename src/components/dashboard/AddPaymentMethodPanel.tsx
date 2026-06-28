'use client'

// افزودن روش پرداخت — add a bank card / account (UI-only drawer).
import { useState } from 'react'
import { Drawer } from '@/components/ui/Drawer'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { onlyDigits, toPersianDigits } from '@/lib/utils/numbers'
import { toast } from '@/lib/toast'

interface AddPaymentMethodPanelProps {
  open: boolean
  onClose: () => void
}

// Group a card number into ····-····-····-···· while typing.
function formatCard(raw: string): string {
  const d = onlyDigits(raw).slice(0, 16)
  return toPersianDigits(d.replace(/(.{4})/g, '$1-').replace(/-$/, ''))
}

export function AddPaymentMethodPanel({ open, onClose }: AddPaymentMethodPanelProps) {
  const [bankName, setBankName] = useState('')
  const [card, setCard] = useState('')
  const [owner, setOwner] = useState('')

  function handleSubmit() {
    if (!bankName || onlyDigits(card).length !== 16) {
      toast.error('نام بانک و شماره کارت ۱۶ رقمی را کامل کنید.')
      return
    }
    toast.success('روش پرداخت جدید ثبت شد.')
    setBankName('')
    setCard('')
    setOwner('')
    onClose()
  }

  return (
    <Drawer open={open} onClose={onClose} title="افزودن روش پرداخت">
      <div className="flex flex-col gap-4">
        <Input
          label="نام بانک"
          placeholder="مثلاً بانک ملت"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
        />
        <Input
          label="شماره کارت"
          dir="ltr"
          inputMode="numeric"
          placeholder="۱۶ رقم"
          value={formatCard(card)}
          onChange={(e) => setCard(onlyDigits(e.target.value).slice(0, 16))}
        />
        <Input
          label="نام صاحب حساب"
          placeholder="نام و نام خانوادگی"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
        />

        <Button variant="primary" size="wide" fullWidth onClick={handleSubmit}>
          افزودن حساب
        </Button>
      </div>
    </Drawer>
  )
}
