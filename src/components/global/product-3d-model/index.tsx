"use client";
import React, { useEffect, useRef, useState } from "react";
import "@google/model-viewer";

interface Product3DModelProps {
  modelUrl: string;
  className?: string;
  autoRotate?: boolean;
  enableZoom?: boolean;
  enablePan?: boolean;
  isVisible?: boolean;
}

interface ModelViewerElement extends HTMLElement {
  cameraOrbit: string;
  autoRotate: boolean;
  src:string
  alt:string
}

export function Product3DModel({
  modelUrl,
  className = "",
  autoRotate = true,
  enableZoom = true,
  enablePan = true,
  isVisible = true,
}: Product3DModelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialSpinComplete, setInitialSpinComplete] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create the model-viewer element programmatically
    const modelViewer = document.createElement('model-viewer') as ModelViewerElement;
    modelViewer.src = modelUrl;
    modelViewer.alt = "3D Product Model";
    modelViewer.style.width = "100%";
    modelViewer.style.height = "100%";
    modelViewer.setAttribute('camera-controls', '');
    modelViewer.setAttribute('auto-rotate', autoRotate.toString());
    modelViewer.setAttribute('ar', '');
    modelViewer.setAttribute('loading', 'eager');
    modelViewer.setAttribute('reveal', 'auto');

    const handleLoad = () => {
      setIsLoading(false);
      setError(null);

      if (!initialSpinComplete) {
        performInitialSpin(modelViewer);
      }
    };

    const handleError = (event: any) => {
      setError("Failed to load 3D model");
      setIsLoading(false);
      console.error("Model loading error:", event);
    };

    modelViewer.addEventListener("load", handleLoad);
    modelViewer.addEventListener("error", handleError);

    // Clear container and append the model-viewer
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(modelViewer);

    return () => {
      modelViewer.removeEventListener("load", handleLoad);
      modelViewer.removeEventListener("error", handleError);
      if (containerRef.current && containerRef.current.contains(modelViewer)) {
        containerRef.current.removeChild(modelViewer);
      }
    };
  }, [modelUrl, autoRotate, initialSpinComplete]);

  const performInitialSpin = async (modelViewer: ModelViewerElement) => {
    if (!modelViewer) return;

    try {
      // Perform a smooth 360° rotation
      const duration = 3000; // 3 seconds
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Smooth easing function
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);

        // Set camera orbit (azimuth angle for horizontal rotation)
        const angle = easeOutCubic * 360; // Full 360 degrees
        modelViewer.cameraOrbit = `${angle}deg 75deg auto`;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Reset to default position and enable auto-rotate
          modelViewer.cameraOrbit = "0deg 75deg auto";
          setInitialSpinComplete(true);

          if (autoRotate) {
            modelViewer.autoRotate = true;
          }
        }
      };

      requestAnimationFrame(animate);
    } catch (err) {
      console.error("Initial spin error:", err);
      setInitialSpinComplete(true);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">Loading 3D Model...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-red-500 text-sm text-center">
            <div className="text-2xl mb-2">⚠️</div>
            <div>{error}</div>
            <div className="text-xs mt-1 text-gray-500">
              Check model format and URL
            </div>
          </div>
        </div>
      )}
    </div>
  );
}