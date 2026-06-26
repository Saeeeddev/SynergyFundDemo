import { z } from "zod";

export const VerificationStatusSchema = z.enum([
  "pending",
  "verified",
  "rejected",
]);

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  role: z.string(),
  avatar: z.string().optional(),
  verificationStatus: VerificationStatusSchema,
});

export const NotificationTypeSchema = z.enum(["payout", "performance"]);

export const NotificationSchema = z.object({
  id: z.string(),
  type: NotificationTypeSchema,
  title: z.string(),
  body: z.string(),
  timestamp: z.string(),
  read: z.boolean(),
});

export type User = z.infer<typeof UserSchema>;
export type Notification = z.infer<typeof NotificationSchema>;
