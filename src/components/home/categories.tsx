"use client";

import { ProductType } from "@/lib/constants/types";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "../ui/section-heading";
import { useRef } from "react";
import { useRouter } from "next/navigation";

interface CategoryProps {
  title: string;
  products: ProductType[];
  index: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 100,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 60,
    rotateX: 45,
  },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
      duration: 0.8,
    },
  },
  hover: {
    scale: 1.08,
    y: -10,
    rotateY: 5,
    boxShadow: "0px 20px 40px rgba(34, 197, 94, 0.3)",
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },
};

const imageVariants = {
  hover: {
    scale: 1.2,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
    },
  },
};

const titleVariants = {
  hidden: {
    opacity: 0,
    x: -50,
    scale: 0.9,
  },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 20,
      delay: 0.2,
    },
  },
};

const exploreButtonVariants = {
  hidden: { opacity: 0, x: 50 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      delay: 0.4,
    },
  },
  hover: {
    scale: 1.05,
    x: 5,
    transition: {
      type: "spring" as const,
      stiffness: 400,
    },
  },
};

function CategorySection({ title, products, index }: CategoryProps) {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Dynamic sliding based on scroll and alternating direction
  const isEven = index % 2 === 0;
  const slideX = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    isEven ? [100, 0, 0, -50] : [-100, 0, 0, 50]
  );

  const slideY = useTransform(scrollYProgress, [0, 0.5, 1], [30, 0, -20]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0.7]
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.9, 1, 1, 0.95]
  );

  const displayProducts = products.slice(0, 4);

  return (
    <motion.section
      ref={sectionRef}
      className="mb-16 px-4 md:px-20 relative overflow-hidden"
      style={{
        x: slideX,
        y: slideY,
        opacity,
        scale,
      }}
    >
      {/* Header section with enhanced animations */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <motion.div
          variants={titleVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="relative"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-green-600 uppercase font-bebas relative"
            whileHover={{
              scale: 1.05,
              textShadow: "0px 0px 20px rgba(34, 197, 94, 0.5)",
            }}
          >
            {title}
            <motion.div
              className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            />
          </motion.h2>
        </motion.div>

        <motion.div
          variants={exploreButtonVariants}
          initial="hidden"
          whileInView="show"
          whileHover="hover"
          viewport={{ once: true }}
        >
          <Link
            href={`/categories/${title.toLowerCase().replace(/ /g, "-")}`}
            className="group relative px-6 py-3"
          >
            <motion.div
              className="absolute inset-0"
              initial={{ x: "100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10 flex items-center gap-2 text-green-600">
              Explore All
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
          </Link>
        </motion.div>
      </div>

      {/* Products grid with staggered animations */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
      >
        {displayProducts.map((product, productIndex) => (
          <motion.div
            key={product.id}
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
            className="group relative bg-transparent rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer"
            style={{
              transformStyle: "preserve-3d",
            }}
            onClick={() => router.push(`/products/${product.sku}`)}
          >
            {/* Card content */}
            <div className="relative z-10 bg-transparent m-0.5">
              <div className="relative h-48 md:h-56 overflow-visible rounded-t-3xl">
                <motion.div
                  variants={imageVariants}
                  whileHover="hover"
                  className="relative w-full h-full"
                >
                  <Image
                    src={product.images[0]}
                    alt={`${product.name} - ${title}`}
                    fill
                    className="object-contain p-4 transition-all duration-700 group-hover:drop-shadow-lg"
                  />
                </motion.div>
              </div>

              <div className="p-6">
                <motion.h3
                  className="text-lg font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300"
                  whileHover={{
                    scale: 1.02,
                    transition: { type: "spring", stiffness: 300 },
                  }}
                >
                  {product.name}
                </motion.h3>
                <motion.p
                  className="text-sm text-gray-600 line-clamp-2 group-hover:text-gray-700 transition-colors"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                >
                  {product.shortDescription}
                </motion.p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Section divider with animation */}
      <motion.div
        className="mt-12 flex justify-center"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="w-24 h-1" />
      </motion.div>
    </motion.section>
  );
}

export default function Categories({ products }: { products: ProductType[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const babyCare = products.filter((p) => p.category?.name === "Baby Care");
  const adultCare = products.filter((p) => p.category?.name === "Adult Care");
  const personalCare = products.filter(
    (p) => p.category?.name === "Personal Care"
  );

  const sections = [
    { title: "Baby Care", products: babyCare },
    { title: "Adult Care", products: adultCare },
    { title: "Personal Care", products: personalCare },
  ];

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="container mx-auto py-8 relative"
    >
      {/* Main title with enhanced animation */}
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, type: "spring", stiffness: 100 }}
        className="mb-20"
      >
        <SectionHeading
          title="CATEGORIES"
          fontStyle="font-bebas"
          align="center"
          size="lg"
          letterSpacing="2px"
        />
      </motion.div>

      {/* Animated background */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        animate={{
          background: [
            "radial-gradient(circle at 0% 0%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 100% 100%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 0% 0%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div className="relative z-10">
          {sections.map((section, idx) => (
            <CategorySection
              key={section.title}
              title={section.title}
              products={section.products}
              index={idx}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
