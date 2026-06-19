import useBannerStore from "@/store/banner.store";
import {
  getBanners,
  createBanner as apiCreate,
  updateBanner as apiUpdate,
  deleteBanner as apiDelete,
} from "@/routes/banner.routes";

export const useBanner = () => {
  const setBanners = useBannerStore((s) => s.setBanners);
  const setLoading = useBannerStore((s) => s.setLoading);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const data = await getBanners();
      setBanners(data.banners);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const createBanner = async (formData) => {
    const data = await apiCreate(formData);
    await fetchBanners();
    return data;
  };

  const updateBanner = async (id, formData) => {
    const data = await apiUpdate(id, formData);
    await fetchBanners();
    return data;
  };

  const deleteBanner = async (id) => {
    const data = await apiDelete(id);
    await fetchBanners();
    return data;
  };

  return { fetchBanners, createBanner, updateBanner, deleteBanner };
};
