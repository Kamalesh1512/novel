//products/[id]/page.tsx
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
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  Leaf,
  Baby,
  Droplets,
  TestTube,
  Zap,
  Users,
  Clock,
  Home,
  Gift,
  ShoppingBag,
  Tag,
  ExternalLink,
  TestTube2,
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
import FAQs from "@/components/products/faqs";
import { CustomerReviews } from "@/components/products/product-reviews";
import YouMayAlsoLike from "@/components/products/you-may-also-like";
import { Product3DModel } from "@/components/global/product-3d-model";
import { Product3DModelAnimation } from "@/components/products/product-model-animation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

// Icon mapping for features
const getFeatureEmoji = (feature: string) => {
  const lowerFeature = feature.toLowerCase();

  if (
    lowerFeature.includes("organic") ||
    lowerFeature.includes("bamboo") ||
    lowerFeature.includes("natural")
  ) {
    return "🌿";
  }
  if (
    lowerFeature.includes("comfort") ||
    lowerFeature.includes("soft") ||
    lowerFeature.includes("ultra-soft")
  ) {
    return "❤️";
  }
  if (
    lowerFeature.includes("test") ||
    lowerFeature.includes("dermatolog") ||
    lowerFeature.includes("paediatrician")
  ) {
    return "🧪";
  }
  if (lowerFeature.includes("vegan") || lowerFeature.includes("cruelty")) {
    return "🙌";
  }
  if (lowerFeature.includes("baby") || lowerFeature.includes("infant")) {
    return "👶";
  }
  if (
    lowerFeature.includes("protein") ||
    lowerFeature.includes("vitamin") ||
    lowerFeature.includes("milk")
  ) {
    return "⚡";
  }
  if (
    lowerFeature.includes("wash") ||
    lowerFeature.includes("clean") ||
    lowerFeature.includes("soap")
  ) {
    return "💧";
  }
  if (lowerFeature.includes("balanced") || lowerFeature.includes("ph")) {
    return "🛡️";
  }
  if (lowerFeature.includes("free") || lowerFeature.includes("paraben")) {
    return "🍃";
  }
  if (
    lowerFeature.includes("quick") ||
    lowerFeature.includes("fast") ||
    lowerFeature.includes("instant")
  ) {
    return "⏱️";
  }
  if (lowerFeature.includes("home") || lowerFeature.includes("family")) {
    return "🏠";
  }
  // Default emoji
  return "✨";
};

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
  const [youMayAlsoLike, setYouMayAlsoLike] = useState<ProductType[]>([]);
  const [expandedSellers, setExpandedSellers] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: string;
  }>({});
  const [hoveredSeller, setHoveredSeller] = useState<number | null>(null);

  const params = useParams();
  const sku = params.id as string;
  const router = useRouter();

  const { products } = useProductStore();

  const [product, setProduct] = useState<ProductType | null>(null);

  const sellerVariants: {
    [variant: string]: { name: string; url: string; offer: string }[];
  } =
    product?.sellers?.reduce((acc, seller) => {
      if (!acc[seller.variant]) {
        acc[seller.variant] = [];
      }
      acc[seller.variant].push({
        name: seller.name,
        url: seller.url,
        offer: seller.offer,
      });
      return acc;
    }, {} as { [variant: string]: { name: string; url: string; offer: string }[] }) ||
    {};

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
        // You May Also Like products: Looser match, e.g., only match category
        const youMayAlsoLike = products
          .filter((product) => {
            if (product.sku === foundProduct.sku) return false;

            const otherSkuParts = product.sku.split("-");
            if (otherSkuParts.length < 4) return false;

            // Match only category (more relaxed than related products)
            return otherSkuParts[1] === category;
          })
          .slice(0, 8);

        setYouMayAlsoLike(youMayAlsoLike);
      } else {
        setRelatedProducts([]);
        setYouMayAlsoLike([]);
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

  const toggleSellerExpansion = (sellerName: string) => {
    setExpandedSellers((prev) => ({
      ...prev,
      [sellerName]: !prev[sellerName],
    }));
  };

  const handleVariantSelect = (sellerName: string, variant: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [sellerName]: variant,
    }));

    // Here you would typically redirect to the actual product URL
    // For now, we'll show a toast
    toast.success(`Selected ${variant} from ${sellerName}`);
  };

  const handleSellerClick = (url: string, event: any) => {
    event.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (!product) {
    return <ProductNotFound />;
  }

  console.log(banners);
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
            {/* Image/3D Model Section */}
            <div className="relative">
              {/* View Mode Toggle */}
              <div className="flex justify-center mb-6">
                <ViewModeToggle
                  viewMode={viewMode}
                  hasModelUrl={!!product.modelUrl}
                  onViewModeChange={setViewMode}
                />
              </div>

              {/* Content Container */}
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-lg">
                {viewMode === "image" ? (
                  <ProductImageGallery
                    images={product.images}
                    productName={product.name}
                    selectedImage={selectedImage}
                    onImageSelect={setSelectedImage}
                    viewMode="image"
                    // className="min-h-[400px] md:min-h-[500px]"
                  />
                ) : (
                  <div className="aspect-square w-full min-h-[400px] md:min-h-[500px]">
                    <Product3DModel
                      modelUrl={product.modelUrl || ""}
                      className="w-full h-full"
                      autoRotate={false}
                      enableZoom={true}
                      enablePan={false}
                      isVisible={viewMode === "3d"} // Only active when in 3D mode
                    />
                  </div>
                )}

                {/* Loading overlay for mode switching */}
                {viewMode === "3d" && product.modelUrl && (
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-gray-600 font-medium">
                      3D Interactive View
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-8 opacity-0 animate-[slideInRight_0.8s_ease-out_0.4s_forwards]">
            {/* Product Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-center">
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 ">
                  {product.name}
                </h1>
              </div>
            </div>

            {/* Key Features */}
            <div className="text-center">
              {product.features && (
                <div className="flex flex-col items-center space-y-1">
                  {product.features
                    .filter((feature: string) => feature.trim().startsWith("*"))
                    .flatMap((feature: string) =>
                      feature
                        .substring(1)
                        .split(",")
                        .map((f) => f.trim())
                    )
                    .reduce(
                      (rows: string[][], feature: string, index: number) => {
                        // Pyramid shape logic
                        const rowIndex = Math.floor(
                          (Math.sqrt(8 * index + 1) - 1) / 2
                        );
                        if (!rows[rowIndex]) rows[rowIndex] = [];
                        rows[rowIndex].push(feature);
                        return rows;
                      },
                      []
                    )
                    .map((row: string[], rowIndex: number) => (
                      <div key={rowIndex} className="flex justify-center gap-5">
                        {row.map((featureItem: string, index: number) => (
                          <div
                            key={index}
                            className="flex flex-row items-center space-y-2 p-2"
                          >
                            <div className="text-3xl">
                              {getFeatureEmoji(featureItem)}
                            </div>
                            <span className="text-sm md:text-lg font-medium text-gray-700 text-center">
                              {featureItem}
                            </span>
                          </div>
                        ))}
                      </div>
                    ))}
                </div>
              )}
            </div>

            <p className="text-lg text-gray-600 mt-2">
              {product.shortDescription}
            </p>

            {/* Shop Now Section with Variant Cards and Seller Accordions */}
            <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl">
              {/* Header Section */}
              <div className="flex flex-row items-center mb-8 space-x-3">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-600 to-green-950 rounded-full mb-4 shadow-lg">
                  <ShoppingBag className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">
                    Shop Now
                  </h3>
                  <p className="text-xs text-gray-600">
                    Choose your variant and find the best deals
                  </p>
                </div>
              </div>

              {/* Variant Selection */}
              <div className="mb-8">
                {/* Title + Share button row */}
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                    Available Variants
                  </h4>

                  {/* Action Button */}
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-6 border-2 hover:bg-gray-50"
                    onClick={handleShare}
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>

                {/* Variants grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {Object.keys(sellerVariants).map((variantName, index) => {
                    const hasOffer = sellerVariants[variantName].some(
                      (v) => v.offer && v.offer !== "None"
                    );
                    const offerText = sellerVariants[variantName]
                      .map((v) => v.offer)
                      .filter((offer) => offer && offer !== "None")[0];
                    const isSelected =
                      selectedVariants.selectedVariant === variantName;

                    return (
                      <div key={index} className="relative group">
                        <Button
                          variant={isSelected ? "premium" : "premiumOutline"}
                          className="relative flex flex-col items-center justify-center p-4 h-24 w-full text-center overflow-hidden group-hover:ring-2 group-hover:ring-purple-300"
                          onClick={() =>
                            setSelectedVariants({
                              selectedVariant: variantName,
                            })
                          }
                        >
                          {hasOffer && (
                            <Badge
                              variant="secondary"
                              className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 shadow-lg animate-pulse z-10"
                            >
                              <Tag className="w-3 h-3 mr-1" />
                              {offerText}
                            </Badge>
                          )}

                          <h4
                            className={`font-semibold transition-colors ${
                              isSelected ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {variantName}
                          </h4>
                          <div
                            className={`text-sm mt-1 ${
                              isSelected ? "text-purple-100" : "text-gray-500"
                            }`}
                          >
                            {sellerVariants[variantName].length} seller
                            {sellerVariants[variantName].length > 1 ? "s" : ""}
                          </div>
                        </Button>

                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                            <div className="w-3 h-3 bg-purple-600 rotate-45 shadow-lg"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Seller Selection */}
              {selectedVariants.selectedVariant && (
                <div className="animate-in slide-in-from-bottom duration-500">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <ExternalLink className="w-5 h-5 mr-2 text-blue-600" />
                    Available on {selectedVariants.selectedVariant}
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {sellerVariants[selectedVariants.selectedVariant]?.map(
                      (seller, idx) => {
                        const platformKey = seller.name.toLowerCase();
                        const platform =
                          platformConfig[
                            platformKey as keyof typeof platformConfig
                          ];
                        if (!platform) return null;

                        const hasOffer =
                          seller.offer && seller.offer !== "None";

                        return (
                          <div
                            key={idx}
                            className="relative group"
                            onMouseEnter={() => setHoveredSeller(idx)}
                            onMouseLeave={() => setHoveredSeller(null)}
                          >
                            <Button
                              variant="link"
                              onClick={(e) => handleSellerClick(seller.url, e)}
                              className="relative flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg p-2 w-fit h-fit overflow-hidden group-hover:shadow-2xl group-hover:ring-2 group-hover:ring-blue-400 transform transition-all duration-300 group-hover:scale-105"
                            >
                              {/* Gradient overlay */}
                              <div
                                className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                              ></div>

                              {/* Platform logo */}
                              <div className="relative z-10 w-16 h-16 mb-2 transition-transform duration-300 group-hover:scale-110">
                                <img
                                  src={platform.logoSrc}
                                  alt={`${platform.name} logo`}
                                  className="object-contain w-full h-full filter group-hover:brightness-110"
                                />
                              </div>
                              {/* Hover effect indicator */}
                              <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400 rounded-2xl transition-colors duration-300"></div>
                            </Button>

                            {/* Offer badge */}
                            {hasOffer && (
                              <div className="absolute -top-2 -right-2 z-20">
                                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 shadow-lg animate-bounce">
                                  {seller.offer}
                                </Badge>
                              </div>
                            )}

                            {/* Hover tooltip */}
                            {hoveredSeller === idx && (
                              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-30">
                                <div className="bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap shadow-xl">
                                  Shop on {platform.name}
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                                    <div className="w-2 h-2 bg-gray-900 rotate-45 -mt-1"></div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>

                  {/* Call to action */}
                  <div className="mt-8 text-center">
                    <p className="text-gray-600 mb-4">
                      Find the best deals across all platforms
                    </p>
                  </div>
                </div>
              )}
            </div>
            {/* Like Counter */}
            <div className="text-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              <Heart className="w-4 h-4 inline mr-2" />
              <AnimatedCounter target={likeCount} /> people liked this product
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12">
        <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
          "Care That Never Compromises"
        </h2>
        <Tabs defaultValue="ingredients" className="w-full">
          <TabsList className="grid grid-cols-4 gap-1 mb-8 bg-gray-100 p-1 rounded-xl h-auto">
            <TabsTrigger
              value="ingredients"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-4 py-3 font-medium transition-all"
            >
              Ingredients
            </TabsTrigger>
            <TabsTrigger
              value="howtouse"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-4 py-3 font-medium transition-all"
            >
              How to Use
            </TabsTrigger>
            <TabsTrigger
              value="moredetails"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-4 py-3 font-medium transition-all"
            >
              More Details
            </TabsTrigger>
            <TabsTrigger
              value="disclaimer"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-4 py-3 font-medium transition-all"
            >
              Disclaimer
            </TabsTrigger>
          </TabsList>

          {/* Ingredients */}
          <TabsContent value="ingredients" className="mt-0">
            <Card className="border-0 shadow-sm bg-gray-50">
              <CardContent className="p-8">
                {product.ingredients && product.ingredients.length > 0 ? (
                  <div className="space-y-6">
                    {product.ingredients.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                      >
                        {/* Ingredient Icon/Image */}
                        <div className="w-16 h-16 flex-shrink-0 rounded-full overflow-hidden bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-orange-200 rounded-full"></div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h4 className="font-semibold text-lg text-gray-800 mb-1">
                            {item.name}
                          </h4>
                          <p className="text-gray-600 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500">
                      No ingredients information available.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* How to Use */}
          <TabsContent value="howtouse" className="mt-0">
            <Card className="border-0 shadow-sm bg-gray-50">
              <CardContent className="p-8">
                {product.howToUse && product.howToUse.length > 0 ? (
                  <div className="space-y-4">
                    {product.howToUse.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm"
                      >
                        <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-2">
                            {step.steps}
                          </h4>
                          <p className="text-gray-600 leading-relaxed">
                            {step.answer}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500">
                      No usage instructions available.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* More Details */}
          <TabsContent value="moredetails" className="mt-0">
            <Card className="border-0 shadow-sm bg-gray-50">
              <CardContent className="p-8">
                {product.description ? (
                  <ProductDescription
                    description={product.description}
                    productName={product.name}
                    features={product.features}
                    
                  />
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500">
                      No additional details available.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Disclaimer */}
          <TabsContent value="disclaimer" className="mt-0">
            <Card className="border-0 shadow-sm bg-gray-50">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <svg
                      className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-amber-800 mb-2">
                        Important Notice
                      </h4>
                      <p className="text-amber-700 text-sm leading-relaxed">
                        This product has not been evaluated by the FDA. It is
                        not intended to diagnose, treat, cure, or prevent any
                        disease. Please consult with a healthcare professional
                        before use if you have any medical conditions or
                        concerns.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-xl shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Usage Guidelines
                    </h4>
                    <ul className="space-y-2 text-gray-600 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0 mt-2"></span>
                        For external use only
                      </li>
                      {/* <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0 mt-2"></span>
                        Avoid contact with eyes
                      </li> */}
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0 mt-2"></span>
                        Discontinue use if irritation occurs
                      </li>
                      {/* <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0 mt-2"></span>
                        Keep out of reach of children
                      </li> */}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Product3DModelAnimation
        modelUrl={product.modelUrl || ""}
        fallbackImage={product.images[0] || ""}
        productName={product.name}
        features={product.features!}
        dimensions={{
          width: '15.2 cm (6")',
          height: '10.8 cm (4.25")',
        }}
        className="w-full h-96"
        autoRotate={false}
        altText="Your product 3D model"
      />

      <FAQs faqs={product.faqs} />

      <ProductBanners banners={banners} />

      {product.customerReviews && (
        <CustomerReviews customerReviews={product.customerReviews} />
      )}

      <YouMayAlsoLike products={youMayAlsoLike} />

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
