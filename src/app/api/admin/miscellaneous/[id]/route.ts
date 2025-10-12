// api/admin/miscellaneous/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { miscellaneous } from "@/lib/db/schema";

interface ParamsProps {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await db
      .update(miscellaneous)
      .set({
        ...body,
        updatedAt: new Date(),
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
      })
      .where(eq(miscellaneous.id, id))
      .returning();

    if (!updated.length)
      return NextResponse.json(
        { error: "Miscellaneous entry not found" },
        { status: 404 }
      );

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating miscellaneous entry:", error);
    return NextResponse.json(
      { error: "Failed to update miscellaneous entry" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params;

    const deleted = await db
      .delete(miscellaneous)
      .where(eq(miscellaneous.id, id))
      .returning();

    if (!deleted.length)
      return NextResponse.json(
        { error: "Miscellaneous entry not found" },
        { status: 404 }
      );

    return NextResponse.json({
      message: "Miscellaneous entry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting miscellaneous entry:", error);
    return NextResponse.json(
      { error: "Failed to delete miscellaneous entry" },
      { status: 500 }
    );
  }
}