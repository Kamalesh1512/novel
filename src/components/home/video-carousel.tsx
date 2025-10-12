"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "../ui/section-heading";

interface Video {
  id: number;
  title: string;
  description?: string;
  linkUrl: string;
  videoUrl: string;
  videoType?: string;
  priority: number;
  thumbnailUrl?: string;
}

const VideoCarousel = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/videos/active");
        const data = await res.json();

        const filtered = data.videos.filter(
          (v: Video) => v.videoType === "home" && v.priority === 1
        );

        setVideos(filtered);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const itemWidth = 228.25;
    const gap = 0;
    const scrollAmount = itemWidth + gap;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className="w-full py-8">
        <p className="text-center text-gray-500">Loading videos...</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="w-full py-8">
        <p className="text-center text-gray-500">No videos available.</p>
      </div>
    );
  }

  return (
    <div id="video-feed" className="w-full py-8 bg-transparent">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10 transition-all duration-1000 translate-y-0 opacity-100">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-sans text-green-700 mb-2">
            Get Inspired
          </h2>
          {/* <p className="text-sm md:text-lg text-gray-700 text-center">
            Follow Us On Instagram
          </p> */}
        </div>

        {/* Carousel Container */}
        <div className="relative mx-auto" style={{ maxWidth: "913px" }}>
          <div className="overflow-hidden">
            <div
              ref={scrollRef}
              className="flex overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ gap: "0px" }}
            >
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="flex-shrink-0 relative group"
                  style={{
                    clipPath: "inset(0px)",
                    width: "228.25px",
                    height: "228.25px",
                  }}
                >
                  {/* Auto-playing Video */}
                  <video
                    preload="auto"
                    autoPlay={true}
                    muted={true}
                    playsInline={true}
                    loop={true}
                    className="w-full h-full object-cover"
                    style={{ borderRadius: "0px" }}
                    poster={video.thumbnailUrl}
                  >
                    <source src={video.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {/* Hover Overlay - Instagram style */}
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`Video: ${video.title}`}
                    className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all duration-300 cursor-pointer flex items-center justify-center"
                    style={{ borderRadius: "0px" }}
                    onClick={() => {
                      if (video.linkUrl) {
                        window.open(video.linkUrl, "_blank");
                      }
                    }}
                    onKeyDown={(e) => {
                      if (
                        (e.key === "Enter" || e.key === " ") &&
                        video.linkUrl
                      ) {
                        e.preventDefault();
                        window.open(video.linkUrl, "_blank");
                      }
                    }}
                  ></div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows - Instagram style */}
          <button
            aria-label="previous post"
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
            style={{ marginLeft: "10px", paddingRight: "2px" }}
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>

          <button
            aria-label="next post"
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
            style={{ marginRight: "10px", paddingLeft: "2px" }}
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default VideoCarousel;
