import { create } from "zustand";

const useCartStore = create((set) => ({
  items: [],
  loading: false,

  setCart: (cart) => set({ items: cart?.items || [] }),
  setLoading: (loading) => set({ loading }),
  resetCart: () => set({ items: [] }),
}));

export default useCartStore;
