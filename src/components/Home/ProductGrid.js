"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { FaHeart, FaShoppingCart, FaStar, FaRegHeart } from "react-icons/fa";

// TODO: Replace with API data
const products = [
  {
    id: 1, name: "Biotique Premium 5-Piece Hotel Kit", category: "Bath Toiletries",
    price: 59, originalPrice: 75, unit: "/kit", minQty: "Min 72 kits",
    rating: 4.8, reviews: 132, badge: "Best Seller", src: "https://picsum.photos/seed/prod1/400/400",
    tags: ["Ayurvedic", "Eco-Friendly"],
  },
  {
    id: 2, name: "Farm Fresh 5-Piece Hotel Collection", category: "Bath Toiletries",
    price: 45, originalPrice: 60, unit: "/kit", minQty: "Min 72 kits",
    rating: 4.7, reviews: 98, badge: "New", src: "https://picsum.photos/seed/prod2/400/400",
    tags: ["Bay Leaf", "Lemongrass"],
  },
  {
    id: 3, name: "Biotique Royal Ayurveda Bath Kit (4pc)", category: "Bath Toiletries",
    price: 1450, originalPrice: 1800, unit: "/kit", minQty: "No Min Order",
    rating: 4.9, reviews: 56, badge: "Premium", src: "https://picsum.photos/seed/prod3/400/400",
    tags: ["300ml Each", "Luxury"],
  },
  {
    id: 4, name: "Guest Slippers (Pair) — Soft Cotton", category: "Guest Amenities",
    price: 28, originalPrice: 35, unit: "/pair", minQty: "Min 50 pairs",
    rating: 4.6, reviews: 74, badge: null, src: "https://picsum.photos/seed/prod4/400/400",
    tags: ["Cotton", "Hygienic"],
  },
  {
    id: 5, name: "Dental Kit — Toothbrush + Toothpaste", category: "Guest Amenities",
    price: 18, originalPrice: 22, unit: "/kit", minQty: "Min 100 kits",
    rating: 4.5, reviews: 89, badge: null, src: "https://picsum.photos/seed/prod5/400/400",
    tags: ["Travel Size", "Compact"],
  },
  {
    id: 6, name: "Green Apple Shampoo 5L Bulk Jar", category: "Bulk Products",
    price: 850, originalPrice: 1100, unit: "/jar", minQty: "Min 2 jars",
    rating: 4.7, reviews: 43, badge: "Bulk", src: "https://picsum.photos/seed/prod6/400/400",
    tags: ["5 Litres", "Hotel Grade"],
  },
  {
    id: 7, name: "Biotique Wall Mounted Dispenser 380ml", category: "Guest Amenities",
    price: 320, originalPrice: 420, unit: "/piece", minQty: "Min 5 pcs",
    rating: 4.8, reviews: 61, badge: null, src: "https://picsum.photos/seed/prod7/400/400",
    tags: ["Rust-resistant", "380ml"],
  },
  {
    id: 8, name: "Shower Cap — Disposable Hotel Grade", category: "Guest Amenities",
    price: 4, originalPrice: 6, unit: "/piece", minQty: "Min 200 pcs",
    rating: 4.4, reviews: 112, badge: null, src: "https://picsum.photos/seed/prod8/400/400",
    tags: ["Disposable", "Waterproof"],
  },
];

const tabs = ["All", "Bath Toiletries", "Guest Amenities", "Bulk Products"];

export default function ProductGrid() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const [activeTab, setActiveTab] = useState("All");
  const [wishlisted, setWishlisted] = useState({});

  const filtered = activeTab === "All" ? products : products.filter((p) => p.category === activeTab);

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
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".prod-card");
    gsap.from(cards, { opacity: 0, y: 30, stagger: 0.07, duration: 0.5, ease: "power2.out" });
  }, [activeTab]);

  const toggleWish = (id) => setWishlisted((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <section ref={sectionRef} className="py-16 px-4 md:px-10 lg:px-16 bg-(--surface-warm)">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="prod-heading text-center mb-10">
          <span className="section-label">Our Collection</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-(--accent) mt-1">Featured Products</h2>
          <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
            Hotel-grade Biotique amenities sourced directly from the manufacturer — GST-ready & bulk pricing available.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="prod-heading flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-5 py-2 text-xs font-bold rounded-full border transition-all ${
                activeTab === t
                  ? "bg-(--secondary) text-white border-(--secondary)"
                  : "bg-white text-gray-500 border-gray-200 hover:border-(--secondary) hover:text-(--secondary)"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="prod-card bg-white rounded-b-xl overflow-hidden border border-[var(--border-light)] group hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img
                  src={product.src}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-(--accent) text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                    {product.badge}
                  </span>
                )}

                {/* Wishlist */}
                <button
                  onClick={() => toggleWish(product.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-(--primary) transition-colors"
                >
                  {wishlisted[product.id]
                    ? <FaHeart className="text-sm text-(--accent)" />
                    : <FaRegHeart className="text-sm text-gray-400" />
                  }
                </button>

                {/* Discount pill */}
                {product.originalPrice > product.price && (
                  <span className="absolute bottom-3 left-3 bg-(--primary) text-(--accent) text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-sm font-semibold text-(--accent) leading-snug line-clamp-2 flex-1">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-[10px] ${i < Math.round(product.rating) ? "text-amber-400" : "text-gray-200"}`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-400">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-lg font-extrabold text-(--accent)">
                    ₹{product.price}<span className="text-xs font-normal text-gray-400">{product.unit}</span>
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-(--secondary) text-white text-xs font-bold rounded-lg hover:bg-(--accent) transition-colors">
                    <FaShoppingCart className="text-xs" /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
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
