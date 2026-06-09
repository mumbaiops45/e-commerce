"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { FaCheck } from "react-icons/fa";

const features = [
  {
    id: 1,
    reverse: false,
    label: "Bulk Hotel Solutions",
    heading: "5-Litre Biotique Products\nfor Hotels & Resorts",
    body: "Reduce operational costs while offering your guests a premium, natural Ayurvedic experience. Our 5L bulk jars are specifically designed for high-volume hotel usage.",
    bullets: [
      "Green Apple Shampoo & Conditioner",
      "Apricot Shower Gel",
      "Orange Blossom Shampoo & Shower Gel",
      "Perfect for bulk usage & long-term savings",
    ],
    cta: "Shop Bulk Products",
    href: "/products",
    src: "https://picsum.photos/seed/bulkhotel/800/600",
  },
  {
    id: 2,
    reverse: true,
    label: "Wall-Mounted Dispensers",
    heading: "Biotique Wall Mounted\nDispensers for Bathrooms",
    body: "Compact, hygienic, and stylish — our Biotique wall-mounted dispensers are the modern solution for hotel bathrooms. Made from durable, rust-resistant materials.",
    bullets: [
      "380ml bottle capacity",
      "Rust-resistant construction",
      "Hygienic & easy to refill",
      "Ideal for hotels and resorts",
    ],
    cta: "View Dispensers",
    href: "/products",
    src: "https://picsum.photos/seed/dispenser/800/600",
  },
];

function SplitBlock({ feature }) {
  const blockRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(blockRef.current.querySelector(".sf-img"), {
        opacity: 0,
        x: feature.reverse ? 60 : -60,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: blockRef.current, start: "top 75%" },
      });
      gsap.from(blockRef.current.querySelectorAll(".sf-el"), {
        opacity: 0,
        x: feature.reverse ? -40 : 40,
        stagger: 0.1,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: blockRef.current, start: "top 75%" },
      });
    }, blockRef);
    return () => ctx.revert();
  }, [feature.reverse]);

  const imgCol = (
    <div className="sf-img h-72 md:h-130 overflow-hidden">
      <img
        src={feature.src}
        alt={feature.label}
        className="w-full h-full object-cover"
      />
    </div>
  );

  const contentCol = (
    <div className="flex flex-col justify-center space-y-5 px-8 py-12 md:px-14 lg:px-20 md:py-0">
      <span className="sf-el section-label">{feature.label}</span>
      <h2
        className="sf-el text-3xl md:text-4xl font-extrabold text-(--accent) leading-tight"
        style={{ whiteSpace: "pre-line" }}
      >
        {feature.heading}
      </h2>
      <p className="sf-el text-gray-600 text-base leading-relaxed">{feature.body}</p>

      <ul className="sf-el space-y-2.5">
        {feature.bullets.map((b) => (
          <li key={b} className="flex items-start gap-3 text-sm text-gray-600">
            <span className="w-5 h-5 rounded-full bg-(--primary) border border-(--secondary) flex items-center justify-center shrink-0 mt-0.5">
              <FaCheck className="text-[9px] text-(--secondary)" />
            </span>
            {b}
          </li>
        ))}
      </ul>

      <div className="sf-el">
        <Link
          href={feature.href}
          className="inline-flex items-center gap-2 px-7 py-3 bg-(--secondary) text-white font-bold text-sm rounded-sm hover:bg-(--accent) transition-colors shadow-md hover:shadow-lg"
        >
          {feature.cta} →
        </Link>
      </div>
    </div>
  );

  return (
    <div
      ref={blockRef}
      className="grid md:grid-cols-2 border-b border-(--border-light) last:border-0"
    >
      {feature.reverse ? (
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
  return (
    <section className="bg-white overflow-hidden">
      {features.map((f) => (
        <SplitBlock key={f.id} feature={f} />
      ))}
    </section>
  );
}
