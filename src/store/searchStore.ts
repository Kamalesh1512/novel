// store/searchStore.ts - Zustand store for search functionality
import { ProductType } from "@/lib/constants/types";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchFilters {
  categories: string[];
  priceRange: [number, number] | null;
  availability: "all" | "inStock" | "outOfStock" | "lowStock";
  rating: number | null;
  brands: string[];
  sortBy:
    | "relevance"
    | "price-asc"
    | "price-desc"
    | "name-asc"
    | "name-desc"
    | "newest"
    | "rating"
    | "popularity";
}

interface SearchState {
  // Search term
  searchTerm: string;
  debouncedSearchTerm: string;

  // Search history
  searchHistory: string[];
  recentSearches: string[];
  trendingSearches: string[];

  // Filters
  filters: SearchFilters;

  // Results
  searchResults: {
    products: any[];
    categories: any[];
    suggestions: any[];
    total: number;
    loading: boolean;
  };

  // Actions
  setSearchTerm: (term: string) => void;
  setDebouncedSearchTerm: (term: string) => void;
  addToSearchHistory: (term: string) => void;
  clearSearchHistory: () => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  setSearchResults: (results: any) => void;
  setLoading: (loading: boolean) => void;

  // Search execution
  executeSearch: (products: any[], categories: any[]) => void;
}

const getEffectivePrice = (product: ProductType) => {
  return  product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
};

const defaultFilters: SearchFilters = {
  categories: [],
  priceRange: null,
  availability: "all",
  rating: null,
  brands: [],
  sortBy: "relevance",
};

const defaultTrendingSearches = [
  "baby care",
  "baby wipes",
  "adult care",
  "refreshing wipes",
];

// Enhanced search logic
const performSearch = (
  searchTerm: string,
  filters: SearchFilters,
  products: any[] = [],
  categories: any[] = []
) => {
  const term = searchTerm.toLowerCase().trim();

  // Filter products
  let filteredProducts = products.filter((product) => {
    // Text search
    const matchesSearch =
      !term ||
      product.name.toLowerCase().includes(term) ||
      product.description?.toLowerCase().includes(term) ||
      product.category?.name.toLowerCase().includes(term) ||
      product.brand?.toLowerCase().includes(term) ||
      product.tags?.some((tag: string) => tag.toLowerCase().includes(term)) ||
      product.sku?.toLowerCase().includes(term);

    // Category filter
    const matchesCategory =
      filters.categories.length === 0 ||
      filters.categories.some(
        (cat) => product.category?.name === cat || product.category?.id === cat
      );

    // Availability filter
    const matchesAvailability =
      filters.availability === "all" ||
      (filters.availability === "inStock" && product.stock > 0) ||
      (filters.availability === "outOfStock" && product.stock === 0) ||
      (filters.availability === "lowStock" &&
        product.stock > 0 &&
        product.stock <= 5);

    // Price range filter
    const matchesPrice =
      !filters.priceRange ||
      (product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]);

    // Rating filter
    const matchesRating =
      !filters.rating || (product.rating && product.rating >= filters.rating);

    // Brand filter
    const matchesBrand =
      filters.brands.length === 0 || filters.brands.includes(product.brand);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesAvailability &&
      matchesPrice &&
      matchesRating &&
      matchesBrand
    );
  });

  // Sort products
  filteredProducts.sort((a, b) => {
    switch (filters.sortBy) {
      case "price-asc":
        return getEffectivePrice(a) - getEffectivePrice(b);
      case "price-desc":
        return getEffectivePrice(b) - getEffectivePrice(a);
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "newest":
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "popularity":
        return (b.sales || b.views || 0) - (a.sales || a.views || 0);
      case "relevance":
      default:
        // Simple relevance scoring
        const getRelevanceScore = (product: any) => {
          let score = 0;
          const productText = `${product.name} ${product.description || ""} ${
            product.category?.name || ""
          }`.toLowerCase();

          if (term) {
            // Exact match in name gets highest score
            if (product.name.toLowerCase() === term) score += 100;
            else if (product.name.toLowerCase().includes(term)) score += 50;

            // Category match
            if (product.category?.name.toLowerCase().includes(term))
              score += 30;

            // Description match
            if (product.description?.toLowerCase().includes(term)) score += 20;

            // Tag matches
            product.tags?.forEach((tag: string) => {
              if (tag.toLowerCase().includes(term)) score += 10;
            });

            // Brand match
            if (product.brand?.toLowerCase().includes(term)) score += 25;
          }

          // Boost popular/high-rated products
          score += (product.rating || 0) * 5;
          score += Math.log10((product.sales || 0) + 1) * 10;

          return score;
        };

        return getRelevanceScore(b) - getRelevanceScore(a);
    }
  });

  // Filter categories
  const filteredCategories = term
    ? categories.filter(
        (category) =>
          category.name.toLowerCase().includes(term) ||
          category.description?.toLowerCase().includes(term)
      )
    : [];

  // Generate suggestions
  const suggestions: any[] = [];

  if (term) {
    // Category suggestions
    filteredCategories.forEach((cat) => {
      suggestions.push({
        type: "category",
        text: cat.name,
        count: products.filter((p) => p.category?.name === cat.name).length,
        icon: "folder",
      });
    });

    // Brand suggestions
    const matchingBrands = [
      ...new Set(
        products
          .filter((p) => p.brand?.toLowerCase().includes(term))
          .map((p) => p.brand)
      ),
    ].slice(0, 3);

    matchingBrands.forEach((brand) => {
      suggestions.push({
        type: "brand",
        text: brand,
        count: products.filter((p) => p.brand === brand).length,
        icon: "tag",
      });
    });

    // Product name suggestions
    const productSuggestions = [
      ...new Set(
        filteredProducts
          .filter((p) => p.name.toLowerCase().includes(term))
          .map((p) => p.name)
          .slice(0, 5)
      ),
    ];

    productSuggestions.forEach((name) => {
      suggestions.push({
        type: "product",
        text: name,
        count: 1,
        icon: "search",
      });
    });
  }

  return {
    products: filteredProducts,
    categories: filteredCategories,
    suggestions: suggestions.slice(0, 8),
    total: filteredProducts.length,
  };
};

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      // Initial state
      searchTerm: "",
      debouncedSearchTerm: "",
      searchHistory: [],
      recentSearches: [],
      trendingSearches: defaultTrendingSearches,
      filters: defaultFilters,
      searchResults: {
        products: [],
        categories: [],
        suggestions: [],
        total: 0,
        loading: false,
      },

      // Actions
      setSearchTerm: (term: string) => {
        set({ searchTerm: term });
      },

      setDebouncedSearchTerm: (term: string) => {
        set({ debouncedSearchTerm: term });
        // Auto-execute search when debounced term changes
        const state = get();
        if (term !== state.searchTerm) {
          // This prevents infinite loops
          return;
        }
      },

      addToSearchHistory: (term: string) => {
        if (!term.trim()) return;

        const normalizedTerm = term.trim();
        set((state) => {
          // Remove if exists, then add to front
          const filteredHistory = state.searchHistory.filter(
            (item) => item.toLowerCase() !== normalizedTerm.toLowerCase()
          );
          const filteredRecent = state.recentSearches.filter(
            (item) => item.toLowerCase() !== normalizedTerm.toLowerCase()
          );

          return {
            searchHistory: [normalizedTerm, ...filteredHistory].slice(0, 50),
            recentSearches: [normalizedTerm, ...filteredRecent].slice(0, 10),
          };
        });
      },

      clearSearchHistory: () => {
        set({
          searchHistory: [],
          recentSearches: [],
        });
      },

      setFilters: (newFilters: Partial<SearchFilters>) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }));
      },

      resetFilters: () => {
        set({ filters: defaultFilters });
      },

      setSearchResults: (results: any) => {
        set((state) => ({
          searchResults: { ...state.searchResults, ...results },
        }));
      },

      setLoading: (loading: boolean) => {
        set((state) => ({
          searchResults: { ...state.searchResults, loading },
        }));
      },

      executeSearch: (products: any[] = [], categories: any[] = []) => {
        const state = get();
        set((current) => ({
          searchResults: { ...current.searchResults, loading: true },
        }));

        // Simulate async operation (replace with actual API call if needed)
        setTimeout(() => {
          const results = performSearch(
            state.debouncedSearchTerm,
            state.filters,
            products,
            categories
          );

          set({
            searchResults: {
              ...results,
              loading: false,
            },
          });
        }, 100);
      },
    }),
    {
      name: "search-store",
      // Only persist search history and trending searches
      partialize: (state) => ({
        searchHistory: state.searchHistory,
        recentSearches: state.recentSearches,
        trendingSearches: state.trendingSearches,
      }),
    }
  )
);

export default useSearchStore;
