import useAuthStore from "@/store/auth.store";
import { loginUser, registerUser, logoutUser } from "@/routes/auth.routes";

export const useAuth = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);
  const storeLogout = useAuthStore((s) => s.logout);

  const login = async (payload) => {
    setLoading(true);
    try {
      const data = await loginUser(payload);
      if (data.token) localStorage.setItem("token", data.token);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const data = await registerUser(payload);
      if (data.token) localStorage.setItem("token", data.token);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try { await logoutUser(); } catch {}
    localStorage.removeItem("token");
    storeLogout();
  };

  return { login, register, logout };
};