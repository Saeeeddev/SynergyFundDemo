"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

export function useMarkAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mockNotifications.markAsRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useMarkAllAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => mockNotifications.markAllAsRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}
