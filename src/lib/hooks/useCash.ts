"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGetCashConfig } from "@/lib/api/cash";

// Cash config: deposit gateways, user + platform accounts, withdraw limits.
export function useCashConfig() {
  return useQuery({
    queryKey: ["cash", "config"],
    queryFn: apiGetCashConfig,
    staleTime: 5 * 60 * 1000,
  });
}
