"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { BannerForm } from "@/components/admin/banner-form";
import AlertDialogBox from "@/components/global/alert-dialog";
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

interface Banner {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
  priority: number;
  startDate?: string;
  endDate?: string;
  bannerType: string;
  createdAt: string;
  updatedAt: string;
}

const BannerManager = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deletingBanner, setDeletingBanner] = useState<Banner | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/admin/banners");
      const data = await res.json();
      setBanners(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
      fetchBanners();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleActive = async (banner: Banner) => {
    await fetch(`/api/admin/banners/${banner.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...banner, isActive: !banner.isActive }),
    });
    fetchBanners();
  };

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6 p-2 sm:p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-semibold">Banners</h2>
        <Button
          variant={"premium"}
          size="sm"
          className="sm:size-default"
          onClick={() => {
            setEditingBanner(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />{" "}
          <span className="hidden sm:inline sm:ml-2">Add Banner</span>
        </Button>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="bg-white border rounded-lg shadow-sm overflow-hidden"
          >
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-40 sm:h-48 object-cover rounded-t-lg"
            />
            <div className="p-4 space-y-2 text-sm sm:text-base">
              <div className="flex justify-between items-center gap-2">
                <h3 className="font-medium text-base sm:text-lg truncate">
                  {banner.title}
                </h3>
                <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground whitespace-nowrap">
                  {banner.bannerType}
                </span>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 break-words">
                {banner.description}
              </p>

              <div className="flex justify-between items-center text-xs flex-wrap gap-1">
                <span className="truncate">Priority: {banner.priority}</span>
                <span className="truncate">
                  {banner.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditingBanner(banner);
                    setIsModalOpen(true);
                  }}
                  className="w-8 h-8"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeletingBanner(banner)}
                  className="w-8 h-8"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!deletingBanner}
          onOpenChange={() => setDeletingBanner(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete this banner?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                banner "{deletingBanner?.title}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  if (!deletingBanner) return;
                  setIsDeleting(true);
                  try {
                    await fetch(`/api/admin/banners/${deletingBanner.id}`, {
                      method: "DELETE",
                    });
                    await fetchBanners();
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setIsDeleting(false);
                    setDeletingBanner(null);
                  }
                }}
                className="bg-red-500 hover:bg-red-600"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {editingBanner ? "Edit Banner" : "Create Banner"}
            </DialogTitle>
          </DialogHeader>

          <BannerForm
            banner={editingBanner ?? undefined}
            onSuccess={() => {
              setIsModalOpen(false);
              setEditingBanner(null);
              fetchBanners();
            }}
          />
          <DialogFooter />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BannerManager;
