import api from "@/lib/axios";

export const createPaymentOrder = async (orderId) => {
  const res = await api.post(`/payments/create-order/${orderId}`);
  return res.data;
};

export const verifyPayment = async (data) => {
  const res = await api.post("/payments/verify", data);
  return res.data;
};
