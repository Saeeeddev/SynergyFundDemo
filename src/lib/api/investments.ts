import { mockInvestments } from "@/lib/mock/transport";
import { USE_MOCK } from "./client";

export async function apiBuyWatts(projectId: string, sharesCount: number) {
  if (USE_MOCK) return mockInvestments.buy(projectId, sharesCount);
  throw new Error("Real API not implemented yet");
}

export async function apiSellWatts(projectId: string, sharesCount: number) {
  if (USE_MOCK) return mockInvestments.sell(projectId, sharesCount);
  throw new Error("Real API not implemented yet");
}

export async function apiUserOwnsProject(projectId: string) {
  if (USE_MOCK) return mockInvestments.userOwns(projectId);
  throw new Error("Real API not implemented yet");
}
