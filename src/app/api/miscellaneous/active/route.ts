// api/miscellaneous/active/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { desc, eq, and, or, isNull, lte, gte } from "drizzle-orm";
import { miscellaneous } from "@/lib/db/schema";

export async function GET() {
  try {
    const now = new Date();

    // Fetch only active entries that are within their date range (if specified)
    const activeMiscellaneous = await db
      .select()
      .from(miscellaneous)
      .where(
        and(
          eq(miscellaneous.isActive, true),
          // Check start date: either no start date OR start date is in the past
          or(
            isNull(miscellaneous.startDate),
            lte(miscellaneous.startDate, now)
          ),
          // Check end date: either no end date OR end date is in the future
          or(
            isNull(miscellaneous.endDate),
            gte(miscellaneous.endDate, now)
          )
        )
      )
      .orderBy(desc(miscellaneous.priority), desc(miscellaneous.createdAt));

    return NextResponse.json(activeMiscellaneous);
  } catch (error) {
    console.error("Error fetching miscellaneous entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch miscellaneous entries" },
      { status: 500 }
    );
  }
}