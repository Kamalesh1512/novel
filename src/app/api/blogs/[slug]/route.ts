import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { blogs, users } from "@/lib/db/schema";

interface blogsProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(request: NextRequest, { params }: blogsProps) {
  try {
    const { slug } = await params;

    const blog = await db
      .select({
        id: blogs.id,
        title: blogs.title,
        slug: blogs.slug,
        excerpt: blogs.excerpt,
        content: blogs.content,
        featuredImage: blogs.featuredImage,
        tags: blogs.tags,
        metaTitle: blogs.metaTitle,
        metaDescription: blogs.metaDescription,
        publishedAt: blogs.publishedAt,
        readTime: blogs.readTime,
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
      .where(eq(blogs.slug, slug))
      .limit(1);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
