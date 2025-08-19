"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";
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

export default function AnnouncementBanner() {
  const [banners, setBanners] = useState<BannerProps[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("/api/banners/active");
        const data = await res.json();

        // Filter banners with priority === 3
        const filtered = (data.banners || []).filter(
          (banner: BannerProps) => banner.priority === 3
        );
        setBanners(filtered);
      } catch (error) {
        console.error("Error fetching announcement banners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const handleBannerClick = (linkUrl: string) => {
    if (linkUrl) {
      router.push(linkUrl);
    }
  };

  if (banners.length === 0) {
    return (
      <div className="relative w-full min-h-[120px] md:min-h-[150px] bg-transparent flex items-center justify-center">
        <div className="text-gray-500">No announcement banners available</div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        .announcement-banner {
          width: 100%;
          height: 100vh;
        }

        .announcement-banner .swiper-slide {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .announcement-banner .swiper-pagination {
          bottom: 12px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
        }

        .announcement-banner .swiper-pagination-bullet {
          width: 10px !important;
          height: 10px !important;
          background-color: #ffffff !important;
          opacity: 0.4 !important;
          margin: 0 4px !important;
          transition: all 0.3s ease !important;
        }

        .announcement-banner .swiper-pagination-bullet-active {
          background-color: #000000 !important;
          opacity: 1 !important;
        }

        @media (min-width: 640px) {
          .announcement-banner .swiper-pagination {
            bottom: 24px !important;
          }
        }
      `}</style>

      <div className="relative w-full overflow-hidden">
        <Swiper
          className="announcement-banner"
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
            <SwiperSlide
              key={banner.id}
              onClick={() => handleBannerClick(banner.linkUrl)}
              className="cursor-pointer"
            >
              <div className="relative min-h-[320px] md:h-full bg-transparent">
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