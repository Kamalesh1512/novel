import React, { useRef } from "react";
import { Eye } from "lucide-react";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import ProductCard from "./product-card";


const RecentlyViewedSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { items, clearAll, getItemsWithFormattedTime } = useRecentlyViewed();

  const itemsWithTime = getItemsWithFormattedTime();

  // Return null if no recently viewed products
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="py-8 px-4 bg-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <h2 className="text-2xl md:text-3xl md:px-40 font-semibold text-gray-900 mb-8 tracking-wider text-center">
          Recently Viewed{" "}
        </h2>

        {/* Scrollable Container */}
        <div className="relative">
          {/* Horizontal Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto overflow-y-visible scrollbar-hide pb-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div className="flex gap-4 min-w-max md:px-40">
              {itemsWithTime.map((item, index) => (
                <div
                  key={`${item.product.id}-${item.viewedAt}`}
                  className="relative"
                >
                  <ProductCard
                    product={item.product}

                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default RecentlyViewedSection;
