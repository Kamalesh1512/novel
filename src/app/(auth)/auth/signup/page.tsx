"use client";

import type React from "react";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Github, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { z } from "zod";
import { SignupSchema } from "@/lib/schema/signupschema";
import Image from "next/image";

type SignupFormType = z.infer<typeof SignupSchema>;

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    phone: "",
    agreeToTerms: false,
    agreeToMarketing: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof SignupFormType, string>>
  >({});

  const countries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Spain",
    "Italy",
    "Netherlands",
    "Singapore",
    "UAE",
    "Other",
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Validate form with Zod
    const result = SignupSchema.safeParse(formData);

    // Validation
    if (!result.success) {
      const fieldErrors: typeof formErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof SignupFormType;
        fieldErrors[field] = err.message;
      });

      setFormErrors(fieldErrors);

      const errorMessages = result.error.errors
        .map((err) => `${err.path[0]}: ${err.message}`)
        .join("\n");

      toast.error("Validation failed", {
        description: `${errorMessages.split(":")[0]} Field required`,
      });
      return;
    }

    setIsLoading(true);
    try {
      // Here you would typically call your API to create the user
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        toast.success("Success", {
          description:
            "Account created successfully! Please verify Phone Number!",
        });
        router.push("/auth/complete-profile");
      } else {
        const error = await response.json();
        toast.error("Error", {
          description: error.message || "Failed to create account.",
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: string) => {
    try {
      await signIn(provider);
    } catch (error) {
      toast.error("Error", {
        description: "Failed to sign up. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex items-center justify-center">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src={"/images/logo_with_horse.png"}
                  alt="Logo"
                  content="object-cover"
                  height={50}
                  width={50}
                />
              </Link>
            </div>
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>
              Join Alma and discover premium cosmetics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* OAuth Buttons */}
            <div className="grid grid-cols-1 gap-4">
              <Button
                variant="outline"
                onClick={() => handleOAuthSignIn("google")}
                className="w-full"
              >
                <Mail className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="text-primary px-2">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  required
                />
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) =>
                    handleInputChange("agreeToTerms", checked as boolean)
                  }
                />
                <Label htmlFor="terms">
                  I agree to the{" "}
                  <Link href="/terms" className="text-black hover:underline">
                    Terms of Service
                  </Link>{" "}
                  &{" "}
                  <Link href="/privacy" className="text-black hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button variant={"premium"} className="w-full" type="submit">
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-black font-semibold hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
