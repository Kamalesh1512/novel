"use client";

import { Star } from "lucide-react";
import { ProductType } from "@/lib/constants/types";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProductCardProps {
  product: ProductType;
  index?: number;
  className?: string;
  homePage?: boolean;
}

const ProductCard = ({
  product,
  index = 0,
  className = "",
  homePage,
}: ProductCardProps) => {
  const router = useRouter();

  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const handleProductClick = () => {
    router.push(`/products/${product.sku}`);
  };

  const productImage = product.images?.[0] || "/images/placeholder.jpg";
  // Calculate discount percentage if both price and salePrice exist
  const discountPercentage =
    product.price && product.salePrice && parseFloat(product.salePrice) > 0
      ? Math.round(
          ((parseFloat(product.price) - parseFloat(product.salePrice)) /
            parseFloat(product.price)) *
            100
        )
      : null;

  console.log(product);
  const firstSellerReview = product.customerReviews?.[0];

  return (
    <div className={`flex-shrink-0 ${className}`}>
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        viewport={{ once: true }}
        className="flex flex-col rounded-2xl w-[200px] sm:w-[250px] md:w-[250px] shadow-lg relative cursor-pointer h-[420px]"
        onClick={() => router.push(`/products/${product.sku}`)}
      >

        <div className="relative h-[420px] flex items-center justify-center overflow-hidden rounded-t-2xl bg-transparent">
          {discountPercentage && discountPercentage > 0 && (
            <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold shadow-md">
              {discountPercentage}% OFF
            </div>
          )}
          <Image
            src={productImage}
            alt={product.name}
            fill
            className={`object-contain transition-all duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        <div className="flex flex-col justify-between rounded-b-lg bg-gray-100 h-[230px]">
          <div className="flex-1 space-y-2 py-2 px-2 overflow-hidden">
            <div className="text-xs text-gray-600 uppercase tracking-wide truncate">
              {product.category?.name || ""}
            </div>

            <h3 className="text-gray-900 text-sm font-semibold leading-tight line-clamp-2">
              <Link
                href={`/products/${product.id}`}
                className="hover:text-gray-700 transition-colors"
              >
                {product.name}
              </Link>
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              {product.salePrice && parseFloat(product.salePrice) > 0 ? (
                <>
                  {product.price &&
                    parseFloat(product.price) >
                      parseFloat(product.salePrice) && (
                      <span className="text-gray-500 text-xs line-through">
                        ₹{product.price}
                      </span>
                    )}
                  <span className="font-bold text-green-600 text-base">
                    ₹{product.salePrice}
                  </span>
                </>
              ) : (
                product.price && (
                  <span className="font-bold text-gray-800 text-base">
                    ₹{product.price}
                  </span>
                )
              )}
            </div>

            <p className="text-gray-500 text-xs leading-tight">
              {product.shortDescription?.split(".")[0]}.
            </p>

            {firstSellerReview && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => {
                    const rating = firstSellerReview.averageRating ?? 0;
                    const starValue = i + 1;
                    return (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
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
                <span className="text-sm text-gray-700 font-medium">
                  {firstSellerReview.averageRating?.toFixed(1) ?? 0}
                </span>
                <span className="text-xs text-gray-500">
                  | (
                  {firstSellerReview.totalReviews >= 1000
                    ? `${(firstSellerReview.totalReviews / 1000).toFixed(1)}k`
                    : firstSellerReview.totalReviews.toLocaleString()}{" "}
                  reviews)
                </span>
              </div>
            )}
          </div>
          <div>
            <Button
              variant="premium"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/products/${product.sku}`);
              }}
              className="w-full py-0 px-0 text-sm rounded-none rounded-b-lg"
            >
              ORDER NOW
            </Button>
          </div>
        </div>
      </motion.div> */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        viewport={{ once: true }}
        className="flex flex-col rounded-2xl w-[220px] sm:w-[260px] md:w-[270px] shadow-lg relative cursor-pointer h-[480px]"
        onClick={() => router.push(`/products/${product.sku}`)}
      >

        <div className="relative h-[60%] flex-3 flex items-center justify-center overflow-hidden rounded-t-2xl bg-transparent">
          {discountPercentage && discountPercentage > 0 && (
            <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold shadow-md">
              {discountPercentage}% OFF
            </div>
          )}
          <Image
            src={productImage}
            alt={product.name}
            fill
            className={`object-contain transition-all duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        <div className="flex flex-col justify-between flex-1 rounded-b-lg bg-gray-100 h-[40%]">
          <div className="flex-1 space-y-2 py-2 px-2 overflow-hidden">
            <h3 className="text-gray-900 text-sm font-semibold leading-tight line-clamp-2">
              <Link
                href={`/products/${product.id}`}
                className="hover:text-gray-700 transition-colors"
              >
                {product.name}
              </Link>
            </h3>

            <div className="flex items-center gap-2 flex-wrap">
              {product.salePrice && parseFloat(product.salePrice) > 0 ? (
                <>
                  {product.price &&
                    parseFloat(product.price) >
                      parseFloat(product.salePrice) && (
                      <span className="text-gray-500 text-xs line-through">
                        ₹{product.price}
                      </span>
                    )}
                  <span className="font-bold text-green-600 text-base">
                    ₹{product.salePrice}
                  </span>
                </>
              ) : (
                product.price && (
                  <span className="font-bold text-gray-800 text-base">
                    ₹{product.price}
                  </span>
                )
              )}
            </div>

            <p className="text-gray-500 text-xs leading-tight">
              {product.shortDescription?.split(".")[0]}.
            </p>

            {firstSellerReview && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => {
                    const rating = firstSellerReview.averageRating ?? 0;
                    const starValue = i + 1;
                    return (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
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
                <span className="text-sm text-gray-700 font-medium">
                  {firstSellerReview.averageRating?.toFixed(1) ?? 0}
                </span>
                <span className="text-xs text-gray-500">
                  | (
                  {firstSellerReview.totalReviews >= 1000
                    ? `${(firstSellerReview.totalReviews / 1000).toFixed(1)}k`
                    : firstSellerReview.totalReviews.toLocaleString()}{" "}
                  reviews)
                </span>
              </div>
            )}
          </div>
          <div>
            <Button
              variant="premium"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/products/${product.sku}`);
              }}
              className="w-full py-0 px-0 text-sm rounded-none rounded-b-lg"
            >
              ORDER NOW
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductCard;
