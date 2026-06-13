import api from "@/lib/axios";

export const placeOrder = async (items, shippingAddress) => {
  const res = await api.post("/orders", { items, shippingAddress });
  return res.data;
};

export const getMyOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

export const getAllOrdersAdmin = async (params = {}) => {
  const res = await api.get("/orders/all", { params });
  return res.data;
};
