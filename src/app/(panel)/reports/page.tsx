'use client'

// [F §6] Reports page: total stat → category chips → filter → document library
// [M §6.6] Phone: stat → scrollable chip row → search+filter button → stacked doc rows

import { useState } from 'react'
import { FileBarChart, FileText } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { CategoryChips, type ReportCategory } from '@/components/reports/CategoryChips'
import { ReportsFilter, type FilterState } from '@/components/reports/ReportsFilter'
import { DocumentLibrary } from '@/components/reports/DocumentLibrary'
import { useReports } from '@/lib/hooks/useReports'
import { bidiIsolate } from '@/lib/utils/numbers'

export default function ReportsPage() {
  const [category, setCategory] = useState<ReportCategory | 'all'>('all')
  const [filter, setFilter] = useState<FilterState>({ search: '', dateFrom: '', dateTo: '' })

  // Fetch page 1 to get total count
  const totalQ = useReports(1)
  const total = totalQ.data?.total ?? 0

  return (
    <div className="flex flex-col gap-4 p-3 lg:gap-5 lg:p-3">

      {/* asas-style page header — desktop only */}
      <PageHeader
        className="hidden lg:flex"
        icon={<FileText size={22} strokeWidth={1.75} />}
        title="گزارش‌ها"
        subtitle="گزارش‌های فنی و مالی پروژه‌های شما"
      />

      {/* Total reports stat card */}
      <StatCard
        label="مجموع گزارش‌ها"
        value={totalQ.isLoading ? '…' : bidiIsolate(String(total))}
        icon={<FileBarChart size={20} />}
        role="info"
        compact
        className="max-w-xs"
      />

      {/* Category chips [F §6] */}
      <CategoryChips value={category} onChange={setCategory} />

      {/* Filter bar — inline on md+, bottom sheet on phone [M §6.6] */}
      <ReportsFilter value={filter} onChange={setFilter} />

      {/* Document library [F §6] */}
      <DocumentLibrary category={category} filter={filter} />

    </div>
  )
}
