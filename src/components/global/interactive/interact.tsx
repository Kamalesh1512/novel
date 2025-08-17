'use client'
import { useState, useMemo, useEffect } from "react";
import { motion, useMotionValue, useTransform, useScroll } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
}

const InteractiveBackground = () => {
  const { scrollY } = useScroll();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
  const windowHeight = typeof window !== "undefined" ? window.innerHeight : 800;

  // Generate particles ONCE, before any render
  const particles: Particle[] = useMemo(
    () =>
      Array.from({ length: 35 }, (_, i) => ({
        id: i,
        x: Math.random() * windowWidth,
        y: Math.random() * windowHeight,
        size: Math.random() * 6 + 3,
        opacity: Math.random() * 0.7 + 0.3,
        color: [
          "bg-green-200/40",
          "bg-emerald-300/30",
          "bg-teal-200/35",
          "bg-lime-200/25",
          "bg-green-300/45",
          "bg-emerald-400/20",
        ][Math.floor(Math.random() * 6)],
      })),
    [windowWidth, windowHeight]
  );

  // Precompute transforms for orbs
  const orb1X = useTransform(mouseX, [0, windowWidth], [-50, 50]);
  const orb1Y = useTransform(mouseY, [0, windowHeight], [-30, 30]);
  const orb2X = useTransform(scrollY, [0, 1000], [0, -200]);
  const orb2Y = useTransform(scrollY, [0, 1000], [0, 100]);
  const orb3X = useTransform(scrollY, [0, 1000], [0, 150]);
  const orb3Y = useTransform(scrollY, [0, 1000], [0, -80]);

  // Precompute transforms for particles — same number every render
  const particleTransforms = useMemo(
    () =>
      particles.map((p) =>
        useTransform(scrollY, [0, 1000], [p.x, p.x + Math.random() * 200 - 100])
      ),
    [particles, scrollY]
  );

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Orbs */}
      <motion.div
        className="absolute w-96 h-96 bg-gradient-to-r from-green-300/20 to-emerald-400/15 rounded-full blur-3xl"
        style={{ x: orb1X, y: orb1Y }}
        animate={{
          scale: [1, 1.3, 1.1, 1],
          rotate: [0, 90, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-l from-teal-300/25 to-green-400/20 rounded-full blur-2xl"
        style={{ x: orb2X, y: orb2Y }}
        animate={{
          scale: [1.2, 1, 1.4, 1.2],
          opacity: [0.3, 0.6, 0.2, 0.3],
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 left-0 w-72 h-72 bg-gradient-to-r from-lime-300/30 to-emerald-300/25 rounded-full blur-2xl"
        style={{ x: orb3X, y: orb3Y }}
        animate={{
          scale: [1, 1.5, 1.2, 1],
          rotate: [360, 270, 180, 0],
        }}
        transition={{ duration: 18, repeat: Infinity }}
      />

      {/* Particles */}
      {particles.map((p, i) => (
        <motion.div
          key={p.id}
          className={`absolute ${p.color} rounded-full blur-sm`}
          style={{
            width: p.size,
            height: p.size,
            x: particleTransforms[i],
          }}
          animate={{
            x: [p.x, p.x + 150, p.x - 100, p.x],
            y: [p.y, p.y - 120, p.y + 80, p.y],
            opacity: [p.opacity, p.opacity * 0.3, p.opacity * 0.8, p.opacity],
            scale: [1, 1.3, 0.8, 1],
          }}
          transition={{
            duration: 25 + Math.random() * 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default InteractiveBackground;
