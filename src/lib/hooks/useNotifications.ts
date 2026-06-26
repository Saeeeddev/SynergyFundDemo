"use client";

import { useQuery } from "@tanstack/react-query";
import { mockNotifications } from "@/lib/mock/transport";

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => mockNotifications.list(),
    staleTime: 30 * 1000,
  });
}

export function useUnreadCount() {
  const { data } = useNotifications();
  return data?.filter((n) => !n.read).length ?? 0;
}
