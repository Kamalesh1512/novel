"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  TagIcon,
  ArrowLeftIcon,
  EyeIcon,
} from "lucide-react";
import LoadingScreen from "@/components/global/loading";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  tags: string;
  metaTitle: string;
  metaDescription: string;
  publishedAt: string;
  readTime: string;
  viewCount: string;
  author: {
    name: string;
    image: string;
  };
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  tags: string;
  publishedAt: string;
  readTime: string;
  viewCount: string;
  featured: boolean;
  author: {
    name: string;
    image: string;
  };
}

export default function BlogPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlog() {
      try {
        setLoading(true);
        // Fetch the main blog
        const res = await fetch(`/api/blogs/${slug}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Blog not found");
        const data = await res.json();
        setBlog(data[0]);

        // Fetch related blogs (exclude current slug)
        const relatedRes = await fetch(`/api/blogs?limit=3`, {
          cache: "no-store",
        });
        if (relatedRes.ok) {
          const relatedData = await relatedRes.json();
          const filtered = relatedData.blogs.filter(
            (b: Blog) => b.slug !== slug
          );
          setRelatedBlogs(filtered);
        }
      } catch (err) {
        console.error(err);
        router.push("/blogs");
      } finally {
        setLoading(false);
      }
    }
    loadBlog();
  }, [slug, router]);

  console.log(blog)

  if (loading)
    return <div className="text-center py-12 text-gray-500"><LoadingScreen description=""/></div>;
  if (!blog) return null;

  const tags = blog.tags ? JSON.parse(blog.tags) : [];

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <div className="mb-8">
        <Link
          href="/blogs"
          className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Blogs
        </Link>
      </div>

      {/* Header */}
      <header className="mb-12">
        <div className="mb-6">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full"
                >
                  <TagIcon className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="text-xl text-gray-600 leading-relaxed">
              {blog.excerpt}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-6 text-gray-500 border-b border-gray-200 pb-6">
          <div className="flex items-center">
            {blog.author?.image && (
              <Image
                src={blog.author.image}
                alt={blog.author.name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full mr-3"
              />
            )}
            <div>
              <p className="font-medium text-gray-900">{blog.author?.name}</p>
              <p className="text-sm">Author</p>
            </div>
          </div>

          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2" />
            {new Date(blog.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          {blog.readTime && (
            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-2" />
              {blog.readTime}
            </div>
          )}

          <div className="flex items-center">
            <EyeIcon className="w-4 h-4 mr-2" />
            {blog.viewCount} views
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {blog.featuredImage && (
        <div className="mb-12">
          <Image
            src={blog.featuredImage}
            alt={blog.title}
            width={800}
            height={400}
            className="w-full h-64 md:h-96 object-contain border-none bg-none"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg max-w-none mb-16">
        <div
          dangerouslySetInnerHTML={{ __html: blog.content }}
          className="prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-green-600 prose-strong:text-gray-900"
        />
      </div>

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <div className="border-t border-gray-200 pt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Related Articles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedBlogs.map((relatedBlog) => (
              <article key={relatedBlog.id} className="group">
                {relatedBlog.featuredImage && (
                  <div className="mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={relatedBlog.featuredImage}
                      alt={relatedBlog.title}
                      width={300}
                      height={200}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                  <Link href={`/blogs/${relatedBlog.slug}`}>
                    {relatedBlog.title}
                  </Link>
                </h4>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {relatedBlog.excerpt}
                </p>
              </article>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
