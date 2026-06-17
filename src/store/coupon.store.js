import { create } from "zustand";

const useCouponStore = create((set) => ({
  coupons: [],
  loading: false,

  setCoupons: (coupons) => set({ coupons }),
  setLoading: (loading) => set({ loading }),
  clearCoupons: () => set({ coupons: [] }),
}));

export default useCouponStore;
