"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Star,
  Grid,
  List,
  Heart,
  ShoppingBag,
  ArrowLeft,
  SlidersHorizontal,
  Filter,
  X,
  ChevronDown,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { UserHeader } from "@/components/user/user-header";
import { Category, ProductType } from "@/lib/constants/types";
import { useProductStore } from "@/store/productStore";
import { useRouter } from "next/navigation";
import { useAdvancedProductFilter } from "@/hooks/use-advancedproductfilter";
import { FilterSidebar } from "@/components/products/product-filter-sidebar";
import { SearchComponent } from "@/components/search/main-search-component";
import ProductCard from "@/components/products/product-card";

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { products } = useProductStore();

  const categories: Category[] = Array.from(
    new Map(
      products
        .filter((p) => p.category)
        .map((p) => [p.category!.id, p.category!])
    ).values()
  );

  const {
    searchTerm,
    selectedCategory,
    availability,
    sortBy,
    filteredProducts,
    searchSuggestions,
    updateSearchParams,
    totalResults,
  } = useAdvancedProductFilter(products, categories);

  // Handle filter changes
  const handleFilterChange = (type: string, value: string) => {
    updateSearchParams({ [type]: value });
    if (window.innerWidth < 1024) {
      setIsFilterOpen(false);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    router.push("/products");
  };

  // Check if any filters are active
  const hasActiveFilters =
    searchTerm ||
    selectedCategory !== "All" ||
    availability !== "all" ||
    sortBy !== "relevance";

  const options = [
    { value: "relevance", label: "Relevance" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
    { value: "newest", label: "Newest First" },
    { value: "rating", label: "Highest Rated" },
    { value: "popularity", label: "Most Popular" },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Button */}
      <div className="mb-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/home')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          {searchTerm ? `Search Results for "${searchTerm}"` : "Our Products"}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {searchTerm
            ? `Found ${totalResults} products matching your search`
            : "Discover our complete collection of perfumes, each crafted with care and precision"}
        </p>
      </motion.div>



      {/* Active Filters & Results Count */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Filters Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                {totalResults} product{totalResults !== 1 ? "s" : ""}
                {selectedCategory !== "All" && ` in ${selectedCategory}`}
              </span>

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex items-center gap-2">
                  {searchTerm && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      Search: {searchTerm}
                      <button
                        onClick={() => updateSearchParams({ q: "" })}
                        className="ml-1 hover:bg-gray-300 rounded"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {selectedCategory !== "All" && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {selectedCategory}
                      <Button
                        onClick={() => updateSearchParams({ category: "All" })}
                        className="ml-1 hover:bg-gray-300 rounded"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-red-600 hover:text-red-700"
                  >
                    Clear All
                  </Button>
                </div>
              )}
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Products Grid */}
          <AnimatePresence>
            {totalResults > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
              >
                {filteredProducts.map((product:ProductType, index:number) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ProductCard product={product} index={index} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Filter className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-500 mb-8">
                    {searchTerm
                      ? `No products match "${searchTerm}". Try adjusting your search or filters.`
                      : "Try adjusting your filters to see more products."}
                  </p>
                  <Button onClick={clearAllFilters}>Clear All Filters</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block">
          <div className="w-64 bg-white rounded-lg border p-6 sticky top-24">
            <h3 className="text-lg font-semibold mb-6">Filters</h3>

            {/* Categories */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Categories</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value="All"
                    checked={selectedCategory === "All"}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                    className="mr-2"
                  />
                  All ({products?.length || 0})
                </label>
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category.id}
                      checked={selectedCategory === category.id}
                      onChange={(e) =>
                        handleFilterChange("category", e.target.value)
                      }
                      className="mr-2"
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            </div>

            
            <div className="mb-6">
              <h4 className="font-medium mb-3">Sort By</h4>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {options.find((o) => o.value === sortBy)?.label ||
                      "Select option"}
                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  {options.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => handleFilterChange("sort", option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        availability={availability}
        sortBy={sortBy}
        onFilterChange={handleFilterChange}
        totalProducts={products?.length || 0}
      />
    </div>
  );
}
