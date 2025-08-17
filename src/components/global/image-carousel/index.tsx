"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  height?: number;
}

export function ImageCarousel({
  images,
  alt,
  height = 160,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Make sure images is always an array of URLs
  let parsedImages: string[] = [];
  if (Array.isArray(images)) {
    parsedImages = images.flatMap((img) => {
      try {
        const maybeParsed = JSON.parse(img);
        return Array.isArray(maybeParsed) ? maybeParsed : [img];
      } catch {
        return [img]; // fallback if it's a direct URL string
      }
    });
  } else if (typeof images === "string") {
    try {
      const maybeParsed = JSON.parse(images);
      parsedImages = Array.isArray(maybeParsed) ? maybeParsed : [images];
    } catch {
      parsedImages = [images];
    }
  }

  const prev = () => setCurrentIndex((i) => (i === 0 ? parsedImages.length - 1 : i - 1));
  const next = () => setCurrentIndex((i) => (i === parsedImages.length - 1 ? 0 : i + 1));


  return (
    <div
      className="relative w-full overflow-hidden rounded-md"
      style={{ height }}
    >
      {/* image */}
      {parsedImages.length > 0 ? (
        <Image
          src={parsedImages[currentIndex]}
          alt={alt}
          width={50}
          height={50}
          className="object-contain"
          priority
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
          No image
        </div>
      )}

      {/* Controls */}
      {parsedImages.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2"
            onClick={prev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={next}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Indicator Dots */}
      {parsedImages.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
          {parsedImages.map((_, idx) => (
            <span
              key={idx}
              className={`h-2 w-2 rounded-full ${
                idx === currentIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
