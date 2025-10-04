// app/categories/[category]/[subcategory]/page.tsx
"use client";

import { useMemo, useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import dynamic from "next/dynamic";

import { useProductStore } from "@/store/productStore";
import { navigationItems } from "@/lib/constants/types";
import LoadingScreen from "@/components/global/loading";

import SubcategoryPage from "@/components/categories/sub-category";

function toSubCatSlug(name: string): string {
  return name.toLowerCase().replace(/ /g, "");
}

function toCatSlug(name: string): string {
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

function validateCategorySubcategory(
  category: string,
  subcategory: string
): boolean {
  try {
    const categoryItem = navigationItems.find((item) => {
      const slug =
        item.title === "Nursing & Feeding Essentials"
          ? "nursing-feeding"
          : toCatSlug(item.title);

      return slug === category;
    });

    if (!categoryItem) {
      console.warn(`Category not found: ${category}`);
      return false;
    }

    const hasSubcategory = categoryItem.items?.some(
      (item) => toSubCatSlug(item.title) === subcategory
    );

    if (!hasSubcategory) {
      console.warn(
        `Subcategory not found: ${subcategory} in category: ${category}`
      );
    }

    return hasSubcategory || false;
  } catch (error) {
    console.error("Error validating category/subcategory:", error);
    return false;
  }
}

export default function SubcategoryComponent() {
  const params = useParams();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  const category = params.category as string;
  const subcategory = params.subcategory as string;

  console.log("From params", category);
  console.log("From params", subcategory);

  const { products } = useProductStore();

  // Validate params on mount
  useEffect(() => {
    if (category && subcategory) {
      const valid = validateCategorySubcategory(category, subcategory);
      setIsValid(valid);
      setIsValidating(false);

      if (!valid) {
        console.error(`Invalid route: /categories/${category}/${subcategory}`);
      }
    }
  }, [category, subcategory]);

  // Filter products with error handling
  const filteredProducts = useMemo(() => {
    if (!isValid || !products?.length) return [];

    try {
      return products.filter((p) => {
        if (!p.sku || typeof p.sku !== "string") {
          console.warn("Product missing or invalid SKU:", p);
          return false;
        }

        const parts = p.sku.split("-");
        if (parts.length < 4) {
          console.warn("Invalid SKU format:", p.sku);
          return false;
        }

        const catSlug = `${parts[1]}-${parts[2]}`;
        const subcatSlug = parts[3];

        const matches = catSlug === category && subcatSlug === subcategory;

        if (matches) {
          console.log("Product matched:", {
            sku: p.sku,
            catSlug,
            subcatSlug,
            targetCategory: category,
            targetSubcategory: subcategory,
          });
        }

        return matches;
      });
    } catch (error) {
      console.error("Error filtering products:", error);
      return [];
    }
  }, [products, category, subcategory, isValid]);

  // Handle loading states
  if (isValidating) {
    return <LoadingScreen description="" />;
  }

  // Handle validation errors
  if (!isValid) {
    notFound();
  }

  // Handle product loading errors
  if (!products) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Error Loading Products
          </h1>
          <p className="text-red-500 mb-4">
            {"Unable to load products at this time."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const bannerImage = getCategoryBanner(category);

  return (
    <div suppressHydrationWarning>
      <SubcategoryPage
        mainCategory={category}
        subcategory={subcategory}
        products={filteredProducts}
        bannerImage={bannerImage}
      />
    </div>
  );
}
