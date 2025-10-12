// components/admin/miscellaneous-manager.tsx

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, FileText } from "lucide-react";
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
import { MiscellaneousForm } from "@/components/admin/miscellaneous-form";

interface Miscellaneous {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  priority: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export default function MiscellaneousManager() {
  const [miscellaneous, setMiscellaneous] = useState<Miscellaneous[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMisc, setEditingMisc] = useState<Miscellaneous | null>(null);
  const [deletingMisc, setDeletingMisc] = useState<Miscellaneous | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewMisc, setPreviewMisc] = useState<Miscellaneous | null>(null);

  useEffect(() => {
    fetchMiscellaneous();
  }, []);

  const fetchMiscellaneous = async () => {
    try {
      const res = await fetch("/api/admin/miscellaneous");
      if (!res.ok) throw new Error("Failed to fetch miscellaneous entries");
      const data = await res.json();
      setMiscellaneous(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch miscellaneous entries");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/miscellaneous/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete entry");
      toast.success("Entry deleted successfully");
      await fetchMiscellaneous();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete entry");
    } finally {
      setIsDeleting(false);
      setDeletingMisc(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-semibold">Miscellaneous Content</h2>
        <Button
          variant="premium"
          size="sm"
          onClick={() => {
            setEditingMisc(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline sm:ml-2">Add Entry</span>
        </Button>
      </div>

      {/* Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {miscellaneous.map((misc) => (
          <div
            key={misc.id}
            className="bg-white border rounded-lg shadow-sm overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-base sm:text-lg truncate">
                    {misc.title}
                  </h3>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        misc.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {misc.isActive ? "Active" : "Inactive"}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                      Priority: {misc.priority}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Preview */}
            <div className="p-4 space-y-3">
              <div className="text-sm text-muted-foreground">
                <div
                  className="line-clamp-3 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: misc.content.substring(0, 150) + "...",
                  }}
                />
              </div>

              {(misc.startDate || misc.endDate) && (
                <div className="text-xs text-gray-500 space-y-1">
                  {misc.startDate && (
                    <div>
                      Start: {new Date(misc.startDate).toLocaleDateString()}
                    </div>
                  )}
                  {misc.endDate && (
                    <div>
                      End: {new Date(misc.endDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMisc(misc)}
                >
                  Preview
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingMisc(misc);
                      setIsModalOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingMisc(misc)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {miscellaneous.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No miscellaneous entries yet. Create your first one!</p>
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewMisc} onOpenChange={() => setPreviewMisc(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewMisc?.title}</DialogTitle>
          </DialogHeader>
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: previewMisc?.content || "" }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingMisc}
        onOpenChange={() => setDeletingMisc(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Entry</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. You are about to permanently delete
              "{deletingMisc?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingMisc && handleDelete(deletingMisc.id)}
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
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {editingMisc ? "Edit Entry" : "Create New Entry"}
            </DialogTitle>
          </DialogHeader>

          <MiscellaneousForm
            miscellaneous={editingMisc ?? undefined}
            onSuccess={() => {
              setIsModalOpen(false);
              setEditingMisc(null);
              fetchMiscellaneous();
            }}
          />
          <DialogFooter />
        </DialogContent>
      </Dialog>
    </div>
  );
}