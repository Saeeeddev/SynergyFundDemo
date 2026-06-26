import { z } from "zod";

export const ActivityTypeSchema = z.enum(["buy", "sell", "deposit", "withdraw"]);
export const InvestmentStatusSchema = z.enum(["pending", "completed", "failed"]);

export const InvestmentSchema = z.object({
  id: z.string(),
  type: z.enum(["buy", "sell"]),
  projectId: z.string(),
  projectName: z.string(),
  sharesCount: z.number(),
  pricePerShare: z.number(),
  totalAmount: z.number(),
  fee: z.number(),
  status: InvestmentStatusSchema,
  date: z.string(),
});

export const ActivitySchema = z.object({
  id: z.string(),
  type: ActivityTypeSchema,
  description: z.string(),
  amount: z.number(),
  shares: z.number().optional(),
  projectName: z.string().optional(),
  date: z.string(),
});

export type Investment = z.infer<typeof InvestmentSchema>;
export type Activity = z.infer<typeof ActivitySchema>;
