"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/global/upload-image";
import { toast } from "sonner";

const bannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  linkUrl: z.string().optional(),
  isActive: z.boolean(),
  priority: z.number().int(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  bannerType: z.enum(["general", "festival", "sale", "announcement","home","premium-perfumes","perfumes","shower-gels"]),
  imageUrl: z.string().url({ message: "Image is required" }),
});

type BannerFormData = z.infer<typeof bannerSchema>;

interface BannerFormProps {
  banner?: any;
  onSuccess: () => void;
}

export function BannerForm({ banner, onSuccess }: BannerFormProps) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>(banner?.imageUrl ? [banner.imageUrl] : []);

  const form = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: banner?.title || "",
      description: banner?.description || "",
      linkUrl: banner?.linkUrl || "",
      isActive: banner?.isActive ?? true,
      priority: banner?.priority || 0,
      startDate: banner?.startDate?.split("T")[0] || "",
      endDate: banner?.endDate?.split("T")[0] || "",
      bannerType: banner?.bannerType || "general",
      imageUrl: banner?.imageUrl || "",
    },
  });

  useEffect(() => {
    if (images.length > 0) {
      form.setValue("imageUrl", images[0]);
    }
  }, [images, form]);

  const onSubmit = async (data: BannerFormData) => {
    setLoading(true);
    try {
      const url = banner ? `/api/admin/banners/${banner.id}` : "/api/admin/banners";
      const method = banner ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success(banner ? "Banner updated" : "Banner created");
        onSuccess();
      } else {
        toast.error("Failed to save banner");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <FormLabel>Banner Image *</FormLabel>
          <ImageUpload
            images={images}
            setImages={(imgs) => setImages(imgs)}
            sourceFolderName="Banner_Images"
          />
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Summer Sale Banner" {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Optional description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="linkUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link URL</FormLabel>
              <FormControl>
                <Input placeholder="/home" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bannerType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banner Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="home">Home Page</SelectItem>
                  <SelectItem value="premium-perfumes">Premium Perfumes</SelectItem>
                  <SelectItem value="perfumes">Perfumes</SelectItem>
                  <SelectItem value="shower-gels">Shower-gels</SelectItem>
                  <SelectItem value="festival">Festival</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel>Active</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : banner ? "Update Banner" : "Create Banner"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
