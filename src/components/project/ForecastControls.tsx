'use client'

// [F §11 R3] ROI Forecast controls: horizon + scenario toggle + amount input
// [M §6.7] Phone: stack controls; horizon = scrollable segmented or dropdown sheet

import { useCallback } from 'react'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Input } from '@/components/ui/Input'
import type { ForecastScenario, ForecastHorizon } from '@/types/domain'

const HORIZON_OPTIONS: { value: string; label: string }[] = [
  { value: '1',  label: '۱ سال' },
  { value: '5',  label: '۵ سال' },
  { value: '10', label: '۱۰ سال' },
  { value: '15', label: '۱۵ سال' },
  { value: '20', label: '۲۰ سال' },
  { value: '25', label: '۲۵ سال' },
]

const SCENARIO_OPTIONS: { value: string; label: string }[] = [
  { value: 'conservative', label: 'محافظه‌کارانه' },
  { value: 'base',         label: 'پایه' },
  { value: 'optimistic',   label: 'خوش‌بینانه' },
]

interface ForecastControlsProps {
  horizon: ForecastHorizon
  scenario: ForecastScenario
  amount: string
  onHorizonChange: (h: ForecastHorizon) => void
  onScenarioChange: (s: ForecastScenario) => void
  onAmountChange: (a: string) => void
}

export function ForecastControls({
  horizon,
  scenario,
  amount,
  onHorizonChange,
  onScenarioChange,
  onAmountChange,
}: ForecastControlsProps) {
  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onAmountChange(e.target.value.replace(/[^0-9]/g, ''))
  }, [onAmountChange])

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-6">

      {/* Horizon selector — scrollable segmented control [F §11 R3] */}
      <div className="flex flex-col gap-2 flex-1">
        <label className="text-[13px] font-medium text-text-muted">افق زمانی</label>
        <SegmentedControl
          options={HORIZON_OPTIONS}
          value={String(horizon)}
          onChange={(v) => onHorizonChange(Number(v) as ForecastHorizon)}
        />
      </div>

      {/* Scenario toggle */}
      <div className="flex flex-col gap-2 flex-1">
        <label className="text-[13px] font-medium text-text-muted">سناریو</label>
        <SegmentedControl
          options={SCENARIO_OPTIONS}
          value={scenario}
          onChange={(v) => onScenarioChange(v as ForecastScenario)}
        />
      </div>

      {/* Optional amount input */}
      <div className="flex flex-col gap-2 lg:w-52">
        <Input
          label="مبلغ سرمایه‌گذاری (تومان)"
          placeholder="اختیاری"
          inputMode="numeric"
          value={amount}
          onChange={handleAmountChange}
        />
      </div>
    </div>
  )
}
