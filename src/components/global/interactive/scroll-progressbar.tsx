"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

interface ScrollProgressBarProps {
  className?: string;
  gradient?: string;
  height?: string;
  showGlow?: boolean;
  stiffness?: number;
  damping?: number;
}

export function ScrollProgressBar({
  className = "",
  gradient = "from-green-500 via-emerald-500 to-teal-500",
  height = "h-1",
  showGlow = true,
  stiffness = 100,
  damping = 30,
}: ScrollProgressBarProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness,
    damping,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 ${height} bg-gradient-to-r ${gradient} origin-left z-50 ${className}`}
      style={{
        scaleX,
        boxShadow: showGlow ? "0 0 10px rgba(34, 197, 94, 0.5)" : "none",
      }}
    />
  );
}