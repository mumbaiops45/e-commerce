import api from "@/lib/axios";

export const getMyProfile = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

export const updateMyProfile = async (data) => {
  const res = await api.put("/users/me", data);
  return res.data;
};

export const changePassword = async (data) => {
  const res = await api.put("/users/me/password", data);
  return res.data;
};
