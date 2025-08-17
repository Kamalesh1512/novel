import { z } from "zod";

export const SignupSchema = z
  .object({
    name: z.string().min(2, "name must be at least 3 characters"),
    email: z
      .string()
      .email("Invalid email address")
      .refine(
        (email) => {
          const validDomainRegex =
            /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)+(com|net|org|edu|io|in|co)$/;
          return validDomainRegex.test(email);
        },
        {
          message:
            "Please enter a valid email domain (e.g., Gmail, Outlook, etc.)",
        }
      ),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    agreeToTerms: z.literal(true).refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });