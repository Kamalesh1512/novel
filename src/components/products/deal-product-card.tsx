import { Heart } from "lucide-react";
import { Button } from "../ui/button";
import { ProductType } from "@/lib/constants/types";

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
  const sellers = product.sellers;

  return (
    <div
      className={`group relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer max-w-xs ${
        hoveredCard === index && !isMobile ? "scale-105" : ""
      } ${isMobile ? "h-80" : "h-96"}`}
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

      {/* Product Image */}
      <div
        className={`relative overflow-hidden bg-gray-50 ${
          isMobile ? "h-32" : "h-48"
        }`}
      >
        <img
          src={product.images[0] || "/api/placeholder/300/300"}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col justify-between flex-1">
        {/* Product Name */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight truncate group-hover:text-green-600 transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Short Description */}
        {product.shortDescription && (
          <p className="text-gray-600 text-xs md:text-sm mb-3 leading-tight truncate">
            {product.shortDescription}
          </p>
        )}

        {/* Available Platforms - Always at bottom */}
        <div className="">
          <p className="text-xs text-gray-600 mb-2 font-medium">
            Buy From:
          </p>
          <div className="flex gap-2 justify-center">
            {sellers.map((seller, sellerIndex) => {
              const platformKey = seller.name.toLowerCase();
              const platform =
                platformConfig[platformKey as keyof typeof platformConfig];

              if (!platform) return null;

              return (
                <Button
                  key={sellerIndex}
                  onClick={(e) => handleSellerClick(seller.url, e)}
                  className={`flex items-center justify-center bg-transparent transition-all duration-200 transform hover:scale-110 ${
                    isMobile ? "w-12 h-12 p-1" : "w-14 h-14 p-2"
                  }`}
                  variant={"link"}
                >
                  <img
                    src={platform.logoSrc}
                    alt={`${platform.name} logo`}
                    className="object-contain w-full h-full"
                  />
                </Button>
              );
            })}
          </div>
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
