'use client'

import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatToman } from '@/lib/utils/currency'
import { formatNumber, bidiIsolate } from '@/lib/utils/numbers'
import type { Project } from '@/types/domain'

// [F §10 Step1 Right-top] Selected asset info box
// Shows: project image, name, location, key stats (yield, share price, min investment)

interface SelectedAssetBoxProps {
  project: Project
}

export function SelectedAssetBox({ project }: SelectedAssetBoxProps) {
  return (
    <Card className="p-4">
      <h3 className="text-[13px] font-medium text-text-muted mb-3">دارایی انتخاب‌شده</h3>

      <div className="flex gap-3 items-start">
        {/* Project image */}
        <div className="relative w-20 h-14 rounded-md overflow-hidden shrink-0 bg-surface-2">
          <Image
            src={project.images[0] ?? '/placeholder-solar.jpg'}
            alt={project.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>

        {/* Name + location + badge */}
        <div className="flex flex-col gap-1 min-w-0">
          <p className="text-[14px] font-semibold text-text leading-tight truncate">{project.name}</p>
          <div className="flex items-center gap-1 text-[12px] text-text-muted">
            <MapPin size={12} aria-hidden="true" />
            <span>{project.location}</span>
          </div>
          <Badge role="energy">
            {bidiIsolate(formatNumber(project.targetYield, 1))}٪ بازده سالانه
          </Badge>
        </div>
      </div>

      {/* Key stats row */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-border">
        <StatItem label="قیمت هر سهم" value={formatToman(project.sharePrice)} />
        <StatItem label="حداقل سرمایه" value={formatToman(project.minInvestment)} />
      </div>
    </Card>
  )
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-text-muted">{label}</span>
      <span className="text-[13px] font-semibold text-text tabular-nums">{value}</span>
    </div>
  )
}
