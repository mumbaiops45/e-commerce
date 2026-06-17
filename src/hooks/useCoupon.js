import useCouponStore from "@/store/coupon.store";
import { getAllCoupons, createCoupon, updateCoupon } from "@/routes/coupon.routes";

export const useCoupon = () => {
  const setCoupons = useCouponStore((s) => s.setCoupons);
  const setLoading = useCouponStore((s) => s.setLoading);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await getAllCoupons();
      setCoupons(data.coupons || []);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const addCoupon = async (payload) => {
    const data = await createCoupon(payload);
    return data;
  };

  const editCoupon = async (id, payload) => {
    const data = await updateCoupon(id, payload);
    return data;
  };

  return { fetchCoupons, addCoupon, editCoupon };
};
