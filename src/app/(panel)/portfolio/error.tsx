"use client";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      <p className="text-red-base">خطایی رخ داده است</p>
      <button onClick={reset} className="px-4 py-2 border border-border rounded-md">
        تلاش مجدد
      </button>
    </div>
  );
}
