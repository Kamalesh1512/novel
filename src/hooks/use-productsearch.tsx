'use client'
import { useMemo, useState } from "react";
import { useDebounce } from "./use-debounce";
import { Category, ProductType } from "@/lib/constants/types";



interface SelectedFilters {
  categories: string[];
  availability: "all" | "inStock" | "outOfStock";
  priceRange: null;
}

// Enhanced Search Hook
export const useProductSearch = (products: ProductType[] = [], categories: Category[] = []) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    categories: [],
    priceRange: null,
    availability: "all",
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 600);

  const searchResults = useMemo(() => {
    if (
      !debouncedSearchTerm.trim() &&
      selectedFilters.categories.length === 0
    ) {
      return {
        products: products || [],
        categories,
        suggestions: [],
      };
    }

    const term = debouncedSearchTerm.toLowerCase().trim();

    // Search products
    const filteredProducts = (products || []).filter((product) => {
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term) ||
        product.category?.name?.toLowerCase().includes(term) || // safe with ?
        product.tags?.some((tag) => tag.toLowerCase().includes(term));

      const matchesCategory =
        selectedFilters.categories.length === 0 ||
        (product.category?.name !== undefined &&
          selectedFilters.categories.includes(product.category.name));

      const matchesAvailability =
        selectedFilters.availability === "all" ||
        (selectedFilters.availability === "inStock" && product.stock > 0) ||
        (selectedFilters.availability === "outOfStock" && product.stock === 0);

      return matchesSearch && matchesCategory && matchesAvailability;
    });

    // Search categories
    const filteredCategories = term
      ? (categories || []).filter(
          (category) =>
            category.name.toLowerCase().includes(term) ||
            category.description?.toLowerCase().includes(term)
        )
      : [];

    // Generate suggestions
    const suggestions: any[] = [];
    if (term) {
      // Add category suggestions
      filteredCategories.forEach((cat) => {
        suggestions.push({
          type: "category",
          text: cat.name,
          count: (products || []).filter((p) => p.category?.name === cat.name)
            .length,
        });
      });

      // Add product name suggestions
      const uniqueNames = [
        ...new Set(filteredProducts.map((p) => p.name).slice(0, 5)),
      ];
      uniqueNames.forEach((name) => {
        if (name.toLowerCase().includes(term)) {
          suggestions.push({
            type: "product",
            text: name,
            count: 1,
          });
        }
      });
    }

    return {
      products: filteredProducts,
      categories: filteredCategories,
      suggestions: suggestions.slice(0, 8),
    };
  }, [debouncedSearchTerm, selectedFilters, products, categories]);

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    selectedFilters,
    setSelectedFilters,
    searchResults,
    isSearching: searchTerm !== debouncedSearchTerm,
  };
};
