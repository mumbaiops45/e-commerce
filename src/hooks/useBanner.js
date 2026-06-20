import useBannerStore from "@/store/banner.store";
import {
  getHeroBanners,
  getMiddleBanners,
  createBanner as apiCreate,
  updateBanner as apiUpdate,
  deleteBanner as apiDelete,
} from "@/routes/banner.routes";

export const useBanner = () => {
  const setHeroBanners = useBannerStore((s) => s.setHeroBanners);
  const setMiddleBanners = useBannerStore((s) => s.setMiddleBanners);
  const setLoading = useBannerStore((s) => s.setLoading);

  const fetchHeroBanners = async () => {
    setLoading(true);
    try {
      const data = await getHeroBanners();
      setHeroBanners(data.banners);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const fetchMiddleBanners = async () => {
    setLoading(true);
    try {
      const data = await getMiddleBanners();
      setMiddleBanners(data.banners);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const fetchAllBanners = async () => {
    setLoading(true);
    try {
      const [hero, middle] = await Promise.all([getHeroBanners(), getMiddleBanners()]);
      setHeroBanners(hero.banners);
      setMiddleBanners(middle.banners);
    } finally {
      setLoading(false);
    }
  };

  const createBanner = async (formData) => {
    const data = await apiCreate(formData);
    await fetchAllBanners();
    return data;
  };

  const updateBanner = async (id, formData) => {
    const data = await apiUpdate(id, formData);
    await fetchAllBanners();
    return data;
  };

  const deleteBanner = async (id) => {
    const data = await apiDelete(id);
    await fetchAllBanners();
    return data;
  };

  return { fetchHeroBanners, fetchMiddleBanners, fetchAllBanners, createBanner, updateBanner, deleteBanner };
};
