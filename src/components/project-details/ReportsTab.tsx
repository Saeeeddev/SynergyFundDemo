'use client'

// [F §11] Project details — "گزارش‌ها" tab. Reports come from the API per project
// (project.details.reports); the admin uploads them once Django is wired.

import { FileText, Download } from 'lucide-react'
import type { Project } from '@/types/domain'

export function ReportsTab({ project }: { project: Project }) {
  const reports = project.details.reports

  if (reports.length === 0) {
    return (
      <p className="text-text-muted text-[13px]">
        گزارشی برای «{project.name}» ثبت نشده است.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {reports.map((r) => (
        <div
          key={r.title}
          className="flex items-center justify-between gap-3 border border-border rounded-md px-3 py-2.5"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <FileText size={18} className="text-blue-base shrink-0" />
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-text truncate">{r.title}</p>
              <p className="text-[11px] text-text-muted tabular-nums">{r.date}</p>
            </div>
          </div>
          <button
            type="button"
            className="flex items-center gap-1 text-[12px] font-medium text-blue-deep hover:underline shrink-0"
          >
            <Download size={14} /> دانلود
          </button>
        </div>
      ))}
    </div>
  )
}
