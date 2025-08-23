"use client";
import { platformConfig, ProductType } from "@/lib/constants/types";
import { Heart } from "lucide-react";
import { DealProductCard } from "../products/deal-product-card";
import { SectionHeading } from "../ui/section-heading";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Seller {
  name: string;
  url: string;
}

interface StealDealsProps {
  products: ProductType[];
}

const StealDeals: React.FC<StealDealsProps> = ({ products = [] }) => {
  const [favorites, setFavorites] = useState(new Set<string>());
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="p-8 text-center">Loading...</div>;
  }

  // ✅ Always declare hook at the top level
  useEffect(() => {
    const loadWishlist = async () => {
      if (!session?.user?.id) return; // guard inside
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

  // ✅ Now return null only after hooks are declared
  if (!session?.user) {
    return null;
  }

  const toggleFavorite = async (productId: string) => {
    if (!session.user.id) {
      // Redirect to login or show login modal
      router.push("/auth/signin");
      return;
    }

    setIsLoading(true);
    const wasInFavorites = favorites.has(productId);

    try {
      if (wasInFavorites) {
        // Remove from wishlist
        const response = await fetch("/api/wishlist/remove", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session.user.id,
            productId,
          }),
        });

        if (response.ok) {
          const newFavorites = new Set(favorites);
          newFavorites.delete(productId);
          setFavorites(newFavorites);
        } else {
          throw new Error("Failed to remove from wishlist");
        }
      } else {
        // Add to wishlist
        const response = await fetch("/api/wishlist/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session.user.id,
            productId,
          }),
        });

        if (response.ok) {
          const newFavorites = new Set(favorites);
          newFavorites.add(productId);
          setFavorites(newFavorites);
        } else {
          throw new Error("Failed to add to wishlist");
        }
      }
    } catch (error) {
      console.error("Wishlist operation failed:", error);
      // Optionally show a toast notification
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
      <section className="py-8 md:py-16 bg-gradient-to-br from-green-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Steal Deals
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              No deals available at the moment. Check back soon!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-16 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 md:mb-12">
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

        {/* Products Grid - Desktop: Grid, Mobile: Horizontal Scroll */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 justify-center gap-4 md:pl-16">
          {products.map((product, index) => (
            <DealProductCard
              key={product.id}
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
          ))}
        </div>

        {/* Mobile: Horizontal Scrolling */}
        <div className="md:hidden">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 px-1">
            {products.map((product, index) => (
              <div key={product.id} className="flex-shrink-0 w-48">
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StealDeals;
