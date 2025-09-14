"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductType } from "@/lib/constants/types";
import { Button } from "../ui/button";
import ProductCard from "./product-card";

interface BestsellersProps {
  baseProducts: ProductType[];
}

const Bestsellers = ({ baseProducts }: BestsellersProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLargeDevice, setIsLargeDevice] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const isLarge = window.innerWidth >= 1024;
      setIsLargeDevice(isLarge);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const itemsPerPage = 4;
  const maxIndex = Math.max(0, baseProducts.length - itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  // For mobile scroll
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  if (isLargeDevice) {
    // Desktop Carousel View
    return (
      <div className="w-full relative">
        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          {/* Large padding on sides */}
          
          <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-20">
            <div className="relative">
              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 bg-transparent shadow-none border-none hover:bg-transparent disabled:opacity-50 disabled:cursor-default"
                aria-label="Previous slide"
              >
                <ChevronLeft size={48} className="text-black" />
              </button>

              <button
                onClick={nextSlide}
                disabled={currentIndex >= maxIndex}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 bg-transparent shadow-none border-none hover:bg-transparent disabled:opacity-50 disabled:cursor-default"
              >
                <ChevronRight className="text-black" size={48}/>
              </button>

              {/* Products Container */}
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out gap-3 mb-3"
                  style={{
                    transform: `translateX(-${
                      currentIndex * (100 / itemsPerPage)
                    }%)`,
                  }}
                >
                  {baseProducts.map((product, i) => (
                    <ProductCard
                      key={i}
                      product={product}
                      index={i}
                      className="w-1/4 flex-shrink-0"
                      homePage={true}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mobile Scroll View
  return (
    <div className="relative">
      {/* Horizontal Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto overflow-y-visible scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className="flex px-4 min-w-max gap-3">
          {baseProducts.map((product, i) => (
            <div key={`${product.id}-${i}`} className="relative">
              <ProductCard
                key={i}
                product={product}
                index={i}
                className="flex-shrink-0"
              />
            </div>
          ))}
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

export default Bestsellers;
