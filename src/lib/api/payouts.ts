import { mockIncome } from "@/lib/mock/transport";
import { USE_MOCK } from "./client";

export async function apiGetIncomeSummary() {
  if (USE_MOCK) return mockIncome.summary();
  throw new Error("Real API not implemented yet");
}

export async function apiGetPayouts(page = 1, pageSize = 8) {
  if (USE_MOCK) return mockIncome.payouts(page, pageSize);
  throw new Error("Real API not implemented yet");
}

export async function apiGetPayoutMethod() {
  if (USE_MOCK) return mockIncome.payoutMethod();
  throw new Error("Real API not implemented yet");
}
