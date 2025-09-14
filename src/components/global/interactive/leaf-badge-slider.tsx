import React from "react";
import { Award, Users, Sparkles, Star } from "lucide-react";

const LeafBadgeStatsSlider = () => {
  const stats = [
    { value: "25M+", label: "Baby Wipes Sold", icon: Sparkles },
    { value: "25+", label: "Years of Experience", icon: Award },
    { value: "10M+", label: "Customers", icon: Users },
    { value: "30+", label: "Products", icon: Sparkles },
    { value: "10+", label: "Awards Won", icon: Star },
  ];

  const duplicatedStats = [...stats, ...stats];

  const leafImageUrl = "/Images/leaf-badge.png";

  return (
    <div className="w-full overflow-hidden bg-transparent">
      <div className="relative">
        {/* Scrolling container */}
        <div className="flex animate-scroll space-x-6">
          {duplicatedStats.map((stat, index) => (
            <div key={index} className="flex-shrink-0 w-72 md:w-96 relative">
              <div
                className="relative h-48 flex items-center justify-center text-center px-4 py-6"
                style={{
                  backgroundImage: `url(${leafImageUrl})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "contain",
                }}
              >
                <div className="flex flex-col items-center justify-center space-y-2 max-w-[80%] mt-8">
                  <div className="text-lg md:text-2xl font-bold text-black truncate">
                    {stat.value}
                  </div>
                  <div className="text-md md:text-xl text-black font-bold font-serif leading-snug line-clamp-2 truncate">
                    {stat.label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${stats.length * 288}px);
          }
        }

        .animate-scroll {
          display: flex;
          animation: scroll 25s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }

        @media (max-width: 640px) {
          .animate-scroll {
            animation: scroll 35s linear infinite;
          }
        }
      `}</style>
    </div>
  );
};

export default LeafBadgeStatsSlider;
