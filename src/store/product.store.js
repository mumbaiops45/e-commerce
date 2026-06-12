import { create } from "zustand";

const useProductStore = create((set) => ({
  products: [],
  loading: false,

  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ loading }),
  clearProducts: () => set({ products: [], loading: false }),
}));

export default useProductStore;
