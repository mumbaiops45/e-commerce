import api from "@/lib/axios";

export const getBanners = async () => {
  const res = await api.get("/banner");
  return res.data;
};

export const getBannerById = async (id) => {
  const res = await api.get(`/banner/${id}`);
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
