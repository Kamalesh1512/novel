// app/api/blogs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // Your database connection

import { eq, desc, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { blogs, users } from "@/lib/db/schema";

// GET - List all blogs (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user.role) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const offset = (page - 1) * limit;

    // build where conditions
    const conditions = [];
    if (status) {
      conditions.push(eq(blogs.status, status));
    }

    const blogList = await db
      .select({
        id: blogs.id,
        title: blogs.title,
        slug: blogs.slug,
        excerpt: blogs.excerpt,
        status: blogs.status,
        publishedAt: blogs.publishedAt,
        createdAt: blogs.createdAt,
        updatedAt: blogs.updatedAt,
        viewCount: blogs.viewCount,
        featured: blogs.featured,
        featuredImage:blogs.featuredImage,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(blogs)
      .leftJoin(users, eq(blogs.authorId, users.id))
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(blogs.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      blogs: blogList,
      pagination: {
        page,
        limit,
        total: blogList.length,
      },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
