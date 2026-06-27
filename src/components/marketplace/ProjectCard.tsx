'use client'

// Marketplace Project Card — ported from the asas dashboard ProjectCard design,
// adapted for buying a share in a solar power-plant project.
// asas anatomy: rounded soft card → image thumbnail w/ status pill + ref tag
//   → title row + favorite star → location → 2 stat boxes → progress bar
//   → 2×2 key-metrics grid → footer action bar.
// Share-buying fields: capacity, target yield, share price, min investment,
//   shares available, total project value, sold%.

import Image from 'next/image'
import Link from 'next/link'
import {
  MapPin,
  CheckCircle2,
  Clock,
  Lock,
  ChevronLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { formatToman, formatTomanCompact } from '@/lib/utils/currency'
import { bidiIsolate, formatNumber, formatPercent } from '@/lib/utils/numbers'
import type { Project, ProjectStatus } from '@/types/domain'

interface ProjectCardProps {
  project: Project
  className?: string
}

// asas-style status pill: solid white bg (always legible on the photo) + colored
// icon/text + matching bar color
const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; text: string; Icon: typeof CheckCircle2; bar: string }
> = {
  active: {
    label: 'فعال',
    text: 'text-green-deep',
    Icon: CheckCircle2,
    bar: 'bg-green-base',
  },
  funding: {
    label: 'در حال تأمین',
    text: 'text-gold-deep',
    Icon: Clock,
    bar: 'bg-gold-base',
  },
  closed: {
    label: 'بسته‌شده',
    text: 'text-gray-deep',
    Icon: Lock,
    bar: 'bg-gray-soft',
  },
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const status = STATUS_CONFIG[project.status]

  const capacityKw = project.totalCapacityWatts / 1000
  const sharesAvailable = Math.round(
    project.totalCapacityWatts * (1 - project.soldPercent / 100),
  )
  const totalValue = project.totalCapacityWatts * project.sharePrice
  const reference = `SYN-${project.id.replace(/[^0-9]/g, '').padStart(3, '0')}`

  return (
    <div
      className={cn(
        // asas card: white, rounded, soft card shadow, hairline border, lift on hover
        'group bg-surface rounded-card border border-border overflow-hidden flex flex-col',
        'shadow-[var(--shadow-card)]',
        'transition-[box-shadow,transform] duration-200 ease-out motion-reduce:transition-none',
        'hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5',
        className,
      )}
    >
      {/* ── Thumbnail with overlays ── */}
      <div className="relative h-40">
        <Image
          src={project.images[0] ?? '/Images/projects/project-1.jpg'}
          alt={project.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {/* gentle gradient for overlay legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/20" />

        {/* Capacity badge — start/top (solid white for legibility) */}
        <div className="absolute top-3 start-3">
          <span className="inline-flex items-center rounded-pill bg-white px-2.5 py-1 text-[11px] font-bold text-blue-deep shadow-sm tabular-nums">
            {bidiIsolate(formatNumber(capacityKw, 0))} کیلووات
          </span>
        </div>

        {/* Status pill — end/top (solid white for legibility) */}
        <div className="absolute top-3 end-3">
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-pill bg-white px-2.5 py-1 text-[11px] font-semibold shadow-sm',
              status.text,
            )}
          >
            <status.Icon size={12} strokeWidth={2.2} />
            {status.label}
          </span>
        </div>

        {/* Reference id — start/bottom */}
        <div className="absolute bottom-3 start-3 rounded-md bg-black/55 px-2 py-1 text-[10px] font-medium text-white tabular-nums">
          {reference}
        </div>
      </div>

      {/* ── Card content ── */}
      <div className="flex flex-col gap-3.5 p-4 flex-1">
        {/* Title */}
        <h3 className="text-[17px] font-semibold text-text leading-snug line-clamp-1">
          {project.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-[13px] text-text-muted -mt-2">
          <MapPin size={14} className="shrink-0 text-text-subtle" />
          <span className="truncate">{project.location}</span>
        </div>

        {/* 2 stat boxes (asas wells) — capacity + target yield */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-chip bg-surface-2 border border-border p-2.5">
            <div className="text-[11px] text-text-muted">ظرفیت کل</div>
            <div className="text-[14px] font-semibold text-text tabular-nums">
              {bidiIsolate(formatNumber(capacityKw, 0))} کیلووات
            </div>
          </div>
          <div className="rounded-chip bg-surface-2 border border-border p-2.5">
            <div className="text-[11px] text-text-muted">بازده سالانه</div>
            <div className="text-[14px] font-semibold text-green-deep tabular-nums">
              {bidiIsolate(formatPercent(project.targetYield))}
            </div>
          </div>
        </div>

        {/* Progress (sold %) */}
        <div>
          <div className="flex justify-between text-[11px] text-text-muted mb-1">
            <span>درصد فروش سهام</span>
            <span className="tabular-nums font-medium text-text-2">
              {bidiIsolate(`${formatNumber(project.soldPercent, 0)}٪`)}
            </span>
          </div>
          <div className="h-1.5 rounded-pill bg-hover overflow-hidden">
            <div
              className={cn('h-full rounded-pill transition-all duration-500', status.bar)}
              style={{ width: `${project.soldPercent}%` }}
            />
          </div>
        </div>

        {/* 2×2 key metrics — share-buying details */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-3 pt-1">
          <Metric label="قیمت هر سهم" value={formatToman(project.sharePrice)} />
          <Metric label="حداقل سرمایه" value={formatToman(project.minInvestment)} />
          <Metric label="سهام موجود (وات)" value={bidiIsolate(formatNumber(sharesAvailable))} />
          <Metric label="ارزش کل پروژه" value={formatTomanCompact(totalValue)} />
        </div>

        {/* Footer action bar (asas) */}
        <div className="-mx-4 -mb-4 mt-auto border-t border-border bg-surface-2 px-4 py-3 flex items-center gap-2">
          <Link
            href={`/project/${project.id}`}
            className="flex items-center gap-1 text-[13px] font-medium text-blue-base hover:text-blue-deep transition-colors"
          >
            <span>مشاهده جزئیات</span>
            <ChevronLeft size={16} />
          </Link>
          <Link href={`/invest/${project.id}`} className="ms-auto">
            <Button variant="primary" size="compact" className="px-4">
              سرمایه‌گذاری
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-text-muted leading-tight">{label}</span>
      <span className="text-[13px] font-semibold text-text tabular-nums leading-tight">{value}</span>
    </div>
  )
}
