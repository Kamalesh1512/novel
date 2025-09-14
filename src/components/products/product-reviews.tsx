"use client";
import React, { useState, useEffect } from "react";
import { Star, Pause, Play, ShoppingBag } from "lucide-react";
import { CustomerReviewsType, ReviewCommentType } from "@/lib/constants/types";
import { Button } from "../ui/button";

interface ReviewWithSeller extends ReviewCommentType {
  sellerName: string;
  id: string;
}

interface AnimatedLetterProps {
  letter: string;
  delay: number;
}

interface AnimatedHeadingProps {
  children: string;
}

interface StarRatingProps {
  rating: number;
}

interface CustomerReviewsProps {
  customerReviews: CustomerReviewsType[];
}

const AnimatedLetter: React.FC<AnimatedLetterProps> = ({ letter, delay }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 100);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`inline-block transition-all duration-500 ${
        isVisible
          ? "opacity-100 transform translate-y-0"
          : "opacity-0 transform translate-y-2"
      }`}
    >
      {letter}
    </div>
  );
};

const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({ children }) => {
  const words = children.split(" ");
  let letterIndex = 0;

  return (
    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 font-bebas leading-tight">
      {words.map((word: string, wordIndex: number) => (
        <span key={wordIndex} className="inline-block mr-2 sm:mr-4">
          {word.split("").map((letter: string, i: number) => (
            <AnimatedLetter
              key={`${wordIndex}-${i}`}
              letter={letter}
              delay={letterIndex++}
            />
          ))}
        </span>
      ))}
    </h1>
  );
};

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="relative w-4 h-4 sm:w-5 sm:h-5">
          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-gray-200 fill-gray-200" />
          {i < rating && (
            <div className="absolute inset-0 overflow-hidden">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  customerReviews = [],
}) => {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentOffset, setCurrentOffset] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = (): void => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Flatten all reviews from all sellers
  const allReviews: ReviewWithSeller[] = customerReviews.reduce(
    (acc: ReviewWithSeller[], seller) => {
      if (seller.topComments && seller.topComments.length > 0) {
        const reviewsWithSeller = seller.topComments.map((review) => ({
          ...review,
          sellerName: seller.sellerName,
          id: `${seller.sellerName}-${review.reviewerName}-${review.date}`,
        }));
        return [...acc, ...reviewsWithSeller];
      }
      return acc;
    },
    []
  );

  // If no reviews available, show placeholder
  if (allReviews.length === 0) {
    return (
      <div
        className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 overflow-hidden rounded-t-2xl"
        style={{
          backgroundImage: "url('/Images/tests-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: isMobile ? "40px 20px" : "60px 40px 120px 40px",
        }}
      >
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            No Reviews Available
          </h2>
          <p className="text-gray-500">
            Customer reviews will appear here once available.
          </p>
        </div>
      </div>
    );
  }

  // Duplicate reviews for infinite scroll (triple for smooth loop)
  const duplicatedReviews: ReviewWithSeller[] = [
    ...allReviews,
    ...allReviews,
    ...allReviews,
  ];

  // Calculate total reviews and average rating
  const totalReviews: number = customerReviews.reduce(
    (sum, seller) => sum + (seller.totalReviews || 0),
    0
  );
  const averageRating: number =
    customerReviews.length > 0
      ? customerReviews.reduce(
          (sum, seller) => sum + (seller.averageRating || 0),
          0
        ) / customerReviews.length
      : 0;

  useEffect(() => {
    if (isPaused || allReviews.length === 0) return;

    const interval = setInterval(() => {
      setCurrentOffset((prev: number) => {
        const newOffset = prev - 3; // Increased from 1 to 3 pixels per frame (same as testimonials)
        const cardWidth = isMobile ? 280 : 320; // Card width
        const gap = isMobile ? 16 : 24;
        const totalWidth = allReviews.length * (cardWidth + gap);

        if (Math.abs(newOffset) >= totalWidth) {
          return 0;
        }
        return newOffset;
      });
    }, 30); // Reduced from 50ms to 30ms for faster updates (same as testimonials)

    return () => clearInterval(interval);
  }, [isPaused, isMobile, allReviews.length]);

  return (
    <div
      className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 overflow-hidden rounded-t-2xl"
      style={{
        backgroundImage: "url('/Images/tests-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: isMobile ? "40px 20px" : "60px 40px 120px 40px",
      }}
    >
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start lg:items-center">
          {/* Left Column */}
          <div className="space-y-6 sm:space-y-8">
            {/* Pause Button */}
            <Button onClick={() => setIsPaused(!isPaused)} variant={"outline"}>
              {isPaused ? (
                <Play className="w-4 h-4" />
              ) : (
                <Pause className="w-4 h-4" />
              )}
              <span className="font-medium">{isPaused ? "Play" : "Pause"}</span>
            </Button>

            {/* Animated Heading */}
            <AnimatedHeading>What Our Customers Says!</AnimatedHeading>

            {/* Description */}
            <p className="text-black text-base sm:text-lg leading-relaxed">
              Discover authentic reviews from customers who love our products.
              Their genuine experiences highlight the quality, effectiveness,
              and satisfaction that make our products their trusted choice.
            </p>

            {/* Rating Summary */}
            {totalReviews > 0 && (
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <StarRating rating={Math.round(averageRating)} />
                  <span className="text-black font-medium text-sm sm:text-base ml-2">
                    {averageRating.toFixed(1)}
                  </span>
                </div>
                <p className="text-black font-medium text-sm sm:text-base">
                  {totalReviews.toLocaleString()}+ Customer Reviews
                </p>
              </div>
            )}

            {/* Seller Summary Grid */}
            {customerReviews.length > 0 && (
              <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 hover:shadow-xl transition-shadow p-4 sm:p-6">
                <h3 className="text-black font-medium text-lg mb-4">
                  Reviews on Platforms:
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {customerReviews.map((seller, index) => (
                    <div
                      key={`${seller.sellerName}-${index}`}
                      className="flex items-center justify-between bg-white/30 rounded-lg p-3"
                    >
                      <div>
                        <p className="font-medium text-black">
                          {seller.sellerName}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <StarRating
                            rating={Math.round(seller.averageRating)}
                          />
                          <span className="text-black text-sm">
                            {seller.averageRating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-black text-sm font-medium">
                          {seller.totalReviews.toLocaleString()}
                        </p>
                        <p className="text-black text-xs">reviews</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Horizontal Carousel */}
          <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
            <div
              className="flex transition-transform duration-75 ease-linear"
              style={{
                transform: `translateX(${currentOffset}px)`,
                animation: isPaused ? "none" : undefined,
              }}
            >
              {duplicatedReviews.map((review, index) => (
                <div
                  key={`${review.id}-${index}`}
                  className="flex-shrink-0 mr-4 sm:mr-6"
                  style={{ width: isMobile ? "260px" : "300px" }}
                >
                  <div className="bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-white/30 hover:shadow-xl transition-shadow h-56 flex flex-col justify-between">
                    {/* Review Text */}
                    <p className="text-black leading-tight line-clamp-2 mb-4 sm:mb-6 text-sm sm:text-base flex-grow overflow-hidden">
                      "{review.comment}"
                    </p>

                    {/* Author, Rating and Date */}
                    <div className="space-y-3">
                      {/* Rating */}
                      <div className="flex justify-center">
                        <StarRating rating={review.rating} />
                      </div>

                      {/* Reviewer Info */}
                      <div className="text-center">
                        <span className="font-medium text-black text-sm sm:text-base block">
                          {review.reviewerName}
                        </span>
                        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-700 mt-1">
                          <span>{formatDate(review.date as string)}</span>
                          <span>•</span>
                          <span className="font-medium">
                            {review.sellerName}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
