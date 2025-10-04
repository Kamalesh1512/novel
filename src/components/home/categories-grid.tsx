"use client";

import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "../ui/section-heading";

export const mainCategories = [
  {
    title: "Baby Care",
    href: "/categories/baby-care",
    img: "/Images/categories/baby-care.png",
  },
  {
    title: "Indoor Gear",
    href: "/categories/indoor-gear",
    img: "/Images/categories/indoor.png",
  },

  {
    title: "Outdoor",
    href: "/categories/outdoor-gear",
    img: "/Images/categories/outdoor.png",
  },
  {
    title: "Adult",
    href: "/categories/adult-care",
    img: "/Images/categories/adult-care.png",
  },

  {
    title: "Feeding & Nursing",
    href: "/categories/nursing-feeding",
    img: "/Images/categories/nursing-feeding.png",
  },
  {
    title: "Personal Care",
    href: "/categories/personal-care",
    img: "/Images/categories/personal-care.png",
  },
];

export default function CategoriesGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-20 my-8 md:my-12">
      <SectionHeading
        title="Shop by Category"
        fontStyle="font-sans"
        align="center"
        size="lg"
      />

      <div className="py-8">
        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-12 gap-8 auto-rows-[200px]">
          {/* Left column */}
          <div className="col-span-6 row-span-3">
            <CategoryCard category={mainCategories[0]} idx={0} large />
          </div>
          <div className="col-span-6 row-span-1">
            <CategoryCard category={mainCategories[4]} idx={4} />
          </div>

          {/* Right column (stacked 4) */}
          <div className="col-span-6 row-span-1">
            <CategoryCard category={mainCategories[1]} idx={1} />
          </div>
          <div className="col-span-6 row-span-1">
            <CategoryCard category={mainCategories[2]} idx={2} />
          </div>
          <div className="col-span-6 row-span-1">
            <CategoryCard category={mainCategories[3]} idx={3} />
          </div>
          <div className="col-span-6 row-span-1">
            <CategoryCard category={mainCategories[5]} idx={5} />
          </div>
        </div>

        {/* Mobile grid - same layout as desktop but smaller */}
        <div className="grid md:hidden grid-cols-12 gap-3 auto-rows-[140px]">
          <div className="col-span-6 row-span-3">
            <CategoryCard category={mainCategories[0]} idx={0} large mobile />
          </div>

          <div className="col-span-6 row-span-1">
            <CategoryCard category={mainCategories[4]} idx={4} mobile />
          </div>
          <div className="col-span-6 row-span-1">
            <CategoryCard category={mainCategories[1]} idx={1} mobile />
          </div>
          <div className="col-span-6 row-span-1">
            <CategoryCard category={mainCategories[2]} idx={2} mobile />
          </div>
          <div className="col-span-6 row-span-1">
            <CategoryCard category={mainCategories[3]} idx={3} mobile />
          </div>
          <div className="col-span-6 row-span-1">
            <CategoryCard category={mainCategories[5]} idx={5} mobile />
          </div>
        </div>
      </div>

      {/* Enhanced Animations + Effects */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-3d {
          transform-style: preserve-3d;
        }

        /* Staggered Entrance Animation */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px) rotateX(10deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
          }
        }

        /* Enhanced Hover Effects */
        @keyframes floatingBounce {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-8px) scale(1.02);
          }
        }

        @keyframes gradientSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes underlineGrow {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        /* Floating Particle Animations */
        @keyframes float-1 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-8px) rotate(120deg);
          }
          66% {
            transform: translateY(-4px) rotate(240deg);
          }
        }

        @keyframes float-2 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          50% {
            transform: translateY(-12px) rotate(180deg) scale(1.2);
          }
        }

        @keyframes float-3 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-6px) translateX(3px);
          }
          75% {
            transform: translateY(-3px) translateX(-2px);
          }
        }

        @keyframes float-4 {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          40% {
            transform: translateY(-10px) scale(1.1);
          }
          80% {
            transform: translateY(-2px) scale(0.95);
          }
        }

        /* Animation Classes */
        .animate-float-1 {
          animation: float-1 3s ease-in-out infinite;
        }
        .animate-float-2 {
          animation: float-2 2.5s ease-in-out infinite 0.2s;
        }
        .animate-float-3 {
          animation: float-3 2.8s ease-in-out infinite 0.4s;
        }
        .animate-float-4 {
          animation: float-4 3.2s ease-in-out infinite 0.6s;
        }
        .animate-floating-bounce {
          animation: floatingBounce 2s ease-in-out infinite;
        }
        .animate-gradient-spin {
          animation: gradientSpin 3s linear infinite;
        }
        .animate-underline-grow {
          animation: underlineGrow 0.3s ease-out forwards;
        }

        /* Enhanced Shadow Effects */
        .shadow-3d {
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .shadow-3d-hover {
          box-shadow: 0 25px 50px -12px rgba(34, 197, 94, 0.25),
            0 0 0 1px rgba(34, 197, 94, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        /* Gradient Ring Effect */
        .gradient-ring {
          position: absolute;
          inset: -2px;
          background: conic-gradient(
            from 180deg,
            #10b981,
            #3b82f6,
            #8b5cf6,
            #f59e0b,
            #10b981
          );
          border-radius: inherit;
          opacity: 0;
          transition: opacity 0.5s ease-out;
          z-index: -1;
        }

        .gradient-ring-inner {
          position: absolute;
          inset: 2px;
          background: inherit;
          border-radius: inherit;
        }

        /* Enhanced Gradient Overlay */
        .dynamic-gradient-overlay {
          background: linear-gradient(
            135deg,
            rgba(34, 197, 94, 0.1) 0%,
            rgba(59, 130, 246, 0.15) 25%,
            rgba(139, 92, 246, 0.1) 50%,
            rgba(245, 158, 11, 0.15) 75%,
            rgba(34, 197, 94, 0.1) 100%
          );
          background-size: 400% 400%;
          transition: all 0.5s ease-out;
        }

        .dynamic-gradient-overlay:hover {
          background-position: 100% 100%;
        }
          /* Mobile optimizations */
@media (max-width: 768px) {
  .perspective-1000 {
    perspective: none;
  }
  
  .transform-3d {
    transform-style: flat;
  }
  
  /* Simpler mobile animations */
  @keyframes fadeInUpMobile {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Disable complex animations on mobile */
  .animate-float-1,
  .animate-float-2,
  .animate-float-3,
  .animate-float-4 {
    animation: none;
  }
      `}</style>
    </section>
  );
}

function CategoryCard({ category, idx, large = false, mobile = false }: any) {
  if (mobile) {
    return (
      <Link
        href={category.href}
        className="group cursor-pointer relative w-full h-full"
        style={{
          animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`,
        }}
      >
        <div className="relative w-full h-full rounded-xl overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
          {/* Mobile image container with background */}
          <div
            className={`relative w-full h-full ${
              large ? "bg-gray-50" : "bg-white"
            }`}
          >
            <Image
              src={category.img}
              alt={category.title}
              fill
              className={`transition-all duration-300 group-hover:scale-105 ${
                large
                  ? "object-contain object-center"
                  : "object-cover object-center"
              }`}
            />

            {/* Rest of your overlay code stays the same */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/20 transition-all duration-300 group-hover:from-black/40"></div>
          </div>

          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/0 to-purple-400/0 group-hover:from-blue-400/10 group-hover:to-purple-400/10 transition-all duration-300"></div>
        </div>
      </Link>
    );
  }

  // Keep existing desktop version
  return (
    <Link
      href={category.href}
      className="group cursor-pointer perspective-1000 w-full h-full relative"
      style={{
        animation: `fadeInUp 0.8s ease-out ${idx * 0.15}s both`,
      }}
    >
      {/* 3D Card Container */}
      <div className="relative w-full h-full transform-3d transition-all duration-700 ease-out group-hover:rotate-y-12 group-hover:-translate-y-4">
        {/* Bottom Shadow/Base */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-gray-900/20 rounded-full blur-md transition-all duration-700 group-hover:w-36 group-hover:bg-gray-900/30 z-0"></div>

        {/* Main 3D Image Container */}
        <div className="relative w-full h-full rounded-3xl overflow-hidden transform-3d transition-all duration-700 shadow-3d group-hover:shadow-3d-hover">
          {/* 3D Frame/Border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-100 via-white to-gray-200 p-1 transform-3d">
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white transform-3d">
              {/* Inner Shadow for Depth */}
              <div className="absolute inset-0 shadow-inner-3d rounded-2xl z-10"></div>

              {/* Lighting Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/10 z-20 rounded-2xl transition-all duration-700 group-hover:from-white/60"></div>

              {/* Main Image */}
              <div className="relative w-full h-full transform-3d transition-all duration-700 group-hover:scale-105">
                <Image
                  src={category.img}
                  alt={category.title}
                  fill
                  className="object-cover object-center rounded-2xl transition-all duration-700 group-hover:brightness-110 group-hover:contrast-105"
                />
              </div>

              {/* Top Highlight */}
              <div className="absolute top-2 left-2 right-2 h-8 bg-gradient-to-b from-white/60 to-transparent rounded-t-xl z-30"></div>

              {/* Side Depth Lines */}
              <div className="absolute top-4 right-0 w-px h-24 bg-gradient-to-b from-transparent via-gray-300/50 to-transparent z-30"></div>
              <div className="absolute bottom-4 left-0 w-24 h-px bg-gradient-to-r from-transparent via-gray-300/50 to-transparent z-30"></div>
            </div>
          </div>

          {/* 3D Side Panel Effect */}
          <div
            className="absolute inset-0 rounded-3xl transform-3d translate-z-2 bg-gradient-to-r from-gray-200 to-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-700"
            style={{ transform: "rotateY(90deg) translateZ(20px)" }}
          ></div>

          {/* Floating Glow Effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-all duration-700 blur-sm -z-10 scale-110"></div>

          {/* Reflection Effect */}
          <div className="absolute -bottom-40 left-0 right-0 h-40 bg-gradient-to-t from-transparent via-current/5 to-transparent opacity-30 transform rotate-x-180 scale-y-50 rounded-3xl transition-all duration-700 group-hover:opacity-40"></div>
          {/* Floating Elements Around the 3D Object */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
            {/* Floating Orbs */}
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-float-1 shadow-lg"></div>
            <div className="absolute -top-4 -left-1 w-2 h-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full animate-float-2 shadow-lg"></div>
            <div className="absolute -bottom-2 -right-3 w-2.5 h-2.5 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full animate-float-3 shadow-lg"></div>
            <div className="absolute -bottom-1 -left-2 w-2 h-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full animate-float-4 shadow-lg"></div>
          </div>
        </div>
      </div>
    </Link>
  );
}
