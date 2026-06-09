"use client";

import { FaTruck, FaShieldAlt, FaStar, FaTag, FaPhone, FaLeaf, FaCheckCircle, FaGift } from "react-icons/fa";

const items = [
  { icon: FaGift, text: "5% OFF First Order · Use Code FIRST5" },
  { icon: FaTruck, text: "Free Shipping on All Orders" },
  { icon: FaStar, text: "Trusted by 500+ Hotels Across India" },
  { icon: FaLeaf, text: "100% Ayurvedic & Eco-Friendly Products" },
  { icon: FaTag, text: "Custom Branding Available on All Kits" },
  { icon: FaShieldAlt, text: "100% GST Compliant Invoices" },
  { icon: FaCheckCircle, text: "Minimum Order Only ₹2,500" },
  { icon: FaPhone, text: "Contact Us for Bulk Orders & Special Pricing" },
];

export default function PromoStrip() {
  return (
    <div className="bg-(--secondary) text-(--primary) py-2.5 overflow-hidden relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-linear-to-r from-(--secondary) to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-(--secondary) to-transparent z-10 pointer-events-none" />

      <div className="flex whitespace-nowrap animate-marquee">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-8 text-xs font-semibold tracking-wide">
            <item.icon className="text-sm flex-shrink-0 opacity-80" />
            <span>{item.text}</span>
            <span className="text-white/40 ml-4">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
