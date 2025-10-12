// "use client";
// import React, { useEffect, useRef, useState, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
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
//   updateFraming?: () => void;
// }

// interface CameraPosition {
//   horizontal: number;
//   vertical: number;
//   label: string;
// }

// export function Product3DModelAnimation({
//   modelUrl,
//   fallbackImage = "https://via.placeholder.com/500",
//   className = "",
//   autoRotate = false,
//   productName = "Product Pro",
//   features = [],
//   dimensions = { width: "12.70 cm", height: "12.70 cm" },
//   altText = "3D Product Model",
// }: Product3DModelAnimationProps) {
//   const modelViewerRef = useRef<ModelViewerElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showFallback, setShowFallback] = useState(true);
//   const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
//   const [isScrollLocked, setIsScrollLocked] = useState(false);
//   const [hasInitialRotation, setHasInitialRotation] = useState(false);
//   const [showInitialText, setShowInitialText] = useState(false);
//   const [isRotating, setIsRotating] = useState(false);
//   const [animationCompleted, setAnimationCompleted] = useState(false);

//   // Refs for scroll management
//   const lastScrollY = useRef(0);
//   const isInAnimation = useRef(false);
//   const originalBodyOverflow = useRef<string>("");
//   const scrollAccumulator = useRef(0);
//   const unlockTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//   // Filter valid features
//   const processedFeatures = React.useMemo(() => {
//     return features
//       .map((f) => f.replace(/^\*\s*/, "").trim())
//       .filter((f) => f.length > 0);
//   }, [features]);

//   const totalFeatures = processedFeatures.length;

//   // Define camera positions
//   const cameraPositions: CameraPosition[] = [
//     { horizontal: 0, vertical: 75, label: "Front" },
//     { horizontal: 90, vertical: 75, label: "Right Side" },
//     { horizontal: 180, vertical: 75, label: "Back" },
//     { horizontal: 270, vertical: 75, label: "Left Side" },
//     { horizontal: 0, vertical: 20, label: "Top View" },
//     { horizontal: 90, vertical: 20, label: "Top-Right" },
//     { horizontal: 180, vertical: 20, label: "Top-Back" },
//     { horizontal: 270, vertical: 20, label: "Top-Left" },
//     { horizontal: 0, vertical: 130, label: "Bottom View" },
//     { horizontal: 90, vertical: 130, label: "Bottom-Right" },
//   ];

//   const availablePositions = cameraPositions.slice(
//     0,
//     Math.min(totalFeatures, cameraPositions.length)
//   );

//   // Perform initial 360-degree showcase rotation
//   const performInitialRotation = useCallback(() => {
//     if (!modelViewerRef.current || hasInitialRotation) return;

//     const modelViewer = modelViewerRef.current;
//     const duration = 2000;
//     const startTime = performance.now();

//     setShowInitialText(true);

//     const animate = (currentTime: number) => {
//       const elapsed = currentTime - startTime;
//       const progress = Math.min(elapsed / duration, 1);

//       const easeProgress =
//         progress < 0.5
//           ? 2 * progress * progress
//           : 1 - Math.pow(-2 * progress + 2, 2) / 2;

//       const horizontalRotation = 360 * easeProgress;
//       const verticalTilt = 75 + Math.sin(progress * Math.PI * 2) * 10;

//       modelViewer.cameraOrbit = `${horizontalRotation}deg ${verticalTilt}deg 105%`;

//       if (progress < 1) {
//         requestAnimationFrame(animate);
//       } else {
//         const firstPos = availablePositions[0];
//         modelViewer.cameraOrbit = `${firstPos.horizontal}deg ${firstPos.vertical}deg 105%`;
//         setHasInitialRotation(true);
//       }
//     };

//     requestAnimationFrame(animate);
//   }, [hasInitialRotation, availablePositions]);

//   // Lock scroll
//   const lockScroll = useCallback(() => {
//     if (!isScrollLocked) {
//       originalBodyOverflow.current = document.body.style.overflow;
//       document.body.style.overflow = "hidden";
//       setIsScrollLocked(true);
//       isInAnimation.current = true;
      
//       // Clear any pending unlock timeout
//       if (unlockTimeoutRef.current) {
//         clearTimeout(unlockTimeoutRef.current);
//         unlockTimeoutRef.current = null;
//       }
//     }
//   }, [isScrollLocked]);

//   // Unlock scroll with optional delay
//   const unlockScroll = useCallback((immediate = false) => {
//     if (unlockTimeoutRef.current) {
//       clearTimeout(unlockTimeoutRef.current);
//       unlockTimeoutRef.current = null;
//     }

//     const doUnlock = () => {
//       if (isScrollLocked) {
//         document.body.style.overflow = originalBodyOverflow.current;
//         setIsScrollLocked(false);
//         isInAnimation.current = false;
//         scrollAccumulator.current = 0;
        
//         // Mark animation as completed and reset to front view
//         setAnimationCompleted(true);
//         if (modelViewerRef.current) {
//           const frontPos = availablePositions[0];
//           modelViewerRef.current.cameraOrbit = `${frontPos.horizontal}deg ${frontPos.vertical}deg 105%`;
//           setCurrentFeatureIndex(0);
//         }
//       }
//     };

//     if (immediate) {
//       doUnlock();
//     } else {
//       // Small delay to prevent immediate re-lock
//       unlockTimeoutRef.current = setTimeout(doUnlock, 100);
//     }
//   }, [isScrollLocked, availablePositions]);

//   // Rotate model to a specific camera position
//   const rotateToPosition = useCallback(
//     (targetIndex: number) => {
//       if (!modelViewerRef.current || !hasInitialRotation || isRotating) return;

//       setIsRotating(true);
//       const modelViewer = modelViewerRef.current;

//       const currentPos = availablePositions[currentFeatureIndex];
//       const targetPos = availablePositions[targetIndex];

//       let horizontalDiff = targetPos.horizontal - currentPos.horizontal;
//       if (horizontalDiff > 180) horizontalDiff -= 360;
//       if (horizontalDiff < -180) horizontalDiff += 360;

//       const verticalDiff = targetPos.vertical - currentPos.vertical;

//       const duration = 900;
//       const startTime = performance.now();

//       const animate = (currentTime: number) => {
//         const elapsed = currentTime - startTime;
//         const progress = Math.min(elapsed / duration, 1);

//         let easeProgress;
//         if (progress < 0.5) {
//           easeProgress = 4 * progress * progress * progress;
//         } else {
//           const p = -2 * progress + 2;
//           easeProgress = 1 - (p * p * p) / 2;
//         }

//         const currentHorizontal =
//           currentPos.horizontal + horizontalDiff * easeProgress;
//         const currentVertical =
//           currentPos.vertical + verticalDiff * easeProgress;

//         modelViewer.cameraOrbit = `${currentHorizontal}deg ${currentVertical}deg 105%`;

//         if (progress < 1) {
//           requestAnimationFrame(animate);
//         } else {
//           modelViewer.cameraOrbit = `${targetPos.horizontal}deg ${targetPos.vertical}deg 105%`;
//           setCurrentFeatureIndex(targetIndex);
//           setIsRotating(false);
//         }
//       };

//       requestAnimationFrame(animate);
//     },
//     [currentFeatureIndex, hasInitialRotation, isRotating, availablePositions]
//   );

//   // Handle scroll-wheel animation
//   const handleWheel = useCallback(
//     (e: WheelEvent) => {
//       if (
//         !containerRef.current ||
//         !isInAnimation.current ||
//         !hasInitialRotation ||
//         isRotating
//       ) {
//         return;
//       }

//       e.preventDefault();
//       e.stopPropagation();

//       const delta = e.deltaY;
//       scrollAccumulator.current += delta;

//       const scrollThreshold = 100;

//       if (Math.abs(scrollAccumulator.current) >= scrollThreshold) {
//         if (scrollAccumulator.current > 0) {
//           // Scrolling down
//           const nextIndex = currentFeatureIndex + 1;

//           if (nextIndex < totalFeatures) {
//             rotateToPosition(nextIndex);
//             scrollAccumulator.current = 0;
//           } else {
//             // At the end - unlock and allow page scroll
//             unlockScroll(true);
//           }
//         } else {
//           // Scrolling up
//           const prevIndex = currentFeatureIndex - 1;

//           if (prevIndex >= 0) {
//             rotateToPosition(prevIndex);
//             scrollAccumulator.current = 0;
//           } else {
//             // At the beginning - unlock and allow page scroll
//             unlockScroll(true);
//           }
//         }
//       } else if (
//         (currentFeatureIndex === totalFeatures - 1 && delta > 0) ||
//         (currentFeatureIndex === 0 && delta < 0)
//       ) {
//         // User is trying to scroll past boundaries - unlock faster
//         if (Math.abs(scrollAccumulator.current) >= scrollThreshold / 2) {
//           unlockScroll(true);
//         }
//       }
//     },
//     [
//       currentFeatureIndex,
//       totalFeatures,
//       rotateToPosition,
//       unlockScroll,
//       hasInitialRotation,
//       isRotating,
//     ]
//   );

//   // Detect viewport & lock scroll
//   const handleScroll = useCallback(() => {
//     // Don't lock again if animation was already completed
//     if (!containerRef.current || isInAnimation.current || !hasInitialRotation || animationCompleted)
//       return;

//     const containerRect = containerRef.current.getBoundingClientRect();
//     const viewportHeight = window.innerHeight;

//     const isEntering =
//       containerRect.top <= viewportHeight * 0.4 &&
//       containerRect.bottom >= viewportHeight * 0.6;

//     if (isEntering) {
//       const currentScrollY = window.scrollY;
//       const direction = currentScrollY > lastScrollY.current ? "down" : "up";

//       lockScroll();

//       if (direction === "down") {
//         setCurrentFeatureIndex(0);
//         if (modelViewerRef.current) {
//           const firstPos = availablePositions[0];
//           modelViewerRef.current.cameraOrbit = `${firstPos.horizontal}deg ${firstPos.vertical}deg 105%`;
//         }
//       } else {
//         const lastIndex = totalFeatures - 1;
//         setCurrentFeatureIndex(lastIndex);
//         if (modelViewerRef.current) {
//           const lastPos = availablePositions[lastIndex];
//           modelViewerRef.current.cameraOrbit = `${lastPos.horizontal}deg ${lastPos.vertical}deg 105%`;
//         }
//       }

//       scrollAccumulator.current = 0;
//       lastScrollY.current = currentScrollY;
//     } else {
//       lastScrollY.current = window.scrollY;
//     }
//   }, [lockScroll, totalFeatures, hasInitialRotation, availablePositions, animationCompleted]);

//   // Scroll listeners
//   useEffect(() => {
//     const handleScrollThrottled = () => {
//       requestAnimationFrame(handleScroll);
//     };
//     window.addEventListener("scroll", handleScrollThrottled, { passive: true });
//     return () => window.removeEventListener("scroll", handleScrollThrottled);
//   }, [handleScroll]);

//   // Wheel event
//   useEffect(() => {
//     if (isScrollLocked && containerRef.current) {
//       window.addEventListener("wheel", handleWheel, { passive: false });
//       return () => {
//         window.removeEventListener("wheel", handleWheel);
//       };
//     }
//   }, [isScrollLocked, handleWheel]);

//   // Cleanup
//   useEffect(() => {
//     return () => {
//       if (isScrollLocked) {
//         document.body.style.overflow = originalBodyOverflow.current;
//       }
//       if (unlockTimeoutRef.current) {
//         clearTimeout(unlockTimeoutRef.current);
//       }
//     };
//   }, [isScrollLocked]);

//   useEffect(() => {
//     const modelViewer = modelViewerRef.current;
//     if (!modelViewer) return;

//     const handleLoad = () => {
//       setIsLoading(false);

//       setTimeout(() => {
//         setShowFallback(false);

//         if (modelViewer.updateFraming) {
//           modelViewer.updateFraming();
//         }

//         const firstPos = availablePositions[0];
//         modelViewer.cameraOrbit = `${firstPos.horizontal}deg ${firstPos.vertical}deg 105%`;
//         modelViewer.fieldOfView = "auto";

//         performInitialRotation();
//       }, 300);
//     };

//     modelViewer.addEventListener("load", handleLoad);
//     return () => modelViewer.removeEventListener("load", handleLoad);
//   }, [modelUrl, performInitialRotation, availablePositions]);

//   const currentPosition = availablePositions[currentFeatureIndex];

//   return (
//     <div
//       ref={containerRef}
//       className={`relative w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden ${className}`}
//     >
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full px-6">
//         {/* 3D Model Column */}
//         <div className="relative w-full h-[600px] flex items-center justify-center">
//           {React.createElement("model-viewer", {
//             ref: modelViewerRef,
//             src: modelUrl,
//             alt: altText,
//             style: {
//               width: "100%",
//               height: "100%",
//               "--poster-color": "transparent",
//             },
//             "camera-controls": false,
//             "auto-rotate": false,
//             ar: true,
//             loading: "eager",
//             reveal: "auto",
//             "environment-image": "neutral",
//             "shadow-intensity": 0.5,
//             "shadow-softness": 1.0,
//             "camera-target": "auto auto auto",
//             "camera-orbit": `${currentPosition.horizontal}deg ${currentPosition.vertical}deg 105%`,
//             "field-of-view": "auto",
//             "disable-zoom": true,
//             "disable-pan": true,
//             "interaction-prompt": "none",
//             "touch-action": "none",
//             bounds: "tight",
//             "interpolation-decay": 200,
//             "min-field-of-view": "25deg",
//             "max-field-of-view": "45deg",
//           })}

//           {/* Navigation hint */}
//           {hasInitialRotation && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-blue-500/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg"
//             >
//               <p className="text-xs font-medium text-white">
//                 Scroll to explore all angles
//               </p>
//             </motion.div>
//           )}
//         </div>

//         {/* Text Column */}
//         <div className="relative z-10 flex flex-col justify-center text-center lg:text-left">
//           {!showInitialText ? (
//             <div className="h-24 flex items-center justify-center lg:justify-start">
//               <div className="flex items-center gap-3">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
//                 <div
//                   className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
//                   style={{ animationDelay: "0.2s" }}
//                 ></div>
//                 <div
//                   className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
//                   style={{ animationDelay: "0.4s" }}
//                 ></div>
//                 <span className="ml-2 text-gray-600 font-medium">
//                   Loading 3D Model
//                 </span>
//               </div>
//             </div>
//           ) : animationCompleted ? (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.5 }}
//             >
//               <h1 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
//                 {productName}
//               </h1>
//               <p className="text-lg text-gray-600">
//                 Explore all the amazing features of this product
//               </p>
              
//               {/* Feature list */}
//               <div className="mt-8 space-y-3">
//                 {processedFeatures.map((feature, index) => (
//                   <div key={index} className="flex items-center justify-center lg:justify-start gap-3">
//                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                     <span className="text-gray-700">{feature}</span>
//                   </div>
//                 ))}
//               </div>
//             </motion.div>
//           ) : (
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={currentFeatureIndex}
//                 initial={{ opacity: 0, x: 50, scale: 0.95 }}
//                 animate={{ opacity: 1, x: 0, scale: 1 }}
//                 exit={{ opacity: 0, x: -50, scale: 0.95 }}
//                 transition={{
//                   duration: 0.5,
//                   ease: [0.25, 0.46, 0.45, 0.94],
//                 }}
//               >
//                 <h1 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
//                   {processedFeatures[currentFeatureIndex]}
//                 </h1>

//                 {/* Progress visualization */}
//                 <div className="space-y-4 mt-8">
//                   <div className="flex justify-center lg:justify-start space-x-2">
//                     {processedFeatures.map((_, index) => (
//                       <div
//                         key={index}
//                         className={`h-2 rounded-full transition-all duration-500 ${
//                           index === currentFeatureIndex
//                             ? "bg-gradient-to-r from-blue-500 to-purple-500 w-12 shadow-lg"
//                             : index < currentFeatureIndex
//                             ? "bg-blue-300 w-2"
//                             : "bg-gray-300 w-2"
//                         }`}
//                       />
//                     ))}
//                   </div>

//                   {/* Scroll hint */}
//                   {isScrollLocked && (
//                     <motion.div
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       className="flex items-center justify-center lg:justify-start gap-2 text-sm text-gray-500"
//                     >
//                       {currentFeatureIndex < totalFeatures - 1 ? (
//                         <>
//                           <svg
//                             className="w-4 h-4 animate-bounce"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M19 14l-7 7m0 0l-7-7m7 7V3"
//                             />
//                           </svg>
//                           <span>
//                             Scroll to see{" "}
//                             {availablePositions[currentFeatureIndex + 1]?.label}
//                           </span>
//                         </>
//                       ) : (
//                         <>
//                           <svg
//                             className="w-4 h-4 animate-bounce"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M19 14l-7 7m0 0l-7-7m7 7V3"
//                             />
//                           </svg>
//                           <span>Scroll to continue</span>
//                         </>
//                       )}
//                     </motion.div>
//                   )}
//                 </div>
//               </motion.div>
//             </AnimatePresence>
//           )}
//         </div>
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
  updateFraming?: () => void;
}

interface CameraPosition {
  horizontal: number;
  vertical: number;
  label: string;
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
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [hasInitialRotation, setHasInitialRotation] = useState(false);
  const [showInitialText, setShowInitialText] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"down" | "up" | null>(null);

  // Refs for scroll management
  const lastScrollY = useRef(0);
  const isInAnimation = useRef(false);
  const originalBodyOverflow = useRef<string>("");
  const scrollAccumulator = useRef(0);
  const unlockTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastFeatureIndexRef = useRef(0);

  // Filter valid features
  const processedFeatures = React.useMemo(() => {
    return features
      .map((f) => f.replace(/^\*\s*/, "").trim())
      .filter((f) => f.length > 0);
  }, [features]);

  const totalFeatures = processedFeatures.length;

  // Define camera positions
  const cameraPositions: CameraPosition[] = [
    { horizontal: 0, vertical: 75, label: "Front" },
    { horizontal: 90, vertical: 75, label: "Right Side" },
    { horizontal: 180, vertical: 75, label: "Back" },
    { horizontal: 270, vertical: 75, label: "Left Side" },
    { horizontal: 0, vertical: 20, label: "Top View" },
    { horizontal: 90, vertical: 20, label: "Top-Right" },
    { horizontal: 180, vertical: 20, label: "Top-Back" },
    { horizontal: 270, vertical: 20, label: "Top-Left" },
    { horizontal: 0, vertical: 130, label: "Bottom View" },
    { horizontal: 90, vertical: 130, label: "Bottom-Right" },
  ];

  const availablePositions = cameraPositions.slice(
    0,
    Math.min(totalFeatures, cameraPositions.length)
  );

  // Perform initial 360-degree showcase rotation
  const performInitialRotation = useCallback(() => {
    if (!modelViewerRef.current || hasInitialRotation) return;

    const modelViewer = modelViewerRef.current;
    const duration = 2000;
    const startTime = performance.now();

    setShowInitialText(true);

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeProgress =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const horizontalRotation = 360 * easeProgress;
      const verticalTilt = 75 + Math.sin(progress * Math.PI * 2) * 10;

      modelViewer.cameraOrbit = `${horizontalRotation}deg ${verticalTilt}deg 105%`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        const firstPos = availablePositions[0];
        modelViewer.cameraOrbit = `${firstPos.horizontal}deg ${firstPos.vertical}deg 105%`;
        setHasInitialRotation(true);
      }
    };

    requestAnimationFrame(animate);
  }, [hasInitialRotation, availablePositions]);

  // Lock scroll
  const lockScroll = useCallback(() => {
    if (!isScrollLocked) {
      originalBodyOverflow.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      setIsScrollLocked(true);
      isInAnimation.current = true;
      
      // Clear any pending unlock timeout
      if (unlockTimeoutRef.current) {
        clearTimeout(unlockTimeoutRef.current);
        unlockTimeoutRef.current = null;
      }
    }
  }, [isScrollLocked]);

  // Unlock scroll with optional delay
  const unlockScroll = useCallback((immediate = false, fromDirection?: "down" | "up") => {
    if (unlockTimeoutRef.current) {
      clearTimeout(unlockTimeoutRef.current);
      unlockTimeoutRef.current = null;
    }

    const doUnlock = () => {
      if (isScrollLocked) {
        document.body.style.overflow = originalBodyOverflow.current;
        setIsScrollLocked(false);
        isInAnimation.current = false;
        scrollAccumulator.current = 0;
        
        // Save the last position when unlocking
        lastFeatureIndexRef.current = currentFeatureIndex;
        
        // Don't mark as fully completed, just unlock scroll
        // Model stays at current position
      }
    };

    if (immediate) {
      doUnlock();
    } else {
      // Small delay to prevent immediate re-lock
      unlockTimeoutRef.current = setTimeout(doUnlock, 100);
    }
  }, [isScrollLocked, currentFeatureIndex]);

  // Rotate model to a specific camera position
  const rotateToPosition = useCallback(
    (targetIndex: number) => {
      if (!modelViewerRef.current || !hasInitialRotation || isRotating) return;

      setIsRotating(true);
      const modelViewer = modelViewerRef.current;

      const currentPos = availablePositions[currentFeatureIndex];
      const targetPos = availablePositions[targetIndex];

      let horizontalDiff = targetPos.horizontal - currentPos.horizontal;
      if (horizontalDiff > 180) horizontalDiff -= 360;
      if (horizontalDiff < -180) horizontalDiff += 360;

      const verticalDiff = targetPos.vertical - currentPos.vertical;

      const duration = 900;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        let easeProgress;
        if (progress < 0.5) {
          easeProgress = 4 * progress * progress * progress;
        } else {
          const p = -2 * progress + 2;
          easeProgress = 1 - (p * p * p) / 2;
        }

        const currentHorizontal =
          currentPos.horizontal + horizontalDiff * easeProgress;
        const currentVertical =
          currentPos.vertical + verticalDiff * easeProgress;

        modelViewer.cameraOrbit = `${currentHorizontal}deg ${currentVertical}deg 105%`;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          modelViewer.cameraOrbit = `${targetPos.horizontal}deg ${targetPos.vertical}deg 105%`;
          setCurrentFeatureIndex(targetIndex);
          setIsRotating(false);
        }
      };

      requestAnimationFrame(animate);
    },
    [currentFeatureIndex, hasInitialRotation, isRotating, availablePositions]
  );

  // Handle scroll-wheel animation
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (
        !containerRef.current ||
        !isInAnimation.current ||
        !hasInitialRotation ||
        isRotating
      ) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const delta = e.deltaY;
      scrollAccumulator.current += delta;

      const scrollThreshold = 100;

      if (Math.abs(scrollAccumulator.current) >= scrollThreshold) {
        if (scrollAccumulator.current > 0) {
          // Scrolling down
          const nextIndex = currentFeatureIndex + 1;

          if (nextIndex < totalFeatures) {
            setScrollDirection("down");
            rotateToPosition(nextIndex);
            scrollAccumulator.current = 0;
          } else {
            // At the end - unlock and allow page scroll
            unlockScroll(true, "down");
          }
        } else {
          // Scrolling up
          const prevIndex = currentFeatureIndex - 1;

          if (prevIndex >= 0) {
            setScrollDirection("up");
            rotateToPosition(prevIndex);
            scrollAccumulator.current = 0;
          } else {
            // At the beginning - unlock and allow page scroll
            unlockScroll(true, "up");
          }
        }
      } else if (
        (currentFeatureIndex === totalFeatures - 1 && delta > 0) ||
        (currentFeatureIndex === 0 && delta < 0)
      ) {
        // User is trying to scroll past boundaries - unlock faster
        if (Math.abs(scrollAccumulator.current) >= scrollThreshold / 2) {
          unlockScroll(true, delta > 0 ? "down" : "up");
        }
      }
    },
    [
      currentFeatureIndex,
      totalFeatures,
      rotateToPosition,
      unlockScroll,
      hasInitialRotation,
      isRotating,
    ]
  );

  // Detect viewport & lock scroll
  const handleScroll = useCallback(() => {
    // Allow re-entry into animation
    if (!containerRef.current || isInAnimation.current || !hasInitialRotation)
      return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const isEntering =
      containerRect.top <= viewportHeight * 0.4 &&
      containerRect.bottom >= viewportHeight * 0.6;

    if (isEntering) {
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > lastScrollY.current ? "down" : "up";

      lockScroll();
      setScrollDirection(direction);

      if (direction === "down") {
        // Scrolling down: continue from where we left off or start from beginning
        const startIndex = lastFeatureIndexRef.current;
        setCurrentFeatureIndex(startIndex);
        if (modelViewerRef.current && availablePositions[startIndex]) {
          const pos = availablePositions[startIndex];
          modelViewerRef.current.cameraOrbit = `${pos.horizontal}deg ${pos.vertical}deg 105%`;
        }
      } else {
        // Scrolling up: go to previous feature from where we were
        const startIndex = Math.max(0, lastFeatureIndexRef.current - 1);
        setCurrentFeatureIndex(startIndex);
        if (modelViewerRef.current && availablePositions[startIndex]) {
          const pos = availablePositions[startIndex];
          modelViewerRef.current.cameraOrbit = `${pos.horizontal}deg ${pos.vertical}deg 105%`;
        }
      }

      scrollAccumulator.current = 0;
      lastScrollY.current = currentScrollY;
    } else {
      lastScrollY.current = window.scrollY;
    }
  }, [lockScroll, totalFeatures, hasInitialRotation, availablePositions]);

  // Scroll listeners
  useEffect(() => {
    const handleScrollThrottled = () => {
      requestAnimationFrame(handleScroll);
    };
    window.addEventListener("scroll", handleScrollThrottled, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollThrottled);
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
      if (unlockTimeoutRef.current) {
        clearTimeout(unlockTimeoutRef.current);
      }
    };
  }, [isScrollLocked]);

  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer) return;

    const handleLoad = () => {
      setIsLoading(false);

      setTimeout(() => {
        setShowFallback(false);

        if (modelViewer.updateFraming) {
          modelViewer.updateFraming();
        }

        const firstPos = availablePositions[0];
        modelViewer.cameraOrbit = `${firstPos.horizontal}deg ${firstPos.vertical}deg 105%`;
        modelViewer.fieldOfView = "auto";

        performInitialRotation();
      }, 300);
    };

    modelViewer.addEventListener("load", handleLoad);
    return () => modelViewer.removeEventListener("load", handleLoad);
  }, [modelUrl, performInitialRotation, availablePositions]);

  const currentPosition = availablePositions[currentFeatureIndex];

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden ${className}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full px-6">
        {/* 3D Model Column */}
        <div className="relative w-full h-[600px] flex items-center justify-center">
          {React.createElement("model-viewer", {
            ref: modelViewerRef,
            src: modelUrl,
            alt: altText,
            style: {
              width: "100%",
              height: "100%",
              "--poster-color": "transparent",
            },
            "camera-controls": false,
            "auto-rotate": false,
            ar: true,
            loading: "eager",
            reveal: "auto",
            "environment-image": "neutral",
            "shadow-intensity": 0.5,
            "shadow-softness": 1.0,
            "camera-target": "auto auto auto",
            "camera-orbit": `${currentPosition.horizontal}deg ${currentPosition.vertical}deg 105%`,
            "field-of-view": "auto",
            "disable-zoom": true,
            "disable-pan": true,
            "interaction-prompt": "none",
            "touch-action": "none",
            bounds: "tight",
            "interpolation-decay": 200,
            "min-field-of-view": "25deg",
            "max-field-of-view": "45deg",
          })}

          {/* Navigation hint */}
          {hasInitialRotation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-blue-500/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg"
            >
              <p className="text-xs font-medium text-white">
                Scroll to explore all angles
              </p>
            </motion.div>
          )}
        </div>

        {/* Text Column */}
        <div className="relative z-10 flex flex-col justify-center text-center lg:text-left">
          {!showInitialText ? (
            <div className="h-24 flex items-center justify-center lg:justify-start">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
                <span className="ml-2 text-gray-600 font-medium">
                  Loading 3D Model
                </span>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeatureIndex}
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                transition={{
                  duration: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <h1 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
                  {processedFeatures[currentFeatureIndex]}
                </h1>

                {/* Progress visualization */}
                <div className="space-y-4 mt-8">
                  <div className="flex justify-center lg:justify-start space-x-2">
                    {processedFeatures.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 rounded-full transition-all duration-500 ${
                          index === currentFeatureIndex
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 w-12 shadow-lg"
                            : index < currentFeatureIndex
                            ? "bg-blue-300 w-2"
                            : "bg-gray-300 w-2"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Scroll hint */}
                  {isScrollLocked && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center lg:justify-start gap-2 text-sm text-gray-500"
                    >
                      {currentFeatureIndex < totalFeatures - 1 && scrollDirection === "down" ? (
                        <>
                          <svg
                            className="w-4 h-4 animate-bounce"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                          </svg>
                          <span>
                            Scroll down to see next feature
                          </span>
                        </>
                      ) : currentFeatureIndex > 0 && scrollDirection === "up" ? (
                        <>
                          <svg
                            className="w-4 h-4 animate-bounce transform rotate-180"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                          </svg>
                          <span>
                            Scroll up to see previous feature
                          </span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4 animate-bounce"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                          </svg>
                          <span>Scroll to continue</span>
                        </>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}