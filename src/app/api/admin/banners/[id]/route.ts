// app/api/admin/banners/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { banners } from '@/lib/db/schema';

interface BannerProps {
  params: Promise<{
    id: string;
  }>;
}

// PUT update banner
export async function PUT(
  request: NextRequest,
  { params }:BannerProps ) {
  try {
    const {id} = await params;
    const body = await request.json();

    const updatedBanner = await db
      .update(banners)
      .set({
        ...body,
        updatedAt: new Date(),
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
      })
      .where(eq(banners.id,id))
      .returning();

    if (updatedBanner.length === 0) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    return NextResponse.json(updatedBanner[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 });
  }
}

// DELETE banner
export async function DELETE(
  request: NextRequest,
  { params }:BannerProps
) {
  try {
    const {id} = await params;

    const deletedBanner = await db
      .delete(banners)
      .where(eq(banners.id, id))
      .returning();

    if (deletedBanner.length === 0) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
  }
}