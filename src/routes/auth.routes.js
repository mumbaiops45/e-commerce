import api from "@/lib/axios";

// REGISTER
export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

// LOGIN
export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

// LOGOUT
export const logoutUser = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

// PROFILE (optional later)
export const getProfile = async () => {
  const res = await api.get("/users/profile");
  return res.data;
};