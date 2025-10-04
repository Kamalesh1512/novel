"use client";
import { useState, useEffect, JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import AutoScrollCarousel from "../global/interactive/autoscroll";
import ProductBanners from "./product-banners";
import { BannerProps } from "@/lib/constants/types";
import { Sparkles } from "lucide-react";

interface ProductDescriptionProps {
  description: string;
  productName: string;
  features?: string[];
  banners?: BannerProps[];
}

export default function ProductDescription({
  description,
  productName,
  features = [],
  banners,
}: ProductDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [keyBenefits, setKeyBenefits] = useState<
    Array<{ icon: JSX.Element; text: string; color: string }>
  >([]);

  // Map feature text to icon and color
  const getFeatureDisplay = (feature: string) => {
    const lowerFeature = feature.toLowerCase();
    if (
      lowerFeature.includes("gentle") ||
      lowerFeature.includes("soft") ||
      lowerFeature.includes("delicate")
    ) {
      return { icon: <span>👶</span>, color: "text-blue-600" };
    }
    if (
      lowerFeature.includes("natural") ||
      lowerFeature.includes("aloe") ||
      lowerFeature.includes("chamomile") ||
      lowerFeature.includes("organic")
    ) {
      return { icon: <span>🌿</span>, color: "text-green-600" };
    }
    if (
      lowerFeature.includes("protect") ||
      lowerFeature.includes("safe") ||
      lowerFeature.includes("tested") ||
      lowerFeature.includes("hypoallergenic")
    ) {
      return { icon: <span>🛡️</span>, color: "text-purple-600" };
    }
    if (
      lowerFeature.includes("travel") ||
      lowerFeature.includes("portable") ||
      lowerFeature.includes("compact") ||
      lowerFeature.includes("convenient")
    ) {
      return { icon: <span>❤️</span>, color: "text-pink-600" };
    }
    if (
      lowerFeature.includes("moistur") ||
      lowerFeature.includes("hydrat") ||
      lowerFeature.includes("nourish")
    ) {
      return { icon: <span>✨</span>, color: "text-cyan-600" };
    }
    if (
      lowerFeature.includes("effective") ||
      lowerFeature.includes("clean") ||
      lowerFeature.includes("fresh")
    ) {
      return { icon: <span>⭐</span>, color: "text-yellow-600" };
    }
    return { icon: <span>✅</span>, color: "text-gray-600" };
  };

  useEffect(() => {
    if (features.length > 0) {
      const benefits = features.slice(0, 4).map((feature) => ({
        ...getFeatureDisplay(feature),
        text: feature,
      }));
      setKeyBenefits(benefits);
    } else {
      setKeyBenefits([
        {
          text: "Premium Quality",
          icon: <span>⭐</span>,
          color: "text-yellow-600",
        },
        { text: "Gentle Care", icon: <span>👶</span>, color: "text-blue-600" },
        {
          text: "Natural Ingredients",
          icon: <span>🌿</span>,
          color: "text-green-600",
        },
        {
          text: "Trusted Brand",
          icon: <span>🛡️</span>,
          color: "text-purple-600",
        },
      ]);
    }
  }, [features]);

  // Simple truncation logic
  const extractSentences = (text: string) => {
    return text.split(/(?<=[.!?])\s+/).filter(Boolean);
  };

  const sentences = extractSentences(description);

  const shortDescription = sentences.slice(0, 2).join(" ");
  const fullDescription = description;

  return (
    <div className="w-full py-12">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </motion.div>

          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Product Story
          </h2>

          <motion.div
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </motion.div>
        </div>

        {/* Key Benefits Carousel */}
        <div className="max-w-6xl mx-auto p-8">
          <AutoScrollCarousel keyBenefits={keyBenefits} />
        </div>

        {/* Product Description */}
        <div className="max-w-6xl mx-auto p-6 text-left">
          <div className="text-gray-700 leading-snug prose max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html: isExpanded ? fullDescription : shortDescription,
              }}
            />
          </div>

          {sentences.length > 2 && (
            <div className="text-center mt-4">
              <Button
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Show Less" : "Read More"}
              </Button>
            </div>
          )}

          {/* Banners
          {isExpanded && banners.length > 0 && (
            <div className="mt-6">
              <ProductBanners banners={banners} />
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
