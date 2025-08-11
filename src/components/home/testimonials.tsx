"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { SectionHeading } from "../ui/section-heading";

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Gunveet",
      handle: "@gunveetdang",
      text: "I always buy perfumes based on notes and BELLAVITA explain how different notes make you feel so well!",
      rating: 4,
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      handle: "@sarahj_beauty",
      text: "The customer service is exceptional and the product quality exceeds expectations every single time!",
      rating: 3,
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 3,
      name: "Michael Chen",
      handle: "@mikec_reviews",
      text: "Outstanding experience from start to finish. The attention to detail is what sets this brand apart.",
      rating: 4.5,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 4,
      name: "Emma Rodriguez",
      handle: "@emma_lifestyle",
      text: "I've been a loyal customer for years and they never disappoint. Quality and service are unmatched!",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 5,
      name: "David Kim",
      handle: "@davidk_official",
      text: "The best investment I've made this year. Highly recommend to anyone looking for premium quality.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    },
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: any) => {
    setCurrentIndex(index);
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));

  return (
    <div className="container mx-auto md:pl-16">
      <SectionHeading
        title="WHAT OUR CUSTOMERS SAYS!"
        fontStyle="font-bebas"
        align="center"
        size="lg"
      />
      <div className="relative md:px-40">
        {/* Main testimonial area */}
        <div className="bg-white rounded-2xl p-4 sm:p-8 mx-2 sm:mx-4 min-h-[280px] sm:min-h-[300px] flex flex-col justify-center items-center text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-transparent opacity-30"></div>

          <div className="relative z-10">
            {/* Avatar row */}
            <div className="flex justify-center items-center mb-6 sm:mb-8 overflow-hidden">
              <div className="flex space-x-2 sm:space-x-4 items-center">
                {testimonials.map((testimonial, index) => {
                  const isCenter = index === currentIndex;
                  const distance = Math.abs(index - currentIndex);
                  const minDistance = Math.min(
                    distance,
                    testimonials.length - distance
                  );

                  // Show only nearby avatars (2 on each side for desktop, 1 for mobile)
                  const isMobile =
                    typeof window !== "undefined"
                      ? window.innerWidth < 640
                      : false;
                  const maxDistance = isMobile ? 1 : 2;
                  if (minDistance > maxDistance) return null;

                  return (
                    <div
                      key={testimonial.id}
                      className={`rounded-full overflow-hidden border-4 transition-all duration-300 cursor-pointer ${
                        isCenter
                          ? "w-20 h-20 sm:w-24 sm:h-24 border-amber-500 shadow-lg"
                          : "w-12 h-12 sm:w-16 sm:h-16 border-gray-200 opacity-60 hover:opacity-80"
                      }`}
                      onClick={() => goToSlide(index)}
                    >
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rating stars */}
            <div className="flex justify-center mb-4 sm:mb-6">
              {renderStars(testimonials[currentIndex].rating)}
            </div>

            {/* Testimonial text */}
            <div className="max-w-3xl mx-auto px-2">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 font-medium">
                "{testimonials[currentIndex].text}"
              </p>

              <div className="text-center">
                <p className="text-gray-900 font-semibold text-base sm:text-lg mb-1">
                  — {testimonials[currentIndex].name}
                </p>
                <p className="text-gray-500 text-sm flex items-center justify-center">
                  <span className="mr-1">📱</span>
                  {testimonials[currentIndex].handle}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prevTestimonial}
          className="absolute left-2 sm:left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 sm:p-3 hover:bg-gray-50 transition-colors duration-200"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" />
        </button>

        <button
          onClick={nextTestimonial}
          className="absolute right-2 sm:right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 sm:p-3 hover:bg-gray-50 transition-colors duration-200"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" />
        </button>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center mt-8 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? "bg-amber-500 scale-125"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCarousel;
