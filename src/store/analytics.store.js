// src/store/analytics.store.js
import { create } from "zustand";

const useAnalyticsStore = create((set) => ({
  analytics: null,
  loading: false,

  setAnalytics: (analytics) => set({ analytics }),
  setLoading: (loading) => set({ loading }),
  clearAnalytics: () => set({ analytics: null, loading: false }),
}));

export default useAnalyticsStore;