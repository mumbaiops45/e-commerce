"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuthStore from "@/store/auth.store";
import { logoutUser } from "@/routes/auth.routes";
import useCategoryStore from "@/store/category.store";
import useProductStore from "@/store/product.store";
import { useCategory } from "@/hooks/useCategory";
import { useProduct } from "@/hooks/useProduct";
import {
  FaUser, FaBoxOpen, FaShoppingCart, FaHeart, FaCog, FaBars, FaTimes,
  FaPlus, FaEdit, FaTrash, FaEye, FaChevronDown, FaSignOutAlt,
  FaTag, FaCheck, FaImage, FaTruck, FaExclamationTriangle, FaList,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

const isAdminRole = (role) => role === "admin" || role === "superadmin";

// ─── Sidebar ──────────────────────────────────────────────────
function Sidebar({ user, activeTab, onTabChange, onLogout, mobileOpen, onMobileClose }) {
  const [prodOpen, setProdOpen] = useState(
    activeTab === "manage-products" || activeTab === "create-product"
  );
  const [catOpen, setCatOpen] = useState(
    activeTab === "manage-categories" || activeTab === "create-category"
  );
  const isAdmin = isAdminRole(user?.role);

  const NavItem = ({ id, icon, label, indent = false }) => (
    <button
      onClick={() => { onTabChange(id); onMobileClose(); }}
      className={`w-full flex items-center gap-3 rounded-lg text-sm transition-all ${
        indent ? "pl-10 pr-4 py-2" : "px-4 py-2.5"
      } ${
        activeTab === id
          ? "bg-(--accent) text-white font-semibold"
          : "text-gray-600 hover:bg-(--surface-warm) hover:text-(--accent)"
      }`}
    >
      {icon}
      {label}
    </button>
  );

  const GroupToggle = ({ open, onToggle, icon, label }) => (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-(--surface-warm) hover:text-(--accent) rounded-lg transition-all"
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      <FaChevronDown className={`text-[10px] transition-transform ${open ? "rotate-180" : ""}`} />
    </button>
  );

  const content = (
    <>
      {/* User info */}
      <div className="bg-(--accent) px-4 py-6 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-white/20 text-white text-2xl font-bold flex items-center justify-center mb-3 border-2 border-white/40">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <p className="text-white font-bold text-sm leading-tight line-clamp-1 px-2">{user?.name}</p>
        <p className="text-white/65 text-xs mt-0.5 truncate max-w-full px-2">{user?.email}</p>
        <span className="mt-2 px-3 py-0.5 bg-white/20 text-white text-[11px] font-bold rounded-full capitalize border border-white/20">
          {user?.role || "user"}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <NavItem id="profile" icon={<FaUser className="text-xs shrink-0" />} label="Profile" />

        {isAdmin && (
          <>
            <div className="pt-3 pb-1 px-1">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Management</p>
            </div>

            <GroupToggle
              open={prodOpen}
              onToggle={() => setProdOpen((p) => !p)}
              icon={<FaBoxOpen className="text-xs shrink-0" />}
              label="Products"
            />
            {prodOpen && (
              <div className="space-y-0.5">
                <NavItem id="manage-products" indent icon={<FaList className="text-xs shrink-0" />} label="Manage Products" />
                <NavItem id="create-product" indent icon={<FaPlus className="text-xs shrink-0" />} label="Create Product" />
              </div>
            )}

            <GroupToggle
              open={catOpen}
              onToggle={() => setCatOpen((p) => !p)}
              icon={<FaTag className="text-xs shrink-0" />}
              label="Categories"
            />
            {catOpen && (
              <div className="space-y-0.5">
                <NavItem id="manage-categories" indent icon={<FaList className="text-xs shrink-0" />} label="Manage Categories" />
                <NavItem id="create-category" indent icon={<FaPlus className="text-xs shrink-0" />} label="Create Category" />
              </div>
            )}

            <NavItem id="orders" icon={<FaTruck className="text-xs shrink-0" />} label="Orders" />
          </>
        )}

        {!isAdmin && (
          <>
            <NavItem id="orders" icon={<FaBoxOpen className="text-xs shrink-0" />} label="My Orders" />
            <NavItem id="cart" icon={<FaShoppingCart className="text-xs shrink-0" />} label="Cart" />
            <NavItem id="wishlist" icon={<FaHeart className="text-xs shrink-0" />} label="Wishlist" />
          </>
        )}

        <div className="pt-3 pb-1 px-1">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Account</p>
        </div>
        <NavItem id="settings" icon={<FaCog className="text-xs shrink-0" />} label="Settings" />

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-all mt-1"
        >
          <FaSignOutAlt className="text-xs shrink-0" /> Logout
        </button>
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 bg-white border-r border-(--border-light) flex-col min-h-screen sticky top-0 self-start">
        {content}
      </aside>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onMobileClose}
          />
          <aside className="fixed top-0 left-0 h-full w-64 bg-white z-50 flex flex-col md:hidden overflow-hidden">
            <button
              onClick={onMobileClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 z-10"
            >
              <FaTimes className="text-xs" />
            </button>
            {content}
          </aside>
        </>
      )}
    </>
  );
}

// ─── Modal shell ──────────────────────────────────────────────
function Modal({ title, onClose, children, wide = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${wide ? "max-w-2xl" : "max-w-md"} max-h-[90vh] overflow-y-auto z-10`}>
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-(--border-light) bg-white z-10">
          <h3 className="font-bold text-(--accent) text-lg">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FaTimes />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Category form ────────────────────────────────────────────
function CategoryForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    description: initial?.description || "",
    image: initial?.image || "",
    isActive: initial?.isActive !== false,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSave(form);
    } catch (err) {
      setError(
        err?.response?.data?.errors?.[0]?.message ||
        err?.response?.data?.message ||
        "Save failed. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{error}</div>}

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Name *</label>
        <input
          type="text" required minLength={2} value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Bath Toiletries"
          className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Brief description of this category..."
          rows={3}
          className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all resize-none"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Image URL</label>
        <input
          type="url" value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          placeholder="https://..."
          className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all"
        />
        {form.image && (
          <img src={form.image} alt="preview" className="mt-2 h-20 rounded-lg object-cover border border-(--border-light)" />
        )}
      </div>
      {initial && (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox" checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="accent-(--secondary) w-4 h-4"
          />
          <span className="text-sm text-gray-600">Active (visible to customers)</span>
        </label>
      )}
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onClose}
          className="flex-1 py-2.5 border border-(--border-light) text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={saving}
          className="flex-1 py-2.5 bg-(--accent) text-white text-sm font-semibold rounded-lg hover:bg-(--secondary) transition-colors disabled:opacity-60">
          {saving ? "Saving..." : initial ? "Save Changes" : "Create Category"}
        </button>
      </div>
    </form>
  );
}

// ─── Product form ─────────────────────────────────────────────
function ProductForm({ initial, categories, onSave, onClose }) {
  const [form, setForm] = useState({
    title: initial?.title || "",
    description: initial?.description || "",
    price: initial?.price ?? "",
    brand: initial?.brand || "",
    category: initial?.category?._id || initial?.category || "",
    stock: initial?.stock ?? "",
    isFeatured: initial?.isFeatured || false,
    isActive: initial?.isActive !== false,
    images: initial?.images?.length ? initial.images : [{ url: "", alt: "" }],
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const setImg = (idx, field, val) => {
    const imgs = [...form.images];
    imgs[idx] = { ...imgs[idx], [field]: val };
    setForm({ ...form, images: imgs });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSave({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.images.filter((i) => i.url),
      });
    } catch (err) {
      setError(
        err?.response?.data?.errors?.[0]?.message ||
        err?.response?.data?.message ||
        "Save failed. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Title *</label>
          <input type="text" required value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Biotique Premium Bath Kit"
            className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description *</label>
          <textarea required value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3} placeholder="Detailed product description..."
            className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all resize-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Price (₹) *</label>
          <input type="number" required min="0" step="0.01" value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="0.00"
            className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Brand *</label>
          <input type="text" required value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            placeholder="e.g. Biotique"
            className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category *</label>
          <select required value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all bg-white"
          >
            <option value="">Select category</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Stock *</label>
          <input type="number" required min="0" value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            placeholder="0"
            className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all"
          />
        </div>
      </div>

      {/* Images */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-gray-600">Images</label>
          <button type="button"
            onClick={() => setForm({ ...form, images: [...form.images, { url: "", alt: "" }] })}
            className="text-xs text-(--secondary) font-semibold hover:text-(--accent) flex items-center gap-1">
            <FaPlus className="text-[10px]" /> Add Image
          </button>
        </div>
        <div className="space-y-2">
          {form.images.map((img, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input type="url" value={img.url}
                onChange={(e) => setImg(idx, "url", e.target.value)}
                placeholder="Image URL (https://...)"
                className="flex-1 border border-(--border-light) rounded-lg px-3 py-2 text-sm outline-none focus:border-(--secondary) transition-all"
              />
              <input type="text" value={img.alt}
                onChange={(e) => setImg(idx, "alt", e.target.value)}
                placeholder="Alt text"
                className="w-28 border border-(--border-light) rounded-lg px-3 py-2 text-sm outline-none focus:border-(--secondary) transition-all"
              />
              {form.images.length > 1 && (
                <button type="button"
                  onClick={() => setForm({ ...form, images: form.images.filter((_, i) => i !== idx) })}
                  className="text-red-400 hover:text-red-600 shrink-0">
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-5">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" checked={form.isFeatured}
            onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
            className="accent-(--secondary) w-4 h-4" />
          <span className="text-sm text-gray-600">Featured Product</span>
        </label>
        {initial && (
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="accent-(--secondary) w-4 h-4" />
            <span className="text-sm text-gray-600">Active</span>
          </label>
        )}
      </div>

      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onClose}
          className="flex-1 py-2.5 border border-(--border-light) text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={saving}
          className="flex-1 py-2.5 bg-(--accent) text-white text-sm font-semibold rounded-lg hover:bg-(--secondary) transition-colors disabled:opacity-60">
          {saving ? "Saving..." : initial ? "Save Changes" : "Create Product"}
        </button>
      </div>
    </form>
  );
}

// ─── Delete confirm ───────────────────────────────────────────
function DeleteConfirm({ type, name, onClose, onConfirm, loading }) {
  return (
    <Modal title={`Delete ${type}?`} onClose={onClose}>
      <div className="flex items-start gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 shrink-0 mt-0.5">
          <FaExclamationTriangle />
        </div>
        <p className="text-sm text-gray-600">
          Are you sure you want to delete <strong>"{name}"</strong>?
          This action cannot be undone.
        </p>
      </div>
      <div className="flex gap-3">
        <button onClick={onClose}
          className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50">
          Cancel
        </button>
        <button onClick={onConfirm} disabled={loading}
          className="flex-1 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 disabled:opacity-60">
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  );
}

// ─── Toast ────────────────────────────────────────────────────
function Toast({ message }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-600 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-lg animate-fade-in">
      <FaCheck className="text-xs" /> {message}
    </div>
  );
}

// ─── Section header (sticky) ──────────────────────────────────
function SectionHeader({ title, count, buttonLabel, onAction }) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-(--border-light) px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-(--accent)">{title}</h2>
        {count !== undefined && (
          <p className="text-xs text-gray-500 mt-0.5">{count} {count === 1 ? "item" : "items"} total</p>
        )}
      </div>
      {buttonLabel && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 px-4 py-2.5 bg-(--accent) text-white text-sm font-semibold rounded-lg hover:bg-(--secondary) transition-colors shadow-sm"
        >
          <FaPlus className="text-xs" /> {buttonLabel}
        </button>
      )}
    </div>
  );
}

// ─── Manage Categories ────────────────────────────────────────
function ManageCategories() {
  const rows = useCategoryStore((s) => s.categories);
  const { fetchCategories, addCategory, editCategory, removeCategory } = useCategory();
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [sel, setSel] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const closeModal = () => { setModal(null); setSel(null); };

  const load = useCallback(async () => {
    await fetchCategories({ limit: 100 });
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (form) => {
    if (sel) { await editCategory(sel._id, form); showToast("Category updated"); }
    else { await addCategory(form); showToast("Category created"); }
    closeModal();
    fetchCategories({ limit: 100 });
  };

  const handleDelete = async () => {
    setDeleting(true);
    try { await removeCategory(sel._id); showToast("Category deleted"); closeModal(); fetchCategories({ limit: 100 }); }
    finally { setDeleting(false); }
  };

  return (
    <div>
      <SectionHeader title="All Categories" count={rows.length} buttonLabel="Add Category"
        onAction={() => { setSel(null); setModal("edit"); }} />

      <div className="px-6 py-4">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
            <FaTag className="text-4xl mb-3" />
            <p className="font-semibold">No categories yet</p>
            <p className="text-sm mt-1">Create your first category to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b border-(--border-light)">
                  {["Image", "Name", "Description", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 px-3 first:pl-0 last:pr-0">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)]">
                {rows.map((cat) => (
                  <tr key={cat._id} className="hover:bg-(--surface-warm) transition-colors">
                    <td className="py-3.5 px-3 pl-0">
                      <div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        {cat.image
                          ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-gray-400"><FaImage /></div>
                        }
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-sm font-semibold text-(--accent)">{cat.name}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-sm text-gray-500 line-clamp-1 max-w-[200px] block">
                        {cat.description || "—"}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        cat.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                      }`}>
                        {cat.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 pr-0">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => { setSel(cat); setModal("view"); }}
                          className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 flex items-center justify-center transition-colors" title="View">
                          <FaEye className="text-xs" />
                        </button>
                        <button onClick={() => { setSel(cat); setModal("edit"); }}
                          className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 hover:bg-amber-100 flex items-center justify-center transition-colors" title="Edit">
                          <FaEdit className="text-xs" />
                        </button>
                        <button onClick={() => { setSel(cat); setModal("delete"); }}
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors" title="Delete">
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal === "edit" && (
        <Modal title={sel ? "Edit Category" : "Create Category"} onClose={closeModal}>
          <CategoryForm initial={sel} onSave={handleSave} onClose={closeModal} />
        </Modal>
      )}
      {modal === "view" && sel && (
        <Modal title="Category Details" onClose={closeModal}>
          {sel.image && <img src={sel.image} alt={sel.name} className="w-full h-40 object-cover rounded-xl mb-4" />}
          {!sel.image && <div className="w-full h-24 bg-(--surface-warm) rounded-xl mb-4 flex items-center justify-center text-gray-400"><FaImage className="text-4xl" /></div>}
          <div className="space-y-3 mb-5">
            {[["Name", sel.name], ["Description", sel.description || "—"], ["Status", sel.isActive ? "Active" : "Inactive"],
              ["Created", new Date(sel.createdAt).toLocaleDateString()]].map(([l, v]) => (
              <div key={l} className="flex gap-3">
                <span className="text-xs font-semibold text-gray-400 w-24 shrink-0 pt-0.5">{l}</span>
                <span className="text-sm text-(--accent) font-medium flex-1">{v}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={closeModal} className="flex-1 py-2.5 border border-(--border-light) text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50">Close</button>
            <button onClick={() => setModal("edit")} className="flex-1 py-2.5 bg-(--accent) text-white text-sm font-semibold rounded-lg hover:bg-(--secondary)">Edit</button>
          </div>
        </Modal>
      )}
      {modal === "delete" && sel && (
        <DeleteConfirm type="Category" name={sel.name} loading={deleting} onClose={closeModal} onConfirm={handleDelete} />
      )}
      {toast && <Toast message={toast} />}
    </div>
  );
}

// ─── Manage Products ──────────────────────────────────────────
function ManageProducts() {
  const rows = useProductStore((s) => s.products);
  const cats = useCategoryStore((s) => s.categories);
  const { fetchProducts, addProduct, editProduct, removeProduct } = useProduct();
  const { fetchCategories } = useCategory();
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [sel, setSel] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const closeModal = () => { setModal(null); setSel(null); };

  const load = useCallback(async () => {
    await Promise.all([fetchProducts({ limit: 100 }), fetchCategories({ limit: 100 })]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (form) => {
    if (sel) { await editProduct(sel._id, form); showToast("Product updated"); }
    else { await addProduct(form); showToast("Product created"); }
    closeModal();
    fetchProducts({ limit: 100 });
  };

  const handleDelete = async () => {
    setDeleting(true);
    try { await removeProduct(sel._id); showToast("Product deleted"); closeModal(); fetchProducts({ limit: 100 }); }
    finally { setDeleting(false); }
  };

  return (
    <div>
      <SectionHeader title="All Products" count={rows.length} buttonLabel="Add Product"
        onAction={() => { setSel(null); setModal("edit"); }} />

      <div className="px-6 py-4">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />)}
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
            <FaBoxOpen className="text-4xl mb-3" />
            <p className="font-semibold">No products yet</p>
            <p className="text-sm mt-1">Create your first product to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px]">
              <thead>
                <tr className="border-b border-(--border-light)">
                  {["Image", "Title", "Brand", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 px-3 first:pl-0 last:pr-0">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)]">
                {rows.map((p) => {
                  const img = p.images?.[0];
                  return (
                    <tr key={p._id} className="hover:bg-(--surface-warm) transition-colors">
                      <td className="py-3.5 px-3 pl-0">
                        <div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          {img
                            ? <img src={img.url} alt={img.alt || p.title} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-gray-400"><FaImage /></div>
                          }
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="text-sm font-semibold text-(--accent) line-clamp-1 max-w-[140px] block">{p.title}</span>
                      </td>
                      <td className="py-3.5 px-3"><span className="text-sm text-gray-600">{p.brand}</span></td>
                      <td className="py-3.5 px-3"><span className="text-sm text-gray-600">{p.category?.name || "—"}</span></td>
                      <td className="py-3.5 px-3"><span className="text-sm font-bold text-(--accent)">₹{p.price}</span></td>
                      <td className="py-3.5 px-3">
                        <span className={`text-sm font-semibold ${p.stock === 0 ? "text-red-500" : "text-gray-700"}`}>{p.stock}</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          p.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                        }`}>
                          {p.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 pr-0">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => { setSel(p); setModal("view"); }}
                            className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 flex items-center justify-center transition-colors" title="View">
                            <FaEye className="text-xs" />
                          </button>
                          <button onClick={() => { setSel(p); setModal("edit"); }}
                            className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 hover:bg-amber-100 flex items-center justify-center transition-colors" title="Edit">
                            <FaEdit className="text-xs" />
                          </button>
                          <button onClick={() => { setSel(p); setModal("delete"); }}
                            className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors" title="Delete">
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal === "edit" && (
        <Modal title={sel ? "Edit Product" : "Create Product"} onClose={closeModal} wide>
          <ProductForm initial={sel} categories={cats} onSave={handleSave} onClose={closeModal} />
        </Modal>
      )}
      {modal === "view" && sel && (
        <Modal title="Product Details" onClose={closeModal}>
          {(() => {
            const img = sel.images?.[0];
            return (
              <>
                {img
                  ? <img src={img.url} alt={img.alt || sel.title} className="w-full h-44 object-cover rounded-xl mb-4" />
                  : <div className="w-full h-28 bg-(--surface-warm) rounded-xl mb-4 flex items-center justify-center text-gray-400"><FaImage className="text-4xl" /></div>
                }
                <div className="space-y-3 mb-5">
                  {[["Title", sel.title], ["Brand", sel.brand], ["Category", sel.category?.name || "—"],
                    ["Price", `₹${sel.price}`], ["Stock", sel.stock], ["Featured", sel.isFeatured ? "Yes" : "No"],
                    ["Status", sel.isActive ? "Active" : "Inactive"],
                    ["Rating", sel.averageRating?.toFixed(1) || "0"],
                    ["Reviews", sel.numReviews || "0"],
                    ["Description", sel.description]].map(([l, v]) => (
                    <div key={l} className="flex gap-3">
                      <span className="text-xs font-semibold text-gray-400 w-24 shrink-0 pt-0.5">{l}</span>
                      <span className="text-sm text-(--accent) font-medium flex-1 break-words">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={closeModal} className="flex-1 py-2.5 border border-(--border-light) text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50">Close</button>
                  <button onClick={() => setModal("edit")} className="flex-1 py-2.5 bg-(--accent) text-white text-sm font-semibold rounded-lg hover:bg-(--secondary)">Edit</button>
                </div>
              </>
            );
          })()}
        </Modal>
      )}
      {modal === "delete" && sel && (
        <DeleteConfirm type="Product" name={sel.title} loading={deleting} onClose={closeModal} onConfirm={handleDelete} />
      )}
      {toast && <Toast message={toast} />}
    </div>
  );
}

// ─── Create Category (standalone) ────────────────────────────
function CreateCategorySection() {
  const { addCategory, fetchCategories } = useCategory();
  const [success, setSuccess] = useState("");

  return (
    <div>
      <SectionHeader title="Create Category" />
      <div className="px-6 py-6 max-w-xl">
        {success && <div className="flex items-center gap-2 text-green-700 text-sm bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 mb-4"><FaCheck className="text-xs" /> {success}</div>}
        <div className="bg-white rounded-2xl border border-(--border-light) p-6">
          <CategoryForm
            initial={null}
            onSave={async (form) => {
              await addCategory(form);
              await fetchCategories({ limit: 100 });
              setSuccess("Category created successfully!");
              setTimeout(() => setSuccess(""), 3000);
            }}
            onClose={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Create Product (standalone) ─────────────────────────────
function CreateProductSection() {
  const cats = useCategoryStore((s) => s.categories);
  const { fetchCategories } = useCategory();
  const { addProduct, fetchProducts } = useProduct();
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (cats.length === 0) fetchCategories({ limit: 100 });
  }, []);

  return (
    <div>
      <SectionHeader title="Create Product" />
      <div className="px-6 py-6 max-w-2xl">
        {success && <div className="flex items-center gap-2 text-green-700 text-sm bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 mb-4"><FaCheck className="text-xs" /> {success}</div>}
        <div className="bg-white rounded-2xl border border-(--border-light) p-6">
          <ProductForm
            initial={null}
            categories={cats}
            onSave={async (form) => {
              await addProduct(form);
              await fetchProducts({ limit: 100 });
              setSuccess("Product created successfully!");
              setTimeout(() => setSuccess(""), 3000);
            }}
            onClose={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Profile tab ──────────────────────────────────────────────
function ProfileTab({ user }) {
  return (
    <div className="px-6 py-6 max-w-xl">
      <h2 className="text-xl font-bold text-(--accent) mb-6">My Profile</h2>
      <div className="bg-white rounded-2xl border border-(--border-light) overflow-hidden">
        <div className="bg-(--accent) px-6 py-10 flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-white/20 text-white text-3xl font-bold flex items-center justify-center shrink-0 border-2 border-white/40">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{user?.name}</h3>
            <p className="text-white/70 text-sm mt-0.5">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-0.5 bg-white/20 text-white text-xs font-bold rounded-full capitalize">
              {user?.role || "user"}
            </span>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: "Full Name", value: user?.name },
            { label: "Email Address", value: user?.email },
            { label: "Phone", value: user?.phone || "Not provided" },
            { label: "Role", value: user?.role || "user", cap: true },
          ].map((f) => (
            <div key={f.label} className="flex items-center justify-between py-3 border-b border-(--border-light) last:border-0">
              <span className="text-sm text-gray-500 font-medium">{f.label}</span>
              <span className={`text-sm font-semibold text-(--accent) ${f.cap ? "capitalize" : ""}`}>{f.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Placeholder tab ──────────────────────────────────────────
function PlaceholderTab({ title, icon }) {
  return (
    <div className="px-6 py-6">
      <h2 className="text-xl font-bold text-(--accent) mb-6">{title}</h2>
      <div className="flex flex-col items-center justify-center h-52 text-center bg-white rounded-2xl border border-(--border-light)">
        <div className="w-14 h-14 rounded-full bg-(--surface-warm) flex items-center justify-center text-(--secondary) text-2xl mb-3">
          {icon}
        </div>
        <p className="font-semibold text-gray-700">{title}</p>
        <p className="text-sm text-gray-400 mt-1 max-w-xs">This section is coming soon.</p>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────
export default function AccountPage() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/auth");
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-(--secondary) border-t-transparent animate-spin" />
      </div>
    );
  }

  const handleLogout = async () => {
    try { await logoutUser(); } catch {}
    logout();
    router.push("/");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":            return <ProfileTab user={user} />;
      case "manage-products":    return <ManageProducts />;
      case "create-product":     return <CreateProductSection />;
      case "manage-categories":  return <ManageCategories />;
      case "create-category":    return <CreateCategorySection />;
      case "orders":             return <PlaceholderTab title="Orders" icon={<FaTruck />} />;
      case "cart":               return <PlaceholderTab title="Cart" icon={<FaShoppingCart />} />;
      case "wishlist":           return <PlaceholderTab title="Wishlist" icon={<FaHeart />} />;
      case "settings":           return <PlaceholderTab title="Settings" icon={<FaCog />} />;
      default:                   return <ProfileTab user={user} />;
    }
  };

  const tabLabel = activeTab.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="flex min-h-screen bg-(--surface-warm)">
      <Sidebar
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-1 min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden sticky top-0 z-20 bg-white border-b border-(--border-light) px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="w-9 h-9 rounded-lg bg-(--surface-warm) flex items-center justify-center text-(--accent) hover:bg-(--primary) transition-colors"
          >
            <FaBars className="text-sm" />
          </button>
          <span className="font-bold text-(--accent) text-sm">{tabLabel}</span>
        </div>

        <div className="max-w-5xl mx-auto w-full">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
