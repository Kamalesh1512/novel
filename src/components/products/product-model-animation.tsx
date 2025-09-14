// "use client";
// import React, { useEffect, useRef, useState, useCallback } from "react";
// import { motion } from "framer-motion";
// import "@google/model-viewer";

// interface Product3DModelAnimationProps {
//   modelUrl: string;
//   fallbackImage: string;
//   className?: string;
//   autoRotate?: boolean;
//   productName: string;
//   features: string[];
//   dimensions?: { width: string; height: string };
//   altText?: string;
// }

// interface ModelViewerElement extends HTMLElement {
//   cameraOrbit: string;
//   autoRotate: boolean;
//   fieldOfView: string;
// }

// export function Product3DModelAnimation({
//   modelUrl,
//   fallbackImage = "https://via.placeholder.com/500",
//   className = "",
//   autoRotate = false,
//   productName = "Product Pro",
//   features = [
//     "* Mild & Skin-Friendly – Soft, non-irritating material suitable for all skin types, including sensitive skin.",
//     "Instant Refreshment – Effectively removes sweat, dust, and impurities, leaving your skin feeling fresh and revitalized.",
//     "Lightly Scented – Infused with a subtle, clean fragrance that calms and refreshes.",
//     "Compact & Portable – Travel-friendly packaging fits easily in your bag, desk, or glovebox.",
//     "No Sticky Residue – Quick-drying formula leaves your skin clean, soft, and residue-free.",
//     "Perfect For: Daily skincare or freshening up during the day",
//   ],
//   dimensions = { width: "12.70 cm", height: "12.70 cm" },
//   altText = "3D Product Model",
// }: Product3DModelAnimationProps) {
//   const modelViewerRef = useRef<ModelViewerElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showFallback, setShowFallback] = useState(true);
//   const [isModelHovered, setIsModelHovered] = useState(false);
//   const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
//   const [animationProgress, setAnimationProgress] = useState(0);
//   const [isScrollLocked, setIsScrollLocked] = useState(false);
//   const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down');
  
//   // Refs for scroll management
//   const lastScrollY = useRef(0);
//   const scrollAccumulator = useRef(0);
//   const isInAnimation = useRef(false);
//   const originalBodyOverflow = useRef<string>('');

//   // Filter and process features
//   const processedFeatures = React.useMemo(() => {
//     return features
//       .filter((feature) => feature.trim().startsWith("*"))
//       .flatMap((feature) =>
//         feature
//           .split(",")
//           .map((part) => part.replace(/^\*\s*/, "").trim())
//           .filter((part) => part.length > 0)
//       );
//   }, [features]);

//   const totalFeatures = processedFeatures.length;

//   // Handle 3D model loading
//   useEffect(() => {
//     const modelViewer = modelViewerRef.current;
//     if (!modelViewer) return;

//     const handleLoad = () => {
//       setIsLoading(false);
//       setTimeout(() => setShowFallback(false), 300);
//     };

//     modelViewer.addEventListener("load", handleLoad);
//     return () => {
//       modelViewer.removeEventListener("load", handleLoad);
//     };
//   }, [modelUrl]);

//   // Scroll lock/unlock functions
//   const lockScroll = useCallback(() => {
//     if (!isScrollLocked) {
//       originalBodyOverflow.current = document.body.style.overflow;
//       document.body.style.overflow = 'hidden';
//       setIsScrollLocked(true);
//       isInAnimation.current = true;
//     }
//   }, [isScrollLocked]);

//   const unlockScroll = useCallback(() => {
//     if (isScrollLocked) {
//       document.body.style.overflow = originalBodyOverflow.current;
//       setIsScrollLocked(false);
//       isInAnimation.current = false;
//       scrollAccumulator.current = 0;
//     }
//   }, [isScrollLocked]);

//   // Update 3D model rotation based on progress
//   const updateModelRotation = useCallback((progress: number) => {
//     if (!isModelHovered && modelViewerRef.current && !showFallback) {
//       // Each feature gets one full rotation (360 degrees)
//       const totalRotations = progress * totalFeatures;
//       const baseRotation = 45; // Starting rotation
//       const rotation = baseRotation + (totalRotations * 360);
//       const elevation = 75 - progress * 10; // Slight elevation change

//       modelViewerRef.current.cameraOrbit = `${rotation}deg ${elevation}deg 5m`;
//       modelViewerRef.current.fieldOfView = `60deg`;
//     }
//   }, [isModelHovered, showFallback, totalFeatures]);

//   // Handle wheel events for scroll-driven animation
//   const handleWheel = useCallback((e: WheelEvent) => {
//     if (!containerRef.current || !isInAnimation.current) return;

//     e.preventDefault();
//     e.stopPropagation();

//     const delta = e.deltaY;
//     const scrollSensitivity = 0.001; // Adjust this to control scroll speed
    
//     // Determine scroll direction
//     setScrollDirection(delta > 0 ? 'down' : 'up');
    
//     // Accumulate scroll delta
//     scrollAccumulator.current += delta * scrollSensitivity;
    
//     // Clamp the progress between 0 and 1
//     const newProgress = Math.max(0, Math.min(1, scrollAccumulator.current));
//     setAnimationProgress(newProgress);
    
//     // Calculate current feature index
//     const featureIndex = Math.floor(newProgress * totalFeatures);
//     const currentIndex = Math.max(0, Math.min(totalFeatures - 1, featureIndex));
//     setCurrentFeatureIndex(currentIndex);
    
//     // Update 3D model rotation
//     updateModelRotation(newProgress);
    
//     // Check if animation is complete
//     if (newProgress >= 1 && delta > 0) {
//       // Animation complete, unlock scroll and allow normal scrolling
//       setTimeout(() => {
//         unlockScroll();
//         // Trigger a normal scroll to continue down the page
//         window.scrollBy(0, delta * 0.5);
//       }, 100);
//     } else if (newProgress <= 0 && delta < 0) {
//       // Animation complete in reverse, unlock scroll
//       setTimeout(() => {
//         unlockScroll();
//         // Trigger a normal scroll to continue up the page
//         window.scrollBy(0, delta * 0.5);
//       }, 100);
//     }
//   }, [totalFeatures, updateModelRotation, unlockScroll]);

//   // Handle regular scroll events to detect when to lock
//   const handleScroll = useCallback(() => {
//     if (!containerRef.current || isInAnimation.current) return;

//     const containerRect = containerRef.current.getBoundingClientRect();
//     const viewportHeight = window.innerHeight;
    
//     // Check if container is entering viewport from either direction
//     const isEntering = containerRect.top <= viewportHeight * 0.5 && containerRect.bottom >= viewportHeight * 0.5;
    
//     if (isEntering) {
//       const currentScrollY = window.scrollY;
//       const scrollDirection = currentScrollY > lastScrollY.current ? 'down' : 'up';
      
//       // Lock scroll and start animation
//       lockScroll();
      
//       // Initialize animation state based on scroll direction
//       if (scrollDirection === 'down') {
//         setAnimationProgress(0);
//         setCurrentFeatureIndex(0);
//         scrollAccumulator.current = 0;
//       } else {
//         setAnimationProgress(1);
//         setCurrentFeatureIndex(totalFeatures - 1);
//         scrollAccumulator.current = 1;
//       }
//     }
    
//     lastScrollY.current = window.scrollY;
//   }, [lockScroll, totalFeatures]);

//   // Set up scroll event listeners
//   useEffect(() => {
//     const handleScrollThrottled = () => {
//       requestAnimationFrame(handleScroll);
//     };

//     window.addEventListener('scroll', handleScrollThrottled, { passive: true });
//     return () => window.removeEventListener('scroll', handleScrollThrottled);
//   }, [handleScroll]);

//   // Set up wheel event listener for scroll-locked animation
//   useEffect(() => {
//     if (isScrollLocked && containerRef.current) {
//       const container = containerRef.current;
//       container.addEventListener('wheel', handleWheel, { passive: false });
      
//       // Also add to window to catch all wheel events
//       window.addEventListener('wheel', handleWheel, { passive: false });
      
//       return () => {
//         container.removeEventListener('wheel', handleWheel);
//         window.removeEventListener('wheel', handleWheel);
//       };
//     }
//   }, [isScrollLocked, handleWheel]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (isScrollLocked) {
//         document.body.style.overflow = originalBodyOverflow.current;
//       }
//     };
//   }, [isScrollLocked]);

//   // Handle model hover events
//   const handleModelMouseEnter = useCallback(() => {
//     setIsModelHovered(true);
//   }, []);

//   const handleModelMouseLeave = useCallback(() => {
//     setIsModelHovered(false);
//   }, []);

//   return (
//     <div
//       ref={containerRef}
//       className={`relative w-full h-screen flex items-center justify-center bg-white overflow-hidden ${className}`}
//     >
//       {/* Background Text Animation */}
//       <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
//         {processedFeatures.map((feature, index) => {
//           // Calculate visibility based on animation progress
//           const featureProgress = animationProgress * totalFeatures;
//           const featureStart = index;
//           const featureEnd = index + 1;
          
//           let opacity = 0;
//           let scale = 0.8;
//           let y = 30;

//           if (featureProgress >= featureStart && featureProgress < featureEnd) {
//             // Current active feature
//             const localProgress = featureProgress - featureStart;
            
//             if (localProgress < 0.3) {
//               // Fade in
//               opacity = localProgress / 0.3;
//               scale = 0.8 + (localProgress / 0.3) * 0.2;
//               y = 30 - (localProgress / 0.3) * 30;
//             } else if (localProgress > 0.7) {
//               // Fade out
//               const fadeProgress = (localProgress - 0.7) / 0.3;
//               opacity = 1 - fadeProgress;
//               scale = 1 - fadeProgress * 0.2;
//               y = -fadeProgress * 30;
//             } else {
//               // Full visibility
//               opacity = 1;
//               scale = 1;
//               y = 0;
//             }
//           } else if (index < currentFeatureIndex) {
//             // Already passed
//             opacity = 0.1;
//             scale = 0.9;
//             y = -30;
//           }

//           return (
//             <motion.div
//               key={index}
//               className="absolute inset-0 flex items-center justify-center px-8"
//               style={{
//                 opacity,
//                 transform: `translateY(${y}px) scale(${scale})`,
//               }}
//               transition={{ duration: 0.3, ease: "easeOut" }}
//             >
//               <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-700 text-center leading-tight max-w-6xl">
//                 {feature}
//               </h1>
//             </motion.div>
//           );
//         })}
//       </div>

//       {/* 3D Model Container */}
//       <div
//         className="relative z-10 w-full max-w-2xl h-[600px] mx-auto"
//         onMouseEnter={handleModelMouseEnter}
//         onMouseLeave={handleModelMouseLeave}
//       >
//         {React.createElement("model-viewer", {
//           ref: modelViewerRef,
//           src: modelUrl,
//           alt: altText,
//           style: {
//             width: "100%",
//             height: "100%",
//             "--poster-color": "transparent",
//           },
//           "camera-controls": isModelHovered && !isScrollLocked,
//           "auto-rotate": autoRotate && !isModelHovered && !isScrollLocked,
//           ar: true,
//           loading: "eager",
//           reveal: "auto",
//           "environment-image": "neutral",
//           "shadow-intensity": 0.3,
//           "shadow-softness": 0.8,
//           "camera-orbit": "45deg 75deg 5m",
//           "min-camera-orbit": "auto 20deg 2m",
//           "max-camera-orbit": "auto 90deg 8m",
//           "field-of-view": "60deg",
//           "min-field-of-view": "30deg",
//           "max-field-of-view": "90deg",
//           "interaction-prompt": "none",
//           "touch-action": "pan-y",
//           "disable-zoom": !isModelHovered || isScrollLocked,
//         })}

//         {/* Loading State */}
//         {isLoading && (
//           <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm">
//             <div className="flex flex-col items-center space-y-4">
//               <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
//               <p className="text-gray-600 text-sm">Loading 3D Model...</p>
//             </div>
//           </div>
//         )}

//         {/* Fallback Image */}
//         {showFallback && (
//           <div className="absolute inset-0 flex items-center justify-center bg-white">
//             <img
//               src={fallbackImage}
//               alt={altText}
//               className="max-w-full max-h-full object-contain"
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "@google/model-viewer";

interface Product3DModelAnimationProps {
  modelUrl: string;
  fallbackImage: string;
  className?: string;
  autoRotate?: boolean;
  productName: string;
  features: string[];
  dimensions?: { width: string; height: string };
  altText?: string;
}

interface ModelViewerElement extends HTMLElement {
  cameraOrbit: string;
  autoRotate: boolean;
  fieldOfView: string;
}

export function Product3DModelAnimation({
  modelUrl,
  fallbackImage = "https://via.placeholder.com/500",
  className = "",
  autoRotate = false,
  productName = "Product Pro",
  features = [],
  dimensions = { width: "12.70 cm", height: "12.70 cm" },
  altText = "3D Product Model",
}: Product3DModelAnimationProps) {
  const modelViewerRef = useRef<ModelViewerElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(true);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isScrollLocked, setIsScrollLocked] = useState(false);

  // Refs for scroll management
  const lastScrollY = useRef(0);
  const scrollAccumulator = useRef(0);
  const isInAnimation = useRef(false);
  const originalBodyOverflow = useRef<string>("");

  // Filter valid features
  const processedFeatures = React.useMemo(() => {
    return features
      .map((f) => f.replace(/^\*\s*/, "").trim())
      .filter((f) => f.length > 0);
  }, [features]);

  const totalFeatures = processedFeatures.length;

  // Handle 3D model loading
  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer) return;

    const handleLoad = () => {
      setIsLoading(false);
      setTimeout(() => setShowFallback(false), 300);
    };

    modelViewer.addEventListener("load", handleLoad);
    return () => {
      modelViewer.removeEventListener("load", handleLoad);
    };
  }, [modelUrl]);

  // Lock & unlock scroll
  const lockScroll = useCallback(() => {
    if (!isScrollLocked) {
      originalBodyOverflow.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      setIsScrollLocked(true);
      isInAnimation.current = true;
    }
  }, [isScrollLocked]);

  const unlockScroll = useCallback(() => {
    if (isScrollLocked) {
      document.body.style.overflow = originalBodyOverflow.current;
      setIsScrollLocked(false);
      isInAnimation.current = false;
      scrollAccumulator.current = 0;
    }
  }, [isScrollLocked]);

  // Update 3D rotation
  const updateModelRotation = useCallback(
    (progress: number) => {
      if (modelViewerRef.current && !showFallback) {
        const totalRotations = progress * totalFeatures;
        const baseRotation = 45;
        const rotation = baseRotation + totalRotations * 360;
        const elevation = 75 - progress * 10;
        modelViewerRef.current.cameraOrbit = `${rotation}deg ${elevation}deg 5m`;
        modelViewerRef.current.fieldOfView = `60deg`;
      }
    },
    [showFallback, totalFeatures]
  );

  // Handle scroll-wheel animation
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!containerRef.current || !isInAnimation.current) return;

      e.preventDefault();
      e.stopPropagation();

      const delta = e.deltaY;
      const scrollSensitivity = 0.001;

      scrollAccumulator.current += delta * scrollSensitivity;
      const newProgress = Math.max(0, Math.min(1, scrollAccumulator.current));
      setAnimationProgress(newProgress);

      const featureIndex = Math.floor(newProgress * totalFeatures);
      setCurrentFeatureIndex(
        Math.max(0, Math.min(totalFeatures - 1, featureIndex))
      );

      updateModelRotation(newProgress);

      if (newProgress >= 1 && delta > 0) {
        setTimeout(() => {
          unlockScroll();
          window.scrollBy(0, delta * 0.5);
        }, 100);
      } else if (newProgress <= 0 && delta < 0) {
        setTimeout(() => {
          unlockScroll();
          window.scrollBy(0, delta * 0.5);
        }, 100);
      }
    },
    [totalFeatures, updateModelRotation, unlockScroll]
  );

  // Detect viewport & lock scroll
  const handleScroll = useCallback(() => {
    if (!containerRef.current || isInAnimation.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const isEntering =
      containerRect.top <= viewportHeight * 0.5 &&
      containerRect.bottom >= viewportHeight * 0.5;

    if (isEntering) {
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > lastScrollY.current ? "down" : "up";
      lockScroll();
      if (direction === "down") {
        setAnimationProgress(0);
        setCurrentFeatureIndex(0);
        scrollAccumulator.current = 0;
      } else {
        setAnimationProgress(1);
        setCurrentFeatureIndex(totalFeatures - 1);
        scrollAccumulator.current = 1;
      }
    }
    lastScrollY.current = window.scrollY;
  }, [lockScroll, totalFeatures]);

  // Scroll listeners
  useEffect(() => {
    const handleScrollThrottled = () => {
      requestAnimationFrame(handleScroll);
    };
    window.addEventListener("scroll", handleScrollThrottled, { passive: true });
    return () =>
      window.removeEventListener("scroll", handleScrollThrottled);
  }, [handleScroll]);

  // Wheel event
  useEffect(() => {
    if (isScrollLocked && containerRef.current) {
      window.addEventListener("wheel", handleWheel, { passive: false });
      return () => {
        window.removeEventListener("wheel", handleWheel);
      };
    }
  }, [isScrollLocked, handleWheel]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (isScrollLocked) {
        document.body.style.overflow = originalBodyOverflow.current;
      }
    };
  }, [isScrollLocked]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-screen flex items-center justify-center bg-white overflow-hidden ${className}`}
    >
      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.h1
            key={currentFeatureIndex}
            className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-700 text-center leading-tight max-w-6xl px-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {processedFeatures[currentFeatureIndex]}
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* 3D Model */}
      <div className="relative z-10 w-full max-w-2xl h-[600px] mx-auto">
        {React.createElement("model-viewer", {
          ref: modelViewerRef,
          src: modelUrl,
          alt: altText,
          style: {
            width: "100%",
            height: "100%",
            "--poster-color": "transparent",
          },
          "camera-controls": true,
          "auto-rotate": autoRotate && !isScrollLocked,
          ar: true,
          loading: "eager",
          reveal: "auto",
          "environment-image": "neutral",
          "shadow-intensity": 0.3,
          "shadow-softness": 0.8,
          "camera-orbit": "45deg 75deg 5m",
          "field-of-view": "60deg",
          "disable-zoom": true, // ✅ Always disable zoom
          "interaction-prompt": "none",
          "touch-action": "pan-y",
          // ✅ Normalize scale for consistent model sizing
          "min-scale": "1",
          "max-scale": "1",
        })}

        {/* Loader */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-gray-600 text-sm">Loading 3D Model...</p>
            </div>
          </div>
        )}

        {/* Fallback */}
        {showFallback && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <img
              src={fallbackImage}
              alt={altText}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
}
