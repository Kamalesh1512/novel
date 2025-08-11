import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, categories, reviews, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

interface productsProps{
  params:Promise<{
  id:string,
  }>
}

export async function GET(
 request: Request, { params} :productsProps
) {
  try {
    const {id} = await params
    const product = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        shortDescription: products.shortDescription,
        price: products.price,
        salePrice: products.salePrice,
        sku: products.sku,
        stock: products.stock,
        images: products.images,
        modelUrl: products.modelUrl,
        featured: products.featured,
        bestSeller: products.bestSeller,
        tags: products.tags,
        categoryId: products.categoryId,
        createdAt: products.createdAt,
        category: {
          id: categories.id,
          name: categories.name,
        },
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.id, id))
      .limit(1);

    if (!product.length) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Get product reviews
    const productReviews = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        title: reviews.title,
        comment: reviews.comment,
        verified: reviews.verified,
        createdAt: reviews.createdAt,
        user: {
          name: users.name,
          image: users.image,
        },
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.productId,id))
      .orderBy(reviews.createdAt);

    return NextResponse.json({
      product: product[0],
      reviews: productReviews,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}