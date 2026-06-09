"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const slides = [
  { id: 0, src: "/hero1.png", centerSrc: "" },
  { id: 1, src: "/hero2.png", centerSrc: "" },
  { id: 2, src: "/hero3.png", centerSrc: "" },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const goTo = useCallback((idx) => {
    setCurrent((idx + slides.length) % slides.length);
  }, []);

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    timerRef.current = setInterval(goNext, 3000);
    return () => clearInterval(timerRef.current);
  }, [goNext]);

  return (
    <section className="relative w-full h-[85vh] overflow-hidden">

      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          {slide.src && (
            <img
              src={slide.src}
              alt={`Slide ${i + 1}`}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ))}

      {/* Center product image */}
      {slides[current].centerSrc && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <img
            src={slides[current].centerSrc}
            alt={`Product ${current + 1}`}
            className="h-[60%] max-h-105 w-auto object-contain drop-shadow-2xl"
          />
        </div>
      )}

      {/* Prev button */}
      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors"
      >
        <FaChevronLeft />
      </button>

      {/* Next button */}
      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors"
      >
        <FaChevronRight />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
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
