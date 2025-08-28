"use client";

import { ProductType } from "@/lib/constants/types";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import Link from "next/link";
import { useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Filter, SortAsc, Search, ArrowLeft, Star, ShoppingCart } from "lucide-react";

const SubcategoryHero = ({ 
  mainCategory, 
  subcategory, 
  bannerImage,
  productCount
}: { 
  mainCategory: string; 
  subcategory: string; 
  bannerImage?: string;
  productCount: number;
}) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <motion.div
      ref={heroRef}
      className="relative h-[50vh] md:h-[60vh] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Dynamic Background */}
      <motion.div
        className="absolute inset-0"
        style={{ y }}
      >
        <div className="w-full h-full bg-gradient-to-br from-emerald-400 via-green-500 to-green-600" />
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/70 via-green-800/40 to-transparent" />
      </motion.div>

      {/* Floating Elements */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/10 rounded-full"
            style={{
              width: Math.random() * 6 + 4,
              height: Math.random() * 6 + 4,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col justify-center h-full px-6"
        style={{ opacity }}
      >
        <div className="max-w-6xl mx-auto w-full">
          {/* Breadcrumb */}
          <motion.nav
            className="flex items-center space-x-2 text-green-100 mb-6"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link 
              href={`/categories/${mainCategory}`}
              className="hover:text-white transition-colors"
            >
              {mainCategory.replace("-", " ")}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">
              {subcategory.replace("-", " ")}
            </span>
          </motion.nav>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div>
              <motion.h1
                className="text-4xl md:text-6xl font-bold text-white mb-4 font-bebas tracking-wide"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {subcategory.replace("-", " ").toUpperCase()}
              </motion.h1>
              
              <motion.p
                className="text-xl text-green-100 mb-6 leading-relaxed"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Premium quality {subcategory.replace("-", " ")} from our {mainCategory.replace("-", " ")} collection
              </motion.p>

              <motion.div
                className="flex items-center gap-6 mb-8"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-white font-semibold">{productCount} Products</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-green-100 ml-2">4.8+ Rating</span>
                </div>
              </motion.div>
            </div>

            {/* Right Content - Featured Product Preview */}
            <motion.div
              className="hidden md:block"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="relative">
                <motion.div
                  className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <ShoppingCart className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">Shop with Confidence</h3>
                    <p className="text-green-100 text-sm">Trusted by thousands of customers</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

