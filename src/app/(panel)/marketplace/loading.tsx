// [D §9.20] Marketplace skeleton: 8 card rects — 4×2 desktop / 1-col phone [M §7.8]

export default function MarketplaceLoading() {
  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-5 lg:p-5">
      {/* Title skeleton */}
      <div className="flex flex-col gap-2">
        <div className="skeleton h-6 w-48 rounded-md" />
        <div className="skeleton h-4 w-72 rounded-md" />
      </div>
      {/* Filter bar skeleton */}
      <div className="flex items-center gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-9 w-20 rounded-pill" />
        ))}
      </div>
      {/* Card grid: 4×2 desktop / 1-col phone */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-card overflow-hidden border border-border">
            <div className="skeleton aspect-video w-full" />
            <div className="p-4 flex flex-col gap-3">
              <div className="skeleton h-4 w-3/4 rounded-md" />
              <div className="skeleton h-3 w-1/2 rounded-md" />
              <div className="skeleton h-8 w-full rounded-md" />
              <div className="skeleton h-10 w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
