"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/lib/scripts/firebase-client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function CompleteProfile() {
  const router = useRouter();
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"enterPhone" | "enterOtp">("enterPhone");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  useEffect(() => {
    // Prepare invisible reCAPTCHA
    if (typeof window !== "undefined" && auth) {
      new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
    }
  }, []);

  async function sendOtp() {
    const fullNumber = `${countryCode}${phoneNumber}`;
    const appVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });

    try {
      const result = await signInWithPhoneNumber(auth, fullNumber, appVerifier);
      setConfirmationResult(result);
      setStep("enterOtp");
    } catch (error: any) {
      alert(`Error sending OTP: ${error.message}`);
    }
  }

  async function verifyOtp() {
    try {
      await confirmationResult.confirm(otp); // Firebase validates OTP
      // Save the phone number to your DB after successful verification
      const fullNumber = `${countryCode}${phoneNumber}`;
      const res = await fetch("/api/complete-profile/save-phone-number", {
        method: "POST",
        body: JSON.stringify({ phoneNumber: fullNumber }),
      });

      if (res.ok) {
        router.push("/home");
      } else {
        alert("Error saving phone number!");
      }
    } catch (error: any) {
      alert(`OTP verification failed: ${error.message}`);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex items-center justify-center">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src={"/images/logo_novel.png"}
                  alt="Logo"
                  content="object-cover"
                  height={150}
                  width={150}
                />
              </Link>
            </div>
            <CardTitle className="text-2xl font-bold">
              Complete your profile
            </CardTitle>
            <CardDescription>
              Please verify your phone number to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div id="recaptcha-container"></div>

            {step === "enterPhone" && (
              <>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="border p-2 rounded w-24"
                  >
                    <option value="+1">+1 (US)</option>
                    <option value="+91">+91 (IN)</option>
                    <option value="+44">+44 (UK)</option>
                  </select>
                  <Input
                    type="tel"
                    placeholder="Phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <Button
                  onClick={sendOtp}
                  variant="outline"
                  className="w-full mt-4"
                >
                  Send OTP
                </Button>
              </>
            )}

            {step === "enterOtp" && (
              <>
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <Button
                  variant="premium"
                  onClick={verifyOtp}
                  className="w-full mt-4"
                >
                  Verify OTP
                </Button>
              </>
            )}

            <Separator className="my-4" />

            <p className="text-center text-sm text-muted-foreground">
              Need help?{" "}
              <Link href="/contact" className="text-primary hover:underline">
                Contact Support
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
