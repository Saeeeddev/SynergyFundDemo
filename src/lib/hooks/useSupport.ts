"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGetTickets, apiCreateTicket, apiReplyTicket } from "@/lib/api/support";
import type { TicketCategory } from "@/lib/schemas/support";

const TICKETS_KEY = ["support", "tickets"];

export function useTickets() {
  return useQuery({
    queryKey: TICKETS_KEY,
    queryFn: apiGetTickets,
  });
}

export function useCreateTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { category: TicketCategory; subject: string; message: string }) =>
      apiCreateTicket(vars.category, vars.subject, vars.message),
    onSuccess: () => qc.invalidateQueries({ queryKey: TICKETS_KEY }),
  });
}

export function useReplyTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { ticketId: string; text: string }) =>
      apiReplyTicket(vars.ticketId, vars.text),
    onSuccess: () => qc.invalidateQueries({ queryKey: TICKETS_KEY }),
  });
}
