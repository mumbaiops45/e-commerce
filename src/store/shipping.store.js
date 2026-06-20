import { create } from "zustand";

const useShippingStore = create((set) => ({
  config: null,
  loading: false,

  setConfig: (config) => set({ config }),
  setLoading: (loading) => set({ loading }),
}));

export default useShippingStore;
