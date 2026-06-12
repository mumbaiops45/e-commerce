"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaSearch, FaBars, FaTimes, FaChevronDown,
  FaFacebook, FaInstagram, FaWhatsapp,
  FaTruck, FaStar, FaPhone, FaGift, FaSignOutAlt,
} from "react-icons/fa";
import { FaRegUser, FaRegHeart } from "react-icons/fa";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { BsGrid3X3Gap } from "react-icons/bs";
import { MdDashboard } from "react-icons/md";
import useAuthStore from "@/store/auth.store";
import { logoutUser } from "@/routes/auth.routes";
import useCategoryStore from "@/store/category.store";
import { useCategory } from "@/hooks/useCategory";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [hoverCat, setHoverCat] = useState(0);
  const [mobileExpandCat, setMobileExpandCat] = useState(null);
  const [slideOpen, setSlideOpen] = useState(false);

  const closeTimer = useRef(null);
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const navCategories = useCategoryStore((s) => s.categories);
  const { fetchCategories } = useCategory();

  useEffect(() => {
    fetchCategories({ limit: 20 });
  }, []);

  const openMenu = () => { clearTimeout(closeTimer.current); setCatOpen(true); };
  const closeMenu = () => {
    closeTimer.current = setTimeout(() => { setCatOpen(false); setHoverCat(0); }, 150);
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setSlideOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = slideOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [slideOpen]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  async function handleLogout() {
    try { await logoutUser(); } catch {}
    logout();
    setSlideOpen(false);
    router.push("/");
  }

  const userInitial = user?.name?.charAt(0).toUpperCase() ?? "?";
  const firstName = user?.name?.split(" ")[0] ?? "";

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

        <Link href="/" className="flex-shrink-0">
          <div className="leading-tight">
            <p className="text-sm font-semibold text-[var(--text-primary-l)] tracking-wide">Hotel Guest</p>
            <p className="text-xl font-extrabold text-[var(--secondary)] tracking-tight leading-none">Supplys</p>
          </div>
        </Link>

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

        <div className="flex items-center gap-5 text-[var(--accent)]">

          {isAuthenticated && user ? (
            <button
              onClick={() => setSlideOpen(true)}
              className="flex items-center gap-1.5 group cursor-pointer"
            >
              <span className="w-7 h-7 rounded-full bg-[var(--accent)] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 ring-2 ring-[var(--primary)] group-hover:ring-[var(--secondary)] transition-all">
                {userInitial}
              </span>
              <span className="text-[11px] font-semibold hidden sm:block max-w-[80px] truncate text-[var(--accent)] group-hover:text-[var(--secondary)] transition-colors">
                {firstName}
              </span>
              <FaChevronDown className="text-[9px] hidden sm:block text-gray-400 group-hover:text-[var(--secondary)] transition-colors" />
            </button>
          ) : (
            <Link href="/auth" className="flex items-center gap-1.5 group cursor-pointer">
              <FaRegUser className="text-base group-hover:text-[var(--secondary)] transition-colors" />
              <span className="text-[11px] font-medium hidden sm:block group-hover:text-[var(--secondary)] transition-colors">Account</span>
            </Link>
          )}

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

        <div className="relative" onMouseEnter={openMenu} onMouseLeave={closeMenu}>
          <button className="flex items-center gap-2 text-sm font-semibold text-[var(--accent)] px-3 py-1.5 rounded-sm hover:bg-white/40 transition-colors">
            <BsGrid3X3Gap className="text-base" />
            <span>Shop by Category</span>
            <FaChevronDown className={`text-xs transition-transform duration-300 ${catOpen ? "rotate-180" : ""}`} />
          </button>

          {catOpen && navCategories.length > 0 && (
            <div
              className="absolute top-full left-0 mt-1 bg-white shadow-xl rounded-sm z-50 flex min-w-[420px]"
              onMouseEnter={openMenu}
              onMouseLeave={closeMenu}
            >
              <div className="w-52 border-r border-[var(--border-light)] py-2">
                {navCategories.map((cat, i) => (
                  <div
                    key={cat._id}
                    className={`relative flex items-center gap-2 px-4 py-2.5 cursor-pointer transition-colors ${
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
                  </div>
                ))}
              </div>
              <div className="flex-1 p-5 flex flex-col justify-center">
                {navCategories[hoverCat] && (
                  <>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--secondary)] mb-3">
                      {navCategories[hoverCat].name}
                    </p>
                    {navCategories[hoverCat].image && (
                      <img
                        src={navCategories[hoverCat].image}
                        alt={navCategories[hoverCat].name}
                        className="w-full h-24 object-cover rounded-lg mb-3"
                      />
                    )}
                    {navCategories[hoverCat].description && (
                      <p className="text-xs text-gray-500 mb-3 leading-relaxed line-clamp-2">
                        {navCategories[hoverCat].description}
                      </p>
                    )}
                    <Link
                      href={`/category/${navCategories[hoverCat]._id}`}
                      className="inline-block text-sm text-[var(--secondary)] font-semibold hover:text-[var(--accent)] transition-colors"
                    >
                      Browse all {navCategories[hoverCat].name} →
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--accent)]">
          <Link href="/about" className="hover:text-[var(--secondary)] transition-colors">About Us</Link>
          <Link href="/contact" className="hover:text-[var(--secondary)] transition-colors">Contact Us</Link>
          <Link href="/products" className="hover:text-[var(--secondary)] transition-colors">All Products</Link>
        </div>

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
            {navCategories.map((cat, i) => (
              <div key={cat._id}>
                <button
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-[var(--accent)] hover:bg-[var(--surface-warm)] rounded-sm"
                  onClick={() => setMobileExpandCat(mobileExpandCat === i ? null : i)}
                >
                  {cat.name}
                  <FaChevronDown className={`text-xs transition-transform ${mobileExpandCat === i ? "rotate-180" : ""}`} />
                </button>
                {mobileExpandCat === i && (
                  <div className="pl-4 pb-2">
                    <Link
                      href={`/category/${cat._id}`}
                      className="block text-sm text-gray-600 py-1 pl-2 border-l-2 border-[var(--border-light)] hover:border-[var(--secondary)] hover:text-[var(--accent)] transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      Browse {cat.name} →
                    </Link>
                  </div>
                )}
              </div>
            ))}

            <div className="border-t border-[var(--border-light)] pt-3 mt-2 space-y-1">
              <Link href="/about" className="block px-3 py-2 text-sm text-gray-600 hover:text-[var(--accent)]">About Us</Link>
              <Link href="/contact" className="block px-3 py-2 text-sm text-gray-600 hover:text-[var(--accent)]">Contact Us</Link>

              {isAuthenticated && user ? (
                <button
                  onClick={() => { setMobileOpen(false); setSlideOpen(true); }}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2"
                >
                  <span className="w-7 h-7 rounded-full bg-[var(--accent)] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {userInitial}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[var(--accent)] truncate">{user.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                  </div>
                </button>
              ) : (
                <Link href="/auth" className="block px-3 py-2 text-sm font-medium text-[var(--secondary)]">Login / Sign Up</Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Right Slide Panel ── */}
      {slideOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            onClick={() => setSlideOpen(false)}
          />
          <div
            className="fixed top-0 right-0 h-full w-80 max-w-[92vw] bg-white z-[70] shadow-2xl flex flex-col"
            style={{ animation: "slideInFromRight 0.28s cubic-bezier(0.4,0,0.2,1)" }}
          >
            <button
              onClick={() => setSlideOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors z-10"
            >
              <FaTimes className="text-xs" />
            </button>

            {/* User header */}
            <div className="bg-[var(--accent)] px-6 pt-10 pb-8 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-white/20 text-white text-3xl font-bold flex items-center justify-center mb-4 border-2 border-white/40 ring-4 ring-white/10">
                {userInitial}
              </div>
              <p className="text-white font-bold text-lg leading-tight">{user?.name}</p>
              <p className="text-white/65 text-xs mt-1 truncate max-w-full px-2">{user?.email}</p>
              <span className="mt-3 inline-block px-3 py-1 bg-white/20 text-white text-[11px] font-bold rounded-full capitalize border border-white/20">
                {user?.role || "user"}
              </span>
            </div>

            {/* Links */}
            <div className="flex-1 py-4 px-4 space-y-1">
              <Link
                href="/account"
                onClick={() => setSlideOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold text-[var(--accent)] hover:bg-[var(--surface-warm)] transition-colors group"
              >
                <span className="w-9 h-9 rounded-lg bg-[var(--surface-warm)] group-hover:bg-[var(--primary)] flex items-center justify-center text-[var(--accent)] transition-colors flex-shrink-0">
                  <MdDashboard className="text-base" />
                </span>
                <div>
                  <p className="leading-none">Profile</p>
                  <p className="text-[11px] text-gray-400 font-normal mt-0.5">View your dashboard</p>
                </div>
              </Link>
            </div>

            {/* Logout */}
            <div className="px-4 pb-6 border-t border-[var(--border-light)] pt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-red-50 text-red-500 hover:bg-red-100 transition-colors rounded-xl text-sm font-semibold border border-red-100"
              >
                <FaSignOutAlt className="text-sm" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}

      <style jsx global>{`
        @keyframes slideInFromRight {
          from { transform: translateX(100%); opacity: 0.7; }
          to   { transform: translateX(0);    opacity: 1;   }
        }
      `}</style>
    </nav>
  );
}
