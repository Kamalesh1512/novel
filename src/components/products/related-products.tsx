"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight, Heart, Star, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductType } from "@/lib/constants/types";

interface RelatedProductsProps {
  relatedProducts: ProductType[];
}

export default function RelatedProducts({
  relatedProducts,
}: RelatedProductsProps) {
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
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

  if (!relatedProducts.length) {
    return null;
  }

  return (
    <div className="w-full bg-transparent py-12 mt-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Related Products
            </h2>
            <p className="text-gray-600">
              Discover similar products you might like
            </p>
          </div>
        </div>

        {/* Products Grid with Vertical Scroll */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-h-[600px] overflow-y-auto scrollbar-hide pr-2">
            {relatedProducts.map((product, index) => (
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
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group border border-gray-100"
                onClick={() => handleProductClick(product)}
              >
                {/* Product Image */}
                <div className="relative overflow-hidden bg-gray-100 h-48">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Like Button */}
                  <button
                    onClick={(e) => handleLikeToggle(product.sku, e)}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
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

                  {/* Quick View Badge */}
                  <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Badge variant="secondary" className="text-xs bg-white/90">
                      Quick View
                    </Badge>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 tracking-tight leading-none">
                      {product.shortDescription}
                    </p>
                  </div>

                  {/* Sellers Count */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-600">
                      <Store className="w-4 h-4 mr-1" />
                      Available at {product.sellers.length} store
                      {product.sellers.length !== 1 ? "s" : ""}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Scroll Indicator */}
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
