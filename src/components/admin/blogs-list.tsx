"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { PlusIcon, EyeIcon, EditIcon, TrashIcon } from "lucide-react";
import LoadingScreen from "@/components/global/loading";
import { useSearchParams } from "next/navigation";

export default function BlogsList() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const status = searchParams.get("status") || undefined;

  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch(
        `/api/admin/blogs?page=${page}&status=${status || ""}`,
        {
          cache: "no-store",
        }
      );
      const data = await res.json();
      setBlogs(data.blogs);
      setLoading(false);
    }
    load();
  }, [page, status]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600">Manage your blog posts and content</p>
        </div>
        <Link
          href="/admin/blogs/create"
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Blog
        </Link>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <Link
          href="/admin/blogs"
          className={`px-4 py-2 rounded-lg transition-colors ${
            !status
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All
        </Link>
        <Link
          href="/admin/blogs?status=draft"
          className={`px-4 py-2 rounded-lg transition-colors ${
            status === "draft"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Drafts
        </Link>
        <Link
          href="/admin/blogs?status=published"
          className={`px-4 py-2 rounded-lg transition-colors ${
            status === "published"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Published
        </Link>
      </div>

      {/* Blogs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Published
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {blogs.map((blog) => (
              <tr key={blog.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {blog.title}
                        {blog.featured && (
                          <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{blog.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      blog.status === "published"
                        ? "bg-green-100 text-green-800"
                        : blog.status === "draft"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {blog.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {blog.author.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {blog.publishedAt
                    ? new Date(blog.publishedAt).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {blog.viewCount}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="text-green-600 hover:text-green-900"
                    target="_blank"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/admin/blogs/${blog.id}/edit`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <EditIcon className="w-4 h-4" />
                  </Link>
                  <button className="text-red-600 hover:text-red-900">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {blogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No blogs found</p>
            <Link
              href="/admin/blogs/create"
              className="mt-4 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Create Your First Blog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
