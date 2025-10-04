import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { eq, like, and, desc, asc, sql, inArray } from "drizzle-orm";

const sortableFields = {
  name: products.name,
  stock: products.stock,
  createdAt: products.createdAt,
  updatedAt: products.updatedAt,
} as const;

type SortableField = keyof typeof sortableFields;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const featured = searchParams.get("featured");

    const offset = (page - 1) * 12;

    let whereConditions: any[] = [eq(products.published, true)];

    if (category) whereConditions.push(eq(products.categoryId, category));
    if (search) whereConditions.push(like(products.name, `%${search}%`));
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
        price: products.price,
        salePrice: products.salePrice,
        images: products.images,
        modelUrl: products.modelUrl,
        stock: products.stock,
        featured: products.featured,
        bestSeller: products.bestSeller,
        categoryId: products.categoryId,
        sku: products.sku,
        sellers: products.sellers,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        features: products.features,
        customerReviews: products.customerReviews,
        tags: products.tags,
        seoTitle: products.seoTitle,
        seoDescription: products.seoDescription,
        category: {
          id: categories.id,
          name: categories.name,
          description: categories.description,
          createdAt: categories.createdAt,
          updatedAt: categories.updatedAt,
        },
        faqs: products.faqs,
        howToUse: products.howToUse,
        ingredients: products.ingredients,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(...whereConditions))
      .orderBy(orderBy)
      .offset(offset);

    const result = resultRaw.map((product) => ({
      ...product,
      images: JSON.parse(product.images || "[]"),
      features: JSON.parse(product.features || "[]"),
      tags: JSON.parse(product.tags || "[]"),
      customerReviews: product.customerReviews || null,
      sellers: product.sellers || [],
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
        limit: 12,
        total: totalCount,
        totalPages: Math.ceil(totalCount / 12),
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
