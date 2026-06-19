import { create } from "zustand";

const useWishlistStore = create((set) => ({
  items: [],
  loading: false,

  setWishlist: (items) => set({ items: items || [] }),
  setLoading: (loading) => set({ loading }),
  resetWishlist: () => set({ items: [] }),
}));

export default useWishlistStore;
