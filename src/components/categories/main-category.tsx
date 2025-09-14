"use client";

import { ProductType } from "@/lib/constants/types";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Filter, Grid, List, Search, Star } from "lucide-react";
import ProductCard from "../products/product-card";
import CategoryHeroBanner from "../banners/category-banner";
import { SearchComponent } from "../search/main-search-component";

interface MainCategoryPageProps {
  categoryName: string;
  products: ProductType[];
  subcategories: string[];
  bannerImage?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.9,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
  hover: {
    y: -8,
    scale: 1.03,
    boxShadow: "0px 25px 50px rgba(34, 197, 94, 0.25)",
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 10,
    },
  },
};

const filterVariants = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 120 },
  },
};

export default function MainCategoryPage({
  categoryName,
  products,
  subcategories,
  bannerImage,
}: MainCategoryPageProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  return (
    // <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
    //   {/* Hero Banner */}
    //   <CategoryHeroBanner
    //     categoryName={categoryName}
    //     bannerImage={bannerImage}
    //   />

    //   {/* Main Content */}
    //   <div className="container mx-auto px-4 py-12">
    //     {/* Subcategory Navigation */}
    //     <motion.div
    //       initial={{ opacity: 0, y: 20 }}
    //       animate={{ opacity: 1, y: 0 }}
    //       transition={{ delay: 0.3 }}
    //       className="mb-8"
    //     >
    //       <div className="flex flex-wrap gap-3">
    //         {subcategories.map((subcategory, index) => (
    //           <Link
    //             key={subcategory}
    //             href={`/categories/${categoryName}/${subcategory
    //               .toLowerCase()
    //               .replace(/ /g, "")}`}
    //           >
    //             <motion.div
    //               className="bg-white hover:bg-green-50 border border-green-200 hover:border-green-300 rounded-xl px-6 py-3 transition-all duration-300 cursor-pointer group"
    //               whileHover={{ scale: 1.05, y: -2 }}
    //               whileTap={{ scale: 0.98 }}
    //               initial={{ opacity: 0, x: -20 }}
    //               animate={{ opacity: 1, x: 0 }}
    //               transition={{ delay: index * 0.1 }}
    //             >
    //               <span className="text-green-700 font-medium group-hover:text-green-800">
    //                 {subcategory}
    //               </span>
    //               <motion.span
    //                 className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
    //                 animate={{ x: [0, 5, 0] }}
    //                 transition={{ duration: 1.5, repeat: Infinity }}
    //               >
    //                 →
    //               </motion.span>
    //             </motion.div>
    //           </Link>
    //         ))}
    //       </div>
    //     </motion.div>

    //     <div className="flex px-4 min-w-max gap-3">
    //       {products.map((product, i) => (
    //         <div key={`${product.id}-${i}`} className="relative">
    //           <ProductCard
    //             key={i}
    //             product={product}
    //             index={i}
    //             className="w-1/2 flex-shrink-0"
    //           />
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // </div>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Hero Banner */}
      <CategoryHeroBanner
        categoryName={categoryName}
        bannerImage={bannerImage}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Subcategory Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="grid grid-cols-2 sm:flex flex-wrap gap-3">
            {subcategories.map((subcategory, index) => (
              <Link
                key={subcategory}
                href={`/categories/${categoryName}/${subcategory
                  .toLowerCase()
                  .replace(/ /g, "")}`}
              >
                <motion.div
                  className="bg-white hover:bg-green-50 border border-green-200 hover:border-green-300 rounded-xl px-6 py-3 transition-all duration-300 cursor-pointer group"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="text-xs md:text-base text-green-700 font-medium group-hover:text-green-800">
                    {subcategory}
                  </span>
                  <motion.span
                    className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Products Section with hidden scrollbar */}
        <div className="flex overflow-x-auto px-2 scrollbar-hide scroll-smooth">
          {products.map((product, i) => (
            <div
              key={`${product.id}-${i}`}
              className="flex-shrink-0 px-4 snap-start"
            >
              <ProductCard
                key={i}
                product={product}
                index={i}
                className="w-auto space-x-2"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
