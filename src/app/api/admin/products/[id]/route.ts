import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

interface productsAdminProps {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: Request, { params }: productsAdminProps) {
  try {
    const { id } = await params;
    const session = await auth();

    if (
      !session ||
      (session.user.role !== "admin" && session.user.role !== "super_admin")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      shortDescription,
      price,
      salePrice,
      sku,
      stock,
      categoryId,
      images,
      modelUrl,
      featured,
      bestSeller,
      published,
      features,
      tags,
      seoTitle,
      seoDescription,
      sellers,
      customerReviews,
      faqs,
    } = body;

    const updatedProduct = await db
      .update(products)
      .set({
        name,
        description,
        shortDescription,
        price,
        salePrice,
        sku,
        stock,
        categoryId,
        images: JSON.stringify(images),
        modelUrl,
        featured,
        bestSeller,
        published,
        features:JSON.stringify(features),
        tags: JSON.stringify(tags),
        seoTitle,
        seoDescription,
        updatedAt: new Date(),
        sellers:sellers,
        customerReviews:customerReviews,
        faqs:faqs,
      })
      .where(eq(products.id, id))
      .returning();

    return NextResponse.json(updatedProduct[0]);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: productsAdminProps) {
  try {
    const { id } = await params;
    const session = await auth();

    if (
      !session ||
      (session.user.role !== "admin" && session.user.role !== "super_admin")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.delete(products).where(eq(products.id, id));

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
