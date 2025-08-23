"use client";
import { JSX, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface keyBenefitsProps {
  keyBenefits: {
    icon: JSX.Element;
    text: string;
    color: string;
  }[];
}

const AutoScrollCarousel = ({ keyBenefits }: keyBenefitsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto scroll every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % keyBenefits.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [keyBenefits.length]);

  return (
    <div className="relative w-fit overflow-hidden">
      <motion.div
        className="flex"
        animate={{ x: `-${currentIndex * 100}%` }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {keyBenefits.map((benefit, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-full p-2 bg-gradient-to-r from-blue-50 to-purple-50 relative gap-4"
          >
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <span className={`${benefit.color} flex-shrink-0`}>
                {benefit.icon}
              </span>
              <span className="text-md font-medium text-black relative z-10">
                {benefit.text}
              </span>
            </div>
          </div>
        ))}
      </motion.div>

      <style jsx>{`
        @keyframes borderGlow {
          0% {
            border-color: #22c55e;
          }
          50% {
            border-color: #16a34a;
          }
          100% {
            border-color: #22c55e;
          }
        }
        .animate-borderGlow {
          animation: borderGlow 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AutoScrollCarousel;
