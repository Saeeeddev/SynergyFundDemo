import { mockProjects } from "@/lib/mock/transport";
import { USE_MOCK } from "./client";

export async function apiListProjects(page = 1, pageSize = 8) {
  if (USE_MOCK) return mockProjects.list(page, pageSize);
  throw new Error("Real API not implemented yet");
}

export async function apiGetProject(id: string) {
  if (USE_MOCK) return mockProjects.detail(id);
  throw new Error("Real API not implemented yet");
}
