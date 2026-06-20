"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FaShoppingCart, FaStar, FaFilter, FaTimes, FaCheck,
  FaSearch, FaChevronLeft, FaHeart, FaRegHeart, FaTag,
} from "react-icons/fa";
import { getAllProducts } from "@/routes/product.routes";
import useCategoryStore from "@/store/category.store";
import { useCategory } from "@/hooks/useCategory";
import useAuthStore from "@/store/auth.store";
import { useCart } from "@/hooks/useCart";
import useWishlistStore from "@/store/wishlist.store";
import { useWishlist } from "@/hooks/useWishlist";

// sort value in URL → API params
const SORT_MAP = {
  newest: { sort: "createdAt", order: "desc" },
  low:    { sort: "price",     order: "asc"  },
  high:   { sort: "price",     order: "desc" },
  rating: { sort: "averageRating", order: "desc" },
};

// ── Filters sidebar (shared between desktop and mobile drawer) ────────────────
function FiltersPanel({
  categories, categoryId, priceMin, priceMax, hasFilters,
  onCategory, onPriceMinChange, onPriceMaxChange, onApplyPrice, onClear,
}) {
  return (
    <div className="space-y-7">
      {/* Categories */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Categories</p>
        <div className="space-y-0.5">
          <button
            onClick={() => onCategory("")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !categoryId
                ? "bg-(--accent) text-white font-semibold"
                : "text-gray-600 hover:bg-(--surface-warm)"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => onCategory(cat._id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                categoryId === cat._id
                  ? "bg-(--accent) text-white font-semibold"
                  : "text-gray-600 hover:bg-(--surface-warm)"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Price Range (₹)</p>
        <div className="flex items-center gap-2 mb-2.5">
          <input
            type="number" min="0" placeholder="Min ₹"
            value={priceMin}
            onChange={(e) => onPriceMinChange(e.target.value)}
            className="w-full border border-(--border-light) rounded-lg px-3 py-2 text-sm outline-none focus:border-(--secondary) transition-all"
          />
          <span className="text-gray-300 font-bold shrink-0">—</span>
          <input
            type="number" min="0" placeholder="Max ₹"
            value={priceMax}
            onChange={(e) => onPriceMaxChange(e.target.value)}
            className="w-full border border-(--border-light) rounded-lg px-3 py-2 text-sm outline-none focus:border-(--secondary) transition-all"
          />
        </div>
        <button
          onClick={onApplyPrice}
          className="w-full py-2 bg-(--accent) text-white text-xs font-semibold rounded-lg hover:bg-(--secondary) transition-colors"
        >
          Apply Price
        </button>
      </div>

      {/* Clear all */}
      {hasFilters && (
        <button
          onClick={onClear}
          className="w-full py-2 border border-red-200 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-50 transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}

// ── Product card ──────────────────────────────────────────────────────────────
function ProductCard({ product, onAddToCart, adding, wishlisted, wishlistLoading, onToggleWish }) {
  const img = product.images?.[0];
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-(--border-light) hover:border-(--secondary)/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Image area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <img
          src={img?.url || `https://picsum.photos/seed/${product._id}/400/400`}
          alt={img?.alt || product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isFeatured && (
            <span className="bg-(--accent) text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow">
              Featured
            </span>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <span className="bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide shadow">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-gray-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wide">
              Out of Stock
            </span>
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={(e) => { e.preventDefault(); onToggleWish(product._id); }}
          disabled={wishlistLoading}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 disabled:opacity-60 z-10"
        >
          {wishlisted
            ? <FaHeart className="text-sm text-red-500" />
            : <FaRegHeart className="text-sm text-gray-400" />}
        </button>

        {/* View product pill */}
        <Link
          href={`/product/${product._id}`}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-(--accent) text-[11px] font-bold px-4 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10"
        >
          View Product →
        </Link>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[9px] font-black text-(--secondary) uppercase tracking-widest mb-1">{product.brand}</p>
        <Link href={`/product/${product._id}`} className="flex-1">
          <h3 className="text-sm font-semibold text-(--accent) leading-snug line-clamp-2 hover:text-(--secondary) transition-colors">
            {product.title}
          </h3>
        </Link>

        {product.numReviews > 0 && (
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={`text-[10px] ${i < Math.round(product.averageRating) ? "text-amber-400" : "text-gray-200"}`} />
            ))}
            <span className="text-[11px] text-gray-400 font-medium ml-0.5">({product.numReviews})</span>
          </div>
        )}

        <div className="mt-2 mb-3">
          <span className="text-xl font-black text-(--accent)">₹{product.price?.toLocaleString()}</span>
        </div>

        <button
          onClick={() => onAddToCart(product._id)}
          disabled={product.stock === 0 || adding}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-(--accent) text-white text-xs font-bold rounded-xl hover:bg-(--secondary) active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
        >
          {adding
            ? <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            : <FaShoppingCart className="text-xs" />}
          {adding ? "Adding…" : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

// ── Main content — uses useSearchParams so needs Suspense ────────────────────
function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { addToCart } = useCart();
  const categories = useCategoryStore((s) => s.categories);
  const { fetchCategories } = useCategory();

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [cartToast, setCartToast] = useState("");
  const [wishlistLoading, setWishlistLoading] = useState({});
  const wishlistItems = useWishlistStore((s) => s.items);
  const { addToWishlist, removeFromWishlist, fetchWishlist } = useWishlist();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [localMin, setLocalMin] = useState("");
  const [localMax, setLocalMax] = useState("");

  // URL-derived state
  const search     = searchParams.get("search") || "";
  const sort       = searchParams.get("sort") || "newest";
  const page       = Number(searchParams.get("page") || 1);
  const categoryId = searchParams.get("category") || "";
  const minPrice   = searchParams.get("minPrice") || "";
  const maxPrice   = searchParams.get("maxPrice") || "";

  const hasFilters = !!(categoryId || minPrice || maxPrice);

  // Sync local price inputs when URL changes (back/forward nav)
  useEffect(() => {
    setLocalMin(minPrice);
    setLocalMax(maxPrice);
  }, [minPrice, maxPrice]);

  useEffect(() => {
    if (categories.length === 0) fetchCategories({ limit: 50 });
    if (isAuthenticated) fetchWishlist();
  }, [isAuthenticated]);

  const isWishlisted = (productId) => wishlistItems.some((w) => (w.product?._id || w.product) === productId);

  const handleToggleWish = async (productId) => {
    if (!isAuthenticated) { router.push("/auth"); return; }
    setWishlistLoading((p) => ({ ...p, [productId]: true }));
    try {
      if (isWishlisted(productId)) {
        const entry = wishlistItems.find((w) => (w.product?._id || w.product) === productId);
        await removeFromWishlist(entry._id);
      } else {
        await addToWishlist(productId);
      }
    } finally {
      setWishlistLoading((p) => ({ ...p, [productId]: false }));
    }
  };

  // Push URL helper — resets page unless explicitly provided
  const push = useCallback((updates) => {
    const p = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v !== "" && v != null) p.set(k, String(v));
      else p.delete(k);
    });
    if (!("page" in updates)) p.delete("page");
    router.push(`/products?${p.toString()}`);
  }, [searchParams, router]);

  // Fetch products whenever URL params change
  useEffect(() => {
    setLoading(true);
    const { sort: s, order: o } = SORT_MAP[sort] ?? SORT_MAP.newest;
    const params = { sort: s, order: o, page, limit: 12 };
    if (search)     params.search   = search;
    if (categoryId) params.category = categoryId;
    if (minPrice)   params.minPrice = minPrice;
    if (maxPrice)   params.maxPrice = maxPrice;

    getAllProducts(params)
      .then((data) => {
        setProducts(data.products || []);
        setPagination(data.pagination || null);
      })
      .catch(() => { setProducts([]); setPagination(null); })
      .finally(() => setLoading(false));
  }, [search, sort, page, categoryId, minPrice, maxPrice]);

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) { router.push("/auth"); return; }
    setAddingId(productId);
    try {
      await addToCart(productId, 1);
      setCartToast("Added to cart!");
    } catch {
      setCartToast("Failed to add to cart");
    } finally {
      setAddingId(null);
      setTimeout(() => setCartToast(""), 2500);
    }
  };

  const handleApplyPrice = () => {
    push({ minPrice: localMin, maxPrice: localMax });
    setMobileFiltersOpen(false);
  };

  const handleClearFilters = () => {
    setLocalMin(""); setLocalMax("");
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (sort !== "newest") p.set("sort", sort);
    router.push(`/products${p.toString() ? `?${p.toString()}` : ""}`);
  };

  // Render page number buttons with ellipsis
  const renderPageButtons = () => {
    if (!pagination || pagination.totalPages <= 1) return null;
    const total = pagination.totalPages;
    const buttons = [];

    for (let i = 1; i <= total; i++) {
      const near = i === 1 || i === total || (i >= page - 1 && i <= page + 1);
      const ellipsisBefore = i === 2 && page > 4;
      const ellipsisAfter  = i === total - 1 && page < total - 3;

      if (!near) {
        if (ellipsisBefore || ellipsisAfter) {
          buttons.push(<span key={`e${i}`} className="text-gray-400 px-1 self-center">…</span>);
        }
        continue;
      }
      buttons.push(
        <button
          key={i}
          onClick={() => push({ page: i })}
          className={`w-9 h-9 text-sm font-semibold rounded-lg transition-colors ${
            i === page
              ? "bg-(--accent) text-white"
              : "border border-(--border-light) bg-white hover:border-(--secondary) text-gray-600"
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  const filterProps = {
    categories,
    categoryId,
    priceMin: localMin,
    priceMax: localMax,
    hasFilters,
    onCategory: (id) => { push({ category: id }); setMobileFiltersOpen(false); },
    onPriceMinChange: setLocalMin,
    onPriceMaxChange: setLocalMax,
    onApplyPrice: handleApplyPrice,
    onClear: () => { handleClearFilters(); setMobileFiltersOpen(false); },
  };

  return (
    <div className="min-h-screen bg-(--surface-warm)">
      {/* Page header */}
      <div className="bg-white border-b border-(--border-light) px-4 md:px-10 py-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-(--accent) mb-4 transition-colors"
          >
            <FaChevronLeft className="text-xs" /> Back to Home
          </Link>
          <p className="text-xs font-bold uppercase tracking-widest text-(--secondary) mb-1">
            {search ? `Results for` : "Explore"}
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-(--accent)">
            {search ? `"${search}"` : "All Products"}
          </h1>
          {!loading && pagination && (
            <p className="text-sm text-gray-500 mt-1.5">
              {pagination.total} product{pagination.total !== 1 ? "s" : ""} found
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 py-8">
        <div className="flex gap-7">
          {/* ── Desktop sidebar ─────────────────────────────────── */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="bg-white rounded-xl border border-(--border-light) p-5 sticky top-24">
              <p className="font-bold text-(--accent) text-sm mb-5">Filters</p>
              <FiltersPanel {...filterProps} />
            </div>
          </aside>

          {/* ── Main content ─────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Top bar: mobile filter btn + sort */}
            <div className="flex items-center justify-between mb-5 gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 border border-(--border-light) bg-white rounded-lg text-sm text-gray-600 hover:border-(--secondary) transition-colors"
                >
                  <FaFilter className="text-xs" /> Filters
                  {hasFilters && <span className="w-2 h-2 rounded-full bg-(--secondary) shrink-0" />}
                </button>
                <p className="text-sm text-gray-500 hidden sm:block">
                  {!loading && pagination ? `${pagination.total} items` : ""}
                </p>
              </div>

              <select
                value={sort}
                onChange={(e) => push({ sort: e.target.value })}
                className="text-sm border border-(--border-light) rounded-lg px-3 py-2 outline-none focus:border-(--secondary) bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Active filter chips */}
            {(search || hasFilters) && (
              <div className="flex flex-wrap gap-2 mb-5">
                {search && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-(--border-light) rounded-full text-xs font-semibold text-(--accent)">
                    <FaSearch className="text-[10px] text-(--secondary)" />
                    {search}
                    <button
                      onClick={() => push({ search: "" })}
                      className="ml-1 text-gray-400 hover:text-(--accent) transition-colors"
                    >
                      <FaTimes className="text-[10px]" />
                    </button>
                  </span>
                )}
                {categoryId && (() => {
                  const cat = categories.find((c) => c._id === categoryId);
                  return cat ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-(--border-light) rounded-full text-xs font-semibold text-(--accent)">
                      <FaTag className="text-[10px] text-(--secondary)" />
                      {cat.name}
                      <button onClick={() => push({ category: "" })} className="ml-1 text-gray-400 hover:text-(--accent) transition-colors">
                        <FaTimes className="text-[10px]" />
                      </button>
                    </span>
                  ) : null;
                })()}
                {(minPrice || maxPrice) && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-(--border-light) rounded-full text-xs font-semibold text-(--accent)">
                    ₹{minPrice || "0"} – ₹{maxPrice || "∞"}
                    <button
                      onClick={() => { setLocalMin(""); setLocalMax(""); push({ minPrice: "", maxPrice: "" }); }}
                      className="ml-1 text-gray-400 hover:text-(--accent) transition-colors"
                    >
                      <FaTimes className="text-[10px]" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* ── Skeleton ── */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden border border-(--border-light) animate-pulse">
                    <div className="aspect-square bg-gray-100" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                      <div className="h-5 bg-gray-100 rounded w-1/3" />
                      <div className="h-8 bg-gray-100 rounded mt-3" />
                    </div>
                  </div>
                ))}
              </div>

            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-(--border-light)">
                <FaSearch className="text-4xl text-gray-200 mb-4" />
                <p className="text-lg font-semibold text-gray-700">
                  {search ? `No results for "${search}"` : "No products found"}
                </p>
                <p className="text-sm text-gray-400 mt-1 mb-5">Try adjusting your search or filters.</p>
                {(search || hasFilters) && (
                  <button
                    onClick={() => router.push("/products")}
                    className="px-6 py-2.5 bg-(--accent) text-white text-sm font-semibold rounded-lg hover:bg-(--secondary) transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

            ) : (
              <>
                {/* ── Product grid ── */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      adding={addingId === product._id}
                      wishlisted={isWishlisted(product._id)}
                      wishlistLoading={!!wishlistLoading[product._id]}
                      onToggleWish={handleToggleWish}
                    />
                  ))}
                </div>

                {/* ── Pagination ── */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 mt-10 flex-wrap">
                    <button
                      onClick={() => push({ page: page - 1 })}
                      disabled={page === 1}
                      className="px-4 py-2 text-sm font-semibold border border-(--border-light) bg-white rounded-lg hover:border-(--secondary) disabled:opacity-40 transition-colors"
                    >
                      ← Prev
                    </button>

                    {renderPageButtons()}

                    <button
                      onClick={() => push({ page: page + 1 })}
                      disabled={page === pagination.totalPages}
                      className="px-4 py-2 text-sm font-semibold border border-(--border-light) bg-white rounded-lg hover:border-(--secondary) disabled:opacity-40 transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filters drawer ───────────────────────────────── */}
      {mobileFiltersOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl max-h-[80vh] overflow-y-auto lg:hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-(--border-light) sticky top-0 bg-white z-10">
              <p className="font-bold text-(--accent)">Filters</p>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <FaTimes className="text-xs" />
              </button>
            </div>
            <div className="p-5">
              <FiltersPanel {...filterProps} />
            </div>
          </div>
        </>
      )}

      {/* ── Cart toast ─────────────────────────────────────────── */}
      {cartToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-600 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-lg">
          <FaCheck className="text-xs" /> {cartToast}
        </div>
      )}
    </div>
  );
}

// Suspense boundary required for useSearchParams in App Router
export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-(--surface-warm) flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-(--secondary) border-t-transparent animate-spin" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
