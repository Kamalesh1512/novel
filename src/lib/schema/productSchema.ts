import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  sellers: z
    .array(
      z.object({
        name: z.string(),
        url: z.string().url().optional(),
      })
    )
    .optional(),
  size: z.string().optional(),
  sku: z.string().min(1, "SKU is required"),
  stock: z.coerce.number().min(0, "Stock must be 0 or greater"),
  categoryId: z.string().optional(),
  images: z.string().optional(),
  modelUrl: z.string().optional(),
  featured: z.boolean(),
  bestSeller: z.boolean(),
  published: z.boolean(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  weight: z.coerce.number().optional(),

  // Form-only fields for seller management
  amazonEnabled: z.boolean(),
  amazonUrl: z.string().optional(),
  meeshoEnabled: z.boolean(),
  meeshoUrl: z.string().optional(),
  flipkartEnabled: z.boolean(),
  flipkartUrl: z.string().optional(),

  features: z.array(z.string()).optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
