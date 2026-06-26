'use client'

// [F §10] Invest page — dynamic per projectId, 3-step flow
// [A §3.5] Guard: validate projectId, redirect /marketplace if invalid
// [M §6.8] Most important mobile flow: compact stepper, stacked boxes, sticky CTA, bottom nav hidden

import { use, useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useProject } from '@/lib/hooks/useProjects'
import { useDashboard } from '@/lib/hooks/usePortfolio'
import { useBuyWatts } from '@/lib/hooks/useInvestments'
import { InvestStepper } from '@/components/invest/InvestStepper'
import { SelectedAssetBox } from '@/components/invest/SelectedAssetBox'
import { InvestmentAmountBox } from '@/components/invest/InvestmentAmountBox'
import { InvestmentReviewBox } from '@/components/invest/InvestmentReviewBox'
import { FundingSourceBox } from '@/components/invest/FundingSourceBox'
import type { FundingSource } from '@/components/invest/FundingSourceBox'
import { ReviewStep } from '@/components/invest/ReviewStep'
import { CompleteStep } from '@/components/invest/CompleteStep'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { Card } from '@/components/ui/Card'

const PLATFORM_FEE = 0.005  // 0.5%
const BANK_FEE     = 0.015  // 1.5%

type Step = 1 | 2 | 3

interface InvestPageProps {
  params: Promise<{ projectId: string }>
}

export default function InvestPage({ params }: InvestPageProps) {
  const { projectId } = use(params)
  const router = useRouter()

  // ── Data ─────────────────────────────────────────────────────────────────────
  const { data: project, isLoading, isError } = useProject(projectId)
  const { data: dashboard } = useDashboard()
  const buyMutation = useBuyWatts()

  // ── Form state ────────────────────────────────────────────────────────────────
  const [step, setStep]               = useState<Step>(1)
  const [amount, setAmount]           = useState('')
  const [fundingSource, setFunding]   = useState<FundingSource>('platform')
  const [rules1, setRules1]           = useState(false)
  const [rules2, setRules2]           = useState(false)

  // ── Dynamic guard: redirect if project not found [A §3.5, F §0.3] ───────────
  useEffect(() => {
    if (!isLoading && !isError && !project) {
      router.replace('/marketplace')
    }
  }, [isLoading, isError, project, router])

  // ── Derived values ────────────────────────────────────────────────────────────
  const parsed = useMemo(
    () => parseFloat(amount.replace(/[^0-9.]/g, '')) || 0,
    [amount],
  )
  const cashBalance  = dashboard?.cashBalance ?? 0
  const sharePrice   = project?.sharePrice ?? 1
  const totalCap     = project?.totalCapacityWatts ?? 1
  const targetYield  = project?.targetYield ?? 0

  const shares       = useMemo(() => Math.floor(parsed / sharePrice), [parsed, sharePrice])
  const ownershipPct = useMemo(() => (shares / totalCap) * 100, [shares, totalCap])
  const annualIncome = useMemo(() => shares * sharePrice * (targetYield / 100), [shares, sharePrice, targetYield])
  const monthlyPayout = useMemo(() => annualIncome / 12, [annualIncome])
  const feeRate      = fundingSource === 'platform' ? PLATFORM_FEE : BANK_FEE
  const fee          = parsed * feeRate
  const total        = parsed + fee

  const isValidAmount = parsed >= (project?.minInvestment ?? 0) && parsed <= cashBalance && parsed > 0
  const canProceed    = isValidAmount && rules1 && rules2

  // ── Loading state ─────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="p-3 lg:p-3 flex flex-col gap-4">
        {/* Stepper skeleton */}
        <Skeleton className="h-12 rounded-card" />
        {/* Step 1 layout skeleton: phone = stacked, desktop = 2/3 + 1/3 */}
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:gap-5">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Skeleton className="h-28 rounded-card" />
            <Skeleton className="h-52 rounded-card" />
            <Skeleton className="h-40 rounded-card" />
          </div>
          <Skeleton className="h-96 rounded-card" />
        </div>
      </div>
    )
  }

  // ── Error / not found ─────────────────────────────────────────────────────────
  if (isError || !project) {
    return (
      <div className="p-3 lg:p-3">
        <ErrorState
          scope="page"
          onRetry={() => router.replace('/marketplace')}
          title="پروژه یافت نشد"
          message="صفحه مورد نظر وجود ندارد — به بازار بروید"
        />
      </div>
    )
  }

  // ── Handle confirm (Step 2 → Step 3) ─────────────────────────────────────────
  const handleConfirm = async () => {
    try {
      await buyMutation.mutateAsync({ projectId: project.id, sharesCount: shares })
      setStep(3)
    } catch {
      // Production: show inline error toast. For now: silently stay on step 2.
    }
  }

  return (
    <div className="p-3 lg:p-3 flex flex-col gap-4 lg:gap-5">

      {/* Stepper — always visible */}
      <Card className="p-4">
        <InvestStepper step={step} variant="invest" />
      </Card>

      {/* ─── Step 1: Select Amount ──────────────────────────────────────────── */}
      {step === 1 && (
        // Desktop RTL grid: first child → RIGHT (3 boxes, 2fr), second child → LEFT (ReviewBox, 1fr)
        // Mobile: single column stack — SelectedAsset → Amount → FundingSource → sticky ReviewBox
        // Bottom padding on mobile so the sticky ReviewBox doesn't cover the last card [M §6.8]
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:gap-5 pb-[280px] lg:pb-0">

          {/* RIGHT side (3 stacked boxes) — first in DOM = right in RTL grid [F §10] */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <SelectedAssetBox project={project} />
            <InvestmentAmountBox
              project={project}
              amount={amount}
              onAmountChange={setAmount}
              cashBalance={cashBalance}
              shares={shares}
              ownershipPct={ownershipPct}
              annualIncome={annualIncome}
              monthlyPayout={monthlyPayout}
            />
            <FundingSourceBox
              fundingSource={fundingSource}
              onFundingSourceChange={setFunding}
              amount={parsed}
              platformFeeRate={PLATFORM_FEE}
              bankFeeRate={BANK_FEE}
            />
          </div>

          {/* LEFT side (ReviewBox) — second in DOM = left in RTL grid [F §10] */}
          <div className="lg:col-span-1">
            <InvestmentReviewBox
              shares={shares}
              ownershipPct={ownershipPct}
              annualIncome={annualIncome}
              monthlyPayout={monthlyPayout}
              investmentAmount={parsed}
              rules1={rules1}
              rules2={rules2}
              onRules1Change={setRules1}
              onRules2Change={setRules2}
              canProceed={canProceed}
              onNext={() => setStep(2)}
            />
          </div>
        </div>
      )}

      {/* ─── Step 2: Review & Confirm ──────────────────────────────────────── */}
      {step === 2 && (
        <ReviewStep
          project={project}
          shares={shares}
          ownershipPct={ownershipPct}
          annualIncome={annualIncome}
          monthlyPayout={monthlyPayout}
          investmentAmount={parsed}
          fee={fee}
          total={total}
          fundingSource={fundingSource}
          onConfirm={handleConfirm}
          isPending={buyMutation.isPending}
        />
      )}

      {/* ─── Step 3: Complete ──────────────────────────────────────────────── */}
      {step === 3 && (
        <CompleteStep
          projectName={project.name}
          shares={shares}
          investmentAmount={parsed}
        />
      )}
    </div>
  )
}
