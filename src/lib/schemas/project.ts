import { z } from "zod";

export const ProjectStatusSchema = z.enum(["active", "funding", "closed"]);

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.string(),
  images: z.array(z.string()),
  status: ProjectStatusSchema,
  targetYield: z.number(),
  minInvestment: z.number(),
  sharePrice: z.number(),
  soldPercent: z.number().min(0).max(100),
  totalCapacityWatts: z.number(),
  description: z.string(),
  createdAt: z.string(),
  operationStartDate: z.string(),
  progressPercent: z.number().min(0).max(100).optional(),
});

export type Project = z.infer<typeof ProjectSchema>;

export const PaginatedProjectsSchema = z.object({
  data: z.array(ProjectSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
});
