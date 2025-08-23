'use client'
import { BannerProps } from "@/lib/constants/types";
import React, { useState, useEffect, useRef } from "react";

interface ProductBannersProps {
  banners: BannerProps[];
  loading?: boolean;
}

const ProductBanners: React.FC<ProductBannersProps> = ({
  banners,
  loading = false,
}) => {
  const [visibleBanners, setVisibleBanners] = useState<Set<number>>(new Set());
  const bannerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!banners.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute("data-index") || "0");
          if (entry.isIntersecting) {
            setVisibleBanners((prev) => {
              const updated = new Set(prev);
              updated.add(index);
              return updated;
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    bannerRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [banners]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!banners.length) return null;

  return (
    <div className="w-full py-8 space-y-8">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
              ref={(el) => {
      bannerRefs.current[index] = el;
    }}
          data-index={index}
          className={`
            relative w-full max-w-6xl mx-auto rounded-xl overflow-hidden shadow-lg bg-transparent
            transform transition-all duration-700 ease-out
            ${
              visibleBanners.has(index)
                ? "translate-x-0 opacity-100 scale-100"
                : "opacity-50 translate-y-4"
            }
          `}
        >
          <div className="relative flex flex-col lg:flex-row items-center min-h-[300px]">

            {/* Image */}
            <div className="flex-1 relative h-64 lg:h-full min-h-[300px]">
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className={`w-fit h-full object-cover transition-all duration-700 ${
                  visibleBanners.has(index) ? "opacity-100 scale-100" : "opacity-60 scale-105"
                }`}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductBanners;

// 'use client';
// import React, { useRef, useEffect, useState } from "react";
// import { BannerProps } from "@/lib/constants/types";

// interface ProductBannerProps {
//   banners: BannerProps[];
//   interval?: number; // auto-scroll interval
// }

// const ProductBanners: React.FC<ProductBannerProps> = ({ banners, interval = 3000 }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % banners.length);
//     }, interval);
//     return () => clearInterval(timer);
//   }, [banners.length, interval]);

//   return (
//     <section className="relative w-full overflow-hidden py-8 bg-gray-50">
//       <div
//         ref={containerRef}
//         className="flex transition-transform duration-700 ease-in-out hover:pause"
//         style={{
//           transform: `translateX(-${currentIndex * 100}%)`,
//         }}
//       >
//         {banners.map((banner) => (
//           <div
//             key={banner.id}
//             className="flex-shrink-0 w-full h-96 rounded-xl overflow-hidden shadow-lg cursor-pointer"
//             style={{ backgroundColor: banner.backgroundColor || "#f8fafc" }}
//           >
//             <img
//               src={banner.imageUrl}
//               alt={banner.title}
//               className="w-full h-full object-cover"
//             />
//           </div>
//         ))}
//       </div>

//       {/* Pause scrolling on hover */}
//       <style jsx>{`
//         .hover\\:pause:hover {
//           animation-play-state: paused;
//         }
//       `}</style>
//     </section>
//   );
// };

// export default ProductBanners;
