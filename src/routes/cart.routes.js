import api from "@/lib/axios";

export const getCart = async () => {
  const res = await api.get("/cart");
  return res.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const res = await api.post("/cart", { productId, quantity });
  return res.data;
};

export const updateCartItem = async (productId, quantity) => {
  const res = await api.put(`/cart/${productId}`, { quantity });
  return res.data;
};

export const removeCartItem = async (productId) => {
  const res = await api.delete(`/cart/${productId}`);
  return res.data;
};

export const clearCart = async () => {
  const res = await api.delete("/cart/clear");
  return res.data;
};
