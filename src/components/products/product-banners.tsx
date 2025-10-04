"use client";

import { BannerProps } from "@/lib/constants/types";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

interface ProductBannersProps {
  banners: BannerProps[];
  loading?: boolean;
}

const ProductBanners: React.FC<ProductBannersProps> = ({
  banners,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!banners.length) {
    return (
      <div className="relative w-full h-64 bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">No banners available</div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        .product-banner-carousel {
          width: 100%;
          height: 300px; /* Base height for product banners */
        }

        .product-banner-carousel .swiper-slide {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }

        .product-banner-carousel .swiper-pagination {
          bottom: 10px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
        }

        .product-banner-carousel .swiper-pagination-bullet {
          width: 8px !important;
          height: 8px !important;
          background-color: #ffffff !important;
          opacity: 0.4 !important;
          margin: 0 3px !important;
          transition: all 0.3s ease !important;
        }

        .product-banner-carousel .swiper-pagination-bullet-active {
          background-color: #16a34a !important; /* Tailwind green-600 */
          opacity: 1 !important;
        }

        @media (min-width: 640px) {
          .product-banner-carousel {
            height: 350px;
          }
        }

        @media (min-width: 1024px) {
          .product-banner-carousel {
            height: 400px;
          }
        }
      `}</style>

      <div className="relative w-full overflow-hidden py-8">
        <Swiper
          className="product-banner-carousel"
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          speed={900}
        >
          {banners.map((banner, index) => (
            <SwiperSlide key={banner.id}>
              <div className="relative w-full h-full">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default ProductBanners;

