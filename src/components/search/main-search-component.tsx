"use client";
import { useProductSearch } from "@/hooks/use-productsearch";
import useSearchStore from "@/store/searchStore";
import { useCallback, useEffect, useState } from "react";
import { SearchInput } from "./search-input";
import { SearchDropdown } from "./search-dropdown";
import { Category, ProductType } from "@/lib/constants/types";
import { useRouter } from "next/navigation";

interface SearchComponentProps {
  products?: ProductType[];
  categories?: Category[];
  onSearch?: (payload: {
    term: string;
    results: {
      products: ProductType[];
      categories: Category[];
      suggestions: { text: string; count: number }[];
    };
    filters: {
      categories: string[];
      availability: "all" | "inStock" | "outOfStock";
    };
  }) => void;
  initialSearchTerm?: string;
}

export const SearchComponent = ({
  products = [],
  categories = [],
  onSearch,
  initialSearchTerm = "",
}: SearchComponentProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [placeholder, setPlaceholder] = useState("");
  const router = useRouter()

  const searchStore = useSearchStore();
  const searchHook = useProductSearch(products, categories);

  // List of animated placeholders
  const rotatingPlaceholders = [
    "Search baby wipes...",
    "Search tissues...",
    "Search adult care...",
  ];

  // --- Typewriter Effect for Placeholder ---
  useEffect(() => {
    let wordIndex = 0;
    let charIndex = 0;
    let typingForward = true;

    const typewriter = setInterval(() => {
      const currentWord = rotatingPlaceholders[wordIndex];

      if (typingForward) {
        setPlaceholder(currentWord.slice(0, charIndex + 1));
        charIndex++;

        if (charIndex === currentWord.length) {
          typingForward = false;
          setTimeout(() => {}, 1200); // pause at end
        }
      } else {
        setPlaceholder(currentWord.slice(0, charIndex - 1));
        charIndex--;

        if (charIndex === 0) {
          typingForward = true;
          wordIndex = (wordIndex + 1) % rotatingPlaceholders.length;
        }
      }
    }, 100); // typing speed

    return () => clearInterval(typewriter);
  }, []);

  // Initialize with prop value
  useEffect(() => {
    if (initialSearchTerm) {
      searchHook.setSearchTerm(initialSearchTerm);
    }
  }, [initialSearchTerm]);

  // Handle search execution
  useEffect(() => {
    if (searchHook.debouncedSearchTerm && onSearch) {
      onSearch({
        term: searchHook.debouncedSearchTerm,
        results: searchHook.searchResults,
        filters: searchHook.selectedFilters,
      });
    }
  }, [searchHook.debouncedSearchTerm, searchHook.searchResults, onSearch]);

  const handleSelectSuggestion = useCallback(
    (suggestion: any) => {
      searchHook.setSearchTerm(suggestion);
      searchStore.addToSearchHistory(suggestion);
      setIsDropdownOpen(false);

      if (onSearch) {
        onSearch({
          term: suggestion,
          results: searchHook.searchResults,
          filters: searchHook.selectedFilters,
        });
      }
    },
    [searchHook.setSearchTerm, searchStore.addToSearchHistory, onSearch]
  );

  const handleClear = useCallback(() => {
    searchHook.setSearchTerm("");
    setIsDropdownOpen(false);
    router.push('/products')
  }, [searchHook.setSearchTerm]);

  return (
    <div className="relative w-full h-12">
      <SearchInput
        value={searchHook.searchTerm}
        onChange={searchHook.setSearchTerm}
        onFocus={() => setIsDropdownOpen(true)}
        onClear={handleClear}
        placeholder={placeholder || "Search..."}
        isLoading={searchHook.isSearching}
        onEnter={() => {
          if (onSearch) {
            onSearch({
              term: searchHook.searchTerm,
              results: searchHook.searchResults,
              filters: searchHook.selectedFilters,
            });
          }
          setIsDropdownOpen(false);
          searchStore.addToSearchHistory(searchHook.searchTerm);
        }}
      />

      <SearchDropdown
        isOpen={isDropdownOpen}
        searchResults={searchHook.searchResults}
        recentSearches={searchStore.recentSearches}
        trendingSearches={searchStore.trendingSearches}
        onSelectSuggestion={handleSelectSuggestion}
        onClearHistory={searchStore.clearSearchHistory}
        searchTerm={searchHook.searchTerm}
      />

      {/* Backdrop */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};
