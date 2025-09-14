"use client";
import React, { useState, useEffect } from "react";
import { Star, Pause, Play } from "lucide-react";
import { testimonials } from "@/lib/constants/types";
import { SectionHeading } from "../ui/section-heading";

const AnimatedLetter = ({ letter, delay }: any) => {
  const [isVisible, setIsVisible] = useState(false);

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

const AnimatedHeading = ({ children }: any) => {
  const words = children.split(" ");
  let letterIndex = 0;

  return (
    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 font-bebas leading-tight">
      {words.map((word: any, wordIndex: any) => (
        <span key={wordIndex} className="inline-block mr-2 sm:mr-4">
          {word.split("").map((letter: any, i: any) => (
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

const StarRating = ({ rating }: any) => {
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

const Testimonials = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Duplicate testimonials for infinite scroll
  const duplicatedTestimonials = [
    ...testimonials,
    ...testimonials,
    ...testimonials,
  ];

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentOffset((prev) => {
        const newOffset = prev - 3; // Increased from 1 to 3 pixels per frame
        // Reset when we've scrolled through one complete set
        const cardHeight = isMobile ? 200 : 240; // Adjusted for mobile
        const gap = isMobile ? 16 : 24;
        const totalHeight = testimonials.length * (cardHeight + gap);

        if (Math.abs(newOffset) >= totalHeight) {
          return 0;
        }
        return newOffset;
      });
    }, 30); // Reduced from 50ms to 30ms for faster updates

    return () => clearInterval(interval);
  }, [isPaused, isMobile]);

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
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              {isPaused ? (
                <Play className="w-4 h-4" />
              ) : (
                <Pause className="w-4 h-4" />
              )}
              <span className="font-medium">{isPaused ? "Play" : "Pause"}</span>
            </button>

            {/* Animated Heading */}
            <AnimatedHeading>Real Stories, Real Trust</AnimatedHeading>

            {/* Description */}
            <p className="text-black text-base sm:text-lg leading-relaxed">
              Hear from real customers who trust our products for their
              families. Their stories highlight the quality, effectiveness, and
              care that make our products a must-have for everyday use.
            </p>

            {/* Rating Summary */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2">
                <StarRating rating={5} />
              </div>
              <p className="text-black font-medium text-sm sm:text-base">
                2,000+ Ratings
              </p>
            </div>

            {/* Product Image Grid */}
            <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 hover:shadow-xl transition-shadow">
              <div className="w-full grid grid-cols-3 gap-2 p-3 sm:p-4">
                <div className="aspect-square">
                  <img
                    src="/Images/products/p1.jpg"
                    alt="Product 1"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="aspect-square">
                  <img
                    src="/Images/products/p2.jpg"
                    alt="Product 2"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="aspect-square">
                  <img
                    src="/Images/products/p3.jpg"
                    alt="Product 3"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Vertical Carousel */}
          <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
            <div
              className="transition-transform duration-75 ease-linear"
              style={{
                transform: `translateY(${currentOffset}px)`,
                animation: isPaused ? "none" : undefined,
              }}
            >
              {duplicatedTestimonials.map((testimonial, index) => (
                <div
                  key={`${testimonial.id}-${index}`}
                  className="mb-4 sm:mb-6"
                >
                  <div className="bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-white/30 hover:shadow-xl transition-shadow min-h-[180px] sm:min-h-[200px] lg:min-h-[224px] flex flex-col justify-between">
                    {/* Review Text */}
                    <p className="text-black leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base flex-grow">
                      {testimonial.text}
                    </p>

                    {/* Author and Rating */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                      <span className="font-medium text-black text-sm sm:text-base">
                        {testimonial.name}
                      </span>
                      <StarRating rating={testimonial.rating} />
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

export default Testimonials;
