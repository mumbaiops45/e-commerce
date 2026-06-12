"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import {
  FaTruck, FaFileInvoice, FaHandshake, FaSearch,
  FaBoxes, FaHeadset, FaShieldAlt, FaUniversity,
  FaMobileAlt, FaCreditCard, FaWallet, FaCheckCircle,
  FaPhone, FaClock, FaRecycle,
} from "react-icons/fa";
import { BsStarFill } from "react-icons/bs";

const reasons = [
  {
    icon: FaTruck,
    title: "Pan-India Free Shipping",
    body: "Standard delivery in 2–5 days across India. Free shipping on all orders — no hidden charges.",
    iconBg: "#e8f5e9", iconColor: "#2d6b2d",
  },
  {
    icon: FaFileInvoice,
    title: "100% GST Compliant",
    body: "Get proper GST invoices with every order to claim your input tax credits hassle-free.",
    iconBg: "#fff3e0", iconColor: "#e65100",
  },
  {
    icon: BsStarFill,
    title: "Hospitality-Focused",
    body: "Every product is curated specifically for hotels, resorts, villas, and boutique stays.",
    iconBg: "#fce4ec", iconColor: "#c62828",
  },
  {
    icon: FaSearch,
    title: "Transparent Pricing",
    body: "We source directly from trusted manufacturers — no middlemen, consistently competitive rates.",
    iconBg: "#e3f2fd", iconColor: "#1565c0",
  },
  {
    icon: FaBoxes,
    title: "Bulk Order Support",
    body: "Easy ordering for multi-room, multi-property, and recurring supply requirements.",
    iconBg: "#f3e5f5", iconColor: "#6a1b9a",
  },
  {
    icon: FaHandshake,
    title: "Minimum ₹2,500 Only",
    body: "A low minimum order of just ₹2,500 to checkout. Mix products to meet the threshold.",
    iconBg: "#e8f5e9", iconColor: "#2e7d32",
  },
  {
    icon: FaRecycle,
    title: "Eco-Friendly Options",
    body: "Ayurvedic and botanical formulas with minimal environmental impact — right for your guests and the planet.",
    iconBg: "#e0f2f1", iconColor: "#00695c",
  },
  {
    icon: FaClock,
    title: "Fast Order Processing",
    body: "Priority handling for bulk and repeat orders. Shipment tracking provided after dispatch.",
    iconBg: "#fff8e1", iconColor: "#f57f17",
  },
  {
    icon: FaHeadset,
    title: "Dedicated Support",
    body: "Our hospitality-focused support team is available to help you pick the right products at the best price.",
    iconBg: "#fce4ec", iconColor: "#ad1457",
  },
];

const paymentMethods = [
  { icon: FaMobileAlt, name: "UPI", sub: "GPay · PhonePe · Paytm" },
  { icon: FaCreditCard, name: "Cards", sub: "Visa · Mastercard · RuPay" },
  { icon: FaUniversity, name: "Net Banking", sub: "All major banks" },
  { icon: FaWallet, name: "Wallets", sub: "Amazon Pay & more" },
];

export default function WhyChooseUs() {
  const sectionRef = useRef(null);
  const trustRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".wcu-heading", {
        opacity: 0, y: 30, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
      gsap.from(".wcu-card", {
        opacity: 0, y: 30, stagger: 0.07, duration: 0.55, ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
    }, sectionRef);
    const ctx2 = gsap.context(() => {
      gsap.from(".trust-el", {
        opacity: 0, y: 25, stagger: 0.1, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: trustRef.current, start: "top 80%" },
      });
    }, trustRef);
    return () => { ctx.revert(); ctx2.revert(); };
  }, []);

  return (
    <>
      {/* ── Why Choose Us ── */}
      <section ref={sectionRef} className="py-16 px-4 md:px-10 lg:px-16 bg-(--surface-warm)">
        <div className="max-w-7xl mx-auto">

          <div className="wcu-heading text-center mb-12">
            <span className="section-label">Why Us</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-(--accent) mt-1">
              Why We Are India&apos;s Preferred Hotel Supply Partner
            </h2>
            <p className="text-gray-500 text-sm mt-3 max-w-xl mx-auto">
              Essential supplies, exceptional service — curated exclusively for hospitality.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {reasons.map((r) => (
              <div
                key={r.title}
                className="wcu-card relative overflow-hidden bg-white p-6 border border-(--border-light) hover:shadow-lg transition-shadow duration-300 group"
              >
                {/* Hover fill sweep */}
                <span className="absolute inset-0 bg-(--secondary) w-0 group-hover:w-full transition-all duration-500 ease-out z-0" />

                <div
                  className="relative z-10 w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: r.iconBg }}
                >
                  <r.icon style={{ color: r.iconColor }} className="text-lg" />
                </div>
                <h3 className="relative z-10 font-bold text-(--accent) group-hover:text-white text-base mb-1.5 transition-colors duration-300">{r.title}</h3>
                <p className="relative z-10 text-sm text-gray-500 group-hover:text-white/85 leading-relaxed transition-colors duration-300">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Secure Payment + Support ── */}
      <section ref={trustRef} className="py-16 px-4 md:px-10 lg:px-16 bg-white border-t border-(--border-light)">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">

          {/* Secure Payments */}
          <div className="trust-el bg-(--surface-warm) rounded-2xl p-8 border border-(--border-light)">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-(--primary) border border-(--secondary)/30 flex items-center justify-center">
                <FaShieldAlt className="text-(--secondary) text-xl" />
              </div>
              <div>
                <h3 className="font-extrabold text-(--accent) text-lg">100% Secure Payment</h3>
                <p className="text-xs text-gray-500">Multiple trusted payment options</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((m) => (
                <div key={m.name} className="flex items-center gap-3 bg-white rounded-xl p-3.5 border border-(--border-light) shadow-sm">
                  <div className="w-9 h-9 rounded-lg bg-(--primary) flex items-center justify-center flex-shrink-0">
                    <m.icon className="text-(--secondary) text-base" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-(--accent)">{m.name}</p>
                    <p className="text-[10px] text-gray-400">{m.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-5 text-xs text-gray-500">
              <FaCheckCircle className="text-green-500" />
              <span>All transactions are SSL encrypted and 100% secure</span>
            </div>
          </div>

          {/* Customer Support */}
          <div className="trust-el bg-(--accent) rounded-2xl p-8 text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <FaHeadset className="text-white text-xl" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl">Dedicated Customer Support</h3>
                <p className="text-xs text-white/70">Expert assistance for hospitality buyers</p>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                "Assistance for hotels & commercial buyers",
                "Bulk order & repeat order support",
                "Reliable after-sales service",
                "Quick order processing & priority handling",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/85">
                  <FaCheckCircle className="text-white/60 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-(--primary) text-(--accent) font-bold text-sm rounded-sm hover:bg-white transition-colors"
              >
                Contact Now
              </Link>
              <a
                href="tel:9381653268"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold text-sm rounded-sm border border-white/30 hover:bg-white/20 transition-colors"
              >
                <FaPhone className="text-xs" /> 93816 53268
              </a>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 mt-6 border-t border-white/20 pt-5">
              {["500+ Hotels", "Pan-India Delivery", "GST Invoices", "Bulk Pricing"].map((b) => (
                <span key={b} className="text-[11px] bg-white/10 border border-white/20 text-white/80 px-3 py-1 rounded-full">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
