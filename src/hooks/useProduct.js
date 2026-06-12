import useProductStore from "@/store/product.store";
import {
  getAllProducts,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/routes/product.routes";

export const useProduct = () => {
  const setProducts = useProductStore((s) => s.setProducts);
  const setLoading = useProductStore((s) => s.setLoading);

  const fetchProducts = async (params = {}) => {
    setLoading(true);
    try {
      const data = await getAllProducts(params);
      setProducts(data.products || []);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByCategory = async (categoryId, params = {}) => {
    setLoading(true);
    try {
      const data = await getProductsByCategory(categoryId, params);
      setProducts(data.products || []);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (payload) => {
    const data = await createProduct(payload);
    return data;
  };

  const editProduct = async (id, payload) => {
    const data = await updateProduct(id, payload);
    return data;
  };

  const removeProduct = async (id) => {
    const data = await deleteProduct(id);
    return data;
  };

  return { fetchProducts, fetchProductsByCategory, addProduct, editProduct, removeProduct };
};
