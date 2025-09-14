import { Search, X } from "lucide-react";
import { Button } from "../ui/button";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onClear: () => void;
  onEnter?: () => void;
  placeholder?: string;
  showDropdown?: boolean;
  isLoading?: boolean;
}

export const SearchInput = ({
  value,
  onChange,
  onFocus,
  onClear,
  onEnter,
  placeholder = "Search products, categories...",
  showDropdown = false,
  isLoading = false,
}: SearchInputProps) => {
  return (
    <div className="relative w-full h-10">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          placeholder={placeholder}
          className="w-full h-12 pl-10 pr-10 border border-gray-200 rounded-full bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter" && onEnter) {
              onEnter();
            }
          }}
        />
        {value && (
          <Button
            onClick={onClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-black rounded-full"></div>
        </div>
      )}
    </div>
  );
};
