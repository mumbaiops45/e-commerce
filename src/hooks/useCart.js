import useCartStore from "@/store/cart.store";
import {
  getCart,
  addToCart as apiAdd,
  updateCartItem as apiUpdate,
  removeCartItem as apiRemove,
  clearCart as apiClear,
} from "@/routes/cart.routes";

export const useCart = () => {
  const setCart = useCartStore((s) => s.setCart);
  const setLoading = useCartStore((s) => s.setLoading);
  const resetCart = useCartStore((s) => s.resetCart);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await getCart();
      setCart(data.cart);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    const data = await apiAdd(productId, quantity);
    setCart(data.cart);
    return data;
  };

  const updateItem = async (productId, quantity) => {
    const data = await apiUpdate(productId, quantity);
    setCart(data.cart);
    return data;
  };

  const removeItem = async (productId) => {
    const data = await apiRemove(productId);
    setCart(data.cart);
    return data;
  };

  const emptyCart = async () => {
    await apiClear();
    resetCart();
  };

  return { fetchCart, addToCart, updateItem, removeItem, emptyCart };
};
