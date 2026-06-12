"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { FaCheck } from "react-icons/fa";
import useCategoryStore from "@/store/category.store";
import { useCategory } from "@/hooks/useCategory";

function SplitBlock({ cat, reverse, index }) {
  const blockRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(blockRef.current.querySelector(".sf-img"), {
        opacity: 0,
        x: reverse ? 60 : -60,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: blockRef.current, start: "top 75%" },
      });
      gsap.from(blockRef.current.querySelectorAll(".sf-el"), {
        opacity: 0,
        x: reverse ? -40 : 40,
        stagger: 0.1,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: blockRef.current, start: "top 75%" },
      });
    }, blockRef);
    return () => ctx.revert();
  }, [reverse]);

  const imgSrc = cat.image || `https://picsum.photos/seed/cat${index}/800/600`;

  const imgCol = (
    <div className="sf-img h-72 md:h-130 overflow-hidden">
      <img src={imgSrc} alt={cat.name} className="w-full h-full object-cover" />
    </div>
  );

  const contentCol = (
    <div className="flex flex-col justify-center space-y-5 px-8 py-12 md:px-14 lg:px-20 md:py-0">
      <span className="sf-el section-label">{cat.name}</span>
      <h2 className="sf-el text-3xl md:text-4xl font-extrabold text-(--accent) leading-tight">
        {cat.name}
      </h2>
      <p className="sf-el text-gray-600 text-base leading-relaxed">
        {cat.description || `Browse our full range of ${cat.name.toLowerCase()} — premium quality products for hotels and resorts.`}
      </p>
      <div className="sf-el">
        <Link
          href={`/category/${cat._id}`}
          className="inline-flex items-center gap-2 px-7 py-3 bg-(--secondary) text-white font-bold text-sm rounded-sm hover:bg-(--accent) transition-colors shadow-md hover:shadow-lg"
        >
          Shop {cat.name} →
        </Link>
      </div>
    </div>
  );

  return (
    <div
      ref={blockRef}
      className="grid md:grid-cols-2 border-b border-(--border-light) last:border-0"
    >
      {reverse ? (
        <>
          <div className="order-2 md:order-1">{contentCol}</div>
          <div className="order-1 md:order-2">{imgCol}</div>
        </>
      ) : (
        <>
          {imgCol}
          {contentCol}
        </>
      )}
    </div>
  );
}

export default function SplitFeature() {
  const categories = useCategoryStore((s) => s.categories).slice(0, 2);
  const { fetchCategories } = useCategory();

  useEffect(() => {
    fetchCategories({ limit: 2 });
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="bg-white overflow-hidden">
      {categories.map((cat, i) => (
        <SplitBlock key={cat._id} cat={cat} reverse={i % 2 === 1} index={i} />
      ))}
    </section>
  );
}
