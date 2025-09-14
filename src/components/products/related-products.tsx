"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight, Heart, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductType } from "@/lib/constants/types";
import Image from "next/image";
import Link from "next/link";

interface RelatedProductsProps {
  relatedProducts: ProductType[];
}

export default function RelatedProducts({
  relatedProducts,
}: RelatedProductsProps) {
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const router = useRouter();

  const handleProductClick = (product: ProductType) => {
    router.push(`/products/${product.sku}`);
  };

  const handleLikeToggle = (productSku: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productSku)) {
        newSet.delete(productSku);
      } else {
        newSet.add(productSku);
      }
      return newSet;
    });
  };

  const getUniqueSellerCount = (sellers: any[]) => {
    if (!sellers || !Array.isArray(sellers)) return 0;
    const uniqueSellerNames = new Set(sellers.map((seller) => seller.name));
    return uniqueSellerNames.size;
  };

  const calculateDiscountPercentage = (price: string, salePrice: string) => {
    const originalPrice = parseFloat(price);
    const discountedPrice = parseFloat(salePrice);
    if (originalPrice && discountedPrice && originalPrice > discountedPrice) {
      return Math.round(
        ((originalPrice - discountedPrice) / originalPrice) * 100
      );
    }
    return 0;
  };

  const renderProductCard = (product: ProductType, index: number) => {
    const discountPercentage =
      product.salePrice && product.price
        ? calculateDiscountPercentage(product.price, product.salePrice)
        : 0;
    const uniqueSellerCount = getUniqueSellerCount(product.sellers);
    const productImage = imageErrors.has(product.sku)
      ? "/placeholder-product.jpg"
      : product.images && product.images[0]
      ? product.images[0]
      : "/placeholder-product.jpg";

    return (
      <motion.div
        key={product.sku}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: index * 0.1,
          ease: "easeOut",
        }}
        whileHover={{
          y: -8,
          scale: 1.02,
          transition: { duration: 0.3 },
        }}
        className="flex flex-col rounded-2xl w-full bg-white shadow-lg relative cursor-pointer h-[380px] sm:h-[420px] group border border-gray-100 hover:shadow-xl transition-all duration-300"
        onClick={() => handleProductClick(product)}
      >
        {/* Image Container */}
        <div className="relative h-[160px] sm:h-[200px] flex items-center justify-center overflow-hidden rounded-t-2xl bg-transparent">
          {product.bestSeller && (
            <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10 shadow-md">
              Best Seller
            </div>
          )}

          {/* Like Button */}
          <button
            onClick={(e) => handleLikeToggle(product.sku, e)}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
              likedProducts.has(product.sku)
                ? "bg-red-500 text-white scale-110"
                : "bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white"
            }`}
          >
            <Heart
              className={`w-4 h-4 ${
                likedProducts.has(product.sku) ? "fill-current" : ""
              }`}
            />
          </button>

          <Image
            src={productImage}
            alt={product.name}
            fill
            className="object-contain transition-all duration-500 group-hover:scale-110"
            onError={() =>
              setImageErrors((prev) => new Set([...prev, product.sku]))
            }
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between p-3 sm:p-4 bg-gray-100 rounded-b-2xl h-[220px] sm:h-[220px]">
          <div className="flex flex-col space-y-1 sm:space-y-2 overflow-hidden">
            <div className="text-xs text-gray-600 uppercase tracking-wide truncate">
              {product.category?.name || "PRODUCT"}
            </div>

            <h3 className="text-gray-900 text-xs sm:text-sm font-semibold leading-tight line-clamp-2 group-hover:text-green-600 transition-colors duration-300">
              <Link
                href={`/products/${product.id}`}
                className="hover:text-green-600 transition-colors"
              >
                {product.name}
              </Link>
            </h3>

            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              {product.salePrice &&
              parseFloat(product.salePrice) > 0 ? (
                <>
                  <span className="font-bold text-green-600 text-sm sm:text-base">
                    ₹{product.salePrice}
                  </span>
                  {product.price &&
                    parseFloat(product.price) >
                      parseFloat(product.salePrice) && (
                      <span className="text-gray-500 text-xs line-through">
                        ₹{product.price}
                      </span>
                    )}
                  {discountPercentage && discountPercentage > 0 && (
                    <div className="bg-red-500 text-white px-1 sm:px-1.5 py-0.5 rounded-full text-xs font-bold shadow-md">
                      {discountPercentage}% OFF
                    </div>
                  )}
                </>
              ) : (
                product.price && (
                  <span className="font-bold text-gray-800 text-sm sm:text-base">
                    ₹{product.price}
                  </span>
                )
              )}
            </div>

            <p className="text-gray-500 text-xs leading-tight line-clamp-2 hidden sm:block">
              {product.shortDescription}
            </p>

            {product.customerReviews &&
              product.customerReviews.length > 0 && (
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => {
                      const rating =
                        product.customerReviews![0].averageRating;
                      const starValue = i + 1;

                      return (
                        <svg
                          key={i}
                          className={`w-3 h-3 ${
                            rating >= starValue
                              ? "text-yellow-400"
                              : rating >= starValue - 0.5
                              ? "text-yellow-300"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      );
                    })}
                  </div>
                  <span className="text-xs text-gray-700 font-medium">
                    {product.customerReviews[0].averageRating.toFixed(
                      1
                    )}
                  </span>
                  <span className="text-xs text-gray-500 hidden sm:inline">
                    (
                    {product.customerReviews[0].totalReviews >= 1000
                      ? `${(
                          product.customerReviews[0].totalReviews / 1000
                        ).toFixed(1)}k`
                      : product.customerReviews[0].totalReviews.toLocaleString()}{" "}
                    reviews)
                  </span>
                </div>
              )}
          </div>

          {/* Sellers Count Always Pinned to Bottom */}
          {uniqueSellerCount > 0 && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
              <div className="flex items-center text-sm text-gray-600">
                <Store className="w-4 h-4 mr-1" />
                Available at {uniqueSellerCount} store
                {uniqueSellerCount !== 1 ? "s" : ""}
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-300" />
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  if (!relatedProducts.length) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12">
      {/* Section Header */}
      <div className="text-center mb-6 sm:mb-10">
        <div>
          <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
            Related Products
          </h2>
        </div>
      </div>

      {/* Products Container */}
      <div className="relative">
        {/* Mobile: Horizontal scrolling */}
        <div className="block sm:hidden">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-3 px-3">
            {relatedProducts.map((product, index) => (
              <div key={product.sku} className="flex-none w-64">
                {renderProductCard(product, index)}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop/Tablet: Grid layout with vertical scroll */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-h-[600px] overflow-y-auto scrollbar-hide pr-2">
            {relatedProducts.map((product, index) => (
              renderProductCard(product, index)
            ))}
          </div>

          {/* Scroll Indicator - Only for desktop grid */}
          {relatedProducts.length > 4 && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}
        </div>

        {/* View All Button */}
        {relatedProducts.length >= 8 && (
          <div className="text-center mt-8">
            <Button
              variant="outline"
              className="px-8 py-3 border-2 hover:bg-green-50 hover:border-green-300 transition-colors duration-300"
              onClick={() => router.push("/products")}
            >
              View All Products
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}