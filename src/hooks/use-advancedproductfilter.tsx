'use client'
import { useMemo } from "react";
import { useSearchFromUrl } from "./use-searchfromurl";
import { Category, ProductType } from "@/lib/constants/types";


export const useAdvancedProductFilter = (products:ProductType[], categories:Category[]) => {
  const { 
    searchTerm, 
    selectedCategory, 
    availability, 
    sortBy,
    updateSearchParams 
  } = useSearchFromUrl();

  // Filter products based on all criteria
  const filteredProducts = useMemo(() => {
    let filtered = [...(products || [])];

    // Search term filtering
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(product => {
        return (
          product.name.toLowerCase().includes(term) ||
          product.description?.toLowerCase().includes(term) ||
          product.category?.name.toLowerCase().includes(term) ||
          product.tags?.some(tag => tag.toLowerCase().includes(term))
        );
      });
    }

    // Category filtering
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => 
        product.category?.name === selectedCategory ||
        product.category?.id === selectedCategory
      );
    }

    // Availability filtering
    if (availability !== 'all') {
      filtered = filtered.filter(product => {
        switch (availability) {
          case 'inStock':
            return product.stock > 0;
          case 'outOfStock':
            return product.stock === 0;
          case 'lowStock':
            return product.stock > 0 && product.stock <= 5;
          default:
            return true;
        }
      });
    }

    // Sorting
    filtered.sort((a:any, b:any) => {
      switch (sortBy) {
        case 'price-asc':
          return (a.price || 0) - (b.price || 0);
        case 'price-desc':
          return (b.price || 0) - (a.price || 0);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'popularity':
          return (b.sales || 0) - (a.sales || 0);
        default: // relevance
          return 0;
      }
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, availability, sortBy]);

  // Search suggestions based on current filters
  const searchSuggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const suggestions:any[] = [];
    const term = searchTerm.toLowerCase();

    // Add matching categories
    (categories || []).forEach(cat => {
      if (cat.name.toLowerCase().includes(term)) {
        suggestions.push({
          type: 'category',
          text: cat.name,
          count: products?.filter(p => p.category?.name === cat.name).length || 0
        });
      }
    });

    // Add matching brands
    // const brands = [...new Set((products || []).map(p => p.brand).filter(Boolean))];
    // brands.forEach(brand => {
    //   if (brand.toLowerCase().includes(term)) {
    //     suggestions.push({
    //       type: 'brand',
    //       text: brand,
    //       count: products?.filter(p => p.brand === brand).length || 0
    //     });
    //   }
    // });

    return suggestions.slice(0, 5);
  }, [searchTerm, products, categories]);

  return {
    searchTerm,
    selectedCategory,
    availability,
    sortBy,
    filteredProducts,
    searchSuggestions,
    updateSearchParams,
    totalResults: filteredProducts.length
  };
};