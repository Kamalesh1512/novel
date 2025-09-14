import { z } from "zod";

// Seller schema with variant support
export const sellerSchema = z.object({
  name: z.string().min(1, "Seller name is required"),
  variant: z.string().optional(),
  url: z.string().url("Invalid URL format").optional(),
  offer: z.string().optional(),
});

// FAQ schema
export const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

// Customer review schema
export const customerReviewSchema = z.object({
  sellerName: z.string().min(1, "Seller name is required"),
  totalReviews: z.coerce.number().min(0, "Total reviews must be 0 or greater"),
  averageRating: z.coerce
    .number()
    .min(0)
    .max(5, "Rating must be between 0 and 5"),
  topComments: z
    .array(
      z.object({
        comment: z.string().min(1, "Comment is required"),
        rating: z.coerce
          .number()
          .min(1)
          .max(5, "Rating must be between 1 and 5"),
        reviewerName: z.string().optional(),
        date: z.string().optional(),
      })
    )
    .optional(),
});

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.coerce.number().min(1, "Price is required"),
  salePrice: z.coerce.number().optional(),
  sellers: z.array(sellerSchema).optional(),
  size: z.string().optional(),
  sku: z.string().min(1, "SKU is required"),
  stock: z.coerce.number().min(0, "Stock must be 0 or greater"),
  categoryId: z.string().optional(),
  images: z.string().optional(),
  modelUrl: z.string().optional(),

  // ✅ changed here
  featured: z.boolean(),
  bestSeller: z.boolean(),
  published: z.boolean(),

  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  weight: z.coerce.number().optional(),
  features: z.array(z.string()).optional(),
  faqs: z.array(faqSchema).optional(),
  customerReviews: z.array(customerReviewSchema).optional(), // ✅ New field added

  amazonEnabled: z.boolean(),
  amazonUrl: z.string().optional(),
  meeshoEnabled: z.boolean(),
  meeshoUrl: z.string().optional(),
  flipkartEnabled: z.boolean(),
  flipkartUrl: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
export type SellerFormData = z.infer<typeof sellerSchema>;
export type FaqFormData = z.infer<typeof faqSchema>;
export type CustomerReviewFormData = z.infer<typeof customerReviewSchema>;
