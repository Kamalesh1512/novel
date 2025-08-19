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

  return (
    <div className={`flex-shrink-0 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        viewport={{ once: true }}
        className="flex flex-col overflow-visible rounded-2xl w-full relative cursor-pointer"
        onClick={() => router.push(`/products/${product.sku}`)}
      >
        {/* Card Content */}
        <div className="bg-transparent rounded-t-lg overflow-visible w-[200px] sm:w-[250px]">
          {/* Product Image Container */}
          <div className="relative bg-transparent rounded-t-lg h-[200px] sm:h-[220px] md:h-[220px] flex items-center justify-center overflow-visible">
            {/* Bestseller Badge */}
            <div className="absolute top-1 left-1 z-10">
              <Badge className="bg-green-600 text-black px-2 py-0.5 rounded text-[10px] font-medium leading-none">
                BESTSELLER
              </Badge>
            </div>
            <div className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] md:w-[220px] md:h-[220px] relative">
              <Image
                src={productImage}
                alt={product.name}
                fill
                className={`object-contain transition-all duration-500 group-hover:scale-105 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-b-lg">
            {/* Product Details */}
            <div className="p-4 sm:p-5 space-y-1">
              {/* Category */}
              <div className="text-[9px] text-gray-600 uppercase tracking-wide">
                {product.category?.name || "EAU DE PARFUM"}
              </div>
              {/* Product Name */}
              <h3 className="text-black text-sm sm:text-base font-medium leading-tight truncate whitespace-nowrap overflow-hidden text-ellipsis">
                <Link
                  href={`/products/${product.id}`}
                  className="hover:text-gray-700 transition-colors"
                >
                  {product.name}
                </Link>
              </h3>
              {/* Product desc */}
              <h3 className="text-gray-500 text-[10px] font-medium leading-tight truncate whitespace-nowrap overflow-hidden text-ellipsis">
                {product.shortDescription}
              </h3>
              {/* Rating */}
              {/* <div className="flex items-center gap-2">
                {product.rating && product.rating > 0 ? (
                  <>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {product.rating} |
                      </span>
                    </div>
                    {product.reviews && product.reviews > 0 && (
                      <>
                        <Image
                          src={"/images/verify.png"}
                          height={15}
                          width={15}
                          alt={"verified"}
                          className="object-cover"
                        />
                        <span className="text-sm text-black-600">
                          ({product.reviews.toLocaleString()} Reviews)
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                    <DialogTrigger asChild>
                      <DialogTrigger asChild>
                        <span className="text-sm font-medium text-blue-600 cursor-pointer">
                          Write a Review
                        </span>
                      </DialogTrigger>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md w-full px-4 sm:px-6">
                      <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">
                          Leave a Review
                        </DialogTitle>
                      </DialogHeader>
                      <ReviewForm
                        productId={product.id}
                        onReviewSubmitted={() => setIsReviewOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div> */}
            </div>
            {/* Add to Cart Button */}
            <div className="">
              <Button
                variant={"premium"}
                onClick={() => router.push(`/products/${product.sku}`)}
                className="w-full"
              >
                {homePage ? "ORDER NOW" : "ADD TO CART"}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductCard;
