import { useRef, useState, useMemo, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { ChevronDown } from "lucide-react";

// Hero Banner Component
const CategoryHeroBanner = ({
  categoryName,
  bannerImage,
}: {
  categoryName: string;
  bannerImage?: string;
}) => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: bannerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);
  const [particles, setParticles] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 20 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    }));
    setParticles(generated);
  }, []);

  return (
    <motion.div
      ref={bannerRef}
      className="relative h-[60vh] md:h-[70vh] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Background with parallax */}
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <div
          className="w-full h-full bg-gradient-to-br from-green-400 via-emerald-500 to-green-600"
          style={{
            backgroundImage: bannerImage ? `url(${bannerImage})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/60 to-emerald-900/40" />
      </motion.div>

      {/* Animated particles */}
      <div className="absolute inset-0">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            initial={{ x: p.x, y: p.y }}
            animate={{ y: [p.y, -100], opacity: [0.7, 0] }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex items-center justify-center h-full text-center"
        style={{ opacity }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-6 font-bebas tracking-wider"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {categoryName.replace("-", " ").toUpperCase()}
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-green-100 mb-8 max-w-2xl mx-auto leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Discover our premium collection of {categoryName.replace("-", " ")}{" "}
            products
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <motion.button
              className="bg-white text-green-600 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 20px 40px rgba(255, 255, 255, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Products
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-8 h-8 text-white/70" />
      </motion.div>
    </motion.div>
  );
};

export default CategoryHeroBanner;
