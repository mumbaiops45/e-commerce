"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaHeart, FaRegHeart, FaShoppingCart, FaStar, FaChevronLeft } from "react-icons/fa";
import useProductStore from "@/store/product.store";
import { useProduct } from "@/hooks/useProduct";

export default function FeaturedPage() {
  const products = useProductStore((s) => s.products);
  const { fetchProducts } = useProduct();
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState({});

  useEffect(() => {
    fetchProducts({ isFeatured: true, limit: 50 }).finally(() => setLoading(false));
  }, []);

  const toggleWish = (id) => setWishlisted((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="min-h-screen bg-(--surface-warm)">
      {/* Header */}
      <div className="bg-white border-b border-(--border-light) px-4 md:px-10 py-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-(--accent) mb-4 transition-colors">
            <FaChevronLeft className="text-xs" /> Back to Home
          </Link>
          <span className="section-label">Handpicked for You</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-(--accent) mt-1">Featured Products</h1>
          <p className="text-gray-500 text-sm mt-2">
            Our best-selling, top-rated hotel amenities — curated for premium stays.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 py-10">
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
            <div className="w-16 h-16 rounded-full bg-white border border-(--border-light) flex items-center justify-center text-gray-300 text-2xl mb-4">
              <FaShoppingCart />
            </div>
            <p className="text-lg font-semibold text-gray-700">No featured products yet</p>
            <p className="text-sm text-gray-400 mt-1">Check back soon — we're adding more products.</p>
            <Link href="/products" className="mt-6 px-6 py-3 bg-(--secondary) text-white font-bold text-sm rounded-lg hover:bg-(--accent) transition-colors">
              Browse All Products
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">{products.length} featured products</p>
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
                      <span className="absolute top-3 left-3 bg-(--secondary) text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                        Featured
                      </span>
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
          </>
        )}
      </div>
    </div>
  );
}
