//api/admin/video
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { desc } from "drizzle-orm";
import { video } from "@/lib/db/schema";


export async function GET() {
  try {
    const allVideos = await db
      .select()
      .from(video)
      .orderBy(desc(video.priority), desc(video.createdAt));

    return NextResponse.json(allVideos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      title,
      description,
      linkUrl,
      videoUrl,
      videoType,
      isActive,
      priority,
      startDate,
      endDate,
      autoPlay,
      loop,
      muted,
    } = body;

    const newVideo = await db
      .insert(video)
      .values({
        title,
        description,
        linkUrl,
        videoUrl,
        videoType: videoType ?? "general",
        isActive: isActive ?? true,
        priority: priority ?? 0,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        autoPlay: autoPlay ?? false,
        loop: loop ?? true,
        muted: muted ?? true,
      })
      .returning();

    return NextResponse.json(newVideo[0], { status: 201 });
  } catch (error) {
    console.error("Error creating video banner:", error);
    return NextResponse.json({ error: "Failed to create video banner" }, { status: 500 });
  }
}
