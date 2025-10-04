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

//   // Refs for scroll management
//   const lastScrollY = useRef(0);
//   const isInAnimation = useRef(false);
//   const originalBodyOverflow = useRef<string>("");
//   const scrollAccumulator = useRef(0);

//   // Filter valid features
//   const processedFeatures = React.useMemo(() => {
//     return features
//       .map((f) => f.replace(/^\*\s*/, "").trim())
//       .filter((f) => f.length > 0);
//   }, [features]);

//   const totalFeatures = processedFeatures.length;
  
//   // Define the angles for each face (4 sides of the model)
//   const faceAngles = [0, 90, 180, 270];
  
//   // Get angle for current feature index
//   const getAngleForIndex = (index: number) => {
//     return faceAngles[index % 4];
//   };

//   // Perform initial 360-degree rotation over 1.5 seconds
//   const performInitialRotation = useCallback(() => {
//     if (!modelViewerRef.current || hasInitialRotation) return;

//     const modelViewer = modelViewerRef.current;
//     const duration = 1500; // 1.5 seconds for smoother rotation
//     const startTime = performance.now();
//     const startRotation = 0;
//     const endRotation = 360;

//     setShowInitialText(true);

//     const animate = (currentTime: number) => {
//       const elapsed = currentTime - startTime;
//       const progress = Math.min(elapsed / duration, 1);

//       // Ease-in-out for smoother animation
//       const easeProgress =
//         progress < 0.5
//           ? 2 * progress * progress
//           : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
//       const rotation = startRotation + (endRotation - startRotation) * easeProgress;
//       modelViewer.cameraOrbit = `${rotation}deg 75deg 105%`;

//       if (progress < 1) {
//         requestAnimationFrame(animate);
//       } else {
//         // Reset to starting position (front face)
//         modelViewer.cameraOrbit = `0deg 75deg 105%`;
//         setHasInitialRotation(true);
//       }
//     };

//     requestAnimationFrame(animate);
//   }, [hasInitialRotation]);

//   // Lock & unlock scroll
//   const lockScroll = useCallback(() => {
//     if (!isScrollLocked) {
//       originalBodyOverflow.current = document.body.style.overflow;
//       document.body.style.overflow = "hidden";
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

//   // Rotate model to show a specific face
//   const rotateToFace = useCallback((targetIndex: number) => {
//     if (!modelViewerRef.current || !hasInitialRotation || isRotating) return;

//     setIsRotating(true);
//     const modelViewer = modelViewerRef.current;
//     const targetAngle = getAngleForIndex(targetIndex);
//     const currentAngle = getAngleForIndex(currentFeatureIndex);
    
//     // Calculate the shortest rotation direction
//     let rotationDiff = targetAngle - currentAngle;
//     if (rotationDiff > 180) rotationDiff -= 360;
//     if (rotationDiff < -180) rotationDiff += 360;
    
//     const duration = 800; // 800ms for smooth face transition
//     const startTime = performance.now();

//     const animate = (currentTime: number) => {
//       const elapsed = currentTime - startTime;
//       const progress = Math.min(elapsed / duration, 1);

//       // Ease-in-out animation
//       const easeProgress =
//         progress < 0.5
//           ? 4 * progress * progress * progress
//           : 1 - Math.pow(-2 * progress + 2, 3) / 2;

//       const rotation = currentAngle + rotationDiff * easeProgress;
//       modelViewer.cameraOrbit = `${rotation}deg 75deg 105%`;

//       if (progress < 1) {
//         requestAnimationFrame(animate);
//       } else {
//         modelViewer.cameraOrbit = `${targetAngle}deg 75deg 105%`;
//         setCurrentFeatureIndex(targetIndex);
//         setIsRotating(false);
//       }
//     };

//     requestAnimationFrame(animate);
//   }, [currentFeatureIndex, hasInitialRotation, isRotating]);

//   // Handle scroll-wheel animation
//   const handleWheel = useCallback(
//     (e: WheelEvent) => {
//       if (!containerRef.current || !isInAnimation.current || !hasInitialRotation || isRotating) {
//         return;
//       }

//       e.preventDefault();
//       e.stopPropagation();

//       const delta = e.deltaY;
//       scrollAccumulator.current += delta;

//       // Threshold for triggering face change (adjust for sensitivity)
//       const scrollThreshold = 80;

//       if (Math.abs(scrollAccumulator.current) >= scrollThreshold) {
//         if (scrollAccumulator.current > 0) {
//           // Scrolling down - next face/feature
//           const nextIndex = currentFeatureIndex + 1;
          
//           if (nextIndex < totalFeatures) {
//             rotateToFace(nextIndex);
//             scrollAccumulator.current = 0;
//           } else {
//             // At the end, unlock and allow normal scrolling
//             unlockScroll();
//           }
//         } else {
//           // Scrolling up - previous face/feature
//           const prevIndex = currentFeatureIndex - 1;
          
//           if (prevIndex >= 0) {
//             rotateToFace(prevIndex);
//             scrollAccumulator.current = 0;
//           } else {
//             // At the beginning, unlock and allow normal scrolling
//             unlockScroll();
//           }
//         }
//       }
//     },
//     [currentFeatureIndex, totalFeatures, rotateToFace, unlockScroll, hasInitialRotation, isRotating]
//   );

//   // Detect viewport & lock scroll
//   const handleScroll = useCallback(() => {
//     if (!containerRef.current || isInAnimation.current || !hasInitialRotation) return;

//     const containerRect = containerRef.current.getBoundingClientRect();
//     const viewportHeight = window.innerHeight;

//     // Check if container is in the center of viewport
//     const isEntering =
//       containerRect.top <= viewportHeight * 0.4 &&
//       containerRect.bottom >= viewportHeight * 0.6;

//     if (isEntering) {
//       const currentScrollY = window.scrollY;
//       const direction = currentScrollY > lastScrollY.current ? "down" : "up";
      
//       lockScroll();

//       // Set initial state based on scroll direction
//       if (direction === "down") {
//         setCurrentFeatureIndex(0);
//         if (modelViewerRef.current) {
//           modelViewerRef.current.cameraOrbit = "0deg 75deg 105%";
//         }
//       } else {
//         const lastIndex = totalFeatures - 1;
//         setCurrentFeatureIndex(lastIndex);
//         if (modelViewerRef.current) {
//           const lastAngle = getAngleForIndex(lastIndex);
//           modelViewerRef.current.cameraOrbit = `${lastAngle}deg 75deg 105%`;
//         }
//       }

//       scrollAccumulator.current = 0;
//       lastScrollY.current = currentScrollY;
//     } else {
//       lastScrollY.current = window.scrollY;
//     }
//   }, [lockScroll, totalFeatures, hasInitialRotation]);

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
        
//         modelViewer.cameraOrbit = "0deg 75deg 105%";
//         modelViewer.fieldOfView = "auto";
        
//         performInitialRotation();
//       }, 300);
//     };

//     modelViewer.addEventListener("load", handleLoad);
//     return () => modelViewer.removeEventListener("load", handleLoad);
//   }, [modelUrl, performInitialRotation]);

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
//             "camera-orbit": "0deg 75deg 105%",
//             "field-of-view": "auto",
//             "disable-zoom": true,
//             "disable-pan": true,
//             "interaction-prompt": "none",
//             "touch-action": "none",
//             bounds: "tight",
//             "interpolation-decay": 200,
//           })}

//           {/* Face indicator */}
//           {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
//             <p className="text-sm font-medium text-gray-700">
//               Face {(currentFeatureIndex % 4) + 1} of 4
//             </p>
//           </div> */}
//         </div>

//         {/* Text Column */}
//         <div className="relative z-10 flex flex-col justify-center text-center lg:text-left">
//           {!showInitialText ? (
//             <div className="h-24 flex items-center justify-center">
//               <div className="animate-pulse text-gray-500">Loading model...</div>
//             </div>
//           ) : (
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={currentFeatureIndex}
//                 initial={{ opacity: 0, x: 50 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -50 }}
//                 transition={{ 
//                   duration: 0.6, 
//                   ease: [0.25, 0.46, 0.45, 0.94]
//                 }}
//               >
//                 {/* <div className="mb-4">
//                   <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
//                     Feature {currentFeatureIndex + 1} of {totalFeatures}
//                   </span>
//                 </div> */}
                
//                 <h1 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
//                   {processedFeatures[currentFeatureIndex]}
//                 </h1>
                
//                 {/* Progress dots */}
//                 <div className="flex justify-center lg:justify-start space-x-2 mt-6">
//                   {processedFeatures.map((_, index) => (
//                     <div
//                       key={index}
//                       className={`h-2 rounded-full transition-all duration-300 ${
//                         index === currentFeatureIndex
//                           ? "bg-blue-500 w-8"
//                           : "bg-gray-300 w-2"
//                       }`}
//                     />
//                   ))}
//                 </div>

//                 {/* Scroll hint */}
//                 {isScrollLocked && (
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     className="mt-8 text-sm text-gray-500"
//                   >
//                     {currentFeatureIndex < totalFeatures - 1 ? (
//                       <p>↓ Scroll to see next face</p>
//                     ) : (
//                       <p>↓ Scroll to continue</p>
//                     )}
//                   </motion.div>
//                 )}
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
  horizontal: number; // Y-axis rotation (around model)
  vertical: number;   // X-axis rotation (elevation)
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

  // Refs for scroll management
  const lastScrollY = useRef(0);
  const isInAnimation = useRef(false);
  const originalBodyOverflow = useRef<string>("");
  const scrollAccumulator = useRef(0);

  // Filter valid features
  const processedFeatures = React.useMemo(() => {
    return features
      .map((f) => f.replace(/^\*\s*/, "").trim())
      .filter((f) => f.length > 0);
  }, [features]);

  const totalFeatures = processedFeatures.length;
  
  // Define camera positions for different views (horizontal, vertical, label)
  // vertical: 75deg = eye level, 0deg = top view, 150deg = bottom view
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
  
  // Limit positions to number of features
  const availablePositions = cameraPositions.slice(0, Math.min(totalFeatures, cameraPositions.length));

  // Perform initial 360-degree showcase rotation
  const performInitialRotation = useCallback(() => {
    if (!modelViewerRef.current || hasInitialRotation) return;

    const modelViewer = modelViewerRef.current;
    const duration = 2000; // 2 seconds for full showcase
    const startTime = performance.now();

    setShowInitialText(true);

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-in-out for smooth showcase
      const easeProgress =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      // Complete 360° horizontal rotation with slight vertical tilt
      const horizontalRotation = 360 * easeProgress;
      const verticalTilt = 75 + Math.sin(progress * Math.PI * 2) * 10; // Gentle wave
      
      modelViewer.cameraOrbit = `${horizontalRotation}deg ${verticalTilt}deg 105%`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Set to first position
        const firstPos = availablePositions[0];
        modelViewer.cameraOrbit = `${firstPos.horizontal}deg ${firstPos.vertical}deg 105%`;
        setHasInitialRotation(true);
      }
    };

    requestAnimationFrame(animate);
  }, [hasInitialRotation, availablePositions]);

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

  // Rotate model to a specific camera position
  const rotateToPosition = useCallback((targetIndex: number) => {
    if (!modelViewerRef.current || !hasInitialRotation || isRotating) return;

    setIsRotating(true);
    const modelViewer = modelViewerRef.current;
    
    const currentPos = availablePositions[currentFeatureIndex];
    const targetPos = availablePositions[targetIndex];
    
    // Calculate rotation differences
    let horizontalDiff = targetPos.horizontal - currentPos.horizontal;
    // Always take shortest path for horizontal rotation
    if (horizontalDiff > 180) horizontalDiff -= 360;
    if (horizontalDiff < -180) horizontalDiff += 360;
    
    const verticalDiff = targetPos.vertical - currentPos.vertical;
    
    const duration = 900; // 900ms for smooth transition
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-in-out with slight overshoot for natural feel
      let easeProgress;
      if (progress < 0.5) {
        easeProgress = 4 * progress * progress * progress;
      } else {
        const p = -2 * progress + 2;
        easeProgress = 1 - p * p * p / 2;
      }

      const currentHorizontal = currentPos.horizontal + horizontalDiff * easeProgress;
      const currentVertical = currentPos.vertical + verticalDiff * easeProgress;
      
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
  }, [currentFeatureIndex, hasInitialRotation, isRotating, availablePositions]);

  // Handle scroll-wheel animation
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!containerRef.current || !isInAnimation.current || !hasInitialRotation || isRotating) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const delta = e.deltaY;
      scrollAccumulator.current += delta;

      // Threshold for triggering position change
      const scrollThreshold = 100;

      if (Math.abs(scrollAccumulator.current) >= scrollThreshold) {
        if (scrollAccumulator.current > 0) {
          // Scrolling down - next position/feature
          const nextIndex = currentFeatureIndex + 1;
          
          if (nextIndex < totalFeatures) {
            rotateToPosition(nextIndex);
            scrollAccumulator.current = 0;
          } else {
            // At the end, unlock and allow normal scrolling
            unlockScroll();
          }
        } else {
          // Scrolling up - previous position/feature
          const prevIndex = currentFeatureIndex - 1;
          
          if (prevIndex >= 0) {
            rotateToPosition(prevIndex);
            scrollAccumulator.current = 0;
          } else {
            // At the beginning, unlock and allow normal scrolling
            unlockScroll();
          }
        }
      }
    },
    [currentFeatureIndex, totalFeatures, rotateToPosition, unlockScroll, hasInitialRotation, isRotating]
  );

  // Detect viewport & lock scroll
  const handleScroll = useCallback(() => {
    if (!containerRef.current || isInAnimation.current || !hasInitialRotation) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const isEntering =
      containerRect.top <= viewportHeight * 0.4 &&
      containerRect.bottom >= viewportHeight * 0.6;

    if (isEntering) {
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > lastScrollY.current ? "down" : "up";
      
      lockScroll();

      if (direction === "down") {
        setCurrentFeatureIndex(0);
        if (modelViewerRef.current) {
          const firstPos = availablePositions[0];
          modelViewerRef.current.cameraOrbit = `${firstPos.horizontal}deg ${firstPos.vertical}deg 105%`;
        }
      } else {
        const lastIndex = totalFeatures - 1;
        setCurrentFeatureIndex(lastIndex);
        if (modelViewerRef.current) {
          const lastPos = availablePositions[lastIndex];
          modelViewerRef.current.cameraOrbit = `${lastPos.horizontal}deg ${lastPos.vertical}deg 105%`;
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

          {/* View indicator */}
          {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-semibold text-gray-800">
                {currentPosition.label}
              </p>
            </div>
          </div> */}

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
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                <span className="ml-2 text-gray-600 font-medium">Loading 3D Model</span>
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
                  ease: [0.25, 0.46, 0.45, 0.94]
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
                      {currentFeatureIndex < totalFeatures - 1 ? (
                        <>
                          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                          <span>Scroll to see {availablePositions[currentFeatureIndex + 1]?.label}</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
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