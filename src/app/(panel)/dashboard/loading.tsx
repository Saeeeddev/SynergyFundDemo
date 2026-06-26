export default function Loading() {
  return (
    <div className="p-6 flex flex-col gap-4">
      <div className="skeleton h-8 w-48 rounded-[var(--r-md)]" />
      <div className="skeleton h-64 rounded-[var(--r-card)]" />
    </div>
  );
}
