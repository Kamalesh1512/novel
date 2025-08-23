"use client";
import React from "react";
import { Star } from "lucide-react";
import { SectionHeading } from "../ui/section-heading";
import { testimonials } from "@/lib/constants/types";

const Testimonials = () => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? "fill-amber-300 text-amber-300"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ));
  };

  return (
    <div className="w-full bg-transparent py-16 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <SectionHeading
            title="WHAT OUR CUSTOMER SAYS!"
            fontStyle="font-bebas"
            align="center"
            size="lg"
            letterSpacing="2px"
          />
        </div>

        {/* Scrolling Carousel */}
        <div className="relative">
          {/* Gradient masks for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>

          <div className="overflow-hidden">
            <div className="flex gap-8 animate-scroll">
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div
                  key={`${testimonial.id}-${index}`}
                  className="flex-shrink-0 w-80 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  {/* Header */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                      {testimonial.name}
                    </h3>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4 scale-75 origin-left">
                    {renderStars(testimonial.rating)}
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {testimonial.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Animation */}
        <style jsx>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-scroll {
            animation: scroll 40s linear infinite;
            width: max-content;
          }

          @media (max-width: 268px) {
            .flex-shrink-0 {
              width: 180px;
            }
          }
          @media (max-width: 240px) {
            .flex-shrink-0 {
              width: 160px;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Testimonials;
