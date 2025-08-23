// 'use client'
// import { useInView } from "framer-motion";
// import { useEffect, useRef, useState } from "react";

// interface AnimatedCounterProps {
//   target: number;
//   suffix: string;
//   duration?: number;
// }

// // Animated counter component
// export const AnimatedCounter = ({
//   target,
//   suffix = "+",
//   duration = 2,
// }: AnimatedCounterProps) => {
//   const [count, setCount] = useState(0);
//   const ref = useRef(null);
//   const isInView = useInView(ref, { once: true });

//   useEffect(() => {
//     if (isInView) {
//       let start = 0;
//       const end = target;
//       const increment = end / (duration * 60);

//       const timer = setInterval(() => {
//         start += increment;
//         if (start >= end) {
//           setCount(end);
//           clearInterval(timer);
//         } else {
//           setCount(Math.floor(start));
//         }
//       }, 1000 / 60);

//       return () => clearInterval(timer);
//     }
//   }, [isInView, target, duration]);

//   return (
//     <span ref={ref} className="tabular-nums">
//       {count.toLocaleString()}
//       {suffix}
//     </span>
//   );
// };

'use client'
import { useEffect, useRef, useState, ReactNode } from "react";

interface AnimatedCounterProps {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number; // in seconds
}

// Final Animated Counter Component
export const AnimatedCounter = ({
  target,
  prefix = "",
  suffix = "+",
  duration = 2,
}: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const end = target;
    const fps = 60; // 60 frames per second
    const increment = end / (duration * fps);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / fps);

    return () => clearInterval(timer);
  }, [isVisible, target, duration]);

  return (
    <span ref={ref} className="tabular-nums inline-block">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};
