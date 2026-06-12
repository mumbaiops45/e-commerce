import useAuthStore from "@/store/auth.store";
import {
  loginUser,
  registerUser,
} from "@/routes/auth.routes";

export const useAuth = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);

  // LOGIN
  const login = async (payload) => {
    try {
      setLoading(true);

      const data = await loginUser(payload);

      setUser(data.user);

      return data;
    } finally {
      setLoading(false);
    }
  };

  // REGISTER
  const register = async (payload) => {
    try {
      setLoading(true);

      const data = await registerUser(payload);

      setUser(data.user);

      return data;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    register,
  };
};