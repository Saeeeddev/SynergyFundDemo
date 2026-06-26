import { mockPortfolio, mockDashboard } from "@/lib/mock/transport";
import { USE_MOCK } from "./client";

export async function apiGetDashboardSummary() {
  if (USE_MOCK) return mockDashboard.summary();
  throw new Error("Real API not implemented yet");
}

export async function apiGetActivities(page = 1, pageSize = 10) {
  if (USE_MOCK) return mockDashboard.activities(page, pageSize);
  throw new Error("Real API not implemented yet");
}

export async function apiGetPortfolioSummary() {
  if (USE_MOCK) return mockPortfolio.summary();
  throw new Error("Real API not implemented yet");
}

export async function apiGetHoldings() {
  if (USE_MOCK) return mockPortfolio.holdings();
  throw new Error("Real API not implemented yet");
}

export async function apiGetPerformance() {
  if (USE_MOCK) return mockPortfolio.performance();
  throw new Error("Real API not implemented yet");
}

export async function apiGetGeo() {
  if (USE_MOCK) return mockPortfolio.geo();
  throw new Error("Real API not implemented yet");
}

export async function apiGetOrders(page = 1, pageSize = 10) {
  if (USE_MOCK) return mockPortfolio.orders(page, pageSize);
  throw new Error("Real API not implemented yet");
}
