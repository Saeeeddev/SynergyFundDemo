'use client'

// [F §13] Verification page — dummy sign button, presence over function
// [D §11] Purple «تأیید هویت» status badge + dummy sign button (Primary)
// [M §6.12] Full-width prominent card

import { useState } from 'react'
import { ShieldCheck, ShieldAlert, ShieldX, FileText, CheckCircle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useMe } from '@/lib/hooks/useAuth'
import type { User } from '@/lib/schemas/user'

const STATUS_CONFIG: Record<User['verificationStatus'], {
  label: string
  description: string
  icon: typeof ShieldCheck
  badgeClasses: string
}> = {
  verified: {
    label: 'هویت تأیید شده',
    description: 'احراز هویت شما با موفقیت انجام شده است.',
    icon: ShieldCheck,
    badgeClasses: 'bg-green-tint text-green-deep',
  },
  pending: {
    label: 'در انتظار تأیید',
    description: 'مدارک شما در حال بررسی است. معمولاً این فرآیند تا ۴۸ ساعت طول می‌کشد.',
    icon: ShieldAlert,
    badgeClasses: 'bg-gold-tint text-gold-deep',
  },
  rejected: {
    label: 'رد شده',
    description: 'متأسفانه اطلاعات ارسالی تأیید نشد. لطفاً مدارک خود را مجدداً ارسال کنید.',
    icon: ShieldX,
    badgeClasses: 'bg-red-tint text-red-deep',
  },
}

export function VerificationCard() {
  const { data: user } = useMe()
  const [signed, setSigned] = useState(false)
  const [signing, setSigning] = useState(false)

  const status = user?.verificationStatus ?? 'pending'
  const { label, description, icon: StatusIcon, badgeClasses } = STATUS_CONFIG[status]

  async function handleSign() {
    setSigning(true)
    await new Promise((r) => setTimeout(r, 800))
    setSigning(false)
    setSigned(true)
  }

  return (
    <Card className="flex flex-col gap-6 w-full">
      {/* Purple identity header */}
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="w-20 h-20 rounded-pill bg-purple-tint flex items-center justify-center">
          <StatusIcon size={40} className="text-purple-base" />
        </div>
        <div className="text-center flex flex-col gap-1">
          <h1 className="text-[17px] font-semibold text-text">تأیید هویت</h1>
          <p className="text-[13px] text-text-muted max-w-xs">{description}</p>
        </div>
        {/* Status badge */}
        <div className={`inline-flex items-center gap-1.5 rounded-pill px-4 py-2 text-[13px] font-semibold ${badgeClasses}`}>
          <StatusIcon size={16} />
          <span>{label}</span>
        </div>
      </div>

      {/* Document signing section */}
      <div className="border-t border-border pt-5 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-chip bg-purple-tint flex items-center justify-center shrink-0 mt-0.5">
            <FileText size={20} className="text-purple-deep" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-[14px] font-semibold text-text">امضای قرارداد مشارکت</h3>
            <p className="text-[13px] text-text-muted">
              برای تکمیل احراز هویت، لطفاً قرارداد مشارکت را مطالعه و امضا کنید.
            </p>
          </div>
        </div>

        {signed ? (
          <div className="flex items-center gap-2 rounded-md bg-green-tint px-4 py-3 text-green-deep">
            <CheckCircle size={18} />
            <span className="text-[14px] font-medium">قرارداد با موفقیت امضا شد</span>
          </div>
        ) : (
          <Button
            variant="primary"
            size="wide"
            fullWidth
            onClick={handleSign}
            disabled={signing}
          >
            {signing ? 'در حال پردازش…' : 'امضای الکترونیکی قرارداد'}
          </Button>
        )}
      </div>

      {/* Steps guide */}
      <div className="border-t border-border pt-5">
        <h3 className="text-[13px] font-semibold text-text-muted mb-3">مراحل احراز هویت</h3>
        <ol className="flex flex-col gap-3">
          {[
            'ارسال اطلاعات هویتی',
            'بارگذاری مدارک شناسایی',
            'امضای قرارداد مشارکت',
            'تأیید نهایی توسط تیم پلتفرم',
          ].map((step, i) => (
            <li key={i} className="flex items-center gap-3">
              <span className={`w-6 h-6 rounded-pill text-[11px] font-bold flex items-center justify-center shrink-0 ${
                i < 2 ? 'bg-green-base text-white' : 'bg-gray-tint text-text-muted'
              }`}>
                {i < 2 ? '✓' : String(i + 1)}
              </span>
              <span className={`text-[13px] ${i < 2 ? 'text-text line-through' : 'text-text-2'}`}>
                {step}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </Card>
  )
}
