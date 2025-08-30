// app/api/admin/blogs/route.ts - Admin endpoint to create and list blogs
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // Your database connection

import { eq, desc, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { blogs, users } from "@/lib/db/schema";

// GET - List all blogs (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (
      !session ||
      (session.user.role !== "admin" && session.user.role !== "super_admin")
    ) {
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
        total: blogList.length, // Ideally run a `count()` query
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

// POST - Create new blog (admin only)
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
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      tags,
      metaTitle,
      metaDescription,
      status = "draft",
      publishedAt,
      readTime,
      featured = false,
    } = body;

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 }
      );
    }

    // Create the blog
    const newBlog = await db
      .insert(blogs)
      .values({
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        tags: tags ? JSON.stringify(tags) : null,
        metaTitle,
        metaDescription,
        status,
        publishedAt: status === "published" ? publishedAt || new Date() : null,
        authorId: session.user.id,
        readTime,
        featured,
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(
      { message: "Blog created successfully", blog: newBlog[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating blog:", error);
    if (error) {
      // Unique constraint violation (slug already exists)
      return NextResponse.json(
        { error: "A blog with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
