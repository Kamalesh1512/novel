import { ProductType } from "@/lib/constants/types";
import { useRecentlyViewedStore } from "@/store/recentlyViewed";

// Utility hook for easier usage
export const useRecentlyViewed = () => {
  const store = useRecentlyViewedStore();
  
  // Format time difference
  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  };

  // Get items with formatted time
  const getItemsWithFormattedTime = () => {
    return store.items.map(item => ({
      ...item,
      timeAgo: formatTimeAgo(item.viewedAt)
    }));
  };

  return {
    ...store,
    getItemsWithFormattedTime,
    formatTimeAgo
  };
};

// Utility function to track product view (call this from your product detail page)
export const trackProductView = (product: ProductType) => {
  useRecentlyViewedStore.getState().addProduct(product);
};