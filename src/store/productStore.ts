// stores/useProductStore.ts
import { ProductType } from "@/lib/constants/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProductStore {
  products: ProductType[];
  setProducts: (products: ProductType[]) => void;
  updateProduct: (id: string, data: Partial<ProductType>) => void;
  removeProduct: (id: string) => void;
  clear: () => void;
  getAllProducts: () => ProductType[];
  getProductsByCategory: (categoryName: string) => ProductType[];
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],

      setProducts: (products) => set({ products }),

      updateProduct: (id, data) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),

      removeProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      clear: () => set({ products: [] }),

      getAllProducts: () => get().products,
      getProductsByCategory: (categoryName) =>
        get().products.filter((p) => p.category?.name === categoryName),
    }),

    {
      name: "product-store",
    }
  )
);
