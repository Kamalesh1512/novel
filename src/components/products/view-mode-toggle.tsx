"use client";
import { Eye, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button"; // assuming you're using shadcn/ui

interface ViewModeToggleProps {
  viewMode: "image" | "3d";
  hasModelUrl: boolean;
  onViewModeChange: (mode: "image" | "3d") => void;
}

export const ViewModeToggle = ({
  viewMode,
  hasModelUrl,
  onViewModeChange,
}: ViewModeToggleProps) => {
  if (!hasModelUrl) return null;

  return (
    <div className="bg-white rounded-full p-1 shadow-lg inline-flex mb-4">
      <Button
        size="sm"
        variant={viewMode === "image" ? "default" : "ghost"}
        onClick={() => onViewModeChange("image")}
        className="rounded-full px-6"
      >
        <Eye className="w-4 h-4 mr-2" />
        Images
      </Button>
      <Button
        size="sm"
        variant={viewMode === "3d" ? "default" : "ghost"}
        onClick={() => onViewModeChange("3d")}
        className="rounded-full px-6"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        3D View
      </Button>
    </div>
  );
};
