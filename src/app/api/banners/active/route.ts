import { db } from "@/lib/db";
import { banners } from "@/lib/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const now = new Date();

    const result = await db
      .select({
        id: banners.id,
        title: banners.title,
        description: banners.description,
        imageUrl: banners.imageUrl,
        linkUrl: banners.linkUrl,
        priority: banners.priority,
        bannerType: banners.bannerType,
      })
      .from(banners)
      .where(
        and(
          eq(banners.isActive, true),
          // optional: only show within date range if provided
          // banners.startDate.lte(now),
          // banners.endDate.gte(now)
        )
      )
      .orderBy(banners.priority);

    return NextResponse.json({ banners: result });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
