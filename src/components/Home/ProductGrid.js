"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { FaHeart, FaShoppingCart, FaStar, FaRegHeart } from "react-icons/fa";
import useProductStore from "@/store/product.store";
import useCategoryStore from "@/store/category.store";
import { useProduct } from "@/hooks/useProduct";
import { useCategory } from "@/hooks/useCategory";

export default function ProductGrid() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const [activeTab, setActiveTab] = useState("All");
  const [wishlisted, setWishlisted] = useState({});
  const [loading, setLoading] = useState(true);

  const products = useProductStore((s) => s.products);
  const categories = useCategoryStore((s) => s.categories);
  const { fetchProducts: fetchProds } = useProduct();
  const { fetchCategories } = useCategory();

  useEffect(() => {
    fetchCategories({ limit: 20 });
  }, []);

  const loadProducts = useCallback((categoryId) => {
    setLoading(true);
    const params = { limit: 8 };
    if (categoryId) params.category = categoryId;
    fetchProds(params).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadProducts(null);
  }, [loadProducts]);

  const handleTabChange = (tab, catId) => {
    setActiveTab(tab);
    loadProducts(catId || null);
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".prod-heading", {
        opacity: 0, y: 30, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!gridRef.current || loading) return;
    const cards = gridRef.current.querySelectorAll(".prod-card");
    gsap.from(cards, { opacity: 0, y: 30, stagger: 0.07, duration: 0.5, ease: "power2.out" });
  }, [products, loading]);

  const toggleWish = (id) => setWishlisted((prev) => ({ ...prev, [id]: !prev[id] }));

  const tabs = [{ label: "All", id: null }, ...categories.map((c) => ({ label: c.name, id: c._id }))];

  return (
    <section ref={sectionRef} className="py-16 px-4 md:px-10 lg:px-16 bg-(--surface-warm)">
      <div className="max-w-7xl mx-auto">

        <div className="prod-heading text-center mb-10">
          <span className="section-label">Our Collection</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-(--accent) mt-1">Featured Products</h2>
          <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
            Hotel-grade amenities sourced directly from the manufacturer — GST-ready & bulk pricing available.
          </p>
        </div>

        <div className="prod-heading flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map((t) => (
            <button
              key={t.label}
              onClick={() => handleTabChange(t.label, t.id)}
              className={`px-5 py-2 text-xs font-bold rounded-full border transition-all ${
                activeTab === t.label
                  ? "bg-(--secondary) text-white border-(--secondary)"
                  : "bg-white text-gray-500 border-gray-200 hover:border-(--secondary) hover:text-(--secondary)"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-b-xl overflow-hidden border border-[var(--border-light)] animate-pulse">
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
          <p className="text-center text-gray-400 py-16">No products found.</p>
        ) : (
          <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => {
              const img = product.images?.[0];
              return (
                <div
                  key={product._id}
                  className="prod-card bg-white rounded-b-xl overflow-hidden border border-[var(--border-light)] group hover:shadow-xl transition-shadow duration-300 flex flex-col"
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
                            <FaStar
                              key={i}
                              className={`text-[10px] ${i < Math.round(product.averageRating) ? "text-amber-400" : "text-gray-200"}`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-gray-400">({product.numReviews})</span>
                      </div>
                    )}

                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-lg font-extrabold text-(--accent)">₹{product.price}</span>
                      {product.stock === 0 && (
                        <span className="text-xs text-red-500 font-semibold">Out of stock</span>
                      )}
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button
                        disabled={product.stock === 0}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-(--secondary) text-white text-xs font-bold rounded-lg hover:bg-(--accent) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaShoppingCart className="text-xs" /> Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-(--secondary) text-(--secondary) font-bold text-sm rounded-sm hover:bg-(--secondary) hover:text-white transition-all"
          >
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
}
