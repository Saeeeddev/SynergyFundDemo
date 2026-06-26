// [D §9.20 table] Dashboard skeleton — shape-matched, mobile-first stack order [M §7.8]
// Phone order: cash rect → 2×2 stat rects → chart rect → donut rect → activity rows

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-5 lg:p-5">
      {/* Row 1 — Cash card */}
      <div className="skeleton h-28 w-full rounded-card" />

      {/* Row 2 — 4 KPI cards: 2×2 phone / 4-up desktop */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-28 w-full rounded-card" />
        ))}
      </div>

      {/* Row 3 — Chart + Donut */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-10 lg:gap-4">
        <div className="skeleton h-72 w-full rounded-card lg:col-span-7" />
        <div className="skeleton h-72 w-full rounded-card lg:col-span-3" />
      </div>

      {/* Row 4 — Activities: header strip + 5 row rects */}
      <div className="rounded-card border border-border bg-surface p-5 flex flex-col gap-2">
        <div className="skeleton h-5 w-36 rounded-md" />
        <div className="skeleton h-10 w-full rounded-md mt-2" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton h-14 w-full rounded-md" />
        ))}
      </div>
    </div>
  )
}
