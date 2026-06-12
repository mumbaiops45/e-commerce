"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import useCategoryStore from "@/store/category.store";
import { useCategory } from "@/hooks/useCategory";

const CARD_WIDTH = 220;
const GAP = 16;

export default function ShopByCategory() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [offset, setOffset] = useState(0);

  const categories = useCategoryStore((s) => s.categories);
  const { fetchCategories } = useCategory();
  const [loading, setLoading] = useState(() => categories.length === 0);

  useEffect(() => {
    fetchCategories({ limit: 20 }).finally(() => setLoading(false));
  }, []);

  const maxOffset = Math.max(
    0,
    categories.length * (CARD_WIDTH + GAP) - (CARD_WIDTH + GAP) * 4 - GAP
  );

  useEffect(() => {
    if (loading || categories.length === 0) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".cat-heading", {
        opacity: 0, y: 30, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
      gsap.from(".cat-card", {
        opacity: 0, y: 40, stagger: 0.1, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: trackRef.current, start: "top 85%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [loading, categories]);

  const slide = (dir) => {
    const step = (CARD_WIDTH + GAP) * 2;
    setOffset((prev) => Math.max(0, Math.min(prev + dir * step, maxOffset)));
  };

  useEffect(() => {
    if (!trackRef.current) return;
    gsap.to(trackRef.current, { x: -offset, duration: 0.5, ease: "power2.out" });
  }, [offset]);

  return (
    <section ref={sectionRef} className="py-16 px-4 md:px-10 lg:px-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">

        <div className="cat-heading flex items-end justify-between mb-10">
          <div>
            <span className="section-label">Browse Collections</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-(--accent) mt-1">Shop by Category</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-md">
              Premium amenities curated exclusively for hotels, resorts, and boutique stays.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => slide(-1)}
              disabled={offset === 0}
              className="w-10 h-10 rounded-full border-2 border-(--secondary) flex items-center justify-center text-(--secondary) hover:bg-(--secondary) hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FaChevronLeft className="text-sm" />
            </button>
            <button
              onClick={() => slide(1)}
              disabled={offset >= maxOffset}
              className="w-10 h-10 rounded-full border-2 border-(--secondary) flex items-center justify-center text-(--secondary) hover:bg-(--secondary) hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FaChevronRight className="text-sm" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex gap-5 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="shrink-0 bg-gray-100 animate-pulse rounded-lg" style={{ width: CARD_WIDTH, aspectRatio: "1" }} />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-12">No categories found.</p>
        ) : (
          <div className="overflow-hidden">
            <div
              ref={trackRef}
              className="flex gap-5 will-change-transform"
              style={{ width: `${categories.length * (CARD_WIDTH + GAP)}px` }}
            >
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/category/${cat._id}`}
                  className="cat-card shrink-0 group cursor-pointer"
                  style={{ width: CARD_WIDTH }}
                >
                  <div className="relative w-full aspect-square overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-400">
                    <img
                      src={cat.image || `https://picsum.photos/seed/${cat._id}/300/300`}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-sm font-bold text-white leading-tight drop-shadow-sm">
                        {cat.name}
                      </p>
                      {cat.description && (
                        <p className="text-[11px] text-white/70 mt-0.5 leading-snug line-clamp-1">
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="md:hidden flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => slide(-1)}
            disabled={offset === 0}
            className="w-10 h-10 rounded-full border-2 border-(--secondary) flex items-center justify-center text-(--secondary) hover:bg-(--secondary) hover:text-white transition-all disabled:opacity-30"
          >
            <FaChevronLeft className="text-sm" />
          </button>
          <button
            onClick={() => slide(1)}
            disabled={offset >= maxOffset}
            className="w-10 h-10 rounded-full border-2 border-(--secondary) flex items-center justify-center text-(--secondary) hover:bg-(--secondary) hover:text-white transition-all disabled:opacity-30"
          >
            <FaChevronRight className="text-sm" />
          </button>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-(--secondary) border-b-2 border-(--secondary)/40 hover:border-(--secondary) pb-0.5 transition-colors"
          >
            View All Categories <FaChevronRight className="text-xs" />
          </Link>
        </div>
      </div>
    </section>
  );
}
