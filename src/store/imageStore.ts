import { create } from "zustand";
import { shallow } from "zustand/shallow";

interface ImageProps {
  imagesByProduct: Record<string, string[]>;
  addImage: (productId: string, imageUrl: string) => void;
  removeImage: (productId: string, imageUrl: string) => void;
  clearImages: (productId: string) => void;
}

export const useImageStore = create<ImageProps>((set) => ({
  imagesByProduct: {},

  addImage: (productId, imageUrl) =>
    set((state) => {
      const current = state.imagesByProduct[productId] || [];
      if (current.includes(imageUrl)) return state;

      return {
        imagesByProduct: {
          ...state.imagesByProduct,
          [productId]: [...current, imageUrl],
        },
      };
    }),

  removeImage: (productId, imageUrl) =>
    set((state) => ({
      imagesByProduct: {
        ...state.imagesByProduct,
        [productId]: (state.imagesByProduct[productId] || []).filter(
          (img) => img !== imageUrl
        ),
      },
    })),

  clearImages: (productId) =>
    set((state) => {
      const { [productId]: _, ...rest } = state.imagesByProduct;
      return { imagesByProduct: rest };
    }),
}));

