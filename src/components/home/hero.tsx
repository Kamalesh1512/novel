"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { LoadingScreen } from "../global/loading";
import { useRouter } from "next/navigation";

interface BannerProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  priority: number;
  bannerType: string;
}

export default function HeroBannerCarousel() {
  const [banners, setBanners] = useState<BannerProps[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter()

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("/api/banners/active");
        const data = await res.json();
        setBanners(data.banners || []);
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  if (loading) {
    return (
      <LoadingScreen description=""/>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="relative w-full h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">No banners available</div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        .hero-banner-carousel {
          width: 100%;
          height: 100vh;
        }
        
        .hero-banner-carousel .swiper-slide {
          position: relative;
          width: 100%;
          height: 100%;
        }
        
        .hero-banner-carousel .swiper-pagination {
          bottom: 12px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
        }
        
        .hero-banner-carousel .swiper-pagination-bullet {
          width: 10px !important;
          height: 10px !important;
          background-color: #ffffff !important;
          opacity: 0.4 !important;
          margin: 0 4px !important;
          transition: all 0.3s ease !important;
        }
        
        .hero-banner-carousel .swiper-pagination-bullet-active {
          background-color: #000000 !important;
          opacity: 1 !important;
        }
        
        @media (min-width: 640px) {
          .hero-banner-carousel .swiper-pagination {
            bottom: 24px !important;
          }
        }
      `}</style>

      <div className="relative w-full overflow-visible">
        <Swiper
          className="hero-banner-carousel"
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          spaceBetween={0}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          speed={1000}
        >
          {banners.map((banner, index) => (
            <SwiperSlide key={banner.id} onClick={()=>router.push(banner.linkUrl)} className="cursor-pointer">
              <div className="relative w-full h-screen">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  className="w-full h-full object-cover object-center"
                  priority={index === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}