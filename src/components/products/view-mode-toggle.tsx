"use client";
import { Eye, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";

interface ViewModeToggleProps {
  viewMode: "image" | "3d";
  hasModelUrl: boolean;
  onViewModeChange: (mode: "image" | "3d") => void;
}

export const ViewModeToggle = ({
  viewMode,
  hasModelUrl,
  onViewModeChange,
}: ViewModeToggleProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  if (!hasModelUrl) return null;

  const handleModeChange = async (mode: "image" | "3d") => {
    if (mode === viewMode || isTransitioning) return;

    setIsTransitioning(true);
    
    // Small delay to show transition state
    setTimeout(() => {
      onViewModeChange(mode);
      setIsTransitioning(false);
    }, 200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg border border-gray-200 inline-flex">
        <Button
          size="sm"
          variant={viewMode === "image" ? "default" : "ghost"}
          onClick={() => handleModeChange("image")}
          disabled={isTransitioning}
          className={`rounded-full px-4 py-2 transition-all duration-200 ${
            viewMode === "image"
              ? "bg-gray-900 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          {isTransitioning && viewMode === "3d" ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Eye className="w-4 h-4 mr-2" />
          )}
          Images
        </Button>
        
        <Button
          size="sm"
          variant={viewMode === "3d" ? "default" : "ghost"}
          onClick={() => handleModeChange("3d")}
          disabled={isTransitioning}
          className={`rounded-full px-4 py-2 transition-all duration-200 ${
            viewMode === "3d"
              ? "bg-gray-900 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          {isTransitioning && viewMode === "image" ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RotateCcw className="w-4 h-4 mr-2" />
          )}
          3D View
        </Button>
      </div>

      {/* Mode indicator */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="text-xs text-gray-500 text-center">
          {viewMode === "3d" ? "Interactive 3D Model" : "Product Gallery"}
        </div>
      </div>
    </motion.div>
  );
};