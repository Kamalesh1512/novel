"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface CardScrollAnimationProps {
  reason: {
    title: string;
    subtitle?: string;
    description: string;
    image: string;
    reverse?: boolean;
  };
  index: number;
}

export const CardScrollAnimation = ({
  reason,
  index,
}: CardScrollAnimationProps) => {
  return (
    <motion.div className="flex justify-center my-10 px-4 sm:px-8 lg:px-12">
      <Card className="max-w-6xl w-full rounded-none border-none overflow-hidden">
        <div
          className={`flex flex-col md:flex-row items-center ${
            reason.reverse ? "md:flex-row-reverse" : ""
          }`}
        >
          {/* Image Section */}
          <div className="relative w-full md:w-[320px] aspect-square flex-shrink-0">
            <Image
              src={reason.image}
              alt={reason.title}
              fill
              className="object-cover rounded-none md:rounded-3xl"
            />
          </div>

          {/* Text Section */}
          <div className="bg-green-400 text-white flex flex-col justify-center p-6 sm:p-7 md:p-8 space-y-2.5 max-h-[60%]">
            <h3 className="text-lg font-bold leading-tight">{reason.title}</h3>

            {reason.subtitle && (
              <p className="text-sm sm:text-base font-medium border-t border-white/30 pt-2.5 mt-1">
                {reason.subtitle}
              </p>
            )}

            <p className="text-xs sm:text-sm leading-relaxed text-white/95">
              {reason.description}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
