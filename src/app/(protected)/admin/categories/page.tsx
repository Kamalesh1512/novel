"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, Plus, Search, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import AlertDialogBox from "@/components/global/alert-dialog";
import { categorySchema } from "@/lib/schema/categoryInputSchema";
import { toast } from "sonner";
import { LoadingScreen } from "@/components/global/loading";

interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  productCount: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDeleteId, setOpenDeleteId] = useState<string | null>(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  // Shared dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      // console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setErrors({});
    setEditingCategory(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    setErrors({});
    const result = categorySchema.safeParse(formData);
    if (!result.success) {
      const flattened = result.error.flatten().fieldErrors;
      setErrors({
        name: flattened.name?.[0],
        description: flattened.description?.[0],
      });
      return;
    }

    try {
      const res = await fetch(
        `/api/admin/categories${
          editingCategory ? `/${editingCategory.id}` : ""
        }`,
        {
          method: editingCategory ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result.data),
        }
      );

      if (res.ok) {
        setIsDialogOpen(false);
        resetForm();
        fetchCategories();
        toast.success(editingCategory ? "Category updated" : "Category added", {
          description: editingCategory
            ? "Updated successfully!"
            : "Added successfully!",
        });
      } else {
        const errData = await res.json();
        toast.error(`Error: ${errData.error}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(`Request failed`);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    setDeleteLoadingId(id);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchCategories();
      } else {
        const errData = await res.json();
        toast.error(`Delete failed: ${errData.error}`);
      }
    } catch (error) {
      toast.error(`Delete failed due to network error`);
    } finally {
      setDeleteLoadingId(null);
      setOpenDeleteId(null);
    }
  };

  if (loading)
    return (
      <LoadingScreen description="Categories"/>
    );

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6 p-2 sm:p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        </div>
        <Button
          onClick={openAddDialog}
          variant={"premium"}
          size="sm"
          className="sm:size-default"
        >
          <Plus className="h-4 w-4" />{" "}
          <span className="hidden sm:inline sm:ml-2">Add Category</span>
        </Button>
      </div>

      {/* Shared Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update category details."
                : "Create a new product category for your store."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Premium Perfumes"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveCategory}>
                {editingCategory ? "Save Changes" : "Add Category"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Categories table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Categories</CardTitle>
          <CardDescription>
            Manage categories for perfumes, deodorants, and body care products.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative flex-1 max-w-sm mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories
                .filter(
                  (c) =>
                    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    c.description
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase())
                )
                .map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {category.description || "No description"}
                    </TableCell>
                    <TableCell>{category.productCount} products</TableCell>
                    <TableCell>
                      {new Date(category.createdAt).toLocaleDateString("en-IN")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => openEditDialog(category)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit category
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialogBox
                            open={openDeleteId === category.id}
                            handleOpen={() =>
                              setOpenDeleteId(
                                openDeleteId === category.id
                                  ? null
                                  : category.id
                              )
                            }
                            description={`Delete "${category.name}"? This cannot be undone.`}
                            onClick={() => handleDeleteCategory(category.id)}
                            loading={deleteLoadingId === category.id}
                          >
                            <DropdownMenuItem
                              className="text-red-600"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                              category
                            </DropdownMenuItem>
                          </AlertDialogBox>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
