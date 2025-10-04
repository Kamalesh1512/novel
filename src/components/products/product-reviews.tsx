"use client";
import React, { useState, useEffect } from "react";
import { Star, ShoppingBag } from "lucide-react";
import { CustomerReviewsType, ReviewCommentType } from "@/lib/constants/types";
import { AnimatedHeading } from "../home/testimonials";

interface ReviewWithSeller extends ReviewCommentType {
  sellerName: string;
  id: string;
}

interface StarRatingProps {
  rating: number;
}

interface CustomerReviewsProps {
  customerReviews: CustomerReviewsType[];
}

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
  const [isHovered, setIsHovered] = useState<boolean>(false);
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
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-16 bg-gray-50">
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

  // Duplicate reviews for infinite scroll
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

  return (
    <div className="max-w-4xl mx-auto py-12 bg-transparent">
      <div className="relative overflow-hidden">
        <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
          What Our Customers Says!
        </h2>
        <div
          className="flex gap-4 sm:gap-6"
          style={{
            width: `${duplicatedReviews.length * (isMobile ? 280 : 320)}px`,
            animationName: "slide",
            animationDuration: `${duplicatedReviews.length * 3}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationPlayState: isHovered ? "paused" : "running",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {duplicatedReviews.map((review, index) => (
            <div
              key={`${review.id}-${index}`}
              className="flex-shrink-0"
              style={{ width: isMobile ? "260px" : "300px" }}
            >
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105 h-56 flex flex-col justify-between">
                {/* Review Text */}
                <p className="text-gray-700 leading-tight line-clamp-2 mb-4 sm:mb-6 text-sm sm:text-base flex-grow overflow-hidden">
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
                    <span className="font-medium text-gray-900 text-sm sm:text-base block">
                      {review.reviewerName}
                    </span>
                    <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500 mt-1">
                      <span>{formatDate(review.date as string)}</span>
                      <span>•</span>
                      <span className="font-medium">{review.sellerName}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(
              -${allReviews.length * (isMobile ? 280 : 320)}px
            );
          }
        }
      `}</style>
    </div>
  );
};
