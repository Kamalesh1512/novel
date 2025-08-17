import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import { eq, desc, count } from "drizzle-orm";
import { categorySchema } from "@/lib/schema/categoryInputSchema";

export async function GET() {
  try {
    const result = await db
      .select({
        id: categories.id,
        name: categories.name,
        description: categories.description,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
      })
      .from(categories)
      .orderBy(desc(categories.createdAt));

    // Get product count for each category
    const categoriesWithCount = await Promise.all(
      result.map(async (category) => {
        const productCount = await db
          .select({ count: count(products.id) })
          .from(products)
          .where(eq(products.categoryId, category.id));

        return {
          ...category,
          productCount: productCount[0]?.count || 0,
        };
      })
    );

    return NextResponse.json({ categories: categoriesWithCount });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten() },
        { status: 401 }
      );
    }

    const { name, description } = parsed.data;
    const result = await db
      .insert(categories)
      .values({
        name: name,
        description: description,
      })
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
