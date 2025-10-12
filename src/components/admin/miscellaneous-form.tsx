// components/admin/miscellaneous-form.tsx

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  MiscellaneousFormData,
  miscellaneousSchema,
} from "@/lib/schema/miscellaneousSchema";

interface MiscellaneousFormProps {
  miscellaneous?: any;
  onSuccess: () => void;
}

export function MiscellaneousForm({
  miscellaneous,
  onSuccess,
}: MiscellaneousFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<MiscellaneousFormData>({
    resolver: zodResolver(miscellaneousSchema),
    defaultValues: {
      title: miscellaneous?.title || "",
      content: miscellaneous?.content || "",
      isActive: miscellaneous?.isActive ?? true,
      priority: miscellaneous?.priority || 0,
      startDate: miscellaneous?.startDate?.split("T")[0] || "",
      endDate: miscellaneous?.endDate?.split("T")[0] || "",
    },
  });

  const onSubmit = async (data: MiscellaneousFormData) => {
    setLoading(true);
    try {
      const url = miscellaneous
        ? `/api/admin/miscellaneous/${miscellaneous.id}`
        : "/api/admin/miscellaneous";
      const method = miscellaneous ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success(
          miscellaneous
            ? "Miscellaneous entry updated"
            : "Miscellaneous entry created"
        );
        onSuccess();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to save miscellaneous entry");
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
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input placeholder="Enter title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content (HTML) *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter HTML content..."
                  className="min-h-[200px] font-mono text-sm"
                  {...field}
                />
              </FormControl>
              <p className="text-xs text-gray-500">
                You can use HTML tags for rich formatting. This content will be
                rendered as HTML on the frontend.
              </p>
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

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Active</FormLabel>
                <p className="text-xs text-gray-500">
                  Make this entry visible to users
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
          <Button type="submit" disabled={loading}>
            {loading
              ? "Saving..."
              : miscellaneous
              ? "Update Entry"
              : "Create Entry"}
          </Button>
        </div>
      </form>
    </Form>
  );
}