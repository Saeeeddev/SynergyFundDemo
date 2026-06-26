'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Store,
  Briefcase,
  Banknote,
  FileText,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

// Shared nav definition reused by the desktop sidebar and the mobile drawer [F §1.1]
export const NAV_ITEMS = [
  { href: '/dashboard',   label: 'داشبورد',       icon: LayoutDashboard },
  { href: '/marketplace', label: 'بازار',          icon: Store           },
  { href: '/portfolio',   label: 'دارایی‌ها',      icon: Briefcase       },
  { href: '/income',      label: 'درآمد',           icon: Banknote        },
  { href: '/reports',     label: 'گزارش‌ها',        icon: FileText        },
  { href: '/settings',    label: 'تنظیمات',        icon: Settings        },
]

// ─── Logo ─────────────────────────────────────────────────────────────────────

export function SidebarLogo() {
  return (
    <div className="flex items-center gap-3 px-5 h-16 border-b border-border shrink-0">
      <div className="w-8 h-8 rounded-chip bg-gold-tint flex items-center justify-center shrink-0">
        <span className="text-gold-base text-lg leading-none">☀</span>
      </div>
      <span className="font-semibold text-[15px] text-text">سینرژی</span>
    </div>
  )
}

// ─── Nav items — shared by sidebar + drawer ────────────────────────────────────

interface SidebarNavProps {
  pathname: string
  onNavigate?: () => void
}

export function SidebarNav({ pathname, onNavigate }: SidebarNavProps) {
  return (
    <nav className="flex flex-col gap-0.5 px-3 py-3">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive =
          pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 px-3 py-3 rounded-md text-[13px] font-medium',
              'transition-colors duration-[120ms] ease-out motion-reduce:transition-none',
              'min-h-[44px]', // touch target [M §4]
              isActive
                ? 'bg-sidebar-active text-sidebar-active-fg'
                : 'text-text-muted hover:bg-hover hover:text-text',
            )}
          >
            <Icon size={20} strokeWidth={1.5} className="shrink-0" />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

// ─── Desktop sidebar — hidden below lg [M §2] ────────────────────────────────

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-sidebar-bg border-e border-border">
      <SidebarLogo />
      <SidebarNav pathname={pathname} />
    </aside>
  )
}
