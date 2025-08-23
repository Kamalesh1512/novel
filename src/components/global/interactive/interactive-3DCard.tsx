'use client'
import { ReactNode, useRef, useState } from "react";

// Define props with proper typing
interface Interactive3DCardProps {
  children: ReactNode;
  className?: string;
}

const Interactive3DCard = ({ children, className = "" }: Interactive3DCardProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null); // Fix ref typing
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setMousePosition({
      x: (e.clientX - centerX) / 10,
      y: (e.clientY - centerY) / 10
    });
  };

  return (
    <div
      ref={cardRef}
      className={`transform-gpu transition-all duration-300 ${className}`}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${-mousePosition.y}deg) rotateY(${mousePosition.x}deg) translateZ(20px)`
          : 'none'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
    >
      {children}
    </div>
  );
};

export default Interactive3DCard;