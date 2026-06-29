// src/routes/analytics.routes.js
import api from "@/lib/axios";

export const getDashboardAnalytics = async () => {
  const res = await api.get("/analytics/dashboard");
  return res.data;
};