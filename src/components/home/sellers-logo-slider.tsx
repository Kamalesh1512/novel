"use client";
import Image from "next/image";
import { SectionHeading } from "../ui/section-heading";

const logos = [
  { src: "/Images/amazon.jpg", alt: "Amazon" },
  { src: "/Images/meesho.png", alt: "Meesho" },
  { src: "/Images/flipkart.webp", alt: "Flipkart" },
  { src: "/Images/firstcry-logo.png", alt: "FirstCry" },
  { src: "/Images/fk_minutes_logo.png", alt: "FK Minutes" },
  { src: "/Images/JioMart_logo.png", alt: "Jio Mart" },
  { src: "/Images/apollo-hospitals.png", alt: "Apollo" },
];

export default function LogoSlider() {
  return (
    <div className="page-width-slider py-10 bg-white">
      {/* Heading */}
      <div className="mb-6">
        <SectionHeading
          title="Available On"
          fontStyle="font-sans"
          align="center"
          size="lg"
        />
      </div>

      {/* Slider Wrapper */}
      <div className="logo-slider relative overflow-hidden group">
        <div className="flex animate-slide sm:animate-slide-sm lg:animate-slide-lg w-fit group-hover:[animation-play-state:paused]">
          {/* First set of logos */}
          {logos.map((logo, index) => (
            <div
              key={`first-${index}`}
              className="flex-shrink-0 flex items-center justify-center px-6 sm:px-8 md:px-10"
            >
              <div className="w-40 h-20 sm:w-44 sm:h-24 md:w-48 md:h-28 flex items-center justify-center">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={160}
                  height={80}
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {logos.map((logo, index) => (
            <div
              key={`second-${index}`}
              className="flex-shrink-0 flex items-center justify-center px-6 sm:px-8 md:px-10"
            >
              <div className="w-40 h-20 sm:w-44 sm:h-24 md:w-48 md:h-28 flex items-center justify-center">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={160}
                  height={80}
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
