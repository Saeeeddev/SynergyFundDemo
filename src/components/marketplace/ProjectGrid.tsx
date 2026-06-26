'use client'

// [F §3] Project grid: 4×2 desktop + Pagination
// [D §9.22] Page 2+: in-box loading + in-box retry (never triggers page-level error.tsx)
// [M §6.3/7.7] Phone: 1-col + load-more via useInfiniteQuery
// Accepts either paginated (desktop) or infinite (mobile) data

import { useState } from 'react'
import { ProjectCard } from './ProjectCard'
import { Pagination } from '@/components/ui/Pagination'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { Empty } from '@/components/ui/Empty'
import { Button } from '@/components/ui/Button'
import { LayoutGrid } from 'lucide-react'
import { useProjects, useProjectsInfinite } from '@/lib/hooks/useProjects'
import type { SortOption, CategoryFilter } from './MarketplaceFilter'
import type { Project } from '@/types/domain'

interface ProjectGridProps {
  category: CategoryFilter
  sort: SortOption
}

export function ProjectGrid({ category, sort }: ProjectGridProps) {
  const [page, setPage] = useState(1)

  // Desktop: page-keyed query [D §9.22]
  const desktopQ = useProjects(page)

  // Mobile: infinite query [M §7.7]
  const mobileQ = useProjectsInfinite()

  // Client-side category filter (mock data doesn't support server-side filtering)
  function filterAndSort(items: Project[]): Project[] {
    const filtered = category === 'all' ? items : items.filter((p) => p.status === category)
    return [...filtered].sort((a, b) => {
      if (sort === 'yield_desc') return b.targetYield - a.targetYield
      if (sort === 'price_asc') return a.sharePrice - b.sharePrice
      if (sort === 'sold_desc') return b.soldPercent - a.soldPercent
      // newest: by createdAt desc
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }

  return (
    <>
      {/* ── Desktop grid (md+) ── */}
      <div className="hidden md:block">
        {/* First page loading: standard skeleton */}
        {desktopQ.isLoading && page === 1 && (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton h-80 rounded-card" />
            ))}
          </div>
        )}

        {/* First page error */}
        {desktopQ.isError && page === 1 && (
          <ErrorState scope="page" onRetry={() => desktopQ.refetch()} />
        )}

        {desktopQ.data && (
          <>
            {/* Page content area — reserved height so grid doesn't jump [D §9.22] */}
            <div className="relative">
              {/* In-box loading overlay for page 2+ [D §9.22] */}
              {desktopQ.isFetching && page > 1 && (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="skeleton h-80 rounded-card" />
                  ))}
                </div>
              )}

              {/* In-box error for page 2+ [D §9.22] */}
              {desktopQ.isError && page > 1 && (
                <div className="border border-border rounded-card bg-surface p-8">
                  <ErrorState
                    scope="inline"
                    onRetry={() => desktopQ.refetch()}
                  />
                </div>
              )}

              {/* Grid */}
              {!desktopQ.isFetching && !desktopQ.isError && (() => {
                const filtered = filterAndSort(desktopQ.data.data)
                return filtered.length === 0 ? (
                  <Empty
                    icon={<LayoutGrid size={48} />}
                    message="پروژه‌ای با این فیلتر یافت نشد"
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {filtered.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                )
              })()}
            </div>

            {/* Pagination [D §9.17] — only when there are results and more than one page */}
            {(() => {
              const filtered = filterAndSort(desktopQ.data.data)
              if (filtered.length === 0) return null
              return (
                <div className="flex justify-center mt-6">
                  <Pagination
                    page={page}
                    totalPages={desktopQ.data.totalPages}
                    onPageChange={setPage}
                    loading={desktopQ.isFetching}
                  />
                </div>
              )
            })()}
          </>
        )}
      </div>

      {/* ── Mobile list (< md): 1 col + load-more [M §6.3, §7.7] ── */}
      <div className="md:hidden flex flex-col gap-4">
        {/* Initial loading */}
        {mobileQ.isLoading && (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-80 rounded-card" />
            ))}
          </>
        )}

        {/* Initial error */}
        {mobileQ.isError && (
          <ErrorState scope="page" onRetry={() => mobileQ.refetch()} />
        )}

        {mobileQ.data && (
          <>
            {filterAndSort(
              mobileQ.data.pages.flatMap((p) => p.data)
            ).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}

            {/* Load-more spinner for next page [M §7.7] */}
            {mobileQ.isFetchingNextPage && (
              <div className="skeleton h-80 rounded-card" />
            )}

            {/* In-box error for next page [D §9.22] */}
            {mobileQ.isError && mobileQ.data.pages.length > 0 && (
              <div className="border border-border rounded-card bg-surface p-6">
                <ErrorState scope="inline" onRetry={() => mobileQ.fetchNextPage()} />
              </div>
            )}

            {/* «نمایش بیشتر» button [M §7.7] */}
            {mobileQ.hasNextPage && !mobileQ.isFetchingNextPage && (
              <Button
                variant="secondary"
                size="wide"
                onClick={() => mobileQ.fetchNextPage()}
                className="w-full"
              >
                نمایش بیشتر
              </Button>
            )}

            {/* All loaded */}
            {!mobileQ.hasNextPage && (mobileQ.data.pages.flatMap((p) => p.data).length > 0) && (
              <p className="text-center text-[13px] text-text-muted py-2">
                همه پروژه‌ها نمایش داده شد
              </p>
            )}
          </>
        )}
      </div>
    </>
  )
}
