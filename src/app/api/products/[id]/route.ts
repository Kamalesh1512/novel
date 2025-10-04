import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, categories, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

interface productsProps {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: productsProps
) {
  try {
    const { id } = await params;

    const productData = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        shortDescription: products.shortDescription,
        price:products.price,
        salePrice:products.salePrice,
        sku: products.sku,
        stock: products.stock,
        images: products.images,
        modelUrl: products.modelUrl,
        featured: products.featured,
        bestSeller: products.bestSeller,
        tags: products.tags,
        categoryId: products.categoryId,
        customerReviews: products.customerReviews, // Get customerReviews JSON field
        createdAt: products.createdAt,
        category: {
          id: categories.id,
          name: categories.name,
        },
        howToUse:products.howToUse,
        ingredients:products.ingredients,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.id, id))
      .limit(1);

    if (!productData.length) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = productData[0];

    return NextResponse.json({
      product: {
        ...product,
        reviews: product.customerReviews || [], // Provide reviews array from customerReviews JSON field
      },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
