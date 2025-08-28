"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { platformConfig, ProductType } from "@/lib/constants/types";
import { DealProductCard } from "../products/deal-product-card";
import { Button } from "../ui/button";
import LoadingScreen from "../global/loading";

interface SubcategoryPageProps {
  mainCategory: string;
  subcategory: string;
  products: ProductType[];
  bannerImage: string;
}

const formatName = (slug: string): string => {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

export default function SubcategoryPage({
  mainCategory,
  subcategory,
  products,
  bannerImage,
}: SubcategoryPageProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load wishlist data
  useEffect(() => {
    const loadWishlist = async () => {
      if (!session?.user?.id || !isMounted) return;
      try {
        const response = await fetch(`/api/wishlist/${session.user.id}`, { cache: "no-store" });
        if (response.ok) {
          const wishlistItems = await response.json();
          setFavorites(new Set(wishlistItems.map((item: any) => item.productId)));
        }
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      }
    };
    loadWishlist();
  }, [session?.user?.id, isMounted]);

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin");
  }, [status, router]);

  if (status === "loading" || !isMounted) return <LoadingScreen description="Loading..." />;
  if (!session?.user) return null;

  const toggleFavorite = async (productId: string) => {
    if (!session.user.id) {
      router.push("/auth/signin");
      return;
    }
    if (isLoading) return;

    setIsLoading(true);
    const wasInFavorites = favorites.has(productId);
    const newFavorites = new Set(favorites);
    wasInFavorites ? newFavorites.delete(productId) : newFavorites.add(productId);
    setFavorites(newFavorites);

    try {
      const endpoint = wasInFavorites ? "/api/wishlist/remove" : "/api/wishlist/add";
      const method = wasInFavorites ? "DELETE" : "POST";
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, productId }),
      });
      if (!response.ok) throw new Error("Wishlist operation failed");
    } catch (error) {
      console.error("Wishlist operation failed:", error);
      const revertedFavorites = new Set(favorites);
      wasInFavorites ? revertedFavorites.add(productId) : revertedFavorites.delete(productId);
      setFavorites(revertedFavorites);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = (sku: string) => router.push(`/products/${sku}`);
  const handleSellerClick = (url: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-200 to-green-50">
      {/* Hero Section */}
      <div ref={heroRef} className="relative h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bannerImage})` }}
          role="img"
          aria-label={`${formatName(subcategory)} category banner`}
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-white/90 text-sm mb-4" aria-label="Breadcrumb">
                <Link href="/" className="hover:text-white transition-colors px-1">Home</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href={`/categories/${mainCategory}`} className="hover:text-white transition-colors px-1">
                  {formatName(mainCategory)}
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white">{formatName(subcategory)}</span>
              </nav>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
                {formatName(subcategory)}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 mt-5 relative z-10">
        {/* Back Link */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link
            href={`/categories/${mainCategory}`}
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors group bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to {formatName(mainCategory)} Collection
          </Link>
        </motion.div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <motion.div className="grid gap-6 mb-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            {products.map((product, index) => (
              <DealProductCard
                key={`${product.id}-${index}`}
                product={product}
                index={index}
                hoveredCard={hoveredCard}
                setHoveredCard={setHoveredCard}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                isLoading={isLoading}
                handleProductClick={handleProductClick}
                handleSellerClick={handleSellerClick}
                platformConfig={platformConfig}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div className="text-center py-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            🔍 <h3 className="text-2xl font-bold text-gray-700 mb-2">No products found</h3>
          </motion.div>
        )}
      </div>
    </div>
  );
}

