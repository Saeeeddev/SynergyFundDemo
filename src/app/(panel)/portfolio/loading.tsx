// [D §9.20] Portfolio skeleton — mobile-first stack [M §7.8]
// Phone order: 2×2 KPIs → chart rect → geo rect → 4 holding rows

export default function PortfolioLoading() {
  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-5 lg:p-5">
      {/* Row 1 — 4 KPI cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-28 w-full rounded-card" />
        ))}
      </div>
      {/* Row 2 — Chart + Geo */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-10 lg:gap-4">
        <div className="skeleton h-60 w-full rounded-card lg:col-span-7" />
        <div className="skeleton h-60 w-full rounded-card lg:col-span-3" />
      </div>
      {/* Row 3 — Holdings */}
      <div className="rounded-card border border-border bg-surface p-5 flex flex-col gap-3">
        <div className="skeleton h-5 w-36 rounded-md" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-16 w-full rounded-md" />
        ))}
      </div>
      {/* Row 4 — Order history (collapsed) */}
      <div className="skeleton h-16 w-full rounded-card" />
    </div>
  )
}
