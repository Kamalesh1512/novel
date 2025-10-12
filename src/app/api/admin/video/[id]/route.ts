//api/admin/video/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { video } from "@/lib/db/schema";


interface ParamsProps {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await db
      .update(video)
      .set({
        ...body,
        updatedAt: new Date(),
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
      })
      .where(eq(video.id, id))
      .returning();

    if (!updated.length)
      return NextResponse.json({ error: "Video banner not found" }, { status: 404 });

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating video:", error);
    return NextResponse.json({ error: "Failed to update video" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params;

    const deleted = await db
      .delete(video)
      .where(eq(video.id, id))
      .returning();

    if (!deleted.length)
      return NextResponse.json({ error: "Video banner not found" }, { status: 404 });

    return NextResponse.json({ message: "Video banner deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  }
}
