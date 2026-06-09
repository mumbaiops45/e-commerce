"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import Link from "next/link";

const banners = [
  { id: 0, src: "/nextslider.png" },

];

export default function SecondarySlider() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const goTo = useCallback((idx) => {
    setCurrent((idx + banners.length) % banners.length);
  }, []);

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);

  useEffect(() => {
    timerRef.current = setInterval(goNext, 3000);
    return () => clearInterval(timerRef.current);
  }, [goNext]);

  return (
    <section className="relative w-full h-[75vh] overflow-hidden">
      {banners.map((banner, i) => (
        <div
          key={banner.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          {banner.src && (
            <img
              src={banner.src}
              alt={`Banner ${i + 1}`}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
