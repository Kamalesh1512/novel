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
    <section className="container mx-auto md:pl-16">
      <div className="">
        <SectionHeading
          title="BESTSELLERS"
          fontStyle="font-bebas"
          align="center"
          size="lg"
          letterSpacing="2px"
        />

        <Bestsellers baseProducts={products} />

        <div className="flex items-center justify-center">
          <style jsx>{`
            @keyframes wave {
              0%,
              100% {
                transform: translateX(0) scaleY(1);
              }
              25% {
                transform: translateX(-2px) scaleY(0.95);
              }
              50% {
                transform: translateX(2px) scaleY(1.05);
              }
              75% {
                transform: translateX(-1px) scaleY(0.98);
              }
            }

            @keyframes ripple {
              0% {
                transform: scale(1) rotate(0deg);
                opacity: 0.3;
              }
              50% {
                transform: scale(1.1) rotate(180deg);
                opacity: 0.1;
              }
              100% {
                transform: scale(1) rotate(360deg);
                opacity: 0.3;
              }
            }

            .water-effect::before {
              animation: wave 2s ease-in-out infinite;
            }

            .water-effect::after {
              animation: ripple 3s ease-in-out infinite;
            }
          `}</style>
          <Button
            variant="ghost"
            size="lg"
            className="mt-5 water-effect relative overflow-hidden border border-green-500 text-black hover:text-black transition-colors duration-300 bg-transparent z-10
before:content-[''] before:absolute before:inset-0 before:bg-green-500 before:z-[-1] before:origin-bottom
before:scale-y-0 hover:before:scale-y-100 before:transition-transform before:duration-500 before:ease-in-out
after:content-[''] after:absolute after:inset-0 after:z-[-1] after:origin-bottom after:scale-y-0 
hover:after:scale-y-100 after:transition-transform after:duration-500 after:ease-in-out after:delay-75
after:bg-gradient-to-b after:from-[#4eec56] after:to-[#56f030]"
            asChild
          >
            <Link href="/products">View All</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
