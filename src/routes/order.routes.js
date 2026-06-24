import api from "@/lib/axios";

export const placeOrder = async (items, shippingAddress, couponCode,  paymentMethod) => {
  const body = { items, shippingAddress ,    paymentMethod, };
  if (couponCode) body.couponCode = couponCode;
  const res = await api.post("/orders", body);
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

export const updateOrder = async (orderId, data) => {
  const res = await api.put(`/orders/${orderId}`, data);
  return res.data;
};
