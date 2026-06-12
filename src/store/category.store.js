import { create } from "zustand";

const useCategoryStore = create((set) => ({
  categories: [],
  loading: false,

  setCategories: (categories) => set({ categories }),
  setLoading: (loading) => set({ loading }),
  clearCategories: () => set({ categories: [], loading: false }),
}));

export default useCategoryStore;
