"use client";
import { useState, useEffect, JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Sparkles,
  Heart,
  Shield,
  Leaf,
  Baby,
  Star,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AutoScrollCarousel from "../global/interactive/autoscroll";
import ProductBanners from "./product-banners";
import { BannerProps } from "@/lib/constants/types";

interface ProductDescriptionProps {
  description: string;
  productName: string;
  features?: string[];
  banners: BannerProps[];
}

export default function ProductDescription({
  description,
  productName,
  features = [],
  banners,
}: ProductDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [highlightedWords, setHighlightedWords] = useState<string[]>([]);
  const [currentHighlight, setCurrentHighlight] = useState(0);
  const [keyBenefits, setKeyBenefits] = useState<
    Array<{ icon: JSX.Element; text: string; color: string }>
  >([]);

  // Extract meaningful keywords
  const extractKeyWords = (text: string): string[] => {
    const stopWords = new Set([
      "the",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "will",
      "would",
      "could",
      "should",
      "may",
      "might",
      "a",
      "an",
      "this",
      "that",
      "these",
      "those",
      "i",
      "you",
      "he",
      "she",
      "it",
      "we",
      "they",
    ]);

    const words = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, " ")
      .split(/\s+/)
      .filter(
        (word) => word.length > 3 && !stopWords.has(word) && !/^\d+$/.test(word)
      );

    const phrases: string[] = [];
    const compoundPhrases =
      text.match(/\b[A-Za-z]+(?:[-\s][A-Za-z]+)+\b/g) || [];
    compoundPhrases.forEach((phrase) => {
      if (phrase.length > 5 && phrase.split(/[-\s]/).length <= 3) {
        phrases.push(phrase.toLowerCase());
      }
    });

    return [...new Set([...words, ...phrases])].slice(0, 8);
  };

  // Map feature text to icon and color
  const getFeatureDisplay = (feature: string) => {
    const lowerFeature = feature.toLowerCase();
    if (
      lowerFeature.includes("gentle") ||
      lowerFeature.includes("soft") ||
      lowerFeature.includes("delicate")
    ) {
      return { icon: <Baby className="w-4 h-4" />, color: "text-blue-600" };
    }
    if (
      lowerFeature.includes("natural") ||
      lowerFeature.includes("aloe") ||
      lowerFeature.includes("chamomile") ||
      lowerFeature.includes("organic")
    ) {
      return { icon: <Leaf className="w-4 h-4" />, color: "text-green-600" };
    }
    if (
      lowerFeature.includes("protect") ||
      lowerFeature.includes("safe") ||
      lowerFeature.includes("tested") ||
      lowerFeature.includes("hypoallergenic")
    ) {
      return { icon: <Shield className="w-4 h-4" />, color: "text-purple-600" };
    }
    if (
      lowerFeature.includes("travel") ||
      lowerFeature.includes("portable") ||
      lowerFeature.includes("compact") ||
      lowerFeature.includes("convenient")
    ) {
      return { icon: <Heart className="w-4 h-4" />, color: "text-pink-600" };
    }
    if (
      lowerFeature.includes("moistur") ||
      lowerFeature.includes("hydrat") ||
      lowerFeature.includes("nourish")
    ) {
      return { icon: <Sparkles className="w-4 h-4" />, color: "text-cyan-600" };
    }
    if (
      lowerFeature.includes("effective") ||
      lowerFeature.includes("clean") ||
      lowerFeature.includes("fresh")
    ) {
      return { icon: <Star className="w-4 h-4" />, color: "text-yellow-600" };
    }
    return {
      icon: <CheckCircle className="w-4 h-4" />,
      color: "text-gray-600",
    };
  };

  useEffect(() => {
    // Extract keywords
    const extractedWords = extractKeyWords(description);
    setHighlightedWords(extractedWords);

    // Set key benefits
    if (features.length > 0) {
      const benefits = features.slice(0, 4).map((feature) => ({
        ...getFeatureDisplay(feature),
        text: feature,
      }));
      setKeyBenefits(benefits);
    } else {
      const defaultBenefits = [
        {
          text: "Premium Quality",
          icon: <Star className="w-4 h-4" />,
          color: "text-yellow-600",
        },
        {
          text: "Gentle Care",
          icon: <Baby className="w-4 h-4" />,
          color: "text-blue-600",
        },
        {
          text: "Natural Ingredients",
          icon: <Leaf className="w-4 h-4" />,
          color: "text-green-600",
        },
        {
          text: "Trusted Brand",
          icon: <Shield className="w-4 h-4" />,
          color: "text-purple-600",
        },
      ];
      setKeyBenefits(defaultBenefits);
    }
  }, [description, features]);

  // Highlight word cycling
  useEffect(() => {
    if (highlightedWords.length === 0) return;
    const interval = setInterval(() => {
      setCurrentHighlight((prev) => (prev + 1) % highlightedWords.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [highlightedWords.length]);

  const sentences = description.split(/(?<=[.!?])\s+/).filter((s) => s.trim());
  const shortDescription = sentences.slice(0, 2).join(" ");
  const fullDescription = description;

  // Highlight current word
  const highlightText = (text: string) => {
    if (highlightedWords.length === 0) return text;
    const currentWord = highlightedWords[currentHighlight];
    if (!currentWord) return text;
    const regex = new RegExp(
      `(${currentWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);
    return parts.map((part, idx) => {
      if (part.toLowerCase() === currentWord.toLowerCase()) {
        return (
          <motion.span
            key={idx}
            className="bg-gradient-to-r from-green-200 to-green-300 px-1 py-0.5 rounded font-medium text-green-800"
            initial={{ backgroundColor: "transparent" }}
            animate={{
              backgroundColor: [
                "rgba(187, 247, 208, 0.3)",
                "rgba(187, 247, 208, 0.8)",
                "rgba(187, 247, 208, 0.3)",
              ],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            {part}
          </motion.span>
        );
      }
      return part;
    });
  };

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-32 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-20"
          animate={{ scale: [1.2, 1, 1.2], y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-32 w-12 h-12 bg-pink-200 rounded-full opacity-20"
          animate={{ scale: [1, 1.3, 1], x: [0, 30, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
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
          <motion.p
            className="text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Discover what makes {productName} special
          </motion.p>
        </motion.div>

        {/* Key Benefits */}
        <div className="max-w-6xl mx-auto bg-transparent backdrop-blur-sm p-8 md:p-12 ">
          <motion.div
            className="relative overflow-x-auto flex space-x-4 py-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <AutoScrollCarousel keyBenefits={keyBenefits} />

            {/* Glowing border animation */}
            <style jsx>{`
              @keyframes borderGlow {
                0% {
                  border-color: #22c55e;
                }
                50% {
                  border-color: #16a34a;
                }
                100% {
                  border-color: #22c55e;
                }
              }
              .animate-borderGlow {
                animation: borderGlow 2s linear infinite;
              }
            `}</style>
          </motion.div>

          {/* Description + Banners together */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <div className="text-lg leading-relaxed text-gray-700">
              <AnimatePresence mode="wait">
                {!isExpanded ? (
                  <motion.div
                    key="short"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {highlightText(shortDescription)}
                    {sentences.length > 2 && (
                      <span className="text-gray-500">...</span>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="full"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5 }}
                    className="overflow-hidden"
                  >
                    {highlightText(fullDescription)}

                    {/* Banners inside expanded content */}
                    <AnimatePresence>
                      {banners.length > 0 && (
                        <motion.div
                          key="banners"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.6 }}
                          className="overflow-hidden mt-8"
                        >
                          <ProductBanners banners={banners} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* ✅ "Show Less" moved here */}
                    <div className="text-center pt-4">
                      <Button
                        variant="ghost"
                        onClick={() => setIsExpanded(false)}
                        className="group hover:bg-green-50 transition-all duration-300"
                      >
                        <span className="flex items-center gap-2 text-green-600 font-medium">
                          Show Less
                          <ChevronDown className="w-4 h-4 transform rotate-180 transition-transform duration-300" />
                        </span>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ✅ "Read More" only when collapsed */}
            {!isExpanded && sentences.length > 2 && (
              <div className="text-center pt-4">
                <Button
                  variant="ghost"
                  onClick={() => setIsExpanded(true)}
                  className="group hover:bg-green-50 transition-all duration-300"
                >
                  <span className="flex items-center gap-2 text-green-600 font-medium">
                    Read More
                    <ChevronDown className="w-4 h-4 transform transition-transform duration-300" />
                  </span>
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
