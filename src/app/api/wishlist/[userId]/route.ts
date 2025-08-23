// /api/wishlist/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

import { eq, desc } from 'drizzle-orm';
import { products, wishlist } from '@/lib/db/schema';

interface productsProps{
  params:Promise<{
  userId:string,
  }>
}

export async function GET(
 request: Request, { params} :productsProps
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user's wishlist with product details
    const userWishlist = await db
      .select({
        id: wishlist.id,
        userId: wishlist.userId,
        productId: wishlist.productId,
        createdAt: wishlist.createdAt,
        // Include product details if needed
        product: {
          id: products.id,
          name: products.name,
          sku: products.sku,
          shortDescription: products.shortDescription,
          images: products.images,
          // Add other product fields as needed
        }
      })
      .from(wishlist)
      .leftJoin(products, eq(wishlist.productId, products.id))
      .where(eq(wishlist.userId, userId))
      .orderBy(desc(wishlist.createdAt));

    return NextResponse.json(userWishlist, { status: 200 });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}