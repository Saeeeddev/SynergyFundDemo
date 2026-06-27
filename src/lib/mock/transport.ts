// Mock transport — async functions returning fixtures with simulated latency.
// Signatures are identical to the real API functions so swapping is mechanical.
//
// USAGE: set NEXT_PUBLIC_MOCK_ERROR=1 (or call setMockError(true) at runtime)
// to force every call to reject — useful for testing error/retry states.

import type { Paginated } from "@/types/api";
import type { Notification } from '@/lib/schemas/user';
import {
  MOCK_PROJECTS,
  MOCK_DASHBOARD,
  MOCK_HOLDINGS,
  MOCK_PORTFOLIO_SUMMARY,
  MOCK_PERFORMANCE_SERIES,
  MOCK_GEO,
  MOCK_ACTIVITIES,
  MOCK_INVESTMENTS,
  MOCK_PAYOUTS,
  MOCK_PAYOUT_METHOD,
  MOCK_INCOME_SUMMARY,
  MOCK_REPORTS,
  MOCK_USER,
  MOCK_NOTIFICATIONS,
} from "./fixtures";

// ─── Error toggle ─────────────────────────────────────────────────────────────

let _forceError = false;

export function setMockError(value: boolean) {
  _forceError = value;
}

function latency(ms = 400): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function call<T>(fn: () => T): Promise<T> {
  await latency();
  if (_forceError) {
    throw new Error("MOCK_ERROR: simulated network failure");
  }
  return fn();
}

function paginate<T>(items: T[], page: number, pageSize: number): Paginated<T> {
  const start = (page - 1) * pageSize;
  return {
    data: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize,
    totalPages: Math.ceil(items.length / pageSize),
  };
}

// ─── Projects ────────────────────────────────────────────────────────────────

export const mockProjects = {
  list: (page = 1, pageSize = 8) =>
    call(() => paginate(MOCK_PROJECTS, page, pageSize)),

  detail: (id: string) =>
    call(() => {
      const p = MOCK_PROJECTS.find((p) => p.id === id);
      if (!p) throw new Error(`Project ${id} not found`);
      return p;
    }),
};

// ─── Dashboard ───────────────────────────────────────────────────────────────

export const mockDashboard = {
  summary: () => call(() => MOCK_DASHBOARD),
  activities: (page = 1, pageSize = 10) =>
    call(() => paginate(MOCK_ACTIVITIES, page, pageSize)),
};

// ─── Portfolio ───────────────────────────────────────────────────────────────

export const mockPortfolio = {
  summary: () => call(() => MOCK_PORTFOLIO_SUMMARY),
  holdings: () => call(() => MOCK_HOLDINGS),
  performance: () => call(() => MOCK_PERFORMANCE_SERIES),
  geo: () => call(() => MOCK_GEO),
  orders: (page = 1, pageSize = 10) =>
    call(() => paginate(MOCK_INVESTMENTS, page, pageSize)),
};

// ─── Income ──────────────────────────────────────────────────────────────────

export const mockIncome = {
  summary: () => call(() => MOCK_INCOME_SUMMARY),
  payouts: (page = 1, pageSize = 8) =>
    call(() => paginate(MOCK_PAYOUTS, page, pageSize)),
  payoutMethod: () => call(() => MOCK_PAYOUT_METHOD),
};

// ─── Reports ─────────────────────────────────────────────────────────────────

export const mockReports = {
  list: (page = 1, pageSize = 8, category?: string) =>
    call(() => {
      const filtered = category
        ? MOCK_REPORTS.filter((r) => r.category === category)
        : MOCK_REPORTS;
      return paginate(filtered, page, pageSize);
    }),
};

// ─── User & auth ─────────────────────────────────────────────────────────────

export const mockAuth = {
  me: () => call(() => MOCK_USER),
  login: (username: string, password: string) =>
    call(() => {
      if (username === "admin" && password === "password") {
        return { token: "mock-token-admin" };
      }
      throw new Error("INVALID_CREDENTIALS");
    }),
};

// ─── Notifications ────────────────────────────────────────────────────────────

let _notifications: Notification[] = [...MOCK_NOTIFICATIONS]

export const mockNotifications = {
  list: () => call(() => [..._notifications]),
  markAsRead: (id: string) =>
    call(() => {
      _notifications = _notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      )
      return true
    }),
  markAllAsRead: () =>
    call(() => {
      _notifications = _notifications.map((n) => ({ ...n, read: true }))
      return true
    }),
};

// ─── Investments (buy / sell mutations) ───────────────────────────────────────

export const mockInvestments = {
  buy: (projectId: string, sharesCount: number) =>
    call(() => ({
      id: `inv-new-${Date.now()}`,
      type: "buy" as const,
      projectId,
      projectName:
        MOCK_PROJECTS.find((p) => p.id === projectId)?.name ?? projectId,
      sharesCount,
      pricePerShare:
        MOCK_PROJECTS.find((p) => p.id === projectId)?.sharePrice ?? 10_000,
      totalAmount: sharesCount * 10_000 * 1.015,
      fee: sharesCount * 10_000 * 0.015,
      status: "completed" as const,
      date: new Date().toISOString(),
    })),

  sell: (projectId: string, sharesCount: number) =>
    call(() => ({
      id: `inv-new-${Date.now()}`,
      type: "sell" as const,
      projectId,
      projectName:
        MOCK_PROJECTS.find((p) => p.id === projectId)?.name ?? projectId,
      sharesCount,
      pricePerShare:
        MOCK_PROJECTS.find((p) => p.id === projectId)?.sharePrice ?? 10_000,
      totalAmount: sharesCount * 10_000 * 0.985,
      fee: sharesCount * 10_000 * 0.015,
      status: "completed" as const,
      date: new Date().toISOString(),
    })),

  userOwns: (projectId: string) =>
    call(() => MOCK_HOLDINGS.some((h) => h.projectId === projectId)),
};
