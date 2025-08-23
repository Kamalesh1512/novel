'use client'
import { useRouter, useSearchParams } from "next/navigation";

export const useSearchFromUrl = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchTerm = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || 'All';
  const availability = searchParams.get('availability') || 'all';
  const sortBy = searchParams.get('sort') || 'relevance';

  const updateSearchParams = (updates: Record<string, string>) => {
    const current = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== '' && value !== 'All' && value !== 'all') {
        current.set(key, value);
      } else {
        current.delete(key);
      }
    });

    router.push(`/products?${current.toString()}`, { scroll: false });
  };

  return {
    searchTerm,
    selectedCategory,
    availability,
    sortBy,
    updateSearchParams
  };
};