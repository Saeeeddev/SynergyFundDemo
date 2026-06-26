'use client'

// [D §11] Marketplace Project Card anatomy:
//   image 16:9 (next/image) + gold energy badge (start-top) + status pill (end-top)
//   → name (h-sub) → location w/ pin (caption/muted)
//   → 3-stat strip: Target Yield · Share Price · Sold% + mini bar
//   → full-width «سرمایه‌گذاری» Primary button
//   Card hover lifts shadow.
// [F §3] 4×2 grid; pagination per backend
// [M §6.3] 1-col phone, 2-col tablet

import Image from 'next/image'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { formatToman } from '@/lib/utils/currency'
import { bidiIsolate, formatPercent } from '@/lib/utils/numbers'
import type { Project, ProjectStatus } from '@/types/domain'

interface ProjectCardProps {
  project: Project
  className?: string
}

const STATUS_CONFIG: Record<ProjectStatus, { label: string; role: 'positive' | 'energy' | 'gray' }> = {
  active:   { label: 'فعال',           role: 'positive' },
  funding:  { label: 'در حال تأمین',  role: 'energy' },
  closed:   { label: 'بسته‌شده',       role: 'gray' },
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const status = STATUS_CONFIG[project.status]

  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-card overflow-hidden',
        'shadow-[var(--shadow-sm)]',
        'flex flex-col',
        'transition-shadow duration-[200ms] ease-out motion-reduce:transition-none',
        'hover:shadow-[var(--shadow-md)] hover:border-border-strong',
        className,
      )}
    >
      {/* Image 16:9 with badges overlaid [D §11] */}
      <div className="relative aspect-video">
        <Image
          src={project.images[0] ?? '/placeholder-solar.jpg'}
          alt={project.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
          priority={false}
          onError={() => {/* Next/Image will show broken img, acceptable */}}
        />
        {/* Gold energy badge — start (right) top corner [D §11] */}
        <div className="absolute top-2 start-2">
          <Badge role="energy" className="text-[11px]">
            {bidiIsolate(`${project.targetYield}٪`)} بازده
          </Badge>
        </div>
        {/* Status pill — end (left) top corner [D §11] */}
        <div className="absolute top-2 end-2">
          <Badge role={status.role}>{status.label}</Badge>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Name + location */}
        <div className="flex flex-col gap-1">
          <h3 className="text-[15px] font-semibold text-text leading-snug line-clamp-2">
            {project.name}
          </h3>
          <div className="flex items-center gap-1 text-[12px] text-text-muted">
            <MapPin size={12} className="flex-shrink-0" />
            <span>{project.location}</span>
          </div>
        </div>

        {/* 3-stat strip: Yield, Share Price, Sold% */}
        <div className="grid grid-cols-3 gap-2 border-t border-border pt-3">
          <StatItem label="بازده هدف" value={bidiIsolate(formatPercent(project.targetYield))} />
          <StatItem label="قیمت هر وات" value={formatToman(project.sharePrice)} small />
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-text-muted leading-tight">فروخته‌شده</span>
            <span className="text-[13px] font-semibold text-text tabular-nums">
              {bidiIsolate(`${project.soldPercent}٪`)}
            </span>
            <ProgressBar
              value={project.soldPercent}
              role="energy"
              className="mt-0.5"
            />
          </div>
        </div>

        {/* Details + Invest buttons [D §11] */}
        <div className="mt-auto pt-1 flex gap-2">
          <Link href={`/project/${project.id}`} className="flex-1">
            <Button variant="secondary" size="wide" className="w-full">
              جزئیات
            </Button>
          </Link>
          <Link href={`/invest/${project.id}`} className="flex-1">
            <Button variant="primary" size="wide" className="w-full">
              سرمایه‌گذاری
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function StatItem({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] text-text-muted leading-tight">{label}</span>
      <span className={cn('font-semibold text-text tabular-nums leading-tight', small ? 'text-[11px]' : 'text-[13px]')}>
        {value}
      </span>
    </div>
  )
}
