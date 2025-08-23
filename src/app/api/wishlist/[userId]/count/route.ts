// /api/wishlist/[userId]/count/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eq, count } from "drizzle-orm";
import { wishlist } from "@/lib/db/schema";

interface productsProps {
  params: Promise<{
    userId: string;
  }>;
}

export async function GET(request: Request, { params }: productsProps) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const [result] = await db
      .select({ count: count() })
      .from(wishlist)
      .where(eq(wishlist.userId, userId));

    return NextResponse.json({ count: result.count }, { status: 200 });
  } catch (error) {
    console.error("Error fetching wishlist count:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
