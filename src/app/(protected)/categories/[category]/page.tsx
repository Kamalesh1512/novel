"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { navigationItems } from "@/lib/constants/types";
import MainCategoryPage from "@/components/categories/main-category";
import { useProductStore } from "@/store/productStore";

function toSlug(name: string) {
  return name.toLowerCase().replace(/ /g, "-");
}

function getCategoryBanner(category: string): string {
  const banners: Record<string, string> = {
    "baby-care": "/images/banners/baby-care-banner.jpg",
    "adult-care": "/images/banners/adult-care-banner.jpg",
    "personal-care": "/images/banners/personal-care-banner.jpg",
    "outdoor-gear": "/images/banners/outdoor-gear-banner.jpg",
    "indoor-gear": "/images/banners/indoor-gear-banner.jpg",
    "nursing-feeding-essentials": "/images/banners/nursing-feeding-banner.jpg",
  };
  return banners[category] || "/images/banners/default-banner.jpg";
}

function getSubcategories(category: string): string[] {
  const categoryItem = navigationItems.find(
    (item) => toSlug(item.title) === category
  );
  return categoryItem?.items?.map((item) => item.title) || [];
}

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;

  const { products } = useProductStore();

  // Memoize filtering for performance
  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) => p.category && toSlug(p.category.name) === category
    );
  }, [products, category]);

  const subcategories = getSubcategories(category);
  const bannerImage = getCategoryBanner(category);

  return (
    <MainCategoryPage
      categoryName={category}
      products={filteredProducts}
      subcategories={subcategories}
      bannerImage={bannerImage}
    />
  );
}
