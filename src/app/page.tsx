"use client";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      {/* Mobile Background Video */}
      <video
        preload="auto"
        autoPlay={true}
        muted={true}
        playsInline={true}
        // playsinline="true"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
             w-full h-full object-cover sm:hidden"
        poster="/gifs/coming_soon_banner.gif"
      >
        <source src="/gifs/coming_soon.gif" type="gifs" />
        Your browser does not support the video tag.
      </video>

      {/* Desktop Background Video */}
      <video
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
               hidden sm:block w-full h-full object-cover"
        preload="auto"
        autoPlay={true}
        muted={true}
        playsInline={true}
        poster="/gifs/coming_soon_banner.gif"
      >
        <source src="/gifs/coming_soon.gif" type="gifs" />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* Overlay Content */}
      <div
        className="absolute bottom-4 right-4 z-10 
               sm:bottom-6 sm:right-6 
               md:bottom-8 md:right-8"
      >
        <Button
          className="rounded-xl text-xs px-4 py-2
                 sm:text-sm sm:px-6 sm:py-3
                 md:text-base md:px-8 md:py-3
                 shadow-lg backdrop-blur-sm"
          variant="premium"
          size="lg"
        >
          <Link href="/auth/signin">Sign In</Link>
        </Button>
      </div>
    </div>
  );
}
