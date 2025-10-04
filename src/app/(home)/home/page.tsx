"use client";
import Hero from "@/components/home/hero";
import { Header } from "@/components/layout/header";
import Image from "next/image";
import { useEffect, useState } from "react";
import Footer from "@/components/layout/footer";
import { ProductType } from "@/lib/constants/types";
import { LoadingScreen } from "@/components/global/loading";
import { useProductStore } from "@/store/productStore";
import { FeaturedProducts } from "@/components/home/featured-products";
import Categories from "@/components/home/categories";
import TrustedByMothers from "@/components/home/trusted-by-mothers";
import AnnouncementBanner from "@/components/home/annoucement-banners";
import StealDeals from "@/components/home/steal-deals";
import Testimonials from "@/components/home/testimonials";
import CategoriesGrid from "@/components/home/categories-grid";
import LogoSlider from "@/components/home/sellers-logo-slider";
import { AnimatePresence, motion } from "framer-motion";
import WhatsAppButton from "@/components/global/interactive/whatsAppbutton";

export default function Home() {
  const { setProducts, getAllProducts } = useProductStore();
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/products");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.products || !Array.isArray(data.products)) {
        throw new Error("Invalid products data received");
      }
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [setProducts]);

  const products = useProductStore((state: any) => state.getAllProducts());
  const bestSellers = products.filter((prod: any) => prod.bestSeller);

  const stealDeals = products.filter((prod: any) => prod.featured);

  if (loading) {
    return <LoadingScreen description="" />;
  }

  return (
    <div className="relative overflow-x-hidden">
      <Header isHome={true} />
      <Hero />
      <FeaturedProducts products={bestSellers} />
      <CategoriesGrid />
      <TrustedByMothers />
      <StealDeals products={stealDeals} />
      <Testimonials />
      <LogoSlider />
      <Footer />

      <div>
        <AnimatePresence>
          <motion.div
            className="fixed bottom-6 right-6 z-50 flex flex-col gap-3"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            {/* WhatsApp Button */}
            <WhatsAppButton />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
