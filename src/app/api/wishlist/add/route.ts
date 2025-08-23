// /api/wishlist/add/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Adjust import path as needed
import { eq, and } from 'drizzle-orm';
import { wishlist } from '@/lib/db/schema';

export async function POST(request: NextRequest) {
  try {
    const { userId, productId } = await request.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'User ID and Product ID are required' },
        { status: 400 }
      );
    }

    // Check if the item already exists in wishlist
    const existingItem = await db
      .select()
      .from(wishlist)
      .where(and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)))
      .limit(1);

    if (existingItem.length > 0) {
      return NextResponse.json(
        { error: 'Item already in wishlist' },
        { status: 409 }
      );
    }

    // Add to wishlist
    const newWishlistItem = await db
      .insert(wishlist)
      .values({
        userId,
        productId,
      })
      .returning();

    return NextResponse.json(
      { message: 'Added to wishlist successfully', item: newWishlistItem[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}