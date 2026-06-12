import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,

      setUser: (user) => set({ user, isAuthenticated: true }),
      setLoading: (value) => set({ loading: value }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "hgs-auth",
      storage: createJSONStorage(() => localStorage),
      // only persist display state, not transient loading flag
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;