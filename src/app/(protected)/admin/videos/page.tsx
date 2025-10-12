"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Video, Play, Pause } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { VideoBannerForm } from "@/components/admin/video-form";


interface VideoBanner {
  id: string;
  title: string;
  description?: string;
  linkUrl?: string;
  videoUrl: string;
  videoType: string;
  isActive: boolean;
  priority: number;
  startDate?: string;
  endDate?: string;
  autoPlay: boolean;
  loop: boolean;
  muted: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function VideoManager() {
  const [videos, setVideos] = useState<VideoBanner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoBanner | null>(null);
  const [deletingVideo, setDeletingVideo] = useState<VideoBanner | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/admin/video");
      if (!res.ok) throw new Error("Failed to fetch videos");
      const data = await res.json();
      setVideos(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch videos");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/video/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete video");
      toast.success("Video deleted successfully");
      await fetchVideos();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete video");
    } finally {
      setIsDeleting(false);
      setDeletingVideo(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-semibold">Video Banners</h2>
        <Button
          variant="premium"
          size="sm"
          onClick={() => {
            setEditingVideo(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline sm:ml-2">Add Video</span>
        </Button>
      </div>

      {/* Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-white border rounded-lg shadow-sm overflow-hidden"
          >
            {/* Video Preview */}
            <div className="relative aspect-video bg-black">
              <video
                src={video.videoUrl}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                autoPlay={false}
              />
              {!video.isActive && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Pause className="w-10 h-10 text-white opacity-80" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-2 text-sm sm:text-base">
              <div className="flex justify-between items-center gap-2">
                <h3 className="font-medium text-base sm:text-lg truncate">
                  {video.title}
                </h3>
                <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground whitespace-nowrap">
                  {video.videoType}
                </span>
              </div>

              {video.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {video.description}
                </p>
              )}

              <div className="flex justify-between items-center text-xs flex-wrap gap-1">
                <span>Priority: {video.priority}</span>
                <span>{video.isActive ? "Active" : "Inactive"}</span>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditingVideo(video);
                    setIsModalOpen(true);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeletingVideo(video)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingVideo}
        onOpenChange={() => setDeletingVideo(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Video</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. You are about to permanently delete
              “{deletingVideo?.title}”.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingVideo && handleDelete(deletingVideo.id)}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Form Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {editingVideo ? "Edit Video Banner" : "Create Video Banner"}
            </DialogTitle>
          </DialogHeader>

          <VideoBannerForm
            video={editingVideo ?? undefined}
            onSuccess={() => {
              setIsModalOpen(false);
              setEditingVideo(null);
              fetchVideos();
            }}
          />
          <DialogFooter />
        </DialogContent>
      </Dialog>
    </div>
  );
}

