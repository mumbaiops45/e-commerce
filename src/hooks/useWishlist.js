import useWishlistStore from "@/store/wishlist.store";
import {
  getWishlist,
  addToWishlist as apiAdd,
  removeFromWishlist as apiRemove,
} from "@/routes/wishlist.routes";

export const useWishlist = () => {
  const setWishlist = useWishlistStore((s) => s.setWishlist);
  const setLoading = useWishlistStore((s) => s.setLoading);
  const resetWishlist = useWishlistStore((s) => s.resetWishlist);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const data = await getWishlist();
      setWishlist(data.wishlist);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    const data = await apiAdd(productId);
    await fetchWishlist();
    return data;
  };

  const removeFromWishlist = async (id) => {
    const data = await apiRemove(id);
    await fetchWishlist();
    return data;
  };

  return { fetchWishlist, addToWishlist, removeFromWishlist, resetWishlist };
};
