//api/admin/settings/change-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ success: false, error: "Password must be at least 6 characters long" }, { status: 400 });
    }

    // Get current user
    const user = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
    
    if (!user[0] || !["super_admin", "admin"].includes(user[0].role)) {
      return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 });
    }

    // Verify current password
    if (!user[0].password) {
      return NextResponse.json({ success: false, error: "No password set" }, { status: 400 });
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user[0].password);
    if (!isValidPassword) {
      return NextResponse.json({ success: false, error: "Current password is incorrect" }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await db.update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}