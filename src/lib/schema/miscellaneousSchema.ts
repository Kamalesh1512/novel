// lib/schema/miscellaneousSchema.ts

import * as z from "zod";

export const miscellaneousSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  content: z.string().min(5, "Content is required"),
  isActive: z.boolean(),
  priority: z.number().int().min(0),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type MiscellaneousFormData = z.infer<typeof miscellaneousSchema>;