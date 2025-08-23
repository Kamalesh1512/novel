"use client";
import { Product3DModel } from "@/components/global/product-3d-model";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  selectedImage: number;
  viewMode: "image" | "3d";
  modelUrl?: string;
  onImageSelect: (index: number) => void;
}

export const ProductImageGallery = ({
  images,
  productName,
  selectedImage,
  viewMode,
  onImageSelect,
  modelUrl,
}: ProductImageGalleryProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isAutoPlay) {
      interval = setInterval(() => {
        onImageSelect((selectedImage + 1) % images.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, selectedImage, images.length, onImageSelect]);

  return (
    <div className="space-y-4">
      {/* Main Display Area */}
      <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
        {viewMode === "3d" && modelUrl ? (
          <Product3DModel
            modelUrl={modelUrl}
            className="w-full h-full"
            autoRotate={false}
            enableZoom={true}
          />
        ) : (
          <img
            src={images[selectedImage]}
            alt={productName}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Thumbnail Images - Only show in image mode */}
      {viewMode === "image" && (
        <div className="flex space-x-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onImageSelect(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                selectedImage === index ? "border-gray-800" : "border-gray-200"
              }`}
            >
              <img
                src={image}
                alt={`${productName} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* 3D Model Info */}
      {viewMode === "3d" && (
        <div className="text-center text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
          <RotateCcw className="inline w-4 h-4 mr-1" />
          Drag to rotate • Scroll to zoom • Interactive 3D model
        </div>
      )}
    </div>
  );
};
