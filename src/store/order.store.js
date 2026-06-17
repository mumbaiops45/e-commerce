import { create } from "zustand";

const useOrderStore = create((set) => ({
  orders: [],
  total: 0,
  totalPages: 1,
  loading: false,

  setOrders: (orders) => set({ orders }),
  setMeta: (total, totalPages) => set({ total, totalPages }),
  setLoading: (loading) => set({ loading }),
  clearOrders: () => set({ orders: [], total: 0, totalPages: 1 }),
}));

export default useOrderStore;
