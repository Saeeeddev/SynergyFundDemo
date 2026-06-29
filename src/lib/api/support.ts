import { mockSupport } from "@/lib/mock/transport";
import { USE_MOCK } from "./client";
import type { TicketCategory } from "@/lib/schemas/support";

// Support tickets. To go live, replace each mock branch with the real call, e.g.
//   return (await client.get("/support/tickets")).data;

export async function apiGetTickets() {
  if (USE_MOCK) return mockSupport.list();
  throw new Error("Real API not implemented yet");
}

export async function apiCreateTicket(
  category: TicketCategory,
  subject: string,
  message: string,
) {
  if (USE_MOCK) return mockSupport.create(category, subject, message);
  throw new Error("Real API not implemented yet");
}

export async function apiReplyTicket(ticketId: string, text: string) {
  if (USE_MOCK) return mockSupport.reply(ticketId, text);
  throw new Error("Real API not implemented yet");
}
