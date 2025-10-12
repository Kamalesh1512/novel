// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination } from "swiper/modules";

// // Import Swiper styles
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/autoplay";
// import { LoadingScreen } from "../global/loading";
// import { useRouter } from "next/navigation";

// interface BannerProps {
//   id: string;
//   title: string;
//   description: string;
//   imageUrl: string;
//   linkUrl: string;
//   priority: number;
//   bannerType: string;
// }

// export default function Hero() {
//   const [banners, setBanners] = useState<BannerProps[]>([]);
//   const [loading, setLoading] = useState(true);

//   const router = useRouter();

//   useEffect(() => {
//     const fetchBanners = async () => {
//       try {
//         const res = await fetch("/api/banners/active");
//         const data = await res.json();
//         const filteredBanners = (data.banners || []).filter(
//           (banner: BannerProps) => banner.priority === 1
//         );

//         setBanners(filteredBanners);
//       } catch (error) {
//         console.error("Error fetching banners:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBanners();
//   }, []);

//   if (banners.length === 0) {
//     return (
//       <div className="relative w-full h-64 bg-gray-100 flex items-center justify-center">
//         <div className="text-gray-500">No banners available</div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <style jsx global>{`
//         .hero-banner-carousel {
//           width: 100%;
//           height: 300px;
//         }

//         .hero-banner-carousel .swiper-slide {
//           position: relative;
//           width: 100%;
//           height: 100%;
//         }

//         .hero-banner-carousel .swiper-pagination {
//           bottom: 12px !important;
//           left: 50% !important;
//           transform: translateX(-50%) !important;
//         }

//         .hero-banner-carousel .swiper-pagination-bullet {
//           width: 10px !important;
//           height: 10px !important;
//           background-color: #ffffff !important;
//           opacity: 0.4 !important;
//           margin: 0 4px !important;
//           transition: all 0.3s ease !important;
//         }

//         .hero-banner-carousel .swiper-pagination-bullet-active {
//           background-color: #000000 !important;
//           opacity: 1 !important;
//         }

//         /* Responsive heights for different screen sizes */
//         @media (min-width: 640px) {
//           .hero-banner-carousel {
//             height: 400px;
//           }
//           .hero-banner-carousel .swiper-pagination {
//             bottom: 20px !important;
//           }
//         }

//         @media (min-width: 768px) {
//           .hero-banner-carousel {
//             height: 450px;
//           }
//         }

//         @media (min-width: 1024px) {
//           .hero-banner-carousel {
//             height: 500px;
//           }
//         }

//         @media (min-width: 1280px) {
//           .hero-banner-carousel {
//             height: 550px;
//           }
//         }

//         @media (min-width: 1536px) {
//           .hero-banner-carousel {
//             height: 600px;
//           }
//         }
//       `}</style>

//       <div className="relative w-full overflow-hidden z-0">
//         <Swiper
//           className="hero-banner-carousel"
//           modules={[Autoplay, Pagination]}
//           slidesPerView={1}
//           spaceBetween={0}
//           loop
//           autoplay={{
//             delay: 5000,
//             disableOnInteraction: false,
//           }}
//           pagination={{ clickable: true }}
//           speed={1000}
//         >
//           {banners.map((banner) => (
//             <SwiperSlide
//               key={banner.id}
//               onClick={() => router.push(banner.linkUrl)}
//               className="cursor-pointer"
//             >
//               <div className="relative w-full h-full">
//                 <Image
//                   src={banner.imageUrl}
//                   alt={banner.title}
//                   fill
//                   className="object-contain object-center bg-gray-50"
//                   priority
//                   sizes="100vw"
//                 />
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useRouter } from "next/navigation";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

interface BannerProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  priority: number;
  bannerType: string;
}

export default function Hero() {
  const [banners, setBanners] = useState<BannerProps[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("/api/banners/active");
        const data = await res.json();
        const filteredBanners = (data.banners || []).filter(
          (banner: BannerProps) => banner.priority === 1
        );
        setBanners(filteredBanners);
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center w-screen h-[80vh] bg-transparent">
        <div className="text-gray-400">Loading banners...</div>
      </div>
    );

  if (banners.length === 0)
    return (
      <div className="flex items-center justify-center w-screen h-[80vh] bg-transparent">
        <div className="text-gray-400">No banners available</div>
      </div>
    );

  return (
    <>
      <style jsx global>{`
        :root {
          --header-height: 80px; /* adjust if your header height differs */
        }

        .hero-banner-carousel {
          width: 100vw !important;
          height: calc(100vh - var(--header-height)) !important;
        }

        .hero-banner-carousel .swiper-slide {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .hero-banner-carousel .swiper-pagination {
          bottom: 25px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
        }

        .hero-banner-carousel .swiper-pagination-bullet {
          width: 10px !important;
          height: 10px !important;
          background-color: #ffffff !important;
          opacity: 0.5 !important;
          transition: all 0.3s ease !important;
        }

        .hero-banner-carousel .swiper-pagination-bullet-active {
          background-color: #ffffff !important;
          opacity: 1 !important;
        }

        /* Make sure it adapts to all screens without cropping */
        @media (min-aspect-ratio: 21/9) {
          .hero-banner-carousel .swiper-slide img {
            object-fit: contain !important;
            background-color: #000 !important;
          }
        }
      `}</style>

      <div
        className="relative w-screen overflow-hidden z-0 bg-transparent -mt-[64px] md:-mt-[65px] lg:-mt-[68px] xl:-mt-[60px] 2xl:-mt-[100px]"
      >
        <Swiper
          className="hero-banner-carousel"
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          loop
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          speed={1000}
        >
          {banners.map((banner) => (
            <SwiperSlide
              key={banner.id}
              onClick={() => router.push(banner.linkUrl)}
              className="cursor-pointer"
            >
              <div className="relative w-screen h-full">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  className="object-contain"
                  priority
                  sizes="100vw"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
