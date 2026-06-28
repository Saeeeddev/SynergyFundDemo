import { mockCash } from "@/lib/mock/transport";
import { USE_MOCK } from "./client";

// Cash flows config (deposit gateways, accounts, withdraw limits).
// To go live: replace the mock branch with a real GET, e.g.
//   return (await client.get("/cash/config")).data;
export async function apiGetCashConfig() {
  if (USE_MOCK) return mockCash.config();
  throw new Error("Real API not implemented yet");
}
