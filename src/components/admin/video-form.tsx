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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import VideoUpload from "@/components/global/upload-video";
import { toast } from "sonner";
import { VideoFormData, videoSchema } from "@/lib/schema/videoschema";

interface VideoFormProps {
  video?: any;
  onSuccess: () => void;
}

export function VideoBannerForm({ video, onSuccess }: VideoFormProps) {
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<string[]>(
    video?.videoUrl ? [video.videoUrl] : []
  );

  const form = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: video?.title || "",
      description: video?.description || "",
      linkUrl: video?.linkUrl || "",
      isActive: video?.isActive ?? true,
      priority: video?.priority || 0,
      startDate: video?.startDate?.split("T")[0] || "",
      endDate: video?.endDate?.split("T")[0] || "",
      videoType: video?.videoType || "general",
      videoUrl: video?.videoUrl || "",
      autoPlay: video?.autoPlay ?? false,
      loop: video?.loop ?? true,
      muted: video?.muted ?? true,
    },
  });

  useEffect(() => {
    if (videos.length > 0) {
      form.setValue("videoUrl", videos[0]);
    }
  }, [videos, form]);

  const onSubmit = async (data: VideoFormData) => {
    setLoading(true);
    try {
      const url = video ? `/api/admin/video/${video.id}` : "/api/admin/video";
      const method = video ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success(video ? "Video banner updated" : "Video banner created");
        onSuccess();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to save video banner");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Video Upload */}
        <div className="space-y-2">
          <FormLabel>Banner Video *</FormLabel>
          <VideoUpload
            videos={videos}
            setVideos={setVideos}
            sourceFolderName="Banner_Videos"
            maxSizeMB={100}
            maxVideos={1}
          />
          <p className="text-xs text-gray-500">
            Upload a video for your banner. Max size: 100MB
          </p>
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Summer Sale Video Banner" {...field} />
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
                <Input placeholder="/products/summer-collection" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="videoType"
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
                  <SelectItem value="festival">Festival</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="product-specific">
                    Product Banner
                  </SelectItem>
                  <SelectItem value="categories">All Categories</SelectItem>
                  <SelectItem value="baby-care">Baby Care</SelectItem>
                  <SelectItem value="personal-care">Personal Care</SelectItem>
                  <SelectItem value="adult-care">Adult Care</SelectItem>
                  <SelectItem value="indoor-gear">Indoor Gear</SelectItem>
                  <SelectItem value="outdoor-gear">Outdoor Gear</SelectItem>
                  <SelectItem value="nursing-feeding">
                    Nursing Feeding
                  </SelectItem>
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

        {/* Video Playback Settings */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-sm font-semibold">Video Playback Settings</h3>

          <FormField
            control={form.control}
            name="autoPlay"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Auto Play</FormLabel>
                  <p className="text-xs text-gray-500">
                    Start playing video automatically
                  </p>
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
            name="loop"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Loop</FormLabel>
                  <p className="text-xs text-gray-500">
                    Replay video continuously
                  </p>
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
            name="muted"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Muted</FormLabel>
                  <p className="text-xs text-gray-500">
                    Start with sound muted (recommended for autoplay)
                  </p>
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
        </div>

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Active</FormLabel>
                <p className="text-xs text-gray-500">
                  Make this banner visible to users
                </p>
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

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || videos.length === 0}>
            {loading
              ? "Saving..."
              : video
              ? "Update Video Banner"
              : "Create Video Banner"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
