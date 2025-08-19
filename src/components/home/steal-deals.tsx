import React, { useState } from "react";
import { Heart, Eye, ExternalLink, Timer, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProductType } from "@/lib/constants/types";
import { Button } from "../ui/button";
import { SectionHeading } from "../ui/section-heading";

interface Seller {
  name: string;
  url: string;
}

interface StealDealsProps {
  products: ProductType[];
}

const StealDeals: React.FC<StealDealsProps> = ({ products = [] }) => {
  const [favorites, setFavorites] = useState(new Set<string>());
  const [hovegreenCard, setHovegreenCard] = useState<number | null>(null);
  const router = useRouter();

  // Platform configurations
  const platformConfig = {
    amazon: {
      name: "Amazon",
      logoSrc: "/Images/amazon_logo.png",
    },
    flipkart: {
      name: "Flipkart",
      logoSrc: "/Images/flipkart_logo.png",
    },
    meesho: {
      name: "Meesho",
      logoSrc: "/Images/meesho_logo.png",
    },
    // 'myntra': {
    //   name: 'Myntra',
    //   logoSrc: '/myntra_logo.png'
    // }
  };

  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const handleProductClick = (sku: string) => {
    router.push(`/products/${sku}`);
  };

  const handleSellerClick = (url: string, event: React.MouseEvent) => {
    event.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (!products.length) {
    return (
      <section className="py-16 bg-gradient-to-br from-green-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Steal Deals
            </h2>
            <p className="text-gray-600">
              No deals available at the moment. Check back soon!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <SectionHeading
              title="STEAL DEALS"
              fontStyle="font-bebas"
              align="center"
              size="lg"
              letterSpacing="2px"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => {
            const sellers = product.sellers;

            return (
              <div
                key={product.id}
                className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer ${
                  hovegreenCard === index ? "scale-105" : ""
                }`}
                onMouseEnter={() => setHovegreenCard(index)}
                onMouseLeave={() => setHovegreenCard(null)}
                onClick={() => handleProductClick(product.sku)}
              >
                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-lg"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      favorites.has(product.id)
                        ? "fill-green-500 text-green-500"
                        : "text-gray-400 hover:text-green-500"
                    }`}
                  />
                </button>

                {/* Best Seller Badge */}
                {product.bestSeller && (
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10 shadow-lg">
                    Best Seller
                  </div>
                )}

                {/* Product Image */}
                <div className="relative h-64 overflow-hidden bg-gray-50">
                  <img
                    src={product.images[0] || "/api/placeholder/300/300"}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Product Info */}
                <div className="p-6">
                  {/* Product Name and Rating */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors flex-1 pr-2">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    {/* {product.rating && (
                      <div className="flex items-center gap-1 ml-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-700">
                          {product.rating}
                        </span>
                        {product.reviews && (
                          <span className="text-xs text-gray-500">
                            ({product.reviews})
                          </span>
                        )}
                      </div>
                    )} */}
                  </div>

                  {/* Short Description */}
                  {product.shortDescription && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.shortDescription}
                    </p>
                  )}

                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {product.features.slice(0, 2).map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                        {product.features.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            +{product.features.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Available Platforms */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2 font-medium">
                      Available on:
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {sellers.map((seller, sellerIndex) => {
                        const platformKey = seller.name.toLowerCase();
                        const platform =
                          platformConfig[
                            platformKey as keyof typeof platformConfig
                          ];

                        if (!platform) return null;

                        return (
                          <Button
                            key={sellerIndex}
                            onClick={(e) => handleSellerClick(seller.url, e)}
                            className="flex items-center justify-center w-20 h-20 p-2 bg-transparent transition-all duration-200 transform hover:scale-125"
                            variant={"link"}
                          >
                            <img
                              src={platform.logoSrc}
                              alt={`${platform.name} logo`}
                              className="object-contain"
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
                    <div className="absolute inset-0 rounded-2xl bg-green-500/5 animate-pulse"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* View All Button
        <div className="text-center mt-12">
          <button
            onClick={() => router.push("/deals")}
            className="bg-gradient-to-r from-green-500 to-green-500 hover:from-green-600 hover:to-green-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            View All Deals
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default StealDeals;
