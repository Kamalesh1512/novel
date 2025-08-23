// /api/wishlist/remove/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { wishlist } from '@/lib/db/schema';

export async function DELETE(request: NextRequest) {
  try {
    const { userId, productId } = await request.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'User ID and Product ID are required' },
        { status: 400 }
      );
    }

    // Remove from wishlist
    const deletedItems = await db
      .delete(wishlist)
      .where(and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)))
      .returning();

    if (deletedItems.length === 0) {
      return NextResponse.json(
        { error: 'Item not found in wishlist' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Removed from wishlist successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}