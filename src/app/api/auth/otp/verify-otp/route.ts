import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { users } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();

  if (!session || !session.user.email)
    NextResponse.json({ message: "Unauthorised" }, { status: 401 });

  const { phoneNumber, otp } = await req.json();

  if (!phoneNumber)
    NextResponse.json({ message: "Phone Number is required" }, { status: 400 });

  const dbUser = await db
    .select()
    .from(users)
    .where(eq(users.phoneNumber, phoneNumber))
    .limit(1);

  if (!dbUser.length)
    return NextResponse.json({ message: "User not Found" }, { status: 401 });

  const user = dbUser[0];

  if (user.phoneOtp !== otp || new Date() > new Date(user.phoneOtpExpiresAt!)) {
    return NextResponse.json(
      { message: "Invalid or Expired OTP" },
      { status: 401 }
    );
  }

  // Update phone number verified
  await db
    .update(users)
    .set({ phoneNumberVerified: true })
    .where(eq(users.phoneNumber, phoneNumber))
    .execute();

  return NextResponse.json({ message: "Phone Verified" }, { status: 401 });
}
