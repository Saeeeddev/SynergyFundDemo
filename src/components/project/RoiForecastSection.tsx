'use client'

// [F §11 R3] ROI Forecast Section
// Fixed 25-year horizon, single (base) scenario. The investment amount comes from
// the shared InvestmentCalculator (lifted to the page) so the calculator, the
// forecast, and the Invest flow all use the same number. [F §11]
// Layout: Summary cards → payback note → assumptions → two charts side by side.

import { useMemo } from 'react'
import { Clock } from 'lucide-react'
import { ForecastSummaryCards } from './ForecastSummaryCards'
import { CumulativeRoiChart } from './CumulativeRoiChart'
import { YearlyIncomeChart } from './YearlyIncomeChart'
import { AssumptionsPanel } from './AssumptionsPanel'
import { Card } from '@/components/ui/Card'
import { formatNumber, onlyDigits } from '@/lib/utils/numbers'
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

// Fixed 25-year horizon and base scenario per product direction.
const HORIZON = 25 as ForecastHorizon
const SCENARIO: ForecastScenario = 'base'

// Toggle the war/market context line in the payback note. Set false to hide it.
const SHOW_MARKET_NOTE = true

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
  /** Raw digit string of the invested amount (shared with the calculator) */
  amount: string
}

export function RoiForecastSection({ project, amount }: RoiForecastSectionProps) {
  const investedAmount = parseFloat(onlyDigits(amount)) || 0

  const { result, yearlyData } = useMemo(
    () => computeForecast(project, HORIZON, SCENARIO, investedAmount),
    [project, investedAmount],
  )

  return (
    <div className="flex flex-col gap-5">
      {/* Section title */}
      <div>
        <h2 className="text-[17px] font-semibold text-text">پیش‌بینی اقتصادی و ROI</h2>
        <p className="text-[13px] text-text-muted mt-1">
          بازده تخمینی در افق ۲۵ ساله بر اساس مبلغ واردشده در ماشین‌حساب
        </p>
      </div>

      {/* 3 summary cards — live (payback shown as a note below, not a card) */}
      <ForecastSummaryCards result={result} />

      {/* Payback period — shown as a contextual note instead of a hard number card */}
      <div className="flex items-start gap-3 rounded-md bg-blue-tint border border-blue-base/20 px-4 py-3">
        <Clock size={18} className="text-blue-deep shrink-0 mt-0.5" />
        <p className="text-[13px] text-text-2 leading-relaxed">
          دوره بازگشت سرمایه در شرایط فعلی بازار
          {SHOW_MARKET_NOTE && ' (با توجه به وضعیت جنگ)'} حدود{' '}
          <strong className="tabular-nums">{formatNumber(result.paybackYears, 1)} سال</strong>{' '}
          برآورد می‌شود؛ سال گذشته این عدد حدود{' '}
          <strong className="tabular-nums">{formatNumber(4)} سال</strong> بود.
          این یک تخمین است و تضمینی برای آینده نیست.
        </p>
      </div>

      {/* Assumptions & methodology — moved up, above the charts [F §11] */}
      <AssumptionsPanel assumptions={DEFAULT_ASSUMPTIONS} />

      {/* Two charts side by side (smaller) — stack on phone [M §6.7] */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5 items-start">
        <Card className="p-4">
          <h3 className="text-[14px] font-semibold text-text mb-4">بازده تجمیعی در طول زمان</h3>
          <CumulativeRoiChart
            yearlyData={yearlyData}
            investedAmount={investedAmount || project.minInvestment}
            height={220}
          />
        </Card>

        <Card className="p-4">
          <h3 className="text-[14px] font-semibold text-text mb-4">درآمد سالانه پیش‌بینی‌شده</h3>
          <YearlyIncomeChart yearlyData={yearlyData} height={220} />
        </Card>
      </div>
    </div>
  )
}
