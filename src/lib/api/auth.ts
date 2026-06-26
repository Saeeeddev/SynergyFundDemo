import { mockAuth } from "@/lib/mock/transport";
import { USE_MOCK } from "./client";

export async function apiLogin(username: string, password: string) {
  if (USE_MOCK) return mockAuth.login(username, password);
  // Real API: POST /auth/login
  throw new Error("Real API not implemented yet");
}

export async function apiGetMe() {
  if (USE_MOCK) return mockAuth.me();
  throw new Error("Real API not implemented yet");
}
