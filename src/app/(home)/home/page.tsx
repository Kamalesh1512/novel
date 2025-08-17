"use client";
import HeroBannerCarousel from "@/components/home/hero";
import { Header } from "@/components/layout/header";
import Image from "next/image";
import { useEffect, useState } from "react";
import Footer from "@/components/layout/footer";
import { ProductType } from "@/lib/constants/types";
import { LoadingScreen } from "@/components/global/loading";
import { useProductStore } from "@/store/productStore";
import TestimonialCarousel from "@/components/home/testimonials";

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

  const products = useProductStore((state:any) => state.getAllProducts());
  const bestSellers = products.filter((prod:any) => prod.bestSeller);

    if (loading) {
    return (
      <LoadingScreen description=""/>
    );
  }

  return (
    <div className="relative overflow-x-hidden">
      <Header isHome={true} />
      <HeroBannerCarousel />
      <TestimonialCarousel />
      <Footer />
    </div>
  );
}