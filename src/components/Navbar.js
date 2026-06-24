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
import { useAuth } from "@/hooks/useAuth";
import useAuthStore from "@/store/auth.store";
import useCategoryStore from "@/store/category.store";
import { useCategory } from "@/hooks/useCategory";
import useCartStore from "@/store/cart.store";
import { useCart } from "@/hooks/useCart";
import useWishlistStore from "@/store/wishlist.store";
import { useWishlist } from "@/hooks/useWishlist";
import { useShipping } from "@/hooks/useShipping";
import { useCoupon } from "@/hooks/useCoupon";
import useShippingStore from "@/store/shipping.store";
import useCouponStore from "@/store/coupon.store";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [hoverCat, setHoverCat] = useState(0);
  const [mobileExpandCat, setMobileExpandCat] = useState(null);
  const [slideOpen, setSlideOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [tickerIndex, setTickerIndex] = useState(0);
  const [tickerFade, setTickerFade] = useState(true);

  const tickerTimer = useRef(null);
  const closeTimer = useRef(null);
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { logout } = useAuth();

  const navCategories = useCategoryStore((s) => s.categories);
  const { fetchCategories } = useCategory();
  const cartItems = useCartStore((s) => s.items);
  const { fetchCart } = useCart();
  const wishlistItems = useWishlistStore((s) => s.items);
  const { fetchWishlist } = useWishlist();

  const shippingConfig = useShippingStore((s) => s.config);
  const { fetchShipping } = useShipping();
  const coupons = useCouponStore((s) => s.coupons);
  const { fetchCoupons } = useCoupon();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;
  const isUser = user?.role === "user";

  useEffect(() => {
    fetchCategories({ limit: 20 });
    fetchShipping().catch(() => {});
    fetchCoupons().catch(() => {});
  }, []);

  useEffect(() => {
    if (isAuthenticated && isUser) { fetchCart(); fetchWishlist(); }
  }, [isAuthenticated]);

  const announcementMessages = (() => {
    const msgs = [];
    const now = new Date();

    const activeCoupon = coupons
      .filter((c) => c.isActive && new Date(c.expiresAt) > now && c.usedCount < c.useLimit)
      .sort((a, b) => {
        const aVal = a.discountType === "fixed" ? a.discountValue : a.discountValue * 10;
        const bVal = b.discountType === "fixed" ? b.discountValue : b.discountValue * 10;
        return bVal - aVal;
      })[0];

    if (activeCoupon) {
      const offerText =
        activeCoupon.discountType === "fixed"
          ? `₹${activeCoupon.discountValue} OFF`
          : `${activeCoupon.discountValue}% OFF`;
      msgs.push({
        icon: <FaGift className="text-[10px]" />,
        text: (
          <>
            Get {offerText} | Use Code <strong>{activeCoupon.code}</strong>
            {activeCoupon.minimumOrderAmount > 0 && (
              <> on orders above ₹{activeCoupon.minimumOrderAmount.toLocaleString()}</>
            )}
          </>
        ),
      });
    } else {
      msgs.push({
        icon: <FaGift className="text-[10px]" />,
        text: <>Get 5% OFF on Your First Order | Use Code <strong>FIRST5</strong></>,
      });
    }

    if (shippingConfig?.freeShippingAbove > 0) {
      msgs.push({
        icon: <FaTruck className="text-[10px]" />,
        text: (
          <>
            Free Shipping on All Orders Above{" "}
            <strong>₹{shippingConfig.freeShippingAbove.toLocaleString()}</strong>
          </>
        ),
      });
    } else {
      msgs.push({
        icon: <FaTruck className="text-[10px]" />,
        text: <>Free Shipping on All Orders Above ₹2,500</>,
      });
    }

    msgs.push({
      icon: <FaStar className="text-[10px]" />,
      text: <>Trusted by 500+ Hotels Across India</>,
    });

    msgs.push({
      icon: <FaPhone className="text-[10px]" />,
      text: <>Bulk Orders: <strong>93816 53268</strong></>,
    });

    return msgs;
  })();

  useEffect(() => {
    if (announcementMessages.length <= 1) return;
    tickerTimer.current = setInterval(() => {
      setTickerFade(false);
      setTimeout(() => {
        setTickerIndex((prev) => (prev + 1) % announcementMessages.length);
        setTickerFade(true);
      }, 300);
    }, 3500);
    return () => clearInterval(tickerTimer.current);
  }, [announcementMessages.length]);

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

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchInput.trim();
    router.push(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
  };

  async function handleLogout() {
    logout();
    setSlideOpen(false);
    router.push("/");
  }

  const userInitial = user?.name?.charAt(0).toUpperCase() ?? "?";
  const firstName = user?.name?.split(" ")[0] ?? "";
  const currentMsg = announcementMessages[tickerIndex];

  return (
    <nav className="w-full sticky top-0 z-50 shadow-sm">

      {/* ── Announcement Bar ── */}
      <div className="bg-[var(--accent)] text-[var(--primary)] text-[11px] font-medium text-center py-1.5 px-4 overflow-hidden">

        {/* Mobile: fade ticker */}
        <div className="flex md:hidden items-center justify-center gap-2 min-h-[18px]">
          <span
            className="flex items-center gap-1.5 transition-opacity duration-300"
            style={{ opacity: tickerFade ? 1 : 0 }}
          >
            {currentMsg?.icon}
            <span>{currentMsg?.text}</span>
          </span>
          <div className="flex gap-1 ml-2">
            {announcementMessages.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setTickerFade(false);
                  setTimeout(() => { setTickerIndex(i); setTickerFade(true); }, 300);
                }}
                className="w-1 h-1 rounded-full transition-all"
                style={{ background: i === tickerIndex ? "var(--primary)" : "rgba(255,255,255,0.35)" }}
                aria-label={`Announcement ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop: all inline */}
        <div className="hidden md:flex items-center justify-center gap-8 whitespace-nowrap">
          {announcementMessages.map((msg, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {msg.icon}
              {msg.text}
            </span>
          ))}
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

        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center flex-1 max-w-xl border border-[var(--border-light)] rounded-sm overflow-hidden focus-within:border-[var(--secondary)] transition-colors"
        >
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for anything..."
            className="w-full px-4 py-2.5 outline-none text-sm bg-white text-[var(--text-primary-l)] placeholder-gray-400"
          />
          <button type="submit" className="px-4 py-2.5 bg-[var(--secondary)] text-white hover:bg-[var(--accent)] transition-colors">
            <FaSearch className="text-sm" />
          </button>
        </form>

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

          <button onClick={() => router.push("/wishlist")} className="flex items-center gap-1.5 group relative">
            <FaRegHeart className="text-base group-hover:text-[var(--secondary)] transition-colors" />
            <span className="text-[11px] font-medium hidden sm:block group-hover:text-[var(--secondary)] transition-colors">Wishlist</span>
            {isUser && wishlistCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-[var(--secondary)] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </button>

          <button className="flex items-center gap-1.5 group relative" onClick={() => router.push("/user/dashboard?tab=cart")}>
            <HiOutlineShoppingCart className="text-lg group-hover:text-[var(--secondary)] transition-colors" />
            <span className="text-[11px] font-medium hidden sm:block group-hover:text-[var(--secondary)] transition-colors">Cart</span>
            {isUser && cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-[var(--secondary)] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          <button className="md:hidden text-lg" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* ── Mobile Search ── */}
      <div className="md:hidden bg-white px-4 pb-3 border-b border-[var(--border-light)]">
        <form onSubmit={handleSearch} className="flex items-center border border-(--border-light) rounded-sm overflow-hidden">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search..."
            className="w-full px-3 py-2 text-sm outline-none"
          />
          <button type="submit" className="px-3 bg-(--secondary) text-white py-2">
            <FaSearch className="text-sm" />
          </button>
        </form>
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
              className="absolute top-full left-0 mt-1 bg-white shadow-xl rounded-sm z-50 flex min-w-[220px]"
              onMouseEnter={openMenu}
              onMouseLeave={closeMenu}
            >
              <div className="w-full border-r border-[var(--border-light)] py-2">
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

            <div className="flex-1 py-4 px-4 space-y-1">
              <Link
                href={
                  user?.role === "superadmin"
                    ? "/superadmin/dashboard"
                    : user?.role === "admin"
                    ? "/admin/dashboard"
                    : "/user/dashboard"
                }
                onClick={() => setSlideOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold text-[var(--accent)] hover:bg-[var(--surface-warm)] transition-colors group"
              >
                <span className="w-9 h-9 rounded-lg bg-[var(--surface-warm)] group-hover:bg-[var(--primary)] flex items-center justify-center text-[var(--accent)] transition-colors flex-shrink-0">
                  <MdDashboard className="text-base" />
                </span>
                <div>
                  <p className="leading-none">Dashboard</p>
                  <p className="text-[11px] text-gray-400 font-normal mt-0.5 capitalize">{user?.role || "user"} panel</p>
                </div>
              </Link>
            </div>

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

    </nav>
  );
}