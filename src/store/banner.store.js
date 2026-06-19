import { create } from "zustand";

const useBannerStore = create((set) => ({
  banners: [],
  loading: false,

  setBanners: (banners) => set({ banners: banners || [] }),
  setLoading: (loading) => set({ loading }),
  resetBanners: () => set({ banners: [] }),
}));

export default useBannerStore;
