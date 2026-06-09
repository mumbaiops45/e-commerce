"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const categories = [
  { id: 1, name: "Bath Toiletries", slug: "bath-toiletries", src: "https://picsum.photos/seed/bathkit/300/300", desc: "Soaps, Shampoos & More" },
  { id: 2, name: "Guest Amenities", slug: "guest-amenities", src: "https://picsum.photos/seed/amenities/300/300", desc: "Slippers, Dental Kits & More" },
  { id: 3, name: "Housekeeping Products", slug: "housekeeping-products", src: "https://picsum.photos/seed/housekeep/300/300", desc: "Cleaners & Sanitizers" },
  { id: 4, name: "Bulk Products", slug: "bulk-products", src: "https://picsum.photos/seed/bulkjars/300/300", desc: "5L Solutions & Bulk Kits" },
  { id: 5, name: "Custom Branding", slug: "custom-branding-products", src: "https://picsum.photos/seed/branding/300/300", desc: "Your Brand, Our Quality" },
  { id: 6, name: "Eco-Friendly Products", slug: "eco-friendly-products", src: "https://picsum.photos/seed/ecofriendly/300/300", desc: "Sustainable Amenities" },
];

const CARD_WIDTH = 220; // px
const GAP = 16; // px

export default function ShopByCategory() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const maxOffset = Math.max(0, categories.length * (CARD_WIDTH + GAP) - (CARD_WIDTH + GAP) * 4 - GAP);

  useEffect(() => {
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
  }, []);

  const slide = (dir) => {
    const step = (CARD_WIDTH + GAP) * 2;
    setOffset((prev) => {
      const next = prev + dir * step;
      return Math.max(0, Math.min(next, maxOffset));
    });
  };

  useEffect(() => {
    if (!trackRef.current) return;
    gsap.to(trackRef.current, { x: -offset, duration: 0.5, ease: "power2.out" });
  }, [offset]);

  return (
    <section ref={sectionRef} className="py-16 px-4 md:px-10 lg:px-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="cat-heading flex items-end justify-between mb-10">
          <div>
            <span className="section-label">Browse Collections</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-(--accent) mt-1">Shop by Category</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-md">
              Premium Biotique amenities curated exclusively for hotels, resorts, and boutique stays.
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

        {/* Carousel track */}
        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-5 will-change-transform"
            style={{ width: `${categories.length * (CARD_WIDTH + GAP)}px` }}
          >
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="cat-card shrink-0 group cursor-pointer"
                style={{ width: CARD_WIDTH }}
              >
                {/* Square card — image fills entirely, overlay at bottom */}
                <div className="relative w-full aspect-square overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-400">

                  {/* Image */}
                  <img
                    src={cat.src}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />

                  {/* Permanent dark-to-transparent gradient at bottom */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />

                
                  {/* Text inside card at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-sm font-bold text-white leading-tight drop-shadow-sm">
                      {cat.name}
                    </p>
                    <p className="text-[11px] text-white/70 mt-0.5 leading-snug">
                      {cat.desc}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile arrows */}
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

        {/* See all link */}
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
