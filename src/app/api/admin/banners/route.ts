import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Your database instance
import { desc, eq } from 'drizzle-orm';
import { banners } from '@/lib/db/schema';


export async function GET() {
  try {
    const allBanners = await db
      .select()
      .from(banners)
      .orderBy(desc(banners.priority), desc(banners.createdAt));

    return NextResponse.json(allBanners);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      imageUrl,
      linkUrl,
      isActive,
      priority,
      startDate,
      endDate,
      bannerType
    } = body;

    const newBanner = await db
      .insert(banners)
      .values({
        title,
        description,
        imageUrl,
        linkUrl,
        isActive: isActive ?? true,
        priority: priority ?? 0,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        bannerType: bannerType ?? 'general',
      })
      .returning();

    return NextResponse.json(newBanner[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 });
  }
}