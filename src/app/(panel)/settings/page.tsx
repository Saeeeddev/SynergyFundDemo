'use client'

// [F §7] Settings page — 2 tabs: Account & Identity / Security & Access
// [M §6.10] Phone: scrollable underline tab strip

import { useState } from 'react'
import { Tabs } from '@/components/ui/Tabs'
import { VerificationStatusCard } from '@/components/settings/VerificationStatusCard'
import { PayoutMethodsCard } from '@/components/settings/PayoutMethodsCard'
import { PasswordCard } from '@/components/settings/PasswordCard'
import { TwoFactorCard } from '@/components/settings/TwoFactorCard'

const TABS = [
  { value: 'account', label: 'حساب و هویت' },
  { value: 'security', label: 'امنیت و دسترسی' },
]

export default function SettingsPage() {
  const [tab, setTab] = useState('account')

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-5 lg:p-5">

      {/* Underline tabs — scrollable strip on phone [M §6.10, D §9.7] */}
      <Tabs tabs={TABS} value={tab} onChange={setTab} accent="green" />

      {/* Tab 1 — Account & Identity [F §7 Tab1] */}
      {tab === 'account' && (
        <div className="flex flex-col gap-4">
          <VerificationStatusCard />
          <PayoutMethodsCard />
        </div>
      )}

      {/* Tab 2 — Security & Access [F §7 Tab2] */}
      {tab === 'security' && (
        <div className="flex flex-col gap-4">
          <PasswordCard />
          <TwoFactorCard />
        </div>
      )}

    </div>
  )
}
