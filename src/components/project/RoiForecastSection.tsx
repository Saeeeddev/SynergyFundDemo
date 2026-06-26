'use client'

// [F §11 R3] ROI Forecast Section wrapper
// Controls → 4 Summary Cards → 3 Charts → Assumptions Panel
// [M §6.7] Phone: controls stack, 2x2 summary, stacked full-width charts, assumptions collapsed

import { useState, useMemo } from 'react'
import { ForecastControls } from './ForecastControls'
import { ForecastSummaryCards } from './ForecastSummaryCards'
import { CumulativeRoiChart } from './CumulativeRoiChart'
import { YearlyIncomeChart } from './YearlyIncomeChart'
import { ScenarioComparisonChart } from './ScenarioComparisonChart'
import { AssumptionsPanel } from './AssumptionsPanel'
import { Card } from '@/components/ui/Card'
import type { Project, ForecastHorizon, ForecastScenario, ForecastYearData, RoiForecastResult, ForecastAssumptions } from '@/types/domain'

// ─── ROI calculation (client-side only, no backend) ─────────────────────────

const SCENARIO_MULTIPLIERS: Record<ForecastScenario, number> = {
  conservative: 0.80,
  base:         1.00,
  optimistic:   1.20,
}

const DEFAULT_ASSUMPTIONS: ForecastAssumptions = {
  annualYieldPercent: 18,
  degradationRatePercent: 0.5,
  electricityTariff: 1_500,
  operatingFeePercent: 2,
}

function computeForecast(
  project: Project,
  horizon: ForecastHorizon,
  scenario: ForecastScenario,
  investedAmount: number,
): { result: RoiForecastResult; yearlyData: ForecastYearData[] } {
  const multiplier = SCENARIO_MULTIPLIERS[scenario]
  const yieldRate = (project.targetYield / 100) * multiplier
  const degradation = DEFAULT_ASSUMPTIONS.degradationRatePercent / 100
  const principal = investedAmount > 0 ? investedAmount : project.minInvestment

  let cumulative = 0
  let paybackYear: number | null = null
  const yearlyData: ForecastYearData[] = []

  for (let y = 1; y <= horizon; y++) {
    const yearYield = yieldRate * Math.pow(1 - degradation, y - 1)
    const annualIncome = principal * yearYield
    cumulative += annualIncome
    if (paybackYear === null && cumulative >= principal) {
      paybackYear = y
    }
    yearlyData.push({ year: y, annualIncome, cumulativeReturn: cumulative })
  }

  const projectedTotalReturn = cumulative - principal
  const projectedReturnPercent = (projectedTotalReturn / principal) * 100
  const avgAnnualRoi = projectedReturnPercent / horizon
  const paybackYears = paybackYear ?? horizon + 1

  return {
    result: {
      projectedTotalReturn,
      projectedReturnPercent,
      avgAnnualRoi,
      paybackYears,
      projectedCumulativeIncome: cumulative,
      yearlyData,
    },
    yearlyData,
  }
}

interface RoiForecastSectionProps {
  project: Project
}

export function RoiForecastSection({ project }: RoiForecastSectionProps) {
  const [horizon, setHorizon] = useState<ForecastHorizon>(10)
  const [scenario, setScenario] = useState<ForecastScenario>('base')
  const [amount, setAmount] = useState('')

  const investedAmount = parseFloat(amount.replace(/[^0-9.]/g, '')) || 0

  // Compute all three scenarios for the comparison chart
  const { result, yearlyData } = useMemo(
    () => computeForecast(project, horizon, scenario, investedAmount),
    [project, horizon, scenario, investedAmount]
  )

  const allScenarios = useMemo(() => ({
    conservative: computeForecast(project, horizon, 'conservative', investedAmount).yearlyData,
    base:         computeForecast(project, horizon, 'base',         investedAmount).yearlyData,
    optimistic:   computeForecast(project, horizon, 'optimistic',   investedAmount).yearlyData,
  }), [project, horizon, investedAmount])

  return (
    <div className="flex flex-col gap-5">
      {/* Section title */}
      <div>
        <h2 className="text-[17px] font-semibold text-text">پیش‌بینی اقتصادی و ROI</h2>
        <p className="text-[13px] text-text-muted mt-1">
          بازده تخمینی بر اساس افق زمانی و سناریو انتخابی شما
        </p>
      </div>

      {/* Controls */}
      <Card className="p-4">
        <ForecastControls
          horizon={horizon}
          scenario={scenario}
          amount={amount}
          onHorizonChange={setHorizon}
          onScenarioChange={setScenario}
          onAmountChange={setAmount}
        />
      </Card>

      {/* 4 summary cards — live */}
      <ForecastSummaryCards result={result} />

      {/* 3 charts — stacked full-width on phone [M §6.7] */}
      <Card className="p-4">
        <h3 className="text-[14px] font-semibold text-text mb-4">بازده تجمیعی در طول زمان</h3>
        <CumulativeRoiChart yearlyData={yearlyData} investedAmount={investedAmount || project.minInvestment} />
      </Card>

      <Card className="p-4">
        <h3 className="text-[14px] font-semibold text-text mb-4">درآمد سالانه پیش‌بینی‌شده</h3>
        <YearlyIncomeChart yearlyData={yearlyData} />
      </Card>

      <Card className="p-4">
        <h3 className="text-[14px] font-semibold text-text mb-4">مقایسه سناریوها</h3>
        <ScenarioComparisonChart scenarios={allScenarios} />
      </Card>

      {/* Assumptions — disclaimer always visible, detail expandable [F §11] */}
      <AssumptionsPanel assumptions={DEFAULT_ASSUMPTIONS} />
    </div>
  )
}
