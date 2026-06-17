import useOrderStore from "@/store/order.store";
import { getMyOrders, getAllOrdersAdmin, updateOrder } from "@/routes/order.routes";

export const useOrder = () => {
  const setOrders = useOrderStore((s) => s.setOrders);
  const setMeta = useOrderStore((s) => s.setMeta);
  const setLoading = useOrderStore((s) => s.setLoading);
  const clearOrders = useOrderStore((s) => s.clearOrders);

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const data = await getMyOrders();
      setOrders(data.orders || []);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOrders = async (params = {}) => {
    setLoading(true);
    try {
      const data = await getAllOrdersAdmin(params);
      setOrders(data.orders || []);
      setMeta(data.total || 0, data.totalPages || 1);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const editOrder = async (orderId, data) => {
    const result = await updateOrder(orderId, data);
    return result;
  };

  return { fetchMyOrders, fetchAllOrders, editOrder, clearOrders };
};
