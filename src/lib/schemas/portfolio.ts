import { z } from "zod";

export const HoldingSchema = z.object({
  projectId: z.string(),
  projectName: z.string(),
  projectLocation: z.string(),
  sharesOwned: z.number(),
  purchasePrice: z.number(),
  currentPrice: z.number(),
  totalValue: z.number(),
  totalInvested: z.number(),
  pnl: z.number(),
  pnlPercent: z.number(),
  ownershipPercent: z.number(),
});

export const PerformanceSeriesSchema = z.object({
  date: z.string(),
  value: z.number(),
});

export const GeoDistributionSchema = z.object({
  city: z.string(),
  ownershipPercent: z.number(),
  projectsCount: z.number(),
});

export const PortfolioSummarySchema = z.object({
  totalAssetsValue: z.number(),
  totalInvested: z.number(),
  incomeEarned: z.number(),
  netReturn: z.number(),
  netReturnPercent: z.number(),
});

export type Holding = z.infer<typeof HoldingSchema>;
export type PerformanceSeries = z.infer<typeof PerformanceSeriesSchema>;
export type GeoDistribution = z.infer<typeof GeoDistributionSchema>;
export type PortfolioSummary = z.infer<typeof PortfolioSummarySchema>;
