// [D §9.20] Reports skeleton — mobile-first
// Phone: stat → chips row → filter → 6 doc rows

export default function ReportsLoading() {
  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-5 lg:p-5">
      {/* Total stat */}
      <div className="skeleton h-20 w-48 rounded-card" />

      {/* Category chips */}
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton h-10 w-16 rounded-pill" />
        ))}
      </div>

      {/* Filter bar */}
      <div className="skeleton h-10 w-full max-w-md rounded-md" />

      {/* Document library card */}
      <div className="rounded-card border border-border bg-surface p-5 flex flex-col gap-3">
        <div className="skeleton h-5 w-36 rounded-md" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-16 w-full rounded-md" />
        ))}
      </div>
    </div>
  )
}
