"use client";

import {
  useQuery,
  useInfiniteQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import { apiListProjects, apiGetProject } from "@/lib/api/projects";

const PAGE_SIZE = 8;

// Desktop: page-keyed query — [D §9.22]
export function useProjects(page: number) {
  return useQuery({
    queryKey: ["projects", page],
    queryFn: () => apiListProjects(page, PAGE_SIZE),
    placeholderData: keepPreviousData,
    retry: 1,
  });
}

// Mobile: infinite query for load-more — [M §7.7]
export function useProjectsInfinite() {
  return useInfiniteQuery({
    queryKey: ["projects", "infinite"],
    queryFn: ({ pageParam = 1 }) => apiListProjects(pageParam as number, PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < last.totalPages ? last.page + 1 : undefined,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => apiGetProject(id),
    staleTime: 2 * 60 * 1000,
  });
}
