import { z } from "zod";

// ---------------- Zod Schema ----------------
export const enquirySchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  company: z.string().min(2, "Company name is required"),
  email: z.string().email("Invalid email address"),
  countryCode: z.string().min(1, "Country code is required"),
  phone: z
    .string()
    .min(10, "Phone number must be exactly 10 digits")
    .max(10, "Phone number must be exactly 10 digits")
    .regex(
      /^[6-9]\d{9}$/,
      "Enter a valid Indian mobile number (starting with 6-9)"
    ),
  businessType: z.enum(["Retailer", "Distributor", "Wholesaler", "Other"], {
    required_error: "Select business type",
  }),
  location: z.string().min(2, "Location is required"),
  message: z.string().min(5, "Message is required"),
});

export type EnquiryFormData = z.infer<typeof enquirySchema>;
