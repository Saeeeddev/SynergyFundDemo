'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { MobileBottomNav } from './MobileBottomNav'
import { MobileDrawer } from './MobileDrawer'

interface ShellClientProps {
  children: React.ReactNode
}

// Shell state: only the drawer lives here.
// NotifDropdown, ProfileDropdown, and search overlay state live inside TopBar
// because they are scoped entirely to that component.
export default function ShellClient({ children }: ShellClientProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      {/*
        Main white box (.app-main) — edge-to-edge on phone, 8px margin + 24px radius on md+ [M §5.1]
        flex → in RTL: sidebar (first DOM element) appears on the RIGHT (inline-start) [D §6.1]
      */}
      <div className="app-main flex min-h-[100dvh] md:min-h-[calc(100dvh-16px)] overflow-hidden">
        {/* Persistent sidebar — desktop only [M §2], inline-start = right in RTL [D §6.1] */}
        <Sidebar />

        {/* Content column: TopBar + scrollable page content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopBar onOpenDrawer={() => setDrawerOpen(true)} />

          {/* Page content — scrollable, padded for mobile bottom nav */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="pb-20 lg:pb-0">{children}</div>
          </main>
        </div>
      </div>

      {/* Mobile shell — bottom tab bar + drawer (hidden at lg+) */}
      <MobileBottomNav onOpenDrawer={() => setDrawerOpen(true)} />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
