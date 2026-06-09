"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaSearch, FaBars, FaTimes, FaChevronDown, FaFacebook, FaInstagram, FaWhatsapp, FaTruck, FaStar, FaPhone, FaGift } from "react-icons/fa";
import { FaRegUser, FaRegHeart } from "react-icons/fa";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { BsGrid3X3Gap } from "react-icons/bs";

const categories = [
  {
    name: "Bath Toiletries",
    sub: ["Soaps", "Skin Moisturizer", "Shower Gel", "Shampoos", "Conditioner"],
  },
  {
    name: "Guest Amenities",
    sub: ["Bath Loofahs", "Guest Slippers", "Dental Kits", "Hair Combs", "Sanitary Bags", "Sewing Kits", "Shaving Kits", "Shower Caps", "Vanity Kits"],
  },
  {
    name: "Housekeeping Products",
    sub: ["Air Fresheners", "Garbage Bags", "Hand Wash Sanitizers", "House Keeping Cleaners", "Kitchen Cleaners"],
  },
  { name: "Bulk Products", sub: [] },
  { name: "Custom Branding Products", sub: [] },
  { name: "Eco-Friendly Products", sub: [] },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [hoverCat, setHoverCat] = useState(0);
  const [mobileExpandCat, setMobileExpandCat] = useState(null);
  const closeTimer = useRef(null);

  const openMenu = () => {
    clearTimeout(closeTimer.current);
    setCatOpen(true);
  };
  const closeMenu = () => {
    closeTimer.current = setTimeout(() => {
      setCatOpen(false);
      setHoverCat(0);
    }, 150);
  };

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  return (
    <nav className="w-full sticky top-0 z-50 shadow-sm">

      {/* ── Announcement Bar ── */}
      <div className="bg-[var(--accent)] text-[var(--primary)] text-[11px] font-medium text-center py-1.5 px-4 overflow-hidden">
        <div className="flex items-center justify-center gap-8 whitespace-nowrap">
          <span className="flex items-center gap-1.5"><FaGift className="text-[10px]" /> Get 5% OFF on Your First Order | Use Code <strong>FIRST5</strong></span>
          <span className="hidden sm:flex items-center gap-1.5"><FaTruck className="text-[10px]" /> Free Shipping on All Orders Above ₹2,500</span>
          <span className="hidden md:flex items-center gap-1.5"><FaStar className="text-[10px]" /> Trusted by 500+ Hotels Across India</span>
          <span className="hidden lg:flex items-center gap-1.5"><FaPhone className="text-[10px]" /> Bulk Orders: 93816 53268</span>
        </div>
      </div>

      {/* ── Main Bar ── */}
      <div className="bg-white px-4 md:px-10 py-3 flex items-center justify-between gap-4 border-b border-[var(--border-light)]">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <div className="leading-tight">
            <p className="text-sm font-semibold text-[var(--text-primary-l)] tracking-wide">Hotel Guest</p>
            <p className="text-xl font-extrabold text-[var(--secondary)] tracking-tight leading-none">Supplys</p>
          </div>
        </Link>

        {/* Search */}
        <div className="hidden md:flex items-center flex-1 max-w-xl border border-[var(--border-light)] rounded-sm overflow-hidden focus-within:border-[var(--secondary)] transition-colors">
          <input
            type="text"
            placeholder="Search for anything..."
            className="w-full px-4 py-2.5 outline-none text-sm bg-white text-[var(--text-primary-l)] placeholder-gray-400"
          />
          <button className="px-4 py-2.5 bg-[var(--secondary)] text-white hover:bg-[var(--accent)] transition-colors">
            <FaSearch className="text-sm" />
          </button>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-5 text-[var(--accent)]">
          <Link href="/auth" className="flex items-center gap-1.5 group cursor-pointer">
            <FaRegUser className="text-base group-hover:text-[var(--secondary)] transition-colors" />
            <span className="text-[11px] font-medium hidden sm:block group-hover:text-[var(--secondary)] transition-colors">Account</span>
          </Link>
          <button className="flex items-center gap-1.5 group relative">
            <FaRegHeart className="text-base group-hover:text-[var(--secondary)] transition-colors" />
            <span className="text-[11px] font-medium hidden sm:block group-hover:text-[var(--secondary)] transition-colors">Wishlist</span>
            <span className="absolute -top-2 -right-3 bg-[var(--secondary)] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </button>
          <button className="flex items-center gap-1.5 group relative">
            <HiOutlineShoppingCart className="text-lg group-hover:text-[var(--secondary)] transition-colors" />
            <span className="text-[11px] font-medium hidden sm:block group-hover:text-[var(--secondary)] transition-colors">Cart</span>
            <span className="absolute -top-2 -right-3 bg-[var(--secondary)] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </button>
          <button className="md:hidden text-lg" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden bg-white px-4 pb-3 border-b border-[var(--border-light)]">
        <div className="flex items-center border border-[var(--border-light)] rounded-sm overflow-hidden">
          <input type="text" placeholder="Search..." className="w-full px-3 py-2 text-sm outline-none" />
          <button className="px-3 bg-[var(--secondary)] text-white py-2"><FaSearch className="text-sm" /></button>
        </div>
      </div>

      {/* ── Secondary Nav ── */}
      <div className="bg-[var(--primary)] px-4 md:px-10 py-2.5 flex items-center justify-between relative">

        {/* Category Mega Menu */}
        <div
          className="relative"
          onMouseEnter={openMenu}
          onMouseLeave={closeMenu}
        >
          <button className="flex items-center gap-2 text-sm font-semibold text-[var(--accent)] px-3 py-1.5 rounded-sm hover:bg-white/40 transition-colors">
            <BsGrid3X3Gap className="text-base" />
            <span>Shop by Category</span>
            <FaChevronDown className={`text-xs transition-transform duration-300 ${catOpen ? "rotate-180" : ""}`} />
          </button>

          {catOpen && (
            <div
              className="absolute top-full left-0 mt-1 bg-white shadow-xl rounded-sm z-50 flex min-w-[520px]"
              onMouseEnter={openMenu}
              onMouseLeave={closeMenu}
            >
              {/* Category List */}
              <div className="w-56 border-r border-[var(--border-light)] py-2">
                {categories.map((cat, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 px-4 py-2.5 cursor-pointer transition-colors ${
                      hoverCat === i
                        ? "bg-[var(--surface-warm)] font-semibold text-[var(--accent)]"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                    onMouseEnter={() => setHoverCat(i)}
                  >
                    {hoverCat === i && (
                      <span className="absolute left-0 w-0.5 h-8 bg-[var(--accent)] rounded-r-sm" />
                    )}
                    <span className="text-sm">{cat.name}</span>
                    {cat.sub.length > 0 && <FaChevronDown className="ml-auto text-[10px] -rotate-90 text-gray-400" />}
                  </div>
                ))}
              </div>

              {/* Subcategory Panel */}
              <div className="flex-1 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--secondary)] mb-3">
                  {categories[hoverCat].name}
                </p>
                {categories[hoverCat].sub.length > 0 ? (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                    {categories[hoverCat].sub.map((s, idx) => (
                      <Link
                        key={idx}
                        href={`/category/${s.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-sm text-gray-600 py-1.5 hover:text-[var(--accent)] hover:font-medium transition-colors border-b border-transparent hover:border-[var(--border-light)]"
                      >
                        {s}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    href={`/category/${categories[hoverCat].name.toLowerCase().replace(/\s+/g, "-")}`}
                    className="inline-block mt-2 text-sm text-[var(--secondary)] font-medium hover:text-[var(--accent)] transition-colors"
                  >
                    Browse all {categories[hoverCat].name} →
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--accent)]">
          <Link href="/about" className="hover:text-[var(--secondary)] transition-colors">About Us</Link>
          <Link href="/contact" className="hover:text-[var(--secondary)] transition-colors">Contact Us</Link>
          <Link href="/products" className="hover:text-[var(--secondary)] transition-colors">All Products</Link>
        </div>

        {/* Social */}
        <div className="hidden md:flex items-center gap-3 text-[var(--accent)] text-base">
          <FaFacebook className="cursor-pointer hover:text-[var(--secondary)] transition-colors" />
          <FaInstagram className="cursor-pointer hover:text-[var(--secondary)] transition-colors" />
          <FaWhatsapp className="cursor-pointer hover:text-[var(--secondary)] transition-colors" />
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-[var(--border-light)] z-40 shadow-lg max-h-[80vh] overflow-y-auto">
          <div className="p-4 space-y-1">
            {categories.map((cat, i) => (
              <div key={i}>
                <button
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-[var(--accent)] hover:bg-[var(--surface-warm)] rounded-sm"
                  onClick={() => setMobileExpandCat(mobileExpandCat === i ? null : i)}
                >
                  {cat.name}
                  {cat.sub.length > 0 && <FaChevronDown className={`text-xs transition-transform ${mobileExpandCat === i ? "rotate-180" : ""}`} />}
                </button>
                {mobileExpandCat === i && cat.sub.length > 0 && (
                  <div className="pl-4 pb-2 space-y-1">
                    {cat.sub.map((s, idx) => (
                      <Link key={idx} href={`/category/${s.toLowerCase().replace(/\s+/g, "-")}`} className="block text-sm text-gray-600 py-1 pl-2 border-l-2 border-[var(--border-light)] hover:border-[var(--secondary)] hover:text-[var(--accent)] transition-colors">
                        {s}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="border-t border-[var(--border-light)] pt-3 mt-2 space-y-1">
              <Link href="/about" className="block px-3 py-2 text-sm text-gray-600 hover:text-[var(--accent)]">About Us</Link>
              <Link href="/contact" className="block px-3 py-2 text-sm text-gray-600 hover:text-[var(--accent)]">Contact Us</Link>
              <Link href="/auth" className="block px-3 py-2 text-sm font-medium text-[var(--secondary)]">Login / Sign Up</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
