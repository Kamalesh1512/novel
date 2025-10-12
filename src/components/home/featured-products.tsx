"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import * as THREE from "three";
import { motion } from "framer-motion";
import {
  Star,
  Heart,
  ShoppingCart,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ProductType } from "@/lib/constants/types";
import { Card, CardContent } from "../ui/card";
import { SectionHeading } from "../ui/section-heading";
import Bestsellers from "../products/best-seller-products";

interface FeaturedProductsProps {
  products: ProductType[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  return (
    <section className="w-full relative my-8 md:my-20">
      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        {/* Large padding on sides */}
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-20">
          {/* Row 1: Title + Button */}
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-xl lg:text-3xl font-bold text-green-700 font-sans">
              Our Bestsellers
            </h2>
            <Button
              variant="outline"
              size="lg"
              className="text-green-600 border border-green-500 hover:bg-green-600 hover:text-white"
              asChild
            >
              <Link href="/products">View All</Link>
            </Button>
          </div>

          {/* Row 2: Description */}
          <p className="mt-2 text-gray-600 text-base md:text-lg">
            Shop top-selling Novel's Babio baby care essentials. Trusted by moms, our
            bestsellers provide natural, gentle care for your little one.
          </p>
        </div>

        {/* Products Carousel */}
        <div className="mt-6">
          <Bestsellers baseProducts={products} />
        </div>
      </div>
    </section>
  );
}
