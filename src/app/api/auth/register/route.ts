import { type NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { UserSettings } from "@/lib/constants/types";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Provide default structure
    const defaultSettings: UserSettings = {
      profile: {},
      location: {},
      notifications: {
        email: true,
        whatsapp: true,
      },
      stats: {
        totalOrders: 0,
        totalSpent: 0,
        loyaltyPoints: 0,
        joinDate: new Date().toDateString(),
      },
    };

    // Create user
    const newUser = await db
      .insert(users)
      .values({
        name: name,
        email,
        password: hashedPassword,
        accountSettings:JSON.stringify(defaultSettings),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(
      { message: "User created successfully", userId: newUser[0].id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
