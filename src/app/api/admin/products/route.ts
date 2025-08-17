import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (
      !session ||
      (session.user.role !== "admin" && session.user.role !== "super_admin")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db.select().from(products);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (
      !session ||
      (session.user.role !== "admin" && session.user.role !== "super_admin")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const newProduct = await db
      .insert(products)
      .values({
        id: uuidv4(),
        name: body.name,
        description: body.description,
        shortDescription: body.shortDescription,
        sku: body.sku,
        stock: body.stock,
        sellers:JSON.stringify(body.sellers),
        categoryId: body.categoryId,
        images: JSON.stringify(body.images),
        modelUrl: body.modelUrl,
        featured: body.featured,
        bestSeller: body.bestSeller,
        published: body.published,
        features:JSON.stringify(body.features),
        tags: JSON.stringify(body.tags),
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
      })
      .returning();

    return NextResponse.json(newProduct[0]);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
