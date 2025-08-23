"use client";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";

interface AnimatedFeaturesProps {
  features: string[];
}

// Framer Motion variants
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const featureVariants = {
  hidden: { opacity: 0, x: 40, scale: 0.9 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 20 },
  },
  hover: {
    scale: 1.05,
    y: -2,
    transition: { type: "spring" as const, stiffness: 300 },
  },
};

const AnimatedFeatures = ({ features }: AnimatedFeaturesProps) => {
  return (
    <motion.div
      className="space-y-3"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className="relative flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 shadow-sm cursor-pointer overflow-hidden"
          variants={featureVariants}
          whileHover="hover"
        >
          {/* Moving Border */}
          <span className="absolute inset-0 border-2 border-green-400 rounded-xl pointer-events-none"></span>
          <Zap
            className="w-6 h-6 ml-auto"
            style={{
              stroke: "#FBBF24", // yellow
              strokeWidth: 2,
              strokeDasharray: 100,
              strokeDashoffset: 100,
              animation: "zapFill 5s linear infinite",
            }}
          />
          <span className="text-sm font-medium text-gray-800 z-10">
            {feature}
          </span>
        </motion.div>
      ))}

      {/* Add animation style for border */}
      <style jsx>{`
        @keyframes borderGlow {
          0% {
            clip-path: polygon(0 0, 0 0, 0 0, 0 0);
          }
          25% {
            clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
          }
          50% {
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
          }
          75% {
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
          }
          100% {
            clip-path: polygon(0 0, 0 0, 0 0, 0 0);
          }
        }

        .animate-borderGlow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border: 2px solid transparent;
          border-image: linear-gradient(90deg, #22c55e, #16a34a, #22c55e) 1;
          animation: borderGlow 2s linear infinite;
          pointer-events: none;
        }
        @keyframes zapFill {
          0% {
            stroke-dashoffset: 100;
            stroke: #fbbf24;
          }
          50% {
            stroke-dashoffset: 0;
            stroke: #f59e0b;
          } /* brighter yellow */
          100% {
            stroke-dashoffset: 100;
            stroke: #fbbf24;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default AnimatedFeatures;
