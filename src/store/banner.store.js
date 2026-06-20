import { create } from "zustand";

const useBannerStore = create((set) => ({
  heroBanners: [],
  middleBanners: [],
  loading: false,

  setHeroBanners: (banners) => set({ heroBanners: banners || [] }),
  setMiddleBanners: (banners) => set({ middleBanners: banners || [] }),
  setLoading: (loading) => set({ loading }),
}));

export default useBannerStore;
