import api from "@/lib/axios";

export const getProductReviews = async (productId) => {
  const res = await api.get(`/reviews/${productId}`);
  return res.data;
};

export const createReview = async (productId, data) => {
  const res = await api.post(`/reviews/${productId}`, data);
  return res.data;
};

export const updateReview = async (reviewId, data) => {
  const res = await api.put(`/reviews/${reviewId}`, data);
  return res.data;
};
