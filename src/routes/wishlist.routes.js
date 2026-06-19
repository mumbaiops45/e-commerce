import api from "@/lib/axios";

export const getWishlist = async () => {
  const res = await api.get("/wishlist");
  return res.data;
};

export const addToWishlist = async (productId) => {
  const res = await api.post("/wishlist", { productId });
  return res.data;
};

export const removeFromWishlist = async (id) => {
  const res = await api.delete(`/wishlist/${id}`);
  return res.data;
};
