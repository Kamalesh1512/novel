import { Category } from "@/lib/constants/types";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategory: string;
  availability: string;
  sortBy: string;
  onFilterChange: (
    filterType: "category" | "availability" | "sort",
    value: string
  ) => void;
  totalProducts: number;
}

export const FilterSidebar = ({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  availability,
  sortBy,
  onFilterChange,
  totalProducts,
}: FilterSidebarProps) => {
  if (!isOpen) return null;

  const options = [
    { value: "relevance", label: "Relevance" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
    { value: "newest", label: "Newest First" },
    { value: "rating", label: "Highest Rated" },
    { value: "bestseller", label: "Most Popular" },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-lg lg:relative lg:w-64 lg:shadow-none lg:border-l">
        <div className="p-6 h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Filters</h3>
            <Button onClick={onClose} className="lg:hidden">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Categories</h4>
            <div className="space-y-2">
              <Label className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value="All"
                  checked={selectedCategory === "All"}
                  onChange={(e) => onFilterChange("category", e.target.value)}
                  className="mr-2"
                />
                All ({totalProducts})
              </Label>
              {categories.map((category) => (
                <Label key={category.id} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value={category.id}
                    checked={selectedCategory === category.id}
                    onChange={(e) => onFilterChange("category", e.target.value)}
                    className="mr-2"
                  />
                  {category.name}
                </Label>
              ))}
            </div>
          </div>

          {/* Availability */}
          {/* <div className="mb-6">
            <h4 className="font-medium mb-3">Availability</h4>
            <div className="space-y-2">
              {[
                { value: "all", label: "All Products" },
                { value: "inStock", label: "In Stock" },
                { value: "outOfStock", label: "Out of Stock" },
                { value: "lowStock", label: "Low Stock" },
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="availability"
                    value={option.value}
                    checked={availability === option.value}
                    onChange={(e) =>
                      onFilterChange("availability", e.target.value)
                    }
                    className="mr-2"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div> */}

          {/* Sort By */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Sort By</h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {options.find((o) => o.value === sortBy)?.label ||
                    "Select option"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {options.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => onFilterChange("sort", option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};
