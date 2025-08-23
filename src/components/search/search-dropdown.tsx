import { ArrowRight, Clock, Filter, Search, TrendingUp } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface Suggestion {
  text: string;
  count: number;
}

interface Category {
  id: string | number;
  name: string;
}

interface Product {
  id: string | number;
  name: string;
}

interface SearchResults {
  suggestions: Suggestion[];
  categories: Category[];
  products: Product[];
}

interface SearchDropdownProps {
  isOpen: boolean;
  searchResults: SearchResults;
  recentSearches: string[];
  trendingSearches: string[];
  searchTerm: string;
  onSelectSuggestion: (value: string) => void;
  onClearHistory: () => void;
}

// Search Dropdown Component
export const SearchDropdown = ({ 
  isOpen, 
  searchResults, 
  recentSearches, 
  trendingSearches, 
  onSelectSuggestion, 
  onClearHistory,
  searchTerm 
}:SearchDropdownProps) => {
  if (!isOpen) return null;

  const { suggestions, categories, products } = searchResults;
  const hasResults = suggestions.length > 0 || categories.length > 0;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-[100001] max-h-96 overflow-y-auto">
      {/* No search term - show recent and trending */}
      {!searchTerm.trim() && (
        <div className="p-4">
          {recentSearches.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Recent Searches
                </h3>
                <button
                  onClick={onClearHistory}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => onSelectSuggestion(search)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center"
                  >
                    <Clock className="h-3 w-3 mr-2 text-gray-400" />
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              Trending Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((search, index) => (
                <Button
                  key={index}
                  onClick={() => onSelectSuggestion(search)}
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {search}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search results */}
      {searchTerm.trim() && (
        <div className="p-4">
          {hasResults ? (
            <>
              {/* Categories */}
              {categories.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Categories</h3>
                  <div className="space-y-1">
                    {categories.slice(0, 3).map((category) => (
                      <Button
                        key={category.id}
                        onClick={() => onSelectSuggestion(category.name)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg flex items-center justify-between"
                        variant={'ghost'}
                      >
                        <span className="flex items-center">
                          <Filter className="h-3 w-3 mr-2 text-gray-400" />
                          {category.name}
                        </span>
                        <ArrowRight className="h-3 w-3 text-gray-400" />
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Suggestions</h3>
                  <div className="space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        onClick={() => onSelectSuggestion(suggestion.text)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg flex items-center justify-between"
                        variant={'ghost'}
                      >
                        <span className="flex items-center">
                          <Search className="h-3 w-3 mr-2 text-gray-400" />
                          {suggestion.text}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {suggestion.count}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* View All Results */}
              <div className="pt-2 border-t border-gray-100">
                <Button
                  onClick={() => onSelectSuggestion(searchTerm)}
                  className="w-full text-center py-2 text-sm text-amber-600 hover:text-amber-700 font-medium"
                  variant={'ghost'}
                >
                  View all results for "{searchTerm}"
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No results found for "{searchTerm}"</p>
              <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};