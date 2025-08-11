"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { preview3DModel } from "@/lib/scripts/preview3d-models";
import { motion, AnimatePresence } from "framer-motion";
import { productsTypes } from "@/lib/constants/types";
import Link from "next/link";
import Image from "next/image";

interface Product3DModelProps {
  modelUrl: string;
  className?: string;
  autoRotate?: boolean;
  enableZoom?: boolean;
  enablePan?: boolean;
}

export function Product3DModel({
  modelUrl,
  className = "",
  autoRotate = false,
  enableZoom = true,
  enablePan = false,
}: Product3DModelProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinProgress, setSpinProgress] = useState(0);

  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    const containerWidth = mount.clientWidth;
    camera.position.set(0, 0, containerWidth < 400 ? 4 : 8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    while (mount.firstChild) mount.removeChild(mount.firstChild);
    mount.appendChild(renderer.domElement);

    // Orbit Controls Implementation
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationSpeed = 0.005;
    let currentRotation = { x: 0, y: 0 };
    let targetRotation = { x: 0, y: 0 };

    // Mouse event handlers
    const handleMouseDown = (event: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
      renderer.domElement.style.cursor = "grabbing";
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;

      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y,
      };

      targetRotation.y += deltaMove.x * rotationSpeed;
      targetRotation.x += deltaMove.y * rotationSpeed;

      targetRotation.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, targetRotation.x)
      );

      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
      renderer.domElement.style.cursor = "grab";
    };

    // Touch event handlers for mobile
    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        isDragging = true;
        previousMousePosition = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        };
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!isDragging || event.touches.length !== 1) return;

      event.preventDefault();

      const deltaMove = {
        x: event.touches[0].clientX - previousMousePosition.x,
        y: event.touches[0].clientY - previousMousePosition.y,
      };

      targetRotation.y += deltaMove.x * rotationSpeed;
      targetRotation.x += deltaMove.y * rotationSpeed;

      targetRotation.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, targetRotation.x)
      );

      previousMousePosition = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    // Wheel event for zoom
    const handleWheel = (event: WheelEvent) => {
      if (!enableZoom) return;

      event.preventDefault();
      const zoomSpeed = 0.1;
      const minDistance = 2;
      const maxDistance = 20;

      camera.position.z += event.deltaY * zoomSpeed * 0.01;
      camera.position.z = Math.max(
        minDistance,
        Math.min(maxDistance, camera.position.z)
      );
    };

    // Add event listeners
    renderer.domElement.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    renderer.domElement.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    renderer.domElement.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    renderer.domElement.addEventListener("touchend", handleTouchEnd);

    if (enableZoom) {
      renderer.domElement.addEventListener("wheel", handleWheel, {
        passive: false,
      });
    }

    // Ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Main directional light (soft shadow)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(5, 10, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 50;
    scene.add(keyLight);

    // Soft fill light from the opposite side
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
    fillLight.position.set(-5, 5, 5);
    scene.add(fillLight);

    // Back light for rim highlights
    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(0, 5, -10);
    scene.add(backLight);

    // Hemisphere for global illumination
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x888888, 0.6);
    scene.add(hemiLight);

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    let mixer: THREE.AnimationMixer | undefined;
    const clock = new THREE.Clock();
    let animationId: number;

    let spinStartTime: number | null = null;
    let hasSpun = false;
    const spinDuration = 1000;

    preview3DModel({
      url: modelUrl,
      scene,
      renderer,
      modelGroup,
      onLoaded: () => {
        const box = new THREE.Box3().setFromObject(modelGroup);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        modelGroup.position.sub(center);
        const maxDimension = Math.max(size.x, size.y, size.z);
        const targetSize = containerWidth < 400 ? 3 : 4;
        modelGroup.scale.setScalar(targetSize / maxDimension);

        modelGroup.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Keep original materials and colors - don't modify anything
            // Just enable shadows for better visual quality
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        setIsLoading(false);
        spinStartTime = performance.now();
        setIsSpinning(true);
      },
      rotation: [0, 0, 0],
    }).then((res) => {
      mixer = res.mixer;
    });

    const animate = (now: number) => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      mixer?.update(delta);

      // Smooth rotation interpolation
      const lerpFactor = 0.1;
      currentRotation.x += (targetRotation.x - currentRotation.x) * lerpFactor;
      currentRotation.y += (targetRotation.y - currentRotation.y) * lerpFactor;

      if (spinStartTime && !hasSpun) {
        const spinElapsed = now - spinStartTime;
        const progress = Math.min(spinElapsed / spinDuration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        modelGroup.rotation.y = easedProgress * Math.PI * 2;
        setSpinProgress(progress);

        if (progress >= 1) {
          hasSpun = true;
          setIsSpinning(false);
          setSpinProgress(1);
          modelGroup.rotation.y = 0;
          targetRotation.y = 0;
          currentRotation.y = 0;
        }
      } else if (hasSpun && !isDragging) {
        modelGroup.rotation.x = currentRotation.x;
        modelGroup.rotation.y = currentRotation.y;

        if (!isDragging) {
          const floatOffset = Math.sin(elapsed * 0.7) * 0.05;
          modelGroup.position.y = floatOffset;

          const idleRotationX = Math.sin(elapsed * 0.3) * 0.02;
          const idleRotationZ = Math.sin(elapsed * 0.2) * 0.015;
          modelGroup.rotation.x += idleRotationX;
          modelGroup.rotation.z = idleRotationZ;
        }
      } else if (hasSpun && isDragging) {
        modelGroup.rotation.x = currentRotation.x;
        modelGroup.rotation.y = currentRotation.y;
        modelGroup.position.y = 0;
        modelGroup.rotation.z = 0;
      }

      renderer.render(scene, camera);
    };
    animate(1);

    const handleResize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      const newContainerWidth = mount.clientWidth;
      camera.position.z = newContainerWidth < 400 ? 4 : 8;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);

      // Remove event listeners
      renderer.domElement.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      renderer.domElement.removeEventListener("touchstart", handleTouchStart);
      renderer.domElement.removeEventListener("touchmove", handleTouchMove);
      renderer.domElement.removeEventListener("touchend", handleTouchEnd);

      if (enableZoom) {
        renderer.domElement.removeEventListener("wheel", handleWheel);
      }

      modelGroup.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.computeVertexNormals();
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];
          materials.forEach((mat) => mat.dispose());
        }
      });

      if (mount.contains(renderer.domElement))
        mount.removeChild(renderer.domElement);
      renderer.dispose();
      modelGroup.clear();
    };
  }, [modelUrl, enableZoom, enablePan]);
  return (
    <div className={`relative ${className}`}>
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{
          opacity: isLoading ? 0.3 : 1,
          transition: "opacity 0.5s ease-in-out",
        }}
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 rounded-lg">
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
            <span className="text-sm text-gray-600">Loading 3D Model...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-red-500 text-sm font-medium mb-2">
              ⚠️ Error
            </div>
            <div className="text-gray-600 text-xs">{error}</div>
          </div>
        </div>
      )}

      {!isLoading && !error && (
        <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
          Drag to rotate {enableZoom && "• Scroll to zoom"}
        </div>
      )}
    </div>
  );
}
