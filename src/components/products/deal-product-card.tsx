"use client";
import { Heart } from "lucide-react";
import { Button } from "../ui/button";
import { ProductType } from "@/lib/constants/types";
import Image from "next/image";

interface DealProductCardProps {
  product: ProductType;
  index: number;
  hoveredCard: number | null;
  setHoveredCard: (index: number | null) => void;
  favorites: Set<string>;
  toggleFavorite: (productId: string) => void;
  isLoading: boolean;
  handleProductClick: (sku: string) => void;
  handleSellerClick: (url: string, event: React.MouseEvent) => void;
  platformConfig: any;
  isMobile?: boolean;
}

export const DealProductCard: React.FC<DealProductCardProps> = ({
  product,
  index,
  hoveredCard,
  setHoveredCard,
  favorites,
  toggleFavorite,
  isLoading,
  handleProductClick,
  handleSellerClick,
  platformConfig,
  isMobile = false,
}) => {
  // Filter sellers to only show those with "Steal Deals" offer
  const stealDealSellers = product.sellers.filter(
    (seller) => seller.offer === "Steal Deals"
  );

  // Calculate discount percentage if both price and salePrice exist
  const discountPercentage =
    product.price && product.salePrice
      ? Math.round(
          ((parseFloat(product.price) - parseFloat(product.salePrice)) /
            parseFloat(product.price)) *
            100
        )
      : null;
  return (
    <div
      className={`group relative bg-transparent rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer ${
        isMobile ? "w-56 h-[420px]" : "w-72 h-[550px]"
      } flex flex-col`}
      onMouseEnter={() => !isMobile && setHoveredCard(index)}
      onMouseLeave={() => !isMobile && setHoveredCard(null)}
      onClick={() => handleProductClick(product.sku)}
    >
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(product.id);
        }}
        disabled={isLoading}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-md disabled:opacity-50"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            favorites.has(product.id)
              ? "fill-red-500 text-red-500"
              : "text-gray-400 hover:text-red-500"
          }`}
        />
      </button>

      {/* Best Seller Badge */}
      {product.bestSeller && (
        <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10 shadow-md">
          Best Seller
        </div>
      )}

      {/* Image Container - 60% height */}
      <div className="relative flex-shrink-0 h-[60%] overflow-hidden">
        <Image
          src={product.images[0] || "/api/placeholder/300/300"}
          alt={product.name}
          fill
          className="w-full h-full object-contain transition-transform duration-300"
        />
      </div>

      {/* Product Info & Platforms - 40% height */}
      <div className="flex flex-col flex-1 min-h-0 p-3 h-[40%] overflow-hidden">
        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 text-xs md:text-sm leading-tight line-clamp-2 group-hover:text-green-600 transition-colors mb-1">
          {product.name}
        </h3>

        {/* Price & Discount */}
        <div className="flex items-center gap-1 flex-wrap mb-1 text-xs">
          {product.salePrice && parseFloat(product.salePrice) > 0 ? (
            <>
              <span className="font-bold text-green-600 text-sm">
                ₹{product.salePrice}
              </span>
              {product.price &&
                parseFloat(product.price) > parseFloat(product.salePrice) && (
                  <span className="text-gray-500 line-through text-xs">
                    ₹{product.price}
                  </span>
                )}
              {discountPercentage && discountPercentage > 0 && (
                <div className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold shadow-md">
                  {discountPercentage}% OFF
                </div>
              )}
            </>
          ) : (
            product.price && (
              <span className="font-bold text-gray-800 text-sm">
                ₹{product.price}
              </span>
            )
          )}
        </div>

        {/* Short Description */}
        {product.shortDescription && (
          <p className="text-gray-500 text-xs leading-tight">
            {product.shortDescription?.split(".")[0]}.
          </p>
        )}

        {/* Rating */}
        {product.customerReviews && product.customerReviews.length > 0 && (
          <div className="flex items-center gap-1 mb-1 text-xs text-gray-500">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => {
                const rating = product.customerReviews![0].averageRating;
                const starValue = i + 1;
                return (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
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
            <span className="ml-1 font-medium text-gray-700">
              {product.customerReviews[0].averageRating.toFixed(1)}
            </span>
            <span className="ml-1">
              (
              {product.customerReviews[0].totalReviews >= 1000
                ? `${(product.customerReviews[0].totalReviews / 1000).toFixed(
                    1
                  )}k`
                : product.customerReviews[0].totalReviews.toLocaleString()}{" "}
              reviews)
            </span>
          </div>
        )}

        {/* Available Platforms / Steal Deals */}
        <div className="overflow-hidden">
          {stealDealSellers.length > 0 ? (
            <div className="space-y-1">
              <p className="text-xs text-gray-600 font-medium">Shop now:</p>
              <div className="flex flex-col gap-1">
                {stealDealSellers.map((seller, sellerIndex) => {
                  const platformKey = seller.name.toLowerCase();
                  const platform =
                    platformConfig[platformKey as keyof typeof platformConfig];
                  if (!platform) return null;

                  return (
                    <Button
                      key={sellerIndex}
                      onClick={(e) => handleSellerClick(seller.url, e)}
                      className="flex items-center justify-between bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-900 hover:to-green-600 transition-all duration-200 transform hover:scale-105 rounded-lg px-1 py-0.5 text-xs min-h-[24px]"
                      variant="default"
                    >
                      <div className="flex items-center gap-1">
                        <img
                          src={platform.logoSrc}
                          alt={`${platform.name} logo`}
                          className="object-contain w-3.5 h-3.5 flex-shrink-0"
                        />
                        <span className="font-medium truncate text-xs">
                          {platform.name}
                        </span>
                      </div>
                      {seller.variant && (
                        <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full flex-shrink-0 ml-1">
                          {seller.variant}
                        </span>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-1">
              <p className="text-xs text-gray-500 italic">
                No steal deals currently available
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pulse animation for featured deals */}
      {product.featured && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 rounded-xl bg-green-500/5 animate-pulse"></div>
        </div>
      )}
    </div>
  );
};
