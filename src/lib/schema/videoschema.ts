import { z } from "zod";

 export const videoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  linkUrl: z.string().optional(),
  isActive: z.boolean(),
  priority: z.number().int(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  videoType: z.enum([
    "general",
    "festival",
    "sale",
    "announcement",
    "home",
    "product-specific",
    "baby-care",
    "personal-care",
    "adult-care",
    "indoor-gear",
    "outdoor-gear",
    "nursing-feeding",
    "categories",
  ]),
  videoUrl: z.string().url({ message: "Video is required" }),
  autoPlay: z.boolean(),
  loop: z.boolean(),
  muted: z.boolean(),
});


export type VideoFormData = z.infer<typeof videoSchema>;