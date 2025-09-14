"use client";
import { platformConfig, ProductType } from "@/lib/constants/types";
import { DealProductCard } from "../products/deal-product-card";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface StealDealsProps {
  products: ProductType[];
}

const StealDeals: React.FC<StealDealsProps> = ({ products = [] }) => {
  const [favorites, setFavorites] = useState(new Set<string>());
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sectionInView, setSectionInView] = useState(false);
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Load wishlist
  useEffect(() => {
    const loadWishlist = async () => {
      if (!session?.user?.id) return;
      try {
        const response = await fetch(`/api/wishlist/${session.user.id}`);
        if (response.ok) {
          const wishlistItems = await response.json();
          const wishlistProductIds = new Set<string>(
            wishlistItems.map((item: any) => item.productId as string)
          );
          setFavorites(wishlistProductIds);
        }
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      }
    };

    loadWishlist();
  }, [session?.user?.id]);

  // Observe section for animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setSectionInView(entry.isIntersecting);
        });
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById("steal-deals-section");
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  if (!session?.user) {
    return null;
  }

  const toggleFavorite = async (productId: string) => {
    if (!session.user.id) {
      router.push("/auth/signin");
      return;
    }

    setIsLoading(true);
    const wasInFavorites = favorites.has(productId);

    try {
      if (wasInFavorites) {
        const response = await fetch("/api/wishlist/remove", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session.user.id, productId }),
        });

        if (response.ok) {
          const newFavorites = new Set(favorites);
          newFavorites.delete(productId);
          setFavorites(newFavorites);
        }
      } else {
        const response = await fetch("/api/wishlist/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session.user.id, productId }),
        });

        if (response.ok) {
          const newFavorites = new Set(favorites);
          newFavorites.add(productId);
          setFavorites(newFavorites);
        }
      }
    } catch (error) {
      console.error("Wishlist operation failed:", error);
    } finally {
      setIsLoading(false);
    }
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
      <section className="py-8 md:py-16 relative overflow-hidden bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-green-100 mb-4">
            Steal Deals
          </h2>
          <p className="text-sm md:text-base text-green-200">
            No deals available at the moment. Check back soon!
          </p>
        </div>
      </section>
    );
  }

  // Duplicate products array to create seamless loop
  const duplicatedProducts = [...products, ...products];

  return (
    <section
      id="steal-deals-section"
      className="py-12 md:py-20 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-1000 ${
            sectionInView
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-green-900">
            Steal Deals
          </h2>
          <p className="text-lg text-gray-700">
            🔥 Limited Time Offers • Grab Before They're Gone! 🔥
          </p>
        </div>

        {/* Desktop Moving Slider */}
        <div className="hidden md:block">
          <div className="relative overflow-hidden">
            <div
              className={`flex gap-8 transition-all duration-300 ${
                isSliderHovered ? "" : "animate-slide"
              }`}
              onMouseEnter={() => setIsSliderHovered(true)}
              onMouseLeave={() => setIsSliderHovered(false)}
              style={{
                width: `${duplicatedProducts.length * 320}px`, // Adjusted for wider cards
              }}
            >
              {duplicatedProducts.map((product, index) => (
                <div
                  key={`${product.id}-${index}`}
                  className="flex-shrink-0 cursor-pointer"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="hover:scale-105 transition-transform duration-300 mb-10">
                    <DealProductCard
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Moving Slider */}
        <div className="md:hidden">
          <div className="relative overflow-hidden">
            <div
              className={`flex gap-4 transition-all duration-300 ${
                isSliderHovered ? "" : "animate-slide-mobile"
              }`}
              onMouseEnter={() => setIsSliderHovered(true)}
              onMouseLeave={() => setIsSliderHovered(false)}
              style={{
                width: `${duplicatedProducts.length * 320}px`, // Normal mobile
              }}
            >
              {duplicatedProducts.map((product, index) => (
                <div
                  key={`${product.id}-${index}`}
                  className="flex-shrink-0 cursor-pointer"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="hover:scale-105 transition-transform duration-300 mb-10">
                    <DealProductCard
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
                      isMobile={true}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Hide scrollbar */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Moving slider animation */
        @keyframes slide {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-slide {
          animation: slide 35s linear infinite; /* Slightly slower for taller cards */
        }

        /* Pause animation on hover */
        .animate-slide:hover {
          animation-play-state: paused;
        }

        /* Mobile slider animation - faster than desktop */
        @keyframes slide-mobile {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-slide-mobile {
          animation: slide-mobile 25s linear infinite; /* Faster for mobile */
        }

        /* Pause animation on touch */
        .animate-slide-mobile:active {
          animation-play-state: paused;
        }

        /* Mobile specific adjustments */
        @media (max-width: 768px) {
          .animate-slide-mobile {
            animation: slide-mobile 20s linear infinite; /* Even faster on smaller screens */
          }
        }

        /* Add line clamp utility for text truncation */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Background Animation Effects */
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) translateX(10px) rotate(120deg);
          }
          66% {
            transform: translateY(10px) translateX(-15px) rotate(240deg);
          }
        }

        @keyframes float-medium {
          0%,
          100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) translateX(20px) rotate(180deg);
          }
        }

        @keyframes float-fast {
          0%,
          100% {
            transform: translateY(0px) translateX(0px) scale(1);
          }
          25% {
            transform: translateY(-15px) translateX(-10px) scale(1.1);
          }
          75% {
            transform: translateY(15px) translateX(10px) scale(0.9);
          }
        }

        @keyframes wave-1 {
          0% {
            transform: translateX(-100%) rotate(0deg);
          }
          100% {
            transform: translateX(100%) rotate(360deg);
          }
        }

        @keyframes wave-2 {
          0% {
            transform: translateX(-100%) rotate(0deg);
          }
          100% {
            transform: translateX(100%) rotate(-360deg);
          }
        }

        @keyframes wave-3 {
          0% {
            transform: translateX(100%) rotate(0deg);
          }
          100% {
            transform: translateX(-100%) rotate(360deg);
          }
        }

        @keyframes sparkle-1 {
          0%,
          100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }

        @keyframes sparkle-2 {
          0%,
          100% {
            opacity: 0;
            transform: scale(0);
          }
          25%,
          75% {
            opacity: 1;
            transform: scale(1.2);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.8);
          }
        }

        @keyframes sparkle-3 {
          0%,
          100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          33% {
            opacity: 0.8;
            transform: scale(1.1) rotate(120deg);
          }
          66% {
            opacity: 0.4;
            transform: scale(0.9) rotate(240deg);
          }
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }

        .animate-wave-1 {
          animation: wave-1 20s linear infinite;
        }

        .animate-wave-2 {
          animation: wave-2 25s linear infinite;
        }

        .animate-wave-3 {
          animation: wave-3 15s linear infinite;
        }

        .animate-sparkle-1 {
          animation: sparkle-1 3s ease-in-out infinite;
        }

        .animate-sparkle-2 {
          animation: sparkle-2 4s ease-in-out infinite;
        }

        .animate-sparkle-3 {
          animation: sparkle-3 5s ease-in-out infinite;
        }

        /* Grid Pattern */
        .grid-pattern {
          background-image: linear-gradient(
              rgba(34, 197, 94, 0.1) 1px,
              transparent 1px
            ),
            linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          width: 100%;
          height: 100%;
          animation: grid-move 30s linear infinite;
        }

        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }

        /* Lightswind-style carousel effect for mobile */
        .snap-center {
          scroll-snap-align: center;
        }
      `}</style>
    </section>
  );
};

export default StealDeals;
