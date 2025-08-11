
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { users } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {

   const session = await auth() 
   if (!session || !session.user.email) NextResponse.json({ message: "Unauthorised" }, { status: 401 })

  const { phoneNumber } = await req.json()

  if (!phoneNumber) NextResponse.json({ message: "Phone Number is required" }, { status: 400 })

  // Generate OTP and expiry
  const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

  // Save OTP & expiry
  await db
    .update(users)
    .set({ phoneOtp: otp, phoneOtpExpiresAt: expiry })
    .where(eq(users.email, session?.user.email as string)) // or req.user.id from session
    .execute();

  // TODO: Send OTP via SMS using Twilio or any provider
  console.log(`OTP for ${phoneNumber}: ${otp}`);

  
  return NextResponse.json({ message: "OTP sent" }, { status: 200 })
}
