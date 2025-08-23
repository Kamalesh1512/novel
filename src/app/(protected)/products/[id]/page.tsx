"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  BannerProps,
  platformConfig,
  ProductType,
} from "@/lib/constants/types";
import { useProductStore } from "@/store/productStore";
import { motion } from "framer-motion";
import {
  Sparkles,
  Palette,
  Star,
  Heart,
  RotateCcw,
  ChevronLeft,
  Eye,
  Award,
  Shield,
  Truck,
  RefreshCw,
  Share2,
} from "lucide-react";
import { trackProductView } from "@/hooks/use-recently-viewed";
import LoadingScreen from "@/components/global/loading";
import { ProductBreadcrumb } from "@/components/products/product-breadcrumb";
import { ViewModeToggle } from "@/components/products/view-mode-toggle";
import { ProductImageGallery } from "@/components/products/product-image-gallery";
import { ProductNotFound } from "@/components/products/product-notfound";
import Interactive3DCard from "@/components/global/interactive/interactive-3DCard";
import StatsCard from "@/components/global/interactive/statscard";
import AnimatedFeatures from "@/components/global/interactive/animated-features";
import { AnimatedCounter } from "@/components/global/interactive/animated-counter";
import ProductBanners from "@/components/products/product-banners";
import RelatedProducts from "@/components/products/related-products";
import ProductDescription from "@/components/products/product-description";

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [viewMode, setViewMode] = useState<"image" | "3d">("image");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(342);
  const [showConfetti, setShowConfetti] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [backgroundGreen, setBackgroundGreen] = useState(false);
  const [banners, setBanners] = useState<BannerProps[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);

  const params = useParams();
  const sku = params.id as string;
  const router = useRouter();

  const { products } = useProductStore();

  const [product, setProduct] = useState<ProductType | null>(null);

  const fetchProductAndBanners = async () => {
    // Early return if prerequisites not met
    if (!sku || products.length === 0) {
      setLoading(false);
      return;
    }

    try {
      // Find the product
      const foundProduct = products.find((p) => p.sku === sku);
      setProduct(foundProduct || null);

      if (!foundProduct) {
        setBanners([]); // Clear banners if no product found
        setRelatedProducts([]); // Clear related products
        setLoading(false);
        return;
      }

      // Track product view
      trackProductView(foundProduct);

      const skuParts = foundProduct.sku.split("-");
      if (skuParts.length >= 4) {
        const category = skuParts[1];
        const subCategory = skuParts[2];
        const productType = skuParts[3];

        const related = products
          .filter((product) => {
            if (product.sku === foundProduct.sku) return false;

            const otherSkuParts = product.sku.split("-");
            if (otherSkuParts.length < 4) return false;

            // Match category, subcategory, and product type
            return (
              otherSkuParts[1] === category &&
              otherSkuParts[2] === subCategory &&
              otherSkuParts[3] === productType
            );
          })
          .slice(0, 8);

        setRelatedProducts(related);
      } else {
        setRelatedProducts([]); // No related products if SKU format is unexpected
      }

      // Fetch banners for this specific product
      const res = await fetch("/api/banners/active");
      const data = await res.json();

      // Filter banners: priority === 4 AND title matches product.sku
      const filteredBanners = (data.banners || []).filter(
        (banner: BannerProps) =>
          banner.priority === 4 && banner.title === foundProduct.sku
      );

      setBanners(filteredBanners);
    } catch (error) {
      console.error("Error fetching banners for product:", error);
      setBanners([]); // Set empty array on error
      setRelatedProducts([]); // Clear related products on error
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProductAndBanners();
  }, [sku, products]);

  // Event handlers
  const handleGoBack = () => {
    router.back();
  };

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

    // Green background flash effect
    setBackgroundGreen(true);
    setTimeout(() => setBackgroundGreen(false), 600);

    if (!isLiked) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);
      toast.success("Added to wishlist!");
    } else {
      toast.success("Removed from wishlist!");
    }
  };

  const handleShare = async () => {
    if (!product) {
      toast.error("Product not found");
      return;
    }

    // Green background flash effect
    setBackgroundGreen(true);
    setTimeout(() => setBackgroundGreen(false), 600);

    const shareData = {
      title: product.name,
      text: product.shortDescription,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Product link copied to clipboard!");
      }
    } catch (error) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Product link copied to clipboard!");
      } catch {
        toast.error("Unable to share. Please copy the URL manually.");
      }
    }
  };
  const handleSellerClick = (url: string, event: any) => {
    event.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (!product) {
    return <ProductNotFound />;
  }

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${
        backgroundGreen ? "animate-flashGreen" : ""
      }`}
    >
      {/* Cursor follower */}
      <div
        className="fixed w-4 h-4 bg-gradient-to-r from-green-400 to-green-800 rounded-full pointer-events-none z-50 opacity-100 transition-all duration-100"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
          transform: "scale(0.8)",
        }}
      />
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Animated Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8 opacity-0 animate-[slideInUp_0.6s_ease-out_forwards]">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
            onClick={() => router.back()}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div className="space-y-6 opacity-0 animate-[slideInLeft_0.8s_ease-out_0.2s_forwards]">
            {/* View Mode Toggle */}
            <div className="flex justify-center">
              <ViewModeToggle
                viewMode={viewMode}
                hasModelUrl={!!product.modelUrl}
                onViewModeChange={setViewMode}
              />
            </div>

            <ProductImageGallery
              images={product.images}
              productName={product.name}
              selectedImage={selectedImage}
              viewMode={viewMode}
              onImageSelect={setSelectedImage}
            />
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-8 opacity-0 animate-[slideInRight_0.8s_ease-out_0.4s_forwards]">
            {/* Product Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 leading-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                    {product.name}
                  </h1>
                  <p className="text-lg text-gray-600 mt-2">
                    {product.shortDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-sm md:text-xl font-semibold text-gray-900">
                Key Features
              </h3>
              {product.features && (
                <AnimatedFeatures features={product.features} />
              )}
            </div>

            {/* Buy From Section */}
            <div className="">
              <p className="text-sm md:text-xl font-semibold text-gray-900">
                Buy From:
              </p>

              <div className="flex gap-3 items-start justify-start">
                {product.sellers.map((seller, sellerIndex) => {
                  const platformKey = seller.name.toLowerCase();
                  const platform =
                    platformConfig[platformKey as keyof typeof platformConfig];
                  if (!platform) return null;

                  return (
                    <motion.div
                      key={sellerIndex}
                      whileHover={{ scale: 1.2, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      }}
                      className="relative"
                    >
                      <Button
                        onClick={(e) => handleSellerClick(seller.url, e)}
                        className="flex items-center justify-center bg-white rounded-xl shadow-md p-2 w-12 md:w-24 h-12 md:h-24 overflow-hidden hover:shadow-xl hover:ring-1 hover:ring-green-600 transition-all duration-300 mt-5"
                        variant="link"
                      >
                        <img
                          src={platform.logoSrc}
                          alt={`${platform.name} logo`}
                          className="object-contain w-full h-full"
                        />
                      </Button>

                      {/* Optional floating tooltip */}
                      <motion.span
                        className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 pointer-events-none"
                        initial={{ opacity: 0, y: 5 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {platform.name}
                      </motion.span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                variant="outline"
                size="lg"
                className="px-6 border-2 hover:bg-gray-50"
                onClick={handleShare}
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Like Counter */}
            <div className="text-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              <Heart className="w-4 h-4 inline mr-2" />
              <AnimatedCounter target={likeCount} /> people liked this product
            </div>
          </div>
        </div>
      </div>
      {/* Product Description Section */}
      {product.description && (
        <ProductDescription
          description={product.description}
          productName={product.name}
          features={product.features}
          banners = {banners}
        />
      )}


      {/* Related Products Section */}
      <RelatedProducts relatedProducts={relatedProducts} />

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        @keyframes flashGreen {
          0% {
            background-color: transparent;
          }
          50% {
            background-color: #22c55e;
          } /* Tailwind green-500 */
          100% {
            background-color: transparent;
          }
        }
        .animate-flashGreen {
          animation: flashGreen 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}
