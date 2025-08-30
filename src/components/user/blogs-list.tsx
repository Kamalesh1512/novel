// app/blogs/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarIcon, ClockIcon, UserIcon, TagIcon } from "lucide-react";

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

interface Pagination {
  page: number;
  limit: number;
  hasMore: boolean;
}

export default function BlogsList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [page, setPage] = useState(1);
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    hasMore: false,
  });

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "12",
        });
        if (featured) params.append("featured", "true");

        const res = await fetch(`/api/blogs?${params}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch blogs");

        const data = await res.json();
        setBlogs(data.blogs);
        setPagination(data.pagination);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page, featured]);

  console.log(blogs)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover insights, tips, and stories from our team
        </p>
      </div>

      {/* Filters */}
      <div className="flex justify-center space-x-4 mb-12">
        <button
          onClick={() => {
            setFeatured(false);
            setPage(1);
          }}
          className={`px-6 py-2 rounded-full transition-colors ${
            !featured
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All Posts
        </button>
        <button
          onClick={() => {
            setFeatured(true);
            setPage(1);
          }}
          className={`px-6 py-2 rounded-full transition-colors ${
            featured
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Featured
        </button>
      </div>

      {/* Loader */}
      {loading && (
        <div className="text-center py-12 text-gray-500">Loading blogs...</div>
      )}

      {/* Blog Grid */}
      {!loading && blogs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {blog.featuredImage && (
                <div className="relative h-48">
                  <Image
                    src={blog.featuredImage}
                    alt={blog.title}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {blog.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                        Featured
                      </span>
                    </div>
                  )}
                </div>
              )}
              <div className="p-6">
                {blog.tags && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {JSON.parse(blog.tags).slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className="inline-flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full"
                      >
                        <TagIcon className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="hover:text-green-600 transition-colors"
                  >
                    {blog.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {blog.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      {blog.author.image && (
                        <Image
                          src={blog.author.image}
                          alt={blog.author.name}
                          width={20}
                          height={20}
                          className="w-5 h-5 rounded-full mr-2"
                        />
                      )}
                      {blog.author.name}
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      {new Date(blog.publishedAt).toLocaleDateString()}
                    </div>
                  </div>
                  {blog.readTime && (
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {blog.readTime}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && blogs.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No blogs found
          </h3>
          <p className="text-gray-500">Check back later for new content!</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.hasMore && !loading && (
        <div className="text-center mt-12">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Load More Posts
          </button>
        </div>
      )}
    </div>
  );
}
