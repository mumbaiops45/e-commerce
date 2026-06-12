import useCategoryStore from "@/store/category.store";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/routes/category.routes";

export const useCategory = () => {
  const setCategories = useCategoryStore((s) => s.setCategories);
  const setLoading = useCategoryStore((s) => s.setLoading);

  const fetchCategories = async (params = {}) => {
    setLoading(true);
    try {
      const data = await getAllCategories(params);
      setCategories(data.categories || []);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (payload) => {
    const data = await createCategory(payload);
    return data;
  };

  const editCategory = async (id, payload) => {
    const data = await updateCategory(id, payload);
    return data;
  };

  const removeCategory = async (id) => {
    const data = await deleteCategory(id);
    return data;
  };

  return { fetchCategories, addCategory, editCategory, removeCategory };
};
