// src/hooks/useAnalytics.js
import useAnalyticsStore from "@/store/analytics.store";
import { getDashboardAnalytics } from "@/routes/analytics.routes";

export const useAnalytics = () => {
  const setAnalytics = useAnalyticsStore((s) => s.setAnalytics);
  const setLoading = useAnalyticsStore((s) => s.setLoading);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const data = await getDashboardAnalytics();
      setAnalytics(data.data || null);
      return data.data;
    } finally {
      setLoading(false);
    }
  };

  return { fetchAnalytics };
};