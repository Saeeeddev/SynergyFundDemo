"use client";

import {
  useQuery,
  useInfiniteQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import { apiListReports } from "@/lib/api/reports";

// Desktop: page-keyed document library — [D §9.22]
export function useReports(page: number, category?: string) {
  return useQuery({
    queryKey: ["reports", page, category],
    queryFn: () => apiListReports(page, 8, category),
    placeholderData: keepPreviousData,
    retry: 1,
  });
}

// Mobile: infinite document library — [M §7.7]
export function useReportsInfinite(category?: string) {
  return useInfiniteQuery({
    queryKey: ["reports", "infinite", category],
    queryFn: ({ pageParam = 1 }) =>
      apiListReports(pageParam as number, 8, category),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < last.totalPages ? last.page + 1 : undefined,
  });
}
