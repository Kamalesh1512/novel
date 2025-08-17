// app/api/admin/categories/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

interface configProps {
  params: Promise<{
    id: string;
  }>;
}

// DELETE /api/admin/categories/:id
export async function DELETE(req: NextRequest, { params }: configProps) {
  try {
    const {id} = await params;

    // Check if category exists
    const existing = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Delete the category
    await db.delete(categories).where(eq(categories.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}


// PUT /api/admin/categories/:id
export async function PUT(req: NextRequest, { params }: configProps) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { name, slug, description, image } = body;

    // Check if category exists
    const existing = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Perform the update
    await db
      .update(categories)
      .set({ name,description })
      .where(eq(categories.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}
