'use client'

// [F §11] Project (Asset) Details Page — dynamic per projectId
// [A §3.5] Dynamic-route guard: validate projectId → redirect to /marketplace if invalid
// Row 1: ProjectHeader (full width)
// Row 2: ProjectTabs (75%) + InvestmentCalculator (25%) — phone: calculator ABOVE tabs [M §6.7]
// Row 3: RoiForecastSection (full width)

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useProject } from '@/lib/hooks/useProjects'
import { ProjectHeader } from '@/components/project/ProjectHeader'
import { ProjectTabs } from '@/components/project/ProjectTabs'
import { InvestmentCalculator } from '@/components/project/InvestmentCalculator'
import { RoiForecastSection } from '@/components/project/RoiForecastSection'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'

interface ProjectPageProps {
  params: Promise<{ projectId: string }>
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = use(params)
  const router = useRouter()
  const { data: project, isLoading, isError } = useProject(projectId)

  // Dynamic guard: redirect to /marketplace if project not found [A §3.5, F §0.3]
  useEffect(() => {
    if (!isLoading && !project && !isError) {
      router.replace('/marketplace')
    }
  }, [isLoading, project, isError, router])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-3 lg:gap-5 lg:p-4">
        <Skeleton className="h-64 rounded-card" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <Skeleton className="h-96 rounded-card lg:col-span-3" />
          <Skeleton className="h-96 rounded-card lg:col-span-1" />
        </div>
        <Skeleton className="h-64 rounded-card" />
      </div>
    )
  }

  if (isError || !project) {
    return (
      <div className="p-4 lg:p-5">
        <ErrorState
          scope="page"
          onRetry={() => router.replace('/marketplace')}
          title="پروژه یافت نشد"
          message="صفحه مورد نظر وجود ندارد — به بازار بروید"
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-3 lg:gap-5 lg:p-4">

      {/* Row 1 — full width: header + images + 4 stats [F §11 R1] */}
      <ProjectHeader project={project} />

      {/* Row 2 — 75% tabs + 25% calculator
          Phone: calculator comes FIRST (above tabs) [M §6.7]
          Desktop: RTL flex row — calculator on left (25%), tabs on right (75%) */}
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-4 lg:gap-5">

        {/* Calculator — phone: appears above tabs; desktop: left 25% col [M §6.7] */}
        <div className="lg:col-span-1 lg:order-none order-first">
          <InvestmentCalculator project={project} />
        </div>

        {/* Tabs — phone: below calculator; desktop: right 75% [F §11 R2] */}
        <div className="bg-surface border border-border rounded-card shadow-[var(--shadow-sm)] p-5 lg:col-span-3">
          <ProjectTabs project={project} />
        </div>
      </div>

      {/* Row 3 — full width: ROI Forecast [F §11 R3] */}
      <RoiForecastSection project={project} />
    </div>
  )
}
