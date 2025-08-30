"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Eye } from "lucide-react";
import Link from "next/link";
import {
  Button,
} from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ImageUpload from "@/components/global/upload-image";

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  status: "draft" | "published";
  featured: boolean;
  readTime: string;
}

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    tags: [],
    metaTitle: "",
    metaDescription: "",
    status: "draft",
    featured: false,
    readTime: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    async function loadBlog() {
      try {
        const response = await fetch(`/api/admin/blogs/${params.id}`);
        if (!response.ok) throw new Error("Failed to load blog");
        const blog = await response.json();
        
        setFormData({
          title: blog.title || "",
          slug: blog.slug || "",
          excerpt: blog.excerpt || "",
          content: blog.content || "",
          featuredImage: blog.featuredImage || "",
          tags: blog.tags || [],
          metaTitle: blog.metaTitle || "",
          metaDescription: blog.metaDescription || "",
          status: blog.status || "draft",
          featured: blog.featured || false,
          readTime: blog.readTime || "",
        });
        
        if (blog.featuredImage) {
          setImages([blog.featuredImage]);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load blog");
        router.push("/admin/blogs");
      } finally {
        setLoading(false);
      }
    }
    
    if (params.id) {
      loadBlog();
    }
  }, [params.id, router]);

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
      metaTitle: title,
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleSubmit = async (
    e: React.FormEvent,
    status: "draft" | "published"
  ) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/blogs/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...formData, 
          status,
          featuredImage: images[0] || formData.featuredImage
        }),
      });
      if (!response.ok) throw new Error("Failed to update blog");
      router.push("/admin/blogs");
    } catch (err) {
      console.error(err);
      alert("Failed to update blog");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading blog...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/blogs"
              className="flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blogs
            </Link>
            <h1 className="text-2xl font-bold">Edit Blog</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={(e) => handleSubmit(e, "draft")}
              disabled={isLoading}
            >
              <Save className="w-4 h-4 mr-2" /> Save Draft
            </Button>
            <Button
              onClick={(e) => handleSubmit(e, "published")}
              disabled={isLoading}
            >
              <Eye className="w-4 h-4 mr-2" /> Publish
            </Button>
          </div>
        </div>

        <form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div>
                  <Label>Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter blog title"
                    required
                  />
                </div>

                <div>
                  <Label>Slug *</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="blog-url-slug"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    URL: /blogs/{formData.slug}
                  </p>
                </div>

                <div>
                  <Label>Excerpt</Label>
                  <Textarea
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    placeholder="Brief description of the blog"
                  />
                </div>

                <div>
                  <Label>Content *</Label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={15}
                    placeholder="Write your blog content here..."
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports HTML formatting
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Meta Title</Label>
                  <Input
                    value={formData.metaTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, metaTitle: e.target.value })
                    }
                    placeholder="SEO title"
                  />
                </div>

                <div>
                  <Label>Meta Description</Label>
                  <Textarea
                    value={formData.metaDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        metaDescription: e.target.value,
                      })
                    }
                    placeholder="SEO description"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  images={images}
                  setImages={setImages}
                  sourceFolderName="Blog_Images"
                />
                {/* Fallback URL input */}
                <div className="mt-4">
                  <Label>Or enter image URL</Label>
                  <Input
                    type="url"
                    value={formData.featuredImage}
                    onChange={(e) =>
                      setFormData({ ...formData, featuredImage: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="Add tag"
                  />
                  <Button type="button" onClick={addTag}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Read Time</Label>
                  <Input
                    value={formData.readTime}
                    onChange={(e) =>
                      setFormData({ ...formData, readTime: e.target.value })
                    }
                    placeholder="e.g., 5 min read"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, featured: Boolean(checked) })
                    }
                  />
                  <Label htmlFor="featured">Mark as Featured</Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}