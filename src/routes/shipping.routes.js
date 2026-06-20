import api from "@/lib/axios";

export const getShipping = async () => {
  const res = await api.get("/shipping");
  return res.data;
};

export const createShipping = async (data) => {
  const res = await api.post("/shipping", data);
  return res.data;
};

export const updateShipping = async (id, data) => {
  const res = await api.put(`/shipping/${id}`, data);
  return res.data;
};
