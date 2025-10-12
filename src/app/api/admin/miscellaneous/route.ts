// api/admin/miscellaneous/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { desc } from "drizzle-orm";
import { miscellaneous } from "@/lib/db/schema";

export async function GET() {
  try {
    const allMiscellaneous = await db
      .select()
      .from(miscellaneous)
      .orderBy(desc(miscellaneous.priority), desc(miscellaneous.createdAt));

    return NextResponse.json(allMiscellaneous);
  } catch (error) {
    console.error("Error fetching miscellaneous entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch miscellaneous entries" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      title,
      content,
      isActive,
      priority,
      startDate,
      endDate,
    } = body;

    const newMisc = await db
      .insert(miscellaneous)
      .values({
        title,
        content,
        isActive: isActive ?? true,
        priority: priority ?? 0,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      })
      .returning();

    return NextResponse.json(newMisc[0], { status: 201 });
  } catch (error) {
    console.error("Error creating miscellaneous entry:", error);
    return NextResponse.json(
      { error: "Failed to create miscellaneous entry" },
      { status: 500 }
    );
  }
}