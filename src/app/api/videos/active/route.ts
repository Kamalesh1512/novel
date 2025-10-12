import { db } from "@/lib/db";
import { video } from "@/lib/db/schema";
import { and, eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const now = new Date();

    const result = await db
      .select()
      .from(video)
      .where(and(eq(video.isActive, true)))
      .orderBy(video.priority);

    return NextResponse.json({ videos: result });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
