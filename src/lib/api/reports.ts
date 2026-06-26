import { mockReports } from "@/lib/mock/transport";
import { USE_MOCK } from "./client";

export async function apiListReports(page = 1, pageSize = 8, category?: string) {
  if (USE_MOCK) return mockReports.list(page, pageSize, category);
  throw new Error("Real API not implemented yet");
}
