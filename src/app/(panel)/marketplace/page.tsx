'use client'

// [F §3] Marketplace page: filter + 4×2 project grid + pagination
// [M §6.3] Phone: 1-col, scrollable chip row, sort → sheet, load-more

import { useState } from 'react'
import { MarketplaceFilter, type CategoryFilter, type SortOption } from '@/components/marketplace/MarketplaceFilter'
import { ProjectGrid } from '@/components/marketplace/ProjectGrid'

export default function MarketplacePage() {
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [sort, setSort] = useState<SortOption>('newest')

  return (
    <div className="flex flex-col gap-4 p-3 lg:gap-5 lg:p-4">
      {/* Filter bar [F §3] */}
      <MarketplaceFilter
        category={category}
        sort={sort}
        onCategoryChange={setCategory}
        onSortChange={setSort}
      />

      {/* Project grid [F §3] */}
      <ProjectGrid category={category} sort={sort} />
    </div>
  )
}
