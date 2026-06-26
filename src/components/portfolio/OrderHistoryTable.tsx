'use client'

// [F §4 R4] Portfolio Row 4: Order History (Buy/Sell type chips)
// [D §9.9] Table with type chips
// [M §6.4/7.3] Phone → stacked cards, collapsible

import { useState } from 'react'
import { Table, ActivityTypeChip, type TableColumn } from '@/components/ui/Table'
import { Card } from '@/components/ui/Card'
import { ErrorState } from '@/components/ui/ErrorState'
import { Empty } from '@/components/ui/Empty'
import { Skeleton } from '@/components/ui/Skeleton'
import { ChevronDown, ChevronUp, ReceiptText } from 'lucide-react'
import { formatToman } from '@/lib/utils/currency'
import { bidiIsolate, formatNumber } from '@/lib/utils/numbers'
import { formatJalali } from '@/lib/utils/jalali'
import type { Investment } from '@/lib/schemas/investment'

interface OrderHistoryTableProps {
  orders: Investment[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

const COLUMNS: TableColumn<Investment>[] = [
  {
    key: 'type',
    header: 'نوع',
    primary: true,
    render: (row) => <ActivityTypeChip type={row.type} />,
  },
  {
    key: 'projectName',
    header: 'پروژه',
    render: (row) => <span className="text-text-2">{row.projectName}</span>,
  },
  {
    key: 'sharesCount',
    header: 'تعداد وات',
    numeric: true,
    render: (row) => (
      <span className="tabular-nums text-text-2">
        {bidiIsolate(formatNumber(row.sharesCount))}
      </span>
    ),
  },
  {
    key: 'totalAmount',
    header: 'مبلغ کل',
    numeric: true,
    render: (row) => (
      <span className="tabular-nums text-text-2">{formatToman(row.totalAmount)}</span>
    ),
  },
  {
    key: 'date',
    header: 'تاریخ',
    numeric: true,
    render: (row) => (
      <span className="tabular-nums text-text-muted text-[13px]">{formatJalali(row.date)}</span>
    ),
  },
]

export function OrderHistoryTable({ orders, isLoading, isError, onRetry }: OrderHistoryTableProps) {
  const [expanded, setExpanded] = useState(false)
  const PREVIEW_COUNT = 5

  return (
    <Card className="flex flex-col gap-4">
      {/* Collapsible header [M §5.4] */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center justify-between w-full text-start"
        aria-expanded={expanded}
      >
        <h2 className="text-[15px] font-semibold text-text">تاریخچه سفارشات</h2>
        {expanded
          ? <ChevronUp size={18} className="text-text-muted" />
          : <ChevronDown size={18} className="text-text-muted" />}
      </button>

      {expanded && (
        <>
          {isLoading && (
            <div className="flex flex-col gap-2">
              <div className="skeleton h-10 w-full rounded-md" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton h-14 w-full rounded-md" />
              ))}
            </div>
          )}

          {!isLoading && isError && <ErrorState scope="inline" onRetry={onRetry} />}

          {!isLoading && !isError && orders.length === 0 && (
            <Empty icon={<ReceiptText size={48} />} message="تاریخچه سفارشی ثبت نشده است" />
          )}

          {!isLoading && !isError && orders.length > 0 && (
            <Table
              columns={COLUMNS}
              rows={orders.slice(0, PREVIEW_COUNT)}
              keyExtractor={(r) => r.id}
            />
          )}
        </>
      )}

      {/* Closed state — show preview */}
      {!expanded && !isLoading && !isError && orders.length > 0 && (
        <div className="flex flex-col gap-2">
          {orders.slice(0, 3).map((order) => (
            <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0 gap-3">
              <ActivityTypeChip type={order.type} />
              <span className="text-[14px] text-text-2 flex-1 truncate">{order.projectName}</span>
              <span className="text-[13px] tabular-nums text-text-muted">{formatJalali(order.date)}</span>
            </div>
          ))}
          {orders.length > 3 && (
            <p className="text-[12px] text-text-subtle text-center">
              {bidiIsolate(`${orders.length - 3}`)} مورد بیشتر…
            </p>
          )}
        </div>
      )}
    </Card>
  )
}
