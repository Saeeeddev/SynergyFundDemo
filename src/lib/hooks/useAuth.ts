"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGetMe } from "@/lib/api/auth";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: apiGetMe,
    staleTime: 5 * 60 * 1000,
  });
}
