'use client'

// [F §12] Sell page — dynamic per projectId, Invest in reverse (red semantic)
// [A §3.5] Guard: validate projectId AND that user holds shares; redirect /marketplace if not
// [M §6.9] Same structure as Invest, recolored to Red/sell

import { use, useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useProject } from '@/lib/hooks/useProjects'
import { useHoldings } from '@/lib/hooks/usePortfolio'
import { useSellWatts, useUserOwnsProject } from '@/lib/hooks/useInvestments'
import { SellStepper } from '@/components/sell/SellStepper'
import { SelectedHoldingBox } from '@/components/sell/SelectedHoldingBox'
import { SellAmountBox } from '@/components/sell/SellAmountBox'
import { SellReviewBox } from '@/components/sell/SellReviewBox'
import { SellFundingBox } from '@/components/sell/SellFundingBox'
import type { ProceedsDestination } from '@/components/sell/SellFundingBox'
import { SellReviewStep } from '@/components/sell/SellReviewStep'
import { SellCompleteStep } from '@/components/sell/SellCompleteStep'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { Card } from '@/components/ui/Card'

const SELL_FEE_RATE = 0.015  // 1.5% on all sell transactions

type Step = 1 | 2 | 3

interface SellPageProps {
  params: Promise<{ projectId: string }>
}

export default function SellPage({ params }: SellPageProps) {
  const { projectId } = use(params)
  const router = useRouter()

  // ── Data ─────────────────────────────────────────────────────────────────────
  const { data: project, isLoading: projectLoading, isError: projectError } = useProject(projectId)
  const { data: holdings, isLoading: holdingsLoading }  = useHoldings()
  const { data: userOwns, isLoading: ownsLoading }      = useUserOwnsProject(projectId)
  const sellMutation = useSellWatts()

  // Find the specific holding for this project
  const holding = useMemo(
    () => holdings?.find(h => h.projectId === projectId) ?? null,
    [holdings, projectId],
  )

  const isLoading = projectLoading || holdingsLoading || ownsLoading

  // ── Dynamic guard [A §3.5, F §0.3]:
  //    redirect if project not found OR user doesn't own it ────────────────────
  useEffect(() => {
    if (isLoading) return
    if (projectError || !project || userOwns === false || !holding) {
      router.replace('/marketplace')
    }
  }, [isLoading, projectError, project, userOwns, holding, router])

  // ── Form state ────────────────────────────────────────────────────────────────
  const [step, setStep]                     = useState<Step>(1)
  const [quantity, setQuantity]             = useState('')
  const [destination, setDestination]       = useState<ProceedsDestination>('platform')
  const [rules1, setRules1]                 = useState(false)
  const [rules2, setRules2]                 = useState(false)

  // ── Derived values ────────────────────────────────────────────────────────────
  const parsedQty   = parseInt(quantity, 10) || 0
  const currentPrice = holding?.currentPrice ?? 0
  const proceeds    = parsedQty * currentPrice
  const fee         = proceeds * SELL_FEE_RATE
  const netProceeds = proceeds - fee

  const isValidQty  = parsedQty > 0 && parsedQty <= (holding?.sharesOwned ?? 0)
  const canProceed  = isValidQty && rules1 && rules2

  // ── Loading ───────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="p-3 lg:p-3 flex flex-col gap-4">
        <Skeleton className="h-12 rounded-card" />
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:gap-5">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Skeleton className="h-36 rounded-card" />
            <Skeleton className="h-52 rounded-card" />
            <Skeleton className="h-40 rounded-card" />
          </div>
          <Skeleton className="h-96 rounded-card" />
        </div>
      </div>
    )
  }

  // ── Guard: error / not found / not owned ──────────────────────────────────────
  if (projectError || !project || !holding) {
    return (
      <div className="p-3 lg:p-3">
        <ErrorState
          scope="page"
          onRetry={() => router.replace('/marketplace')}
          title="دارایی یافت نشد"
          message="این پروژه در دارایی‌های شما وجود ندارد — به بازار بروید"
        />
      </div>
    )
  }

  // ── Confirm (Step 2 → Step 3) ─────────────────────────────────────────────────
  const handleConfirm = async () => {
    try {
      await sellMutation.mutateAsync({ projectId: project.id, sharesCount: parsedQty })
      setStep(3)
    } catch {
      // Production: show inline error toast; stay on step 2
    }
  }

  return (
    <div className="p-3 lg:p-3 flex flex-col gap-4 lg:gap-5">

      {/* Stepper (sell variant = red) */}
      <Card className="p-4">
        <SellStepper step={step} variant="sell" />
      </Card>

      {/* ─── Step 1: Select Quantity ──────────────────────────────────────── */}
      {step === 1 && (
        // Same RTL grid pattern as Invest:
        // first DOM child → RIGHT (3 boxes), second → LEFT (SellReviewBox)
        // Mobile: stacked + sticky bottom CTA bar
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:gap-5 lg:items-start pb-[290px] lg:pb-0">

          {/* RIGHT: 3 stacked boxes */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <SelectedHoldingBox holding={holding} />
            <SellAmountBox
              holding={holding}
              quantity={quantity}
              onQuantityChange={setQuantity}
              proceeds={proceeds}
              fee={fee}
              netProceeds={netProceeds}
            />
            <SellFundingBox
              destination={destination}
              onDestinationChange={setDestination}
              proceeds={proceeds}
              fee={fee}
              netProceeds={netProceeds}
              feeRate={SELL_FEE_RATE}
            />
          </div>

          {/* LEFT: SellReviewBox — sticky on desktop so the live summary + CTA stay visible */}
          <div className="lg:col-span-1 lg:sticky lg:top-3">
            <SellReviewBox
              quantity={parsedQty}
              proceeds={proceeds}
              fee={fee}
              netProceeds={netProceeds}
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
        <SellReviewStep
          holding={holding}
          quantity={parsedQty}
          proceeds={proceeds}
          fee={fee}
          netProceeds={netProceeds}
          destination={destination}
          onConfirm={handleConfirm}
          isPending={sellMutation.isPending}
        />
      )}

      {/* ─── Step 3: Complete ──────────────────────────────────────────────── */}
      {step === 3 && (
        <SellCompleteStep
          projectName={project.name}
          quantity={parsedQty}
          netProceeds={netProceeds}
        />
      )}
    </div>
  )
}
