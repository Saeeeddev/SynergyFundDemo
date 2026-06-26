'use client'

// [F §11 R2 right 75%] 5 underline tabs: Overview / Returns / Legal / Reports / Risks
// [D §9.7] Underline tabs, accent Blue for Project Details
// [M §6.7] Phone: horizontally scrollable tab strip

import { useState } from 'react'
import { Tabs } from '@/components/ui/Tabs'
import type { Project } from '@/types/domain'

const PROJECT_TABS = [
  { value: 'overview',  label: 'بررسی اجمالی' },
  { value: 'returns',   label: 'بازده‌ها' },
  { value: 'legal',     label: 'حقوقی و مالکیت' },
  { value: 'reports',   label: 'گزارش‌ها' },
  { value: 'risks',     label: 'ریسک‌ها' },
]

interface ProjectTabsProps {
  project: Project
}

export function ProjectTabs({ project }: ProjectTabsProps) {
  const [tab, setTab] = useState('overview')

  return (
    <div className="flex flex-col gap-4">
      {/* Scrollable underline tab strip — Blue accent for project details [D §9.7] */}
      <Tabs tabs={PROJECT_TABS} value={tab} onChange={setTab} accent="blue" />

      {/* Tab panels */}
      <div className="text-[14px] text-text-2 leading-relaxed min-h-[200px]">
        {tab === 'overview' && (
          <div className="flex flex-col gap-4">
            <p>{project.description}</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoRow label="ظرفیت کل" value={`${(project.totalCapacityWatts / 1000).toFixed(0)} کیلووات`} />
              <InfoRow label="مکان" value={project.location} />
              <InfoRow label="بازده سالانه هدف" value={`${project.targetYield}٪`} />
              <InfoRow label="قیمت هر سهم" value={`${project.sharePrice.toLocaleString('fa')} تومان`} />
            </div>
          </div>
        )}

        {tab === 'returns' && (
          <div className="flex flex-col gap-3">
            <p className="text-text-muted text-[13px]">
              عملکرد تاریخی و توزیع سود این پروژه در این بخش نمایش داده می‌شود.
              اطلاعات بیشتر در بخش پیش‌بینی ROI در پایین همین صفحه موجود است.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoRow label="بازده سالانه هدف" value={`${project.targetYield}٪`} />
              <InfoRow label="درصد فروش‌رفته" value={`${project.soldPercent}٪`} />
            </div>
          </div>
        )}

        {tab === 'legal' && (
          <div className="flex flex-col gap-3">
            <p className="text-text-muted text-[13px]">
              اطلاعات حقوقی و مالکیتی این پروژه از جمله اسناد قرارداد، ساختار مالکیت توکن وات،
              و تعهدات قانونی در این بخش در دسترس است.
            </p>
            <InfoRow label="نوع دارایی" value="توکن وات (ERC-20 — Polygon)" />
            <InfoRow label="نوع سند" value="قرارداد مشارکت در سود" />
            <InfoRow label="دوره قرارداد" value="۲۵ سال" />
          </div>
        )}

        {tab === 'reports' && (
          <p className="text-text-muted text-[13px]">
            گزارش‌های فنی و مالی این پروژه در بخش گزارش‌ها قابل دسترسی و دانلود است.
          </p>
        )}

        {tab === 'risks' && (
          <div className="flex flex-col gap-3">
            <p className="text-text-muted text-[13px]">
              سرمایه‌گذاری در پروژه‌های انرژی خورشیدی با ریسک‌هایی همراه است که در ادامه شرح داده شده:
            </p>
            <ul className="list-disc list-inside flex flex-col gap-2 text-[13px] text-text-muted">
              <li>تغییرات نرخ تعرفه برق</li>
              <li>کاهش تدریجی راندمان پنل‌های خورشیدی</li>
              <li>نوسانات بازار و تغییر قیمت وات</li>
              <li>ریسک‌های عملیاتی و نگهداری</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border border-border rounded-md px-3 py-2">
      <span className="text-[12px] text-text-muted">{label}</span>
      <span className="text-[14px] font-semibold text-text">{value}</span>
    </div>
  )
}
