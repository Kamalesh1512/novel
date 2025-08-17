'use client'
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
  useMotionValue,
  useVelocity,
} from "framer-motion";
import { TiltCard } from "./tiltcard";
import { Card, CardContent } from "@/components/ui/card";

// Enhanced Why Choose Card with scroll animations
interface CardScrollAnimationProps {
  reason: {
    text: string;
    icon: React.ComponentType<any>;
  };
  index: number;
  scrollYProgress: any;
}

export const CardScrollAnimation = ({
  reason,
  index,
  scrollYProgress,
}: CardScrollAnimationProps) => {
  const isEven = index % 2 === 0;

  // Create scroll-based animations for each card
  const cardRef = useRef(null);
  const { scrollYProgress: cardScrollProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  // Different animation ranges for each card
  const startPos = isEven ? -300 : 300
  const endPos = isEven ? 300 : -300;

  const x = useTransform(
    cardScrollProgress,
    [0, 0.3, 0.7, 1],
    [startPos, 0, 0, endPos]
  );

  const opacity = useTransform(
    cardScrollProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0]
  );
  const scale = useTransform(
    cardScrollProgress,
    [0, 0.2, 0.8, 1],
    [0.8, 1, 1, 0.8]
  );
  const rotate = useTransform(
    cardScrollProgress,
    [0, 0.2, 0.8, 1],
    [isEven ? -15 : 15, 0, 0, isEven ? 15 : -15]
  );

  return (
    <motion.div
      ref={cardRef}
      style={{ x, opacity, scale, rotate }}
      className={`flex ${isEven ? "justify-start" : "justify-end"}`}
    >
      <TiltCard className="max-w-2xl">
        <Card className="bg-gradient-to-r from-green-100 to-emerald-100 border-green-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-400/10"
            animate={{
              background: [
                "linear-gradient(45deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)",
                "linear-gradient(225deg, rgba(16, 185, 129, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)",
                "linear-gradient(45deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <CardContent className="p-8 relative z-10">
            <div className="flex items-start space-x-4">
              <motion.div
                className="bg-green-200 p-3 rounded-full"
                whileHover={{
                  scale: 1.2,
                  rotate: 360,
                  backgroundColor: "rgb(187 247 208)", // green-300
                }}
                transition={{ duration: 0.5 }}
              >
                <reason.icon className="w-6 h-6 text-green-700" />
              </motion.div>
              <p className="text-gray-700 leading-relaxed flex-1">
                {reason.text}
              </p>
            </div>
          </CardContent>
        </Card>
      </TiltCard>
    </motion.div>
  );
};
