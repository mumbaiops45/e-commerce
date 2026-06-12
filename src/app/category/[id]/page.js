"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { FaHeart, FaRegHeart, FaShoppingCart, FaStar, FaChevronLeft, FaFilter } from "react-icons/fa";
import { getCategoryById } from "@/routes/category.routes";
import { getProductsByCategory } from "@/routes/product.routes";

export default function CategoryPage({ params }) {
  const { id } = use(params);

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState({});
  const [sort, setSort] = useState("createdAt");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    getCategoryById(id)
      .then((d) => setCategory(d.category))
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    setLoading(true);
    getProductsByCategory(id, { sort, page, limit: 12 })
      .then((d) => {
        setProducts(d.products || []);
        setPagination(d.pagination || null);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [id, sort, page]);

  const toggleWish = (pid) => setWishlisted((prev) => ({ ...prev, [pid]: !prev[pid] }));

  return (
    <div className="min-h-screen bg-(--surface-warm)">
      {/* Header */}
      <div className="bg-white border-b border-(--border-light) px-4 md:px-10 py-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-(--accent) mb-4 transition-colors">
            <FaChevronLeft className="text-xs" /> Back to Home
          </Link>

          {category ? (
            <div className="flex items-center gap-5">
              {category.image && (
                <img src={category.image} alt={category.name} className="w-16 h-16 rounded-xl object-cover border border-(--border-light) shrink-0" />
              )}
              <div>
                <span className="section-label">{category.name}</span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-(--accent) mt-1">{category.name}</h1>
                {category.description && (
                  <p className="text-gray-500 text-sm mt-1 max-w-lg">{category.description}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="h-12 w-64 bg-gray-100 rounded-lg animate-pulse" />
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 py-8">
        {/* Sort bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            {pagination ? `${pagination.total} products` : ""}
          </p>
          <div className="flex items-center gap-2">
            <FaFilter className="text-xs text-gray-400" />
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="text-sm border border-(--border-light) rounded-lg px-3 py-2 outline-none focus:border-(--secondary) bg-white"
            >
              <option value="createdAt">Newest First</option>
              <option value="price">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="averageRating">Top Rated</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden border border-(--border-light) animate-pulse">
                <div className="aspect-square bg-gray-100" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-5 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-lg font-semibold text-gray-700">No products in this category yet</p>
            <p className="text-sm text-gray-400 mt-1">Check back soon.</p>
            <Link href="/" className="mt-6 px-6 py-3 bg-(--secondary) text-white font-bold text-sm rounded-lg hover:bg-(--accent) transition-colors">
              Go to Home
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product) => {
                const img = product.images?.[0];
                return (
                  <div
                    key={product._id}
                    className="bg-white rounded-xl overflow-hidden border border-(--border-light) group hover:shadow-xl transition-shadow duration-300 flex flex-col"
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <img
                        src={img?.url || `https://picsum.photos/seed/${product._id}/400/400`}
                        alt={img?.alt || product.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {product.isFeatured && (
                        <span className="absolute top-3 left-3 bg-(--accent) text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                          Featured
                        </span>
                      )}
                      <button
                        onClick={() => toggleWish(product._id)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-(--primary) transition-colors"
                      >
                        {wishlisted[product._id]
                          ? <FaHeart className="text-sm text-(--accent)" />
                          : <FaRegHeart className="text-sm text-gray-400" />}
                      </button>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-[10px] font-semibold text-(--secondary) uppercase tracking-wider mb-1">
                        {product.brand}
                      </p>
                      <h3 className="text-sm font-semibold text-(--accent) leading-snug line-clamp-2 flex-1">
                        {product.title}
                      </h3>

                      {product.numReviews > 0 && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={`text-[10px] ${i < Math.round(product.averageRating) ? "text-amber-400" : "text-gray-200"}`} />
                            ))}
                          </div>
                          <span className="text-[11px] text-gray-400">({product.numReviews})</span>
                        </div>
                      )}

                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-lg font-extrabold text-(--accent)">₹{product.price}</span>
                        {product.stock === 0 && <span className="text-xs text-red-500 font-semibold">Out of stock</span>}
                      </div>

                      <button
                        disabled={product.stock === 0}
                        className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 bg-(--secondary) text-white text-xs font-bold rounded-lg hover:bg-(--accent) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaShoppingCart className="text-xs" /> Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm font-semibold border border-(--border-light) rounded-lg hover:bg-white disabled:opacity-40 transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500 px-3">
                  Page {page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="px-4 py-2 text-sm font-semibold border border-(--border-light) rounded-lg hover:bg-white disabled:opacity-40 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
