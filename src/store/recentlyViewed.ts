import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ProductType } from '@/lib/constants/types';

interface RecentlyViewedItem {
  product: ProductType;
  viewedAt: string; // ISO string for better serialization
}

interface RecentlyViewedStore {
  items: RecentlyViewedItem[];
  maxItems: number;
  
  // Actions
  addProduct: (product: ProductType) => void;
  removeProduct: (productId: string) => void;
  clearAll: () => void;
  getRecentlyViewed: () => RecentlyViewedItem[];
  isRecentlyViewed: (productId: string) => boolean;
  setMaxItems: (max: number) => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      items: [],
      maxItems: 10,

      addProduct: (product: ProductType) => {
        const currentItems = get().items;
        const maxItems = get().maxItems;
        
        // Remove if already exists to avoid duplicates
        const filteredItems = currentItems.filter(
          item => item.product.id !== product.id
        );
        
        // Add new item at the beginning
        const newItem: RecentlyViewedItem = {
          product,
          viewedAt: new Date().toISOString()
        };
        
        // Keep only maxItems number of items
        const updatedItems = [newItem, ...filteredItems].slice(0, maxItems);
        
        set({ items: updatedItems });
      },

      removeProduct: (productId: string) => {
        const currentItems = get().items;
        const updatedItems = currentItems.filter(
          item => item.product.id !== productId
        );
        set({ items: updatedItems });
      },

      clearAll: () => {
        set({ items: [] });
      },

      getRecentlyViewed: () => {
        return get().items;
      },

      isRecentlyViewed: (productId: string) => {
        const items = get().items;
        return items.some(item => item.product.id === productId);
      },

      setMaxItems: (max: number) => {
        const currentItems = get().items;
        set({ 
          maxItems: max,
          items: currentItems.slice(0, max)
        });
      }
    }),
    {
      name: 'recently-viewed-storage',
      storage: createJSONStorage(() => localStorage),
      
      // Partial persistence - only persist certain fields
      partialize: (state) => ({ 
        items: state.items,
        maxItems: state.maxItems 
      }),
      
      // Version for migration
      version: 1,
      
      // Migration function for version changes
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as Partial<RecentlyViewedStore>;
        if (version === 0) {
          // Migration logic from version 0 to 1
          return {
            items: state.items || [],
            maxItems: state.maxItems || 10
          };
        }
        return state;
      },
      
      // Skip hydration on SSR
      skipHydration: false,
    }
  )
);