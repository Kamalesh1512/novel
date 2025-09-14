"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ImageCarousel } from "@/components/global/image-carousel";
import { useProductStore } from "@/store/productStore";
import { shallow } from "zustand/shallow";
import { ProductType } from "@/lib/constants/types";
import { LoadingScreen } from "@/components/global/loading";

interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  stock: number;
  images?: string[];
  featured: boolean;
  published: boolean;
  createdAt: string;
}

export default function AdminProducts() {
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(
    null
  );
  const { products, setProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products");
      const data = await response.json();
      setProducts(data);
      console.log("Inside Admin", products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  if (loading) {
    return <LoadingScreen description="products" />;
  }

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6 p-2 sm:p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Products
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage your product catalog
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setSelectedProduct(false)}
              variant={"premium"}
              size="sm"
              className="sm:size-default"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline sm:ml-2">Add Product</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-2xl sm:w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            <ProductForm
              product={null}
              onSuccess={() => {
                setIsFormOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="sm:hidden space-y-4">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-lg shadow flex flex-col space-y-3"
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 h-20 w-20 rounded-md overflow-hidden items-center">
                  {product?.images?.length > 0 ? (
                    <ImageCarousel images={product.images} alt={product.name} />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-gray-500">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{product.name}</p>
                  {product.featured && (
                    <Badge variant="premium" className="sm:size-default">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex justify-between text-sm text-gray-700">
                <div>
                  <p className="text-xs font-medium">Stock</p>
                  <Badge
                    variant={product.stock > 0 ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {product.stock}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-medium">Status</p>
                  <Badge
                    variant={product.published ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {product.published ? "Published" : "Draft"}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingProduct(product)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the product.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">No products found.</p>
        )}
      </div>

      {/* Products Table  in large device*/}
      <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(products) && products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16">
                          {product?.images && product.images.length > 0 ? (
                            <div className="h-16 w-16 rounded-md overflow-hidden">
                              <ImageCarousel
                                images={product.images}
                                alt={product.name}
                              />
                            </div>
                          ) : (
                            <div className="h-16 w-16 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded-md">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {product.name}
                          </div>
                          <div className="flex space-x-2 mt-1">
                            {product.featured && (
                              <Badge variant="premium" className="text-xs">
                                Steal deals
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        {/* Best Seller Badge */}
                        {product.sku && (
                          <div className="text-black px-2 py-1 text-xs font-bold z-10">
                            {product.sku}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 space-x-1">
                      <Badge
                        variant={product.published ? "default" : "secondary"}
                      >
                        {product.published ? "Published" : "Draft"}
                      </Badge>
                      {/* Best Seller Badge */}
                      {product.bestSeller && (
                        <Badge className="bg-green-500 text-white rounded-full text-xs">
                          Best Seller
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the product.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(product.id)}
                                className="bg-red-500"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Single Edit Dialog (outside table) */}
      <Dialog
        open={!!editingProduct}
        onOpenChange={(open) => {
          if (!open) setEditingProduct(null);
        }}
      >
        <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-2xl sm:w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              product={editingProduct}
              onSuccess={() => {
                setEditingProduct(null);
                fetchProducts();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
