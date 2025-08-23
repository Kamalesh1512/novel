'use client'
import { LucideIcon } from "lucide-react";
import Interactive3DCard from "./interactive-3DCard";

interface StatsCardProps {
  icon: LucideIcon;                // always a Lucide icon
  label: string;
  value: string | number;
  color?: "blue" | "green" | "purple" | "orange" |"amber";
}

const StatsCard = ({
  icon: Icon,
  label,
  value,
  color = "blue",
}: StatsCardProps) => {
  const colorClasses: Record<NonNullable<StatsCardProps["color"]>, string> = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
    amber:"from-amber-500 to-amber-600",
  };

  return (
    <Interactive3DCard className="p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center space-x-3">
        <div
          className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]} text-white shadow-lg`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-gray-600 font-medium">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </Interactive3DCard>
  );
};

export default StatsCard;
