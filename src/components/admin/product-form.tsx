"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useImageStore } from "@/store/imageStore";
import ImageUpload from "../global/upload-image";
import { useProductStore } from "@/store/productStore";
import { useRouter } from "next/navigation";
import { Category } from "@/lib/constants/types";
import { X, Plus } from "lucide-react";
import { ProductFormData, productSchema } from "@/lib/schema/productSchema";

interface ProductFormProps {
  product?: any;
  onSuccess: () => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const { clearImages } = useImageStore();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>(
    product?.images
      ? typeof product.images === "string"
        ? JSON.parse(product.images)
        : product.images
      : []
  );
  const [features, setFeatures] = useState<string[]>(
        product?.features
      ? typeof product.features === "string"
        ? JSON.parse(product.features)
        : product.features
      : []
  );
  const [newFeature, setNewFeature] = useState("");

  const router = useRouter();

  // Parse sellers from stringified JSON
  const parseSellers = (sellersData: any) => {
    if (!sellersData) return [];

    try {
      if (typeof sellersData === "string") {
        return JSON.parse(sellersData);
      }
      return Array.isArray(sellersData) ? sellersData : [];
    } catch (error) {
      console.error("Error parsing sellers:", error);
      return [];
    }
  };

  const sellers = parseSellers(product?.sellers);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      shortDescription: product?.shortDescription || "",
      sellers: Array.isArray(product?.sellers) ? product.sellers : [],
      size: product?.size || "",
      sku: product?.sku || "",
      stock: product?.stock || 0,
      categoryId: product?.categoryId || "",
      images: product?.images || "",
      modelUrl: product?.modelUrl || "",
      featured: product?.featured || false,
      bestSeller: product?.bestSeller || false,
      published: product?.published ?? true,
      seoTitle: product?.seoTitle || "",
      seoDescription: product?.seoDescription || "",
      weight: product?.weight || 0.0,
      features: Array.isArray(product?.features) ? product.features : [],

      // Parse sellers from stringified data
      amazonEnabled: sellers.some((s: any) => s.name === "Amazon") || false,
      amazonUrl: sellers.find((s: any) => s.name === "Amazon")?.url || "",
      meeshoEnabled: sellers.some((s: any) => s.name === "Meesho") || false,
      meeshoUrl: sellers.find((s: any) => s.name === "Meesho")?.url || "",
      flipkartEnabled: sellers.some((s: any) => s.name === "Flipkart") || false,
      flipkartUrl: sellers.find((s: any) => s.name === "Flipkart")?.url || "",
    },
  });

  console.log(form.formState.errors)

  const productId = product?.id || "new-product";

  // Handle features
  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      const updatedFeatures = [...features, newFeature.trim()];
      setFeatures(updatedFeatures);
      form.setValue("features", updatedFeatures);
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFeatures(updatedFeatures);
    form.setValue("features", updatedFeatures);
  };

  useEffect(() => {
    if (!product || !product.images) return;

    let parsedImages: string[] = [];

    if (Array.isArray(product.images)) {
      parsedImages = product.images.flatMap((img: any) => {
        try {
          const maybeParsed = JSON.parse(img);
          return Array.isArray(maybeParsed) ? maybeParsed : [img];
        } catch {
          return [img];
        }
      });
    } else if (typeof product.images === "string") {
      try {
        const maybeParsed = JSON.parse(product.images);
        parsedImages = Array.isArray(maybeParsed)
          ? maybeParsed
          : [product.images];
      } catch {
        parsedImages = [product.images];
      }
    }

    clearImages(productId);
    parsedImages.forEach((imgUrl: string) =>
      useImageStore.getState().addImage(productId, imgUrl)
    );
  }, [product, clearImages, productId]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      const url = product
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products";
      const method = product ? "PUT" : "POST";

      const sellers = [];
      if (data.amazonEnabled && data.amazonUrl?.trim()) {
        sellers.push({ name: "Amazon", url: data.amazonUrl.trim() });
      }
      if (data.meeshoEnabled && data.meeshoUrl?.trim()) {
        sellers.push({ name: "Meesho", url: data.meeshoUrl.trim() });
      }
      if (data.flipkartEnabled && data.flipkartUrl?.trim()) {
        sellers.push({ name: "Flipkart", url: data.flipkartUrl.trim() });
      }

      const payload = {
        ...data,
        images,
        sellers,
        features,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success("Success", {
          description: product
            ? "Product updated successfully"
            : "Product created successfully",
        });
        onSuccess();
        router.refresh();
      } else {
        toast.error("Error", {
          description: responseData.message || "Failed to save product",
        });
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Error", {
        description: "An unexpected error occurred while saving the product",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Product Images */}
        <div className="space-y-2">
          <FormLabel>Product Images</FormLabel>
          <ImageUpload images={images} setImages={setImages} />
        </div>

        {/* Basic Product Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input placeholder="PROD-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category: any) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter size (e.g., Large, 32GB)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : parseFloat(e.target.value)
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Descriptions */}
        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief product description"
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detailed product description"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Features Section */}
        <div className="space-y-4">
          <FormLabel>Product Features</FormLabel>
          <div className="flex gap-2">
            <Input
              placeholder="Add a feature..."
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFeature();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={addFeature}
              disabled={!newFeature.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {features.length > 0 && (
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                >
                  <span className="text-sm">{feature}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFeature(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3D Model */}
        <FormField
          control={form.control}
          name="modelUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>3D Model Path</FormLabel>
              <FormControl>
                <Input placeholder="Enter path of 3D model" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Seller Integrations */}
        <Card>
          <CardHeader>
            <CardTitle>Seller Integrations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Amazon */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="amazonEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between border p-3 rounded-lg">
                    <FormLabel>Amazon</FormLabel>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormItem>
                )}
              />

              {form.watch("amazonEnabled") && (
                <FormField
                  control={form.control}
                  name="amazonUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amazon Product URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://amazon.in/your-product"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Meesho */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="meeshoEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between border p-3 rounded-lg">
                    <FormLabel>Meesho</FormLabel>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormItem>
                )}
              />

              {form.watch("meeshoEnabled") && (
                <FormField
                  control={form.control}
                  name="meeshoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meesho Product URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://meesho.com/your-product"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Flipkart */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="flipkartEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between border p-3 rounded-lg">
                    <FormLabel>Flipkart</FormLabel>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormItem>
                )}
              />

              {form.watch("flipkartEnabled") && (
                <FormField
                  control={form.control}
                  name="flipkartUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Flipkart Product URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://flipkart.com/your-product"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* SEO Section */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="seoTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO Title</FormLabel>
                  <FormControl>
                    <Input placeholder="SEO optimized title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seoDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="SEO meta description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Product Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Product Settings</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between gap-4 p-4 border rounded-lg">
                  <div>
                    <FormLabel className="text-base">
                      Featured Product
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bestSeller"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between gap-4 p-4 border rounded-lg">
                  <div>
                    <FormLabel className="text-base">Best Seller</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between gap-4 p-4 border rounded-lg">
                  <div>
                    <FormLabel className="text-base">Published</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading
              ? "Saving..."
              : product
              ? "Update Product"
              : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
