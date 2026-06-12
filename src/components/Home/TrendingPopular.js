"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

export default function TrendingPopular() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".tp-col", {
        opacity: 0, y: 40, stagger: 0.2, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 px-4 md:px-10 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">

        {/* Trending */}
        <div className="tp-col relative rounded-2xl overflow-hidden h-72 md:h-96 bg-gray-100">
          <img src="https://picsum.photos/seed/trending/800/500" alt="Trending" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-2">This Week</p>
            <h2 className="text-3xl font-extrabold text-white mb-4">Trending</h2>
            <Link
              href="/featured"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-(--primary) text-(--accent) font-bold text-sm rounded-sm hover:bg-white transition-colors"
            >
              Shop Now →
            </Link>
          </div>
        </div>

        {/* Popular */}
        <div className="tp-col relative rounded-2xl overflow-hidden h-72 md:h-96 bg-gray-100">
          <img src="https://picsum.photos/seed/popular/800/500" alt="Popular" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-2">Most Loved</p>
            <h2 className="text-3xl font-extrabold text-white mb-4">Popular</h2>
            <Link
              href="/featured"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-(--secondary) text-white font-bold text-sm rounded-sm hover:bg-(--accent) transition-colors"
            >
              Shop Now →
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
