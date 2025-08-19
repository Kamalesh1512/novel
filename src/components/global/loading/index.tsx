import { useState, useEffect } from "react";

interface LoadingScreenProps {
  description: string;
}

export const LoadingScreen = ({ description }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState(".");

  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0; // Reset for demo
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === "...") return ".";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent overflow-hidden">
      {/* Main loading content */}
      <div className="text-center relative z-10">
        {/* Central orb with pulsing rings */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          {/* Outer pulsing rings */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 border-2 border-green-300 rounded-full opacity-20"
              style={{
                animation: `pulse-ring ${2 + i * 0.5}s ease-out infinite`,
                animationDelay: `${i * 0.3}s`
              }}
            />
          ))}
          
          {/* Central glowing orb */}
          <div className="absolute inset-4 bg-gradient-to-r from-green-400 via-green-500 to-green-900 rounded-full shadow-2xl">
            <div className="w-32 h-32 bg-gradient-to-tr from-white/20 to-transparent rounded-full animate-pulse" />
          </div>

          {/* Rotating energy particles */}
          {/* {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-green-300 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: '0 0',
                transform: `rotate(${i * 45}deg) translateX(60px)`,
                animation: `orbit ${3}s linear infinite`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))} */}
        </div>
      </div>

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.3; }
          100% { transform: scale(2); opacity: 0; }
        }
        
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(60px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(60px) rotate(-360deg); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { 
            transform: translateY(0px) rotate(12deg);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% { 
            transform: translateY(-25px) rotate(12deg);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
        
        @keyframes glow {
          from { box-shadow: 0 0 5px currentColor; }
          to { box-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;