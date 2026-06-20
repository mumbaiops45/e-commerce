import useShippingStore from "@/store/shipping.store";
import {
  getShipping,
  createShipping as apiCreate,
  updateShipping as apiUpdate,
} from "@/routes/shipping.routes";

export const useShipping = () => {
  const setConfig = useShippingStore((s) => s.setConfig);
  const setLoading = useShippingStore((s) => s.setLoading);

  const fetchShipping = async () => {
    setLoading(true);
    try {
      const data = await getShipping();
      setConfig(data.shipping || null);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const createShipping = async (formData) => {
    const data = await apiCreate(formData);
    setConfig(data.shipping);
    return data;
  };

  const updateShipping = async (id, formData) => {
    const data = await apiUpdate(id, formData);
    setConfig(data.shipping);
    return data;
  };

  return { fetchShipping, createShipping, updateShipping };
};
