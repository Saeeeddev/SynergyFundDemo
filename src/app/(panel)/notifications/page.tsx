'use client'

// [F §8] Notifications page — list + settings panel
// [M §6.11] Phone: list full-width → settings panel below list (collapsible)

import { BellOff } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Empty } from '@/components/ui/Empty'
import { NotificationItem } from '@/components/notifications/NotificationItem'
import { NotificationSettingsPanel } from '@/components/notifications/NotificationSettingsPanel'
import { BackButton } from '@/components/ui/BackButton'
import { useNotifications, useMarkAllAsRead } from '@/lib/hooks/useNotifications'

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications()
  const { mutate: markAllAsRead, isPending: markingAll } = useMarkAllAsRead()

  const hasUnread = (notifications ?? []).some((n) => !n.read)

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-5 lg:p-5">

      <BackButton href="/dashboard" label="بازگشت به داشبورد" />

      {/* Notification list */}
      <Card className="flex flex-col">
        <div className="flex items-center justify-between px-4 py-4 border-b border-border gap-3">
          <h2 className="text-[15px] font-semibold text-text">اعلان‌ها</h2>
          {hasUnread && (
            <button
              onClick={() => markAllAsRead()}
              disabled={markingAll}
              className="text-[13px] text-info hover:underline disabled:opacity-50 shrink-0"
            >
              علامت‌گذاری همه به‌عنوان خوانده‌شده
            </button>
          )}
        </div>

        {isLoading && (
          <div className="flex flex-col p-4 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-16 rounded-md" />
            ))}
          </div>
        )}

        {!isLoading && (notifications?.length ?? 0) === 0 && (
          <div className="py-12">
            <Empty icon={<BellOff size={48} />} message="هیچ اعلانی وجود ندارد" />
          </div>
        )}

        {!isLoading && (notifications?.length ?? 0) > 0 && (
          <div>
            {notifications!.map((n) => (
              <NotificationItem key={n.id} notification={n} />
            ))}
          </div>
        )}
      </Card>

      {/* Notification settings panel [F §8] */}
      <NotificationSettingsPanel />

    </div>
  )
}
