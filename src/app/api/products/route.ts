//app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products, categories, reviews, users } from "@/lib/db/schema";
import {
  eq,
  like,
  and,
  gte,
  lte,
  desc,
  asc,
  sql,
  InferSelectModel,
  inArray,
} from "drizzle-orm";

const sortableFields = {
  name: products.name,
  stock: products.stock,
  createdAt: products.createdAt,
  updatedAt: products.updatedAt,
} as const;

type SortableField = keyof typeof sortableFields;
export type Review = InferSelectModel<typeof reviews> & {
  user: {
    name: string | null;
    email: string | null;
  } | null;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const featured = searchParams.get("featured");

    const offset = (page - 1) * limit;

    let whereConditions: any[] = [eq(products.published, true)];

    if (category) whereConditions.push(eq(products.categoryId, category));
    if (search) whereConditions.push(like(products.name, `%${search}%`));
    // if (minPrice) whereConditions.push(gte(products.price, minPrice));
    // if (maxPrice) whereConditions.push(lte(products.price, maxPrice));
    if (featured === "true") whereConditions.push(eq(products.featured, true));

    const sortBySafe = sortBy as SortableField;
    const column = sortableFields[sortBySafe];
    if (!column) throw new Error(`Invalid sort column: ${sortBy}`);
    const orderBy = sortOrder === "desc" ? desc(column) : asc(column);

    const resultRaw = await db
      .select({
        id: products.id,
        name: products.name,
        shortDescription: products.shortDescription,
        description: products.description,
        images: products.images,
        modelUrl: products.modelUrl,
        stock: products.stock,
        featured: products.featured,
        bestSeller: products.bestSeller,
        categoryId: products.categoryId,
        sku: products.sku,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          description: categories.description,
          createdAt: categories.createdAt,
          updatedAt: categories.updatedAt,
        },
        rating: sql<
          number | null
        >`ROUND(AVG(${reviews.rating})::numeric, 1)`.as("rating"),
        reviewCount: sql<number>`COUNT(${reviews.id})`.as("reviewCount"),
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(reviews, eq(products.id, reviews.productId))
      .where(and(...whereConditions))
      .groupBy(products.id, categories.id)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    let result = resultRaw.map((product) => ({
      ...product,
      images: JSON.parse(product.images || "[]"),
      rating: product.rating ? Number(product.rating) : 0,
      reviews: Number(product.reviewCount),
    }));

    // Always include detailed reviews
    const productIds = result.map((p) => p.id);

    let productReviews: Review[] = [];

    if (productIds.length > 0) {
      const allReviews = await db
        .select({
          id: reviews.id,
          productId: reviews.productId,
          userId: reviews.userId,
          rating: reviews.rating,
          title: reviews.title,
          comment: reviews.comment,
          verified: reviews.verified,
          createdAt: reviews.createdAt,
          updatedAt: reviews.updatedAt,
          user: {
            name: users.name,
            email: users.email,
          },
        })
        .from(reviews)
        .leftJoin(users, eq(reviews.userId, users.id))
        .where(inArray(reviews.productId, productIds))
        .orderBy(desc(reviews.createdAt));

      // 2. Deduplicate: Keep only the latest review per user per product
      const uniqueReviewsMap = new Map<string, (typeof allReviews)[0]>();

      for (const review of allReviews) {
        const key = `${review.productId}_${review.userId}`;
        if (!uniqueReviewsMap.has(key)) {
          uniqueReviewsMap.set(key, review);
        }
      }

      productReviews = Array.from(uniqueReviewsMap.values());
      
    }

    const reviewsByProduct = productReviews.reduce((acc, review) => {
      if (review.productId) {
        if (!acc[review.productId]) {
          acc[review.productId] = [];
        }
        acc[review.productId].push(review);
      }
      return acc;
    }, {} as Record<string, typeof productReviews>);

    result = result.map((product) => ({
      ...product,
      productReviews: reviewsByProduct[product.id] || [],
    }));

    const totalCountResult = await db
      .select({ count: sql<number>`COUNT(DISTINCT ${products.id})` })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(...whereConditions));

    const totalCount = totalCountResult[0]?.count || 0;

    return NextResponse.json({
      products: result,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
