import api from "@/lib/axios";

export const getHeroBanners = async () => {
  const res = await api.get("/banner/hero");
  return res.data;
};

export const getMiddleBanners = async () => {
  const res = await api.get("/banner/middle");
  return res.data;
};

export const createBanner = async (data) => {
  const res = await api.post("/banner", data);
  return res.data;
};

export const updateBanner = async (id, data) => {
  const res = await api.put(`/banner/${id}`, data);
  return res.data;
};

export const deleteBanner = async (id) => {
  const res = await api.delete(`/banner/${id}`);
  return res.data;
};
