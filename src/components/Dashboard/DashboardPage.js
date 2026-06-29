"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/auth.store";
import { useAuth } from "@/hooks/useAuth";
import useCategoryStore from "@/store/category.store";
import useProductStore from "@/store/product.store";
import useCartStore from "@/store/cart.store";
import { useCategory } from "@/hooks/useCategory";
import { useProduct } from "@/hooks/useProduct";
import { useCart } from "@/hooks/useCart";
import {
  FaUser, FaBoxOpen, FaShoppingCart, FaHeart, FaCog, FaBars, FaTimes,
  FaPlus, FaEdit, FaTrash, FaEye, FaChevronDown, FaSignOutAlt,
  FaTag, FaCheck, FaImage, FaTruck, FaExclamationTriangle, FaList,
  FaUsers, FaUserShield, FaSearch, FaBan, FaUnlock, FaPercent, FaClipboard,
  FaChartLine, FaRupeeSign, FaShoppingBag, FaArrowUp, FaArrowDown,
  FaBoxes, FaUserPlus,
} from "react-icons/fa";
import api from "@/lib/axios";
import { getMyOrders, getAllOrdersAdmin, updateOrder } from "@/routes/order.routes";
import { createPaymentOrder, verifyPayment } from "@/routes/payment.routes";
import useCouponStore from "@/store/coupon.store";
import { useCoupon } from "@/hooks/useCoupon";
import useWishlistStore from "@/store/wishlist.store";
import { useWishlist } from "@/hooks/useWishlist";
import useBannerStore from "@/store/banner.store";
import { useBanner } from "@/hooks/useBanner";
import useShippingStore from "@/store/shipping.store";
import { useShipping } from "@/hooks/useShipping";
import useAnalyticsStore from "@/store/analytics.store";
import { useAnalytics } from "@/hooks/useAnalytics";

const isAdminRole = (role) => role === "admin" || role === "superadmin";

// ─── Sidebar ──────────────────────────────────────────────────
function Sidebar({ user, activeTab, onTabChange, onLogout, mobileOpen, onMobileClose }) {
  const [prodOpen, setProdOpen] = useState(
    activeTab === "manage-products" || activeTab === "create-product"
  );
  const [catOpen, setCatOpen] = useState(
    activeTab === "manage-categories" || activeTab === "create-category"
  );
  const isAdmin = isAdminRole(user?.role);

  const NavItem = ({ id, icon, label, indent = false }) => (
    <button
      onClick={() => { onTabChange(id); onMobileClose(); }}
      className={`w-full flex items-center gap-3 rounded-lg text-sm transition-all ${indent ? "pl-10 pr-4 py-2" : "px-4 py-2.5"
        } ${activeTab === id
          ? "bg-(--accent) text-white font-semibold"
          : "text-gray-600 hover:bg-(--surface-warm) hover:text-(--accent)"
        }`}
    >
      {icon}
      {label}
    </button>
  );

  const GroupToggle = ({ open, onToggle, icon, label }) => (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-(--surface-warm) hover:text-(--accent) rounded-lg transition-all"
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      <FaChevronDown className={`text-[10px] transition-transform ${open ? "rotate-180" : ""}`} />
    </button>
  );

  const content = (
    <>
      {/* User info */}
      <div className="bg-(--accent) px-4 py-6 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-white/20 text-white text-2xl font-bold flex items-center justify-center mb-3 border-2 border-white/40">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <p className="text-white font-bold text-sm leading-tight line-clamp-1 px-2">{user?.name}</p>
        <p className="text-white/65 text-xs mt-0.5 truncate max-w-full px-2">{user?.email}</p>
        <span className="mt-2 px-3 py-0.5 bg-white/20 text-white text-[11px] font-bold rounded-full capitalize border border-white/20">
          {user?.role || "user"}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <NavItem id="profile" icon={<FaUser className="text-xs shrink-0" />} label="Profile" />

        {isAdmin && (
          <>
            <div className="pt-3 pb-1 px-1">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Management</p>
            </div>

            {user?.role === "superadmin" && (
              <NavItem id="analytics" icon={<FaChartLine className="text-xs shrink-0" />} label="Analytics" />
            )}

            <GroupToggle
              open={prodOpen}
              onToggle={() => setProdOpen((p) => !p)}
              icon={<FaBoxOpen className="text-xs shrink-0" />}
              label="Products"
            />
            {prodOpen && (
              <div className="space-y-0.5">
                <NavItem id="manage-products" indent icon={<FaList className="text-xs shrink-0" />} label="Manage Products" />
                <NavItem id="create-product" indent icon={<FaPlus className="text-xs shrink-0" />} label="Create Product" />
              </div>
            )}

            <GroupToggle
              open={catOpen}
              onToggle={() => setCatOpen((p) => !p)}
              icon={<FaTag className="text-xs shrink-0" />}
              label="Categories"
            />
            {catOpen && (
              <div className="space-y-0.5">
                <NavItem id="manage-categories" indent icon={<FaList className="text-xs shrink-0" />} label="Manage Categories" />
                <NavItem id="create-category" indent icon={<FaPlus className="text-xs shrink-0" />} label="Create Category" />
              </div>
            )}

            {user?.role === "superadmin" && (
              <>
                <NavItem id="orders" icon={<FaTruck className="text-xs shrink-0" />} label="Orders" />
                <NavItem id="user-management" icon={<FaUsers className="text-xs shrink-0" />} label="Users" />
                <NavItem id="admin-management" icon={<FaUserShield className="text-xs shrink-0" />} label="Admins" />
                <NavItem id="manage-coupons" icon={<FaPercent className="text-xs shrink-0" />} label="Manage Coupons" />
                <NavItem id="manage-banners" icon={<FaImage className="text-xs shrink-0" />} label="Banners" />
                <NavItem id="manage-shipping" icon={<FaTruck className="text-xs shrink-0" />} label="Shipping Config" />
              </>
            )}

            {user?.role === "admin" && (
              <NavItem id="orders" icon={<FaTruck className="text-xs shrink-0" />} label="Orders" />
            )}
          </>
        )}

        {!isAdmin && (
          <>
            <NavItem id="orders" icon={<FaBoxOpen className="text-xs shrink-0" />} label="My Orders" />
            <NavItem id="cart" icon={<FaShoppingCart className="text-xs shrink-0" />} label="Cart" />
            <NavItem id="wishlist" icon={<FaHeart className="text-xs shrink-0" />} label="Wishlist" />
            <NavItem id="coupons" icon={<FaPercent className="text-xs shrink-0" />} label="Coupons" />
          </>
        )}

        <div className="pt-3 pb-1 px-1">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Account</p>
        </div>
        <NavItem id="settings" icon={<FaCog className="text-xs shrink-0" />} label="Settings" />

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-all mt-1"
        >
          <FaSignOutAlt className="text-xs shrink-0" /> Logout
        </button>
      </nav>
    </>
  );

  return (
    <>
      <aside className="hidden md:flex w-64 shrink-0 bg-white border-r border-(--border-light) flex-col h-screen sticky top-0 overflow-y-auto">
        {content}
      </aside>
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onMobileClose} />
          <aside className="fixed top-0 left-0 h-full w-64 bg-white z-50 flex flex-col md:hidden overflow-hidden">
            <button onClick={onMobileClose} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 z-10">
              <FaTimes className="text-xs" />
            </button>
            {content}
          </aside>
        </>
      )}
    </>
  );
}

// ─── Modal shell ──────────────────────────────────────────────
function Modal({ title, onClose, children, wide = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${wide ? "max-w-2xl" : "max-w-md"} max-h-[90vh] overflow-y-auto z-10`}>
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-(--border-light) bg-white z-10">
          <h3 className="font-bold text-(--accent) text-lg">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><FaTimes /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────
function Toast({ message }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-600 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-lg animate-fade-in">
      <FaCheck className="text-xs" /> {message}
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────
function SectionHeader({ title, count, buttonLabel, onAction }) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-(--border-light) px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-lg sm:text-xl font-bold text-(--accent) truncate">{title}</h2>
        {count !== undefined && (
          <p className="text-xs text-gray-500 mt-0.5">{count} {count === 1 ? "item" : "items"} total</p>
        )}
      </div>
      {buttonLabel && (
        <button onClick={onAction} className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-(--accent) text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-(--secondary) transition-colors shadow-sm shrink-0">
          <FaPlus className="text-xs" /> {buttonLabel}
        </button>
      )}
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────
function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-3 mt-5">
      <button onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1}
        className="px-4 py-1.5 text-xs font-semibold border border-(--border-light) rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40">
        ← Prev
      </button>
      <span className="text-sm text-gray-500 font-medium">Page {page} of {totalPages}</span>
      <button onClick={() => onPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
        className="px-4 py-1.5 text-xs font-semibold border border-(--border-light) rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40">
        Next →
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// ─── ANALYTICS TAB ───────────────────────────────────────────
// ════════════════════════════════════════════════════════════

// ── Mini sparkline (pure SVG, no deps) ───────────────────────
function Sparkline({ data = [], color = "#b13124", height = 40 }) {
  if (!data.length) return null;
  const vals = data.map((d) => d.revenue || 0);
  const max = Math.max(...vals, 1);
  const min = Math.min(...vals);
  const range = max - min || 1;
  const w = 120;
  const h = height;
  const pts = vals
    .map((v, i) => {
      const x = (i / (vals.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ── Bar chart for monthly revenue ────────────────────────────
function MonthlyBarChart({ data = [] }) {
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const maxVal = Math.max(...data.map((d) => d.revenue || 0), 1);
  const w = 500;
  const h = 160;
  const barW = Math.floor((w - 20) / 12) - 4;
  const gap = Math.floor((w - 20) / 12);

  return (
    <svg viewBox={`0 0 ${w} ${h + 24}`} width="100%" style={{ overflow: "visible" }}>
      {/* y-axis guide lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const y = h - t * (h - 16) - 8;
        return (
          <line key={t} x1="0" y1={y} x2={w} y2={y}
            stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
        );
      })}
      {/* bars */}
      {Array.from({ length: 12 }, (_, i) => {
        const entry = data.find((d) => d._id?.month === i + 1);
        const val = entry?.revenue || 0;
        const barH = Math.max((val / maxVal) * (h - 16), 2);
        const x = 10 + i * gap;
        const y = h - barH - 8;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH}
              rx="3" fill="var(--accent)" opacity="0.85" />
            <text x={x + barW / 2} y={h + 16} textAnchor="middle"
              fontSize="9" fill="#6b7280">{MONTHS[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Donut chart for order status ──────────────────────────────
function DonutChart({ data = [], total }) {
  const STATUS_COLORS = {
    pending: "#f59e0b",
    processing: "#3b82f6",
    shipped: "#8b5cf6",
    delivered: "#22c55e",
    cancelled: "#ef4444",
  };
  const radius = 70;
  const cx = 90;
  const cy = 90;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const slices = data.map((item) => {
    const pct = parseFloat(item.percentage) / 100;
    const dash = pct * circumference;
    const gap = circumference - dash;
    const slice = { ...item, dash, gap, offset, color: STATUS_COLORS[item.status] || "#9ca3af" };
    offset += dash;
    return slice;
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <svg width="180" height="180" viewBox="0 0 180 180" className="shrink-0">
        {slices.map((s, i) => (
          <circle key={i} cx={cx} cy={cy} r={radius}
            fill="none" stroke={s.color} strokeWidth="28"
            strokeDasharray={`${s.dash} ${s.gap}`}
            strokeDashoffset={-s.offset}
            style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
          />
        ))}
        <text x={cx} y={cy - 8} textAnchor="middle" fontSize="22" fontWeight="800" fill="var(--accent)">{total?.toLocaleString()}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fill="#6b7280">Total Orders</text>
      </svg>
      <div className="flex flex-col gap-2 flex-1 w-full">
        {data.map((item) => (
          <div key={item.status} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: STATUS_COLORS[item.status] || "#9ca3af" }} />
              <span className="text-xs capitalize text-gray-600 font-medium">{item.status}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${item.percentage}%`, background: STATUS_COLORS[item.status] || "#9ca3af" }} />
              </div>
              <span className="text-xs font-bold text-(--accent) w-10 text-right">{item.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Revenue line chart (last 30 days) ────────────────────────
function RevenueLineChart({ data = [] }) {
  if (!data.length) return <div className="flex items-center justify-center h-32 text-gray-400 text-sm">No data</div>;

  const vals = data.map((d) => d.revenue || 0);
  const labels = data.map((d) => d._id?.slice(5) || ""); // MM-DD
  const max = Math.max(...vals, 1);
  const w = 500;
  const h = 120;

  const pts = vals.map((v, i) => {
    const x = (i / Math.max(vals.length - 1, 1)) * (w - 20) + 10;
    const y = h - (v / max) * (h - 16) - 8;
    return [x, y];
  });

  const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
  const areaD = `${pathD} L ${pts[pts.length - 1][0]} ${h} L ${pts[0][0]} ${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h + 20}`} width="100%" style={{ overflow: "visible" }}>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const y = h - t * (h - 16) - 8;
        return <line key={t} x1="10" y1={y} x2={w - 10} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />;
      })}
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#areaGrad)" />
      <path d={pathD} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => {
        if (i % Math.max(Math.floor(pts.length / 6), 1) !== 0) return null;
        return (
          <text key={i} x={p[0]} y={h + 16} textAnchor="middle" fontSize="8" fill="#9ca3af">{labels[i]}</text>
        );
      })}
    </svg>
  );
}

// ── Stat card ────────────────────────────────────────────────
function StatCard({ title, value, icon, color = "bg-blue-50 text-blue-500", trend }) {
  return (
    <div className="bg-white rounded-2xl border border-(--border-light) p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 font-medium">{title}</p>
        <p className="text-xl font-extrabold text-(--accent) mt-0.5 truncate">{value}</p>
        {trend !== undefined && (
          <p className={`text-[11px] font-semibold mt-0.5 flex items-center gap-1 ${trend >= 0 ? "text-green-600" : "text-red-500"}`}>
            {trend >= 0 ? <FaArrowUp className="text-[9px]" /> : <FaArrowDown className="text-[9px]" />}
            {Math.abs(trend)}% vs last period
          </p>
        )}
      </div>
    </div>
  );
}

// ── Chart card wrapper ───────────────────────────────────────
function ChartCard({ title, children, action }) {
  return (
    <div className="bg-white rounded-2xl border border-(--border-light) overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-(--border-light)">
        <h3 className="text-sm font-bold text-(--accent)">{title}</h3>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ── Analytics skeleton ───────────────────────────────────────
function AnalyticsSkeleton() {
  return (
    <div className="px-4 sm:px-6 py-6 space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-52 bg-gray-100 rounded-2xl animate-pulse" />)}
      </div>
    </div>
  );
}

// ── Main Analytics Tab ───────────────────────────────────────
function AnalyticsTab() {
  const analytics = useAnalyticsStore((s) => s.analytics);
  const loading = useAnalyticsStore((s) => s.loading);
  const { fetchAnalytics } = useAnalytics();

  useEffect(() => { fetchAnalytics(); }, []);

  const SC = {
    pending: "bg-amber-100 text-amber-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-600",
  };

  const fmtCurrency = (n) =>
    n >= 100000
      ? `₹${(n / 100000).toFixed(1)}L`
      : n >= 1000
      ? `₹${(n / 1000).toFixed(1)}K`
      : `₹${(n || 0).toLocaleString()}`;

  return (
    <div>
      <SectionHeader title="Analytics Overview" />

      {loading ? (
        <AnalyticsSkeleton />
      ) : !analytics ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <FaChartLine className="text-4xl mb-3" />
          <p className="font-semibold text-gray-600">Failed to load analytics</p>
          <button onClick={fetchAnalytics} className="mt-4 px-5 py-2 bg-(--accent) text-white text-sm font-semibold rounded-lg hover:bg-(--secondary) transition-colors">
            Retry
          </button>
        </div>
      ) : (
        <div className="px-4 sm:px-6 py-6 space-y-6 max-w-6xl">

          {/* ── KPI stat cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Revenue"
              value={fmtCurrency(analytics.totalRevenue)}
              icon={<FaRupeeSign />}
              color="bg-green-50 text-green-600"
            />
            <StatCard
              title="Total Orders"
              value={analytics.totalOrders?.toLocaleString()}
              icon={<FaShoppingBag />}
              color="bg-blue-50 text-blue-500"
            />
            <StatCard
              title="Total Users"
              value={analytics.totalUsers?.toLocaleString()}
              icon={<FaUsers />}
              color="bg-purple-50 text-purple-500"
            />
            <StatCard
              title="Total Products"
              value={analytics.totalProducts?.toLocaleString()}
              icon={<FaBoxes />}
              color="bg-amber-50 text-amber-500"
            />
          </div>

          {/* ── Secondary stat cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              title="New Users This Month"
              value={analytics.newUserThisMonth?.toLocaleString()}
              icon={<FaUserPlus />}
              color="bg-rose-50 text-rose-500"
            />
            <StatCard
              title="Avg. Order Value"
              value={fmtCurrency(analytics.avgOrderResult)}
              icon={<FaChartLine />}
              color="bg-teal-50 text-teal-500"
            />
            <StatCard
              title="Revenue (30 Days)"
              value={fmtCurrency(analytics.revenueLast30Days?.reduce((s, d) => s + d.revenue, 0) || 0)}
              icon={<FaRupeeSign />}
              color="bg-indigo-50 text-indigo-500"
            />
          </div>

          {/* ── Charts row 1 ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Revenue last 30 days */}
            <ChartCard title="Revenue — Last 30 Days">
              <div className="mb-3">
                <p className="text-2xl font-extrabold text-(--accent)">
                  {fmtCurrency(analytics.revenueLast30Days?.reduce((s, d) => s + d.revenue, 0) || 0)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Paid orders only</p>
              </div>
              <RevenueLineChart data={analytics.revenueLast30Days || []} />
            </ChartCard>

            {/* Order status distribution */}
            <ChartCard title="Order Status Distribution">
              <DonutChart
                data={analytics.distributionInPercentage || []}
                total={analytics.totalOrders}
              />
            </ChartCard>
          </div>

          {/* ── Charts row 2 ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Monthly revenue bar chart */}
            <ChartCard title="Monthly Revenue" action={
              <span className="text-xs text-gray-400 font-medium">Last 12 months</span>
            }>
              <MonthlyBarChart data={analytics.monthlyRevenue || []} />
            </ChartCard>

            {/* Top selling products */}
            <ChartCard title="Top Selling Products" action={
              <span className="text-xs font-semibold text-(--secondary)">By quantity</span>
            }>
              {(analytics.topSellingProduct || []).length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No sales data yet</p>
              ) : (
                <div className="space-y-3">
                  {analytics.topSellingProduct.map((p, i) => {
                    const maxQty = analytics.topSellingProduct[0]?.soldQuantity || 1;
                    const pct = Math.round((p.soldQuantity / maxQty) * 100);
                    return (
                      <div key={p._id} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-(--surface-warm) text-[11px] font-extrabold text-(--accent) flex items-center justify-center shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-semibold text-(--accent) truncate max-w-[160px]">{p.name}</p>
                            <div className="flex items-center gap-3 shrink-0 ml-2">
                              <span className="text-xs text-gray-500">{p.soldQuantity} sold</span>
                              <span className="text-xs font-bold text-green-700">{fmtCurrency(p.revenue)}</span>
                            </div>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <div className="h-full rounded-full bg-(--accent)" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ChartCard>
          </div>

          {/* ── Tables row ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Recent orders */}
            <ChartCard title="Recent Orders">
              {(analytics.recentOrders || []).length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No orders yet</p>
              ) : (
                <div className="space-y-3">
                  {analytics.recentOrders.map((order) => (
                    <div key={order._id} className="flex items-center gap-3 py-2 border-b border-(--border-light) last:border-0">
                      <div className="w-8 h-8 rounded-full bg-(--accent) text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {order.user?.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-(--accent) truncate">{order.user?.name || "—"}</p>
                        <p className="text-[11px] text-gray-400">
                          #{order._id.slice(-8).toUpperCase()} ·{" "}
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-xs font-bold text-(--accent)">₹{order.totalAmount?.toLocaleString()}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold capitalize ${SC[order.orderStatus] || "bg-gray-100 text-gray-600"}`}>
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ChartCard>

            {/* Low stock products */}
            <ChartCard title="Low Stock Products">
              {(analytics.lowStockProduct || []).length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No low stock products</p>
              ) : (
                <div className="space-y-3">
                  {analytics.lowStockProduct.map((p) => {
                    const level = p.stock === 0 ? "Out of Stock" : p.stock <= 5 ? "Critical" : "Low";
                    const levelColor = p.stock === 0
                      ? "bg-red-100 text-red-600"
                      : p.stock <= 5
                      ? "bg-orange-100 text-orange-600"
                      : "bg-amber-100 text-amber-700";
                    return (
                      <div key={p._id} className="flex items-center gap-3 py-2 border-b border-(--border-light) last:border-0">
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          {p.image
                            ? <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-gray-400"><FaImage className="text-xs" /></div>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-(--accent) truncate">{p.title}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">Stock: <span className="font-bold">{p.stock}</span></p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${levelColor}`}>
                          {level}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </ChartCard>
          </div>

        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// ─── All other existing tabs (unchanged) ─────────────────────
// ════════════════════════════════════════════════════════════

function DeleteConfirm({ type, name, onClose, onConfirm, loading }) {
  return (
    <Modal title={`Delete ${type}?`} onClose={onClose}>
      <div className="flex items-start gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 shrink-0 mt-0.5">
          <FaExclamationTriangle />
        </div>
        <p className="text-sm text-gray-600">
          Are you sure you want to delete <strong>"{name}"</strong>? This action cannot be undone.
        </p>
      </div>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50">Cancel</button>
        <button onClick={onConfirm} disabled={loading} className="flex-1 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 disabled:opacity-60">
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  );
}

function CategoryForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState({ name: initial?.name || "", description: initial?.description || "", isActive: initial?.isActive !== false });
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState(initial?.image || "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!imageFile) return; const url = URL.createObjectURL(imageFile); return () => URL.revokeObjectURL(url); }, [imageFile]);

  const handleImageChange = (e) => { const file = e.target.files?.[0]; if (file) { setImageFile(file); setExistingImage(""); } e.target.value = ""; };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name); fd.append("description", form.description); fd.append("isActive", form.isActive); fd.append("existingImage", existingImage);
      if (imageFile) fd.append("image", imageFile);
      await onSave(fd);
    } catch (err) { setError(err?.response?.data?.errors?.[0]?.message || err?.response?.data?.message || "Save failed."); }
    finally { setSaving(false); }
  };

  const previewSrc = imageFile ? URL.createObjectURL(imageFile) : existingImage || "";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{error}</div>}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Name *</label>
        <input type="text" required minLength={2} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Bath Toiletries" className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all resize-none" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-gray-600">Category Image</label>
          <label className="cursor-pointer text-xs text-(--secondary) font-semibold hover:text-(--accent)">
            <FaPlus className="inline mr-1" />{previewSrc ? "Change Image" : "Select Image"}
            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
          </label>
        </div>
        {previewSrc ? (
          <div className="relative w-full h-40 rounded-lg overflow-hidden border border-(--border-light)">
            <img src={previewSrc} alt="preview" className="w-full h-full object-cover" />
            <button type="button" onClick={() => { setImageFile(null); setExistingImage(""); }} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"><FaTimes size={11} /></button>
          </div>
        ) : (
          <div className="w-full h-28 bg-(--surface-warm) rounded-lg flex flex-col items-center justify-center text-gray-400 border border-dashed border-(--border-light)">
            <FaImage className="text-2xl mb-1" /><span className="text-xs">No image selected</span>
          </div>
        )}
      </div>
      {initial && (<label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-(--secondary) w-4 h-4" /><span className="text-sm text-gray-600">Active (visible to customers)</span></label>)}
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-(--border-light) text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
        <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-(--accent) text-white text-sm font-semibold rounded-lg hover:bg-(--secondary) transition-colors disabled:opacity-60">{saving ? "Saving..." : initial ? "Save Changes" : "Create Category"}</button>
      </div>
    </form>
  );
}

function ProductForm({ initial, categories, onSave, onClose }) {
  const [form, setForm] = useState({ title: initial?.title || "", description: initial?.description || "", price: initial?.price ?? "", brand: initial?.brand || "", category: initial?.category?._id || initial?.category || "", stock: initial?.stock ?? "", isFeatured: initial?.isFeatured || false, isActive: initial?.isActive !== false, images: [] });
  const [existingImages, setExistingImages] = useState(initial?.images || []);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { const urls = form.images.map((f) => URL.createObjectURL(f)); return () => urls.forEach((u) => URL.revokeObjectURL(u)); }, [form.images]);

  const handleImageChange = (e) => { const files = Array.from(e.target.files); setForm((prev) => ({ ...prev, images: [...prev.images, ...files] })); e.target.value = ""; };
  const removeNewImage = (index) => setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  const removeExistingImage = (index) => setExistingImages((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title); fd.append("description", form.description); fd.append("price", Number(form.price)); fd.append("brand", form.brand); fd.append("category", form.category); fd.append("stock", Number(form.stock)); fd.append("isFeatured", form.isFeatured); fd.append("isActive", form.isActive);
      fd.append("existingImages", JSON.stringify(existingImages));
      form.images.forEach((file) => fd.append("images", file));
      await onSave(fd);
    } catch (err) { setError(err?.response?.data?.errors?.[0]?.message || err?.response?.data?.message || "Save failed."); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2"><label className="block text-xs font-semibold text-gray-600 mb-1.5">Title *</label><input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) transition-all" /></div>
        <div className="sm:col-span-2"><label className="block text-xs font-semibold text-gray-600 mb-1.5">Description *</label><textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) transition-all resize-none" /></div>
        <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Price (₹) *</label><input type="number" required min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) transition-all" /></div>
        <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Brand *</label><input type="text" required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) transition-all" /></div>
        <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Category *</label><select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) transition-all bg-white"><option value="">Select category</option>{categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
        <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Stock *</label><input type="number" required min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) transition-all" /></div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3"><label className="text-xs font-semibold text-gray-600">Product Images</label><label className="cursor-pointer text-xs text-(--secondary) font-semibold hover:text-(--accent)"><FaPlus className="inline mr-1" />Add Images<input type="file" accept="image/*" multiple hidden onChange={handleImageChange} /></label></div>
        {(existingImages.length > 0 || form.images.length > 0) && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {existingImages.map((img, index) => (<div key={`old-${index}`} className="relative border rounded-lg overflow-hidden"><img src={img.url} alt={img.alt || "product"} className="w-full h-28 object-cover" /><button type="button" onClick={() => removeExistingImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"><FaTimes size={10} /></button></div>))}
            {form.images.map((file, index) => (<div key={`new-${index}`} className="relative border rounded-lg overflow-hidden"><img src={URL.createObjectURL(file)} alt="preview" className="w-full h-28 object-cover" /><button type="button" onClick={() => removeNewImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"><FaTimes size={10} /></button></div>))}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-5">
        <label className="flex items-center gap-2.5 cursor-pointer"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="accent-(--secondary) w-4 h-4" /><span className="text-sm text-gray-600">Featured Product</span></label>
        {initial && (<label className="flex items-center gap-2.5 cursor-pointer"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-(--secondary) w-4 h-4" /><span className="text-sm text-gray-600">Active</span></label>)}
      </div>
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-(--border-light) text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
        <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-(--accent) text-white text-sm font-semibold rounded-lg hover:bg-(--secondary) transition-colors disabled:opacity-60">{saving ? "Saving..." : initial ? "Save Changes" : "Create Product"}</button>
      </div>
    </form>
  );
}

function ManageCategories() {
  const rows = useCategoryStore((s) => s.categories);
  const { fetchCategories, addCategory, editCategory, removeCategory } = useCategory();
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [sel, setSel] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState("");
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const closeModal = () => { setModal(null); setSel(null); };
  const load = useCallback(async () => { await fetchCategories({ limit: 100 }); setLoading(false); }, []);
  useEffect(() => { load(); }, [load]);
  const handleSave = async (form) => { if (sel) { await editCategory(sel._id, form); showToast("Category updated"); } else { await addCategory(form); showToast("Category created"); } closeModal(); fetchCategories({ limit: 100 }); };
  const handleDelete = async () => { setDeleting(true); try { await removeCategory(sel._id); showToast("Category deleted"); closeModal(); fetchCategories({ limit: 100 }); } finally { setDeleting(false); } };

  return (
    <div>
      <SectionHeader title="All Categories" count={rows.length} buttonLabel="Add Category" onAction={() => { setSel(null); setModal("edit"); }} />
      <div className="px-6 py-4">
        {loading ? (<div className="space-y-3">{[...Array(5)].map((_, i) => (<div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />))}</div>) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400"><FaTag className="text-4xl mb-3" /><p className="font-semibold">No categories yet</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead><tr className="border-b border-(--border-light)">{["Image", "Name", "Description", "Status", "Actions"].map((h) => (<th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 px-3 first:pl-0 last:pr-0">{h}</th>))}</tr></thead>
              <tbody className="divide-y divide-[var(--border-light)]">
                {rows.map((cat) => (
                  <tr key={cat._id} className="hover:bg-(--surface-warm) transition-colors">
                    <td className="py-3.5 px-3 pl-0"><div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-100 shrink-0">{cat.image ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><FaImage /></div>}</div></td>
                    <td className="py-3.5 px-3"><span className="text-sm font-semibold text-(--accent)">{cat.name}</span></td>
                    <td className="py-3.5 px-3"><span className="text-sm text-gray-500 line-clamp-1 max-w-[200px] block">{cat.description || "—"}</span></td>
                    <td className="py-3.5 px-3"><span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold ${cat.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>{cat.isActive ? "Active" : "Inactive"}</span></td>
                    <td className="py-3.5 px-3 pr-0"><div className="flex items-center gap-1.5"><button onClick={() => { setSel(cat); setModal("view"); }} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 flex items-center justify-center transition-colors"><FaEye className="text-xs" /></button><button onClick={() => { setSel(cat); setModal("edit"); }} className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 hover:bg-amber-100 flex items-center justify-center transition-colors"><FaEdit className="text-xs" /></button><button onClick={() => { setSel(cat); setModal("delete"); }} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"><FaTrash className="text-xs" /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {modal === "edit" && (<Modal title={sel ? "Edit Category" : "Create Category"} onClose={closeModal}><CategoryForm initial={sel} onSave={handleSave} onClose={closeModal} /></Modal>)}
      {modal === "view" && sel && (<Modal title="Category Details" onClose={closeModal}>{sel.image && <img src={sel.image} alt={sel.name} className="w-full h-40 object-cover rounded-xl mb-4" />}<div className="space-y-3 mb-5">{[["Name", sel.name], ["Description", sel.description || "—"], ["Status", sel.isActive ? "Active" : "Inactive"], ["Created", new Date(sel.createdAt).toLocaleDateString()]].map(([l, v]) => (<div key={l} className="flex gap-3"><span className="text-xs font-semibold text-gray-400 w-24 shrink-0 pt-0.5">{l}</span><span className="text-sm text-(--accent) font-medium flex-1">{v}</span></div>))}</div><div className="flex gap-3"><button onClick={closeModal} className="flex-1 py-2.5 border border-(--border-light) text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50">Close</button><button onClick={() => setModal("edit")} className="flex-1 py-2.5 bg-(--accent) text-white text-sm font-semibold rounded-lg hover:bg-(--secondary)">Edit</button></div></Modal>)}
      {modal === "delete" && sel && (<DeleteConfirm type="Category" name={sel.name} loading={deleting} onClose={closeModal} onConfirm={handleDelete} />)}
      {toast && <Toast message={toast} />}
    </div>
  );
}

function ManageProducts() {
  const rows = useProductStore((s) => s.products);
  const cats = useCategoryStore((s) => s.categories);
  const { fetchProducts, addProduct, editProduct, removeProduct } = useProduct();
  const { fetchCategories } = useCategory();
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [sel, setSel] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState("");
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const closeModal = () => { setModal(null); setSel(null); };
  const load = useCallback(async () => { await Promise.all([fetchProducts({ limit: 100 }), fetchCategories({ limit: 100 })]); setLoading(false); }, []);
  useEffect(() => { load(); }, [load]);
  const handleSave = async (form) => { if (sel) { await editProduct(sel._id, form); showToast("Product updated"); } else { await addProduct(form); showToast("Product created"); } closeModal(); fetchProducts({ limit: 100 }); };
  const handleDelete = async () => { setDeleting(true); try { await removeProduct(sel._id); showToast("Product deleted"); closeModal(); fetchProducts({ limit: 100 }); } finally { setDeleting(false); } };

  return (
    <div>
      <SectionHeader title="All Products" count={rows.length} buttonLabel="Add Product" onAction={() => { setSel(null); setModal("edit"); }} />
      <div className="px-6 py-4">
        {loading ? (<div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />)}</div>) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400"><FaBoxOpen className="text-4xl mb-3" /><p className="font-semibold">No products yet</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px]">
              <thead><tr className="border-b border-(--border-light)">{["Image", "Title", "Brand", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (<th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 px-3 first:pl-0 last:pr-0">{h}</th>))}</tr></thead>
              <tbody className="divide-y divide-[var(--border-light)]">
                {rows.map((p) => { const img = p.images?.[0]; return (
                  <tr key={p._id} className="hover:bg-(--surface-warm) transition-colors">
                    <td className="py-3.5 px-3 pl-0"><div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-100 shrink-0">{img ? <img src={img.url} alt={img.alt || p.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><FaImage /></div>}</div></td>
                    <td className="py-3.5 px-3"><span className="text-sm font-semibold text-(--accent) line-clamp-1 max-w-[140px] block">{p.title}</span></td>
                    <td className="py-3.5 px-3"><span className="text-sm text-gray-600">{p.brand}</span></td>
                    <td className="py-3.5 px-3"><span className="text-sm text-gray-600">{p.category?.name || "—"}</span></td>
                    <td className="py-3.5 px-3"><span className="text-sm font-bold text-(--accent)">₹{p.price}</span></td>
                    <td className="py-3.5 px-3"><span className={`text-sm font-semibold ${p.stock === 0 ? "text-red-500" : "text-gray-700"}`}>{p.stock}</span></td>
                    <td className="py-3.5 px-3"><span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold ${p.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>{p.isActive ? "Active" : "Inactive"}</span></td>
                    <td className="py-3.5 px-3 pr-0"><div className="flex items-center gap-1.5"><button onClick={() => { setSel(p); setModal("view"); }} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 flex items-center justify-center transition-colors"><FaEye className="text-xs" /></button><button onClick={() => { setSel(p); setModal("edit"); }} className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 hover:bg-amber-100 flex items-center justify-center transition-colors"><FaEdit className="text-xs" /></button><button onClick={() => { setSel(p); setModal("delete"); }} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"><FaTrash className="text-xs" /></button></div></td>
                  </tr>
                ); })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {modal === "edit" && (<Modal title={sel ? "Edit Product" : "Create Product"} onClose={closeModal} wide><ProductForm initial={sel} categories={cats} onSave={handleSave} onClose={closeModal} /></Modal>)}
      {modal === "delete" && sel && (<DeleteConfirm type="Product" name={sel.title} loading={deleting} onClose={closeModal} onConfirm={handleDelete} />)}
      {toast && <Toast message={toast} />}
    </div>
  );
}

function CreateCategorySection() {
  const { addCategory, fetchCategories } = useCategory();
  const [success, setSuccess] = useState("");
  return (
    <div><SectionHeader title="Create Category" />
      <div className="px-6 py-6 max-w-xl">
        {success && <div className="flex items-center gap-2 text-green-700 text-sm bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 mb-4"><FaCheck className="text-xs" /> {success}</div>}
        <div className="bg-white rounded-2xl border border-(--border-light) p-6">
          <CategoryForm initial={null} onSave={async (form) => { await addCategory(form); await fetchCategories({ limit: 100 }); setSuccess("Category created!"); setTimeout(() => setSuccess(""), 3000); }} onClose={() => {}} />
        </div>
      </div>
    </div>
  );
}

function CreateProductSection() {
  const cats = useCategoryStore((s) => s.categories);
  const { fetchCategories } = useCategory();
  const { addProduct, fetchProducts } = useProduct();
  const [success, setSuccess] = useState("");
  useEffect(() => { if (cats.length === 0) fetchCategories({ limit: 100 }); }, []);
  return (
    <div><SectionHeader title="Create Product" />
      <div className="px-6 py-6 max-w-2xl">
        {success && <div className="flex items-center gap-2 text-green-700 text-sm bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 mb-4"><FaCheck className="text-xs" /> {success}</div>}
        <div className="bg-white rounded-2xl border border-(--border-light) p-6">
          <ProductForm initial={null} categories={cats} onSave={async (form) => { await addProduct(form); await fetchProducts({ limit: 100 }); setSuccess("Product created!"); setTimeout(() => setSuccess(""), 3000); }} onClose={() => {}} />
        </div>
      </div>
    </div>
  );
}

function OrderTimeline({ order }) {
  const steps = ["pending", "processing", "shipped", "delivered"];
  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null;
  if (order.orderStatus === "cancelled") return (<div className="flex items-center gap-2 py-1"><div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shrink-0"><FaTimes className="text-[8px] text-white" /></div><span className="text-xs font-semibold text-red-500">Order Cancelled</span></div>);
  const currentIdx = steps.indexOf(order.orderStatus);
  const stepDates = { pending: fmt(order.orderPlacedAt || order.createdAt), processing: null, shipped: null, delivered: fmt(order.deliveredAt) };
  return (
    <div className="w-full">
      <div className="flex items-start">
        {steps.map((step, idx) => { const done = idx <= currentIdx; const current = idx === currentIdx; return (
          <div key={step} className="flex items-start flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${done ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"} ${current ? "ring-2 ring-green-300 ring-offset-1" : ""}`}>{done ? "✓" : idx + 1}</div>
              <p className={`text-[9px] mt-1 font-semibold capitalize text-center ${done ? "text-green-600" : "text-gray-400"}`}>{step}</p>
              {stepDates[step] && <p className="text-[9px] text-gray-400 text-center leading-tight">{stepDates[step]}</p>}
            </div>
            {idx < steps.length - 1 && <div className={`flex-1 h-0.5 mt-3 mx-1 ${idx < currentIdx ? "bg-green-400" : "bg-gray-200"}`} />}
          </div>
        ); })}
      </div>
      {order.expectedDeliveryDate && <p className="text-[10px] text-amber-600 mt-2">Expected delivery: <span className="font-semibold">{fmt(order.expectedDeliveryDate)}</span></p>}
    </div>
  );
}

function MyOrdersTab() {
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [payingId, setPayingId] = useState(null);
  const [toast, setToast] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const loadOrders = () => { setLoading(true); getMyOrders().then((d) => setOrders(d.orders || [])).catch(() => setError("Failed to load orders.")).finally(() => setLoading(false)); };
  useEffect(() => { loadOrders(); }, []);
  const loadRazorpayScript = () => new Promise((resolve) => { if (window.Razorpay) return resolve(true); const script = document.createElement("script"); script.src = "https://checkout.razorpay.com/v1/checkout.js"; script.onload = () => resolve(true); script.onerror = () => resolve(false); document.body.appendChild(script); });
  const handlePay = async (order) => {
    setPayingId(order._id);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) { showToast("Failed to load payment gateway."); setPayingId(null); return; }
      const { razorpayOrder } = await createPaymentOrder(order._id);
      const options = { key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, amount: razorpayOrder.amount, currency: razorpayOrder.currency, name: "HGS Store", description: `Order #${order._id.slice(-8).toUpperCase()}`, order_id: razorpayOrder.id, prefill: { name: user?.name || "", email: user?.email || "" }, theme: { color: "#1a1a2e" }, handler: async (response) => { try { await verifyPayment({ razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature }); showToast("Payment successful!"); loadOrders(); } catch { showToast("Payment verification failed."); } }, modal: { ondismiss: () => setPayingId(null) } };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => { showToast("Payment failed."); setPayingId(null); });
      rzp.open();
    } catch (err) { showToast(err?.response?.data?.message || "Failed to initiate payment"); setPayingId(null); }
  };
  const SC = { pending: "bg-amber-100 text-amber-700", processing: "bg-blue-100 text-blue-700", shipped: "bg-purple-100 text-purple-700", delivered: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-600" };
  const PC = { pending: "bg-amber-100 text-amber-700", paid: "bg-green-100 text-green-700", failed: "bg-red-100 text-red-600" };
  const filtered = filter === "unpaid" ? orders.filter((o) => o.paymentStatus === "pending") : filter === "paid" ? orders.filter((o) => o.paymentStatus === "paid") : orders;
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const unpaidCount = orders.filter((o) => o.paymentStatus === "pending").length;
  return (
    <div>
      <SectionHeader title="My Orders" count={orders.length} />
      <div className="px-6 py-4">
        {!loading && orders.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {[{ key: "all", label: "All Orders", count: orders.length }, { key: "unpaid", label: "Pending Payment", count: unpaidCount }, { key: "paid", label: "Paid", count: orders.filter((o) => o.paymentStatus === "paid").length }].map((f) => (
              <button key={f.key} onClick={() => { setFilter(f.key); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${filter === f.key ? "bg-(--accent) text-white" : "bg-white border border-(--border-light) text-gray-600 hover:border-(--secondary)"}`}>{f.label}<span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${filter === f.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>{f.count}</span></button>
            ))}
          </div>
        )}
        {loading ? (<div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}</div>) : error ? (<p className="text-red-500 text-sm text-center py-10">{error}</p>) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400"><FaBoxOpen className="text-4xl mb-3" /><p className="font-semibold text-gray-600">No orders yet</p></div>
        ) : paged.length === 0 ? (<div className="flex flex-col items-center justify-center py-16 text-center text-gray-400"><FaBoxOpen className="text-3xl mb-3" /><p className="font-semibold text-gray-600">No orders in this category</p></div>) : (
          <>
            <div className="space-y-3">
              {paged.map((order) => (
                <div key={order._id} className="bg-white border border-(--border-light) rounded-xl overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-4">
                    <button className="flex-1 flex items-center gap-4 text-left min-w-0" onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap"><p className="text-sm font-bold text-(--accent)">#{order._id.slice(-8).toUpperCase()}</p><span className={`text-[11px] px-2 py-0.5 rounded-full font-bold capitalize ${SC[order.orderStatus] || "bg-gray-100 text-gray-600"}`}>{order.orderStatus}</span><span className={`text-[11px] px-2 py-0.5 rounded-full font-bold capitalize ${PC[order.paymentStatus] || "bg-gray-100 text-gray-600"}`}>{order.paymentStatus}</span></div>
                        <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""}</p>
                      </div>
                      <div className="flex flex-col items-end shrink-0"><p className="text-sm font-bold text-(--accent)">₹{order.totalAmount?.toLocaleString()}</p><FaChevronDown className={`text-[10px] text-gray-400 mt-1 transition-transform ${expandedId === order._id ? "rotate-180" : ""}`} /></div>
                    </button>
                    {order.paymentStatus === "pending" && (<button onClick={() => handlePay(order)} disabled={payingId === order._id} className="shrink-0 px-3 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60">{payingId === order._id ? "Opening…" : "Pay Now"}</button>)}
                  </div>
                  {expandedId === order._id && (
                    <div className="border-t border-(--border-light) px-4 py-4 space-y-3">
                      <OrderTimeline order={order} />
                      <div className="p-3 bg-(--surface-warm) rounded-xl text-xs text-gray-600"><p className="font-semibold text-(--accent) mb-1.5">Delivery Address</p><p className="font-semibold">{order.shippingAddress?.name}</p><p>{order.shippingAddress?.address}, {order.shippingAddress?.city}</p><p>{order.shippingAddress?.state} – {order.shippingAddress?.pincode}</p><p className="mt-0.5">Ph: {order.shippingAddress?.phone}</p></div>
                      <div className="space-y-2.5">{order.items?.map((item, idx) => (<div key={idx} className="flex gap-3 items-center"><div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-100 shrink-0">{item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><FaImage className="text-xs" /></div>}</div><div className="flex-1 min-w-0"><p className="text-xs font-semibold text-(--accent) line-clamp-1">{item.name}</p><p className="text-xs text-gray-400">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p></div><p className="text-xs font-bold text-gray-700 shrink-0">₹{(item.price * item.quantity).toLocaleString()}</p></div>))}</div>
                      {["pending", "processing"].includes(order.orderStatus) && (<button onClick={async () => { if (!confirm("Cancel this order?")) return; try { await updateOrder(order._id, { orderStatus: "cancelled" }); showToast("Order cancelled"); loadOrders(); } catch { showToast("Failed to cancel"); } }} className="w-full py-2 border border-red-300 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-50 transition-colors">Cancel Order</button>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPage={setPage} />
          </>
        )}
      </div>
      {toast && <Toast message={toast} />}
    </div>
  );
}

function AdminOrdersTab() {
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [payStatus, setPayStatus] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [toast, setToast] = useState("");
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const load = useCallback(async () => { setLoading(true); try { const params = { page, limit: 10 }; if (search) params.search = search; if (orderStatus) params.orderStatus = orderStatus; if (payStatus) params.paymentStatus = payStatus; const data = await getAllOrdersAdmin(params); setOrders(data.orders || []); setTotal(data.total || 0); setTotalPages(data.totalPages || 1); } catch { setOrders([]); } finally { setLoading(false); } }, [page, search, orderStatus, payStatus]);
  useEffect(() => { load(); }, [load]);
  const SC = { pending: "bg-amber-100 text-amber-700", processing: "bg-blue-100 text-blue-700", shipped: "bg-purple-100 text-purple-700", delivered: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-600" };
  const PC = { pending: "bg-amber-100 text-amber-700", paid: "bg-green-100 text-green-700", failed: "bg-red-100 text-red-600" };
  return (
    <div>
      <SectionHeader title="All Orders" count={total} />
      <div className="px-6 py-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(1); }} className="flex-1 flex gap-2">
            <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search by user name or email…" className="flex-1 border border-(--border-light) rounded-lg px-4 py-2 text-sm outline-none focus:border-(--secondary) transition-all" />
            <button type="submit" className="px-4 py-2 bg-(--accent) text-white text-sm font-semibold rounded-lg hover:bg-(--secondary) transition-colors flex items-center gap-1.5"><FaSearch className="text-xs" /> Search</button>
          </form>
          <div className="flex gap-2">
            <select value={orderStatus} onChange={(e) => { setOrderStatus(e.target.value); setPage(1); }} className="border border-(--border-light) rounded-lg px-3 py-2 text-sm outline-none focus:border-(--secondary) transition-all bg-white"><option value="">All Statuses</option><option value="pending">Pending</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select>
            <select value={payStatus} onChange={(e) => { setPayStatus(e.target.value); setPage(1); }} className="border border-(--border-light) rounded-lg px-3 py-2 text-sm outline-none focus:border-(--secondary) transition-all bg-white"><option value="">All Payments</option><option value="pending">Pending</option><option value="paid">Paid</option><option value="failed">Failed</option></select>
          </div>
        </div>
        {loading ? (<div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}</div>) : orders.length === 0 ? (<div className="flex flex-col items-center justify-center py-20 text-center text-gray-400"><FaTruck className="text-4xl mb-3" /><p className="font-semibold text-gray-600">No orders found</p></div>) : (
          <>
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order._id} className="bg-white border border-(--border-light) rounded-xl overflow-hidden">
                  <button className="w-full flex items-center gap-4 px-4 py-4 hover:bg-(--surface-warm) transition-colors text-left" onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}>
                    <div className="flex-1 min-w-0"><div className="flex items-center gap-2 flex-wrap"><p className="text-sm font-bold text-(--accent)">#{order._id.slice(-8).toUpperCase()}</p><span className={`text-[11px] px-2 py-0.5 rounded-full font-bold capitalize ${SC[order.orderStatus] || "bg-gray-100 text-gray-600"}`}>{order.orderStatus}</span><span className={`text-[11px] px-2 py-0.5 rounded-full font-bold capitalize ${PC[order.paymentStatus] || "bg-gray-100 text-gray-600"}`}>{order.paymentStatus}</span></div><p className="text-xs text-gray-400 mt-0.5">{order.user?.name || "—"} · {order.user?.email || "—"} · {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p></div>
                    <div className="flex flex-col items-end shrink-0"><p className="text-sm font-bold text-(--accent)">₹{order.totalAmount?.toLocaleString()}</p><FaChevronDown className={`text-[10px] text-gray-400 mt-1 transition-transform ${expandedId === order._id ? "rotate-180" : ""}`} /></div>
                  </button>
                  {expandedId === order._id && (
                    <div className="border-t border-(--border-light) px-4 py-4 space-y-3">
                      <OrderTimeline order={order} />
                      <div className="p-3 bg-(--surface-warm) rounded-xl text-xs text-gray-600"><p className="font-semibold text-(--accent) mb-1.5">Delivery Address</p><p className="font-semibold">{order.shippingAddress?.name}</p><p>{order.shippingAddress?.address}, {order.shippingAddress?.city}</p><p>{order.shippingAddress?.state} – {order.shippingAddress?.pincode}</p><p className="mt-0.5">Ph: {order.shippingAddress?.phone}</p></div>
                      <div className="space-y-2.5">{order.items?.map((item, idx) => (<div key={idx} className="flex gap-3 items-center"><div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-100 shrink-0">{item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><FaImage className="text-xs" /></div>}</div><div className="flex-1 min-w-0"><p className="text-xs font-semibold text-(--accent) line-clamp-1">{item.name}</p><p className="text-xs text-gray-400">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p></div><p className="text-xs font-bold text-gray-700 shrink-0">₹{(item.price * item.quantity).toLocaleString()}</p></div>))}</div>
                      {user?.role === "superadmin" && order.orderStatus !== "cancelled" && (<SuperadminStatusControl order={order} onUpdated={load} showToast={showToast} />)}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPage={setPage} />
          </>
        )}
      </div>
      {toast && <Toast message={toast} />}
    </div>
  );
}

function SuperadminStatusControl({ order, onUpdated, showToast }) {
  const [saving, setSaving] = useState(false);
  const statusFlow = ["pending", "processing", "shipped", "delivered", "cancelled"];
  const current = order.orderStatus;
  const handleChange = async (newStatus) => {
    if (newStatus === current) return;
    setSaving(true);
    try {
      const update = { orderStatus: newStatus };
      if (newStatus === "processing") { const d = new Date(); d.setDate(d.getDate() + 5); update.expectedDeliveryDate = d.toISOString(); }
      await updateOrder(order._id, update);
      showToast(`Status updated to ${newStatus}`);
      onUpdated();
    } catch (err) { showToast(err?.response?.data?.message || "Failed to update status"); }
    finally { setSaving(false); }
  };
  const SC = { pending: "bg-amber-100 text-amber-700", processing: "bg-blue-100 text-blue-700", shipped: "bg-purple-100 text-purple-700", delivered: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-600" };
  return (
    <div className="pt-1"><p className="text-xs font-semibold text-gray-500 mb-2">Update Status</p><div className="flex flex-wrap gap-2">{statusFlow.map((s) => (<button key={s} onClick={() => handleChange(s)} disabled={saving || s === current} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-50 ${s === current ? `${SC[s]} border-transparent cursor-default` : "bg-white border-gray-200 text-gray-600 hover:border-(--secondary) hover:text-(--secondary)"}`}>{s === current ? `✓ ${s}` : s}</button>))}</div></div>
  );
}

function UserManagementTab() {
  const [users, setUsers] = useState([]); const [total, setTotal] = useState(0); const [totalPages, setTotalPages] = useState(1); const [loading, setLoading] = useState(true); const [page, setPage] = useState(1); const [searchInput, setSearchInput] = useState(""); const [search, setSearch] = useState(""); const [togglingId, setTogglingId] = useState(null); const [toast, setToast] = useState(""); const [viewUser, setViewUser] = useState(null);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const load = useCallback(async () => { setLoading(true); try { const params = { page, limit: 10, role: "user" }; if (search) params.search = search; const res = await api.get("/users", { params }); setUsers(res.data.users || []); setTotal(res.data.total || 0); setTotalPages(res.data.totalPages || 1); } catch { setUsers([]); } finally { setLoading(false); } }, [page, search]);
  useEffect(() => { load(); }, [load]);
  const handleToggleBlock = async (userId) => { setTogglingId(userId); try { const res = await api.put(`/users/${userId}/block`); showToast(res.data.message || "Updated"); load(); } catch { showToast("Failed to update user"); } finally { setTogglingId(null); } };
  return (
    <div><SectionHeader title="User Management" count={total} />
      <div className="px-6 py-4 space-y-4">
        <form onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(1); }} className="flex gap-2"><input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search by name or email…" className="flex-1 border border-(--border-light) rounded-lg px-4 py-2 text-sm outline-none focus:border-(--secondary) transition-all" /><button type="submit" className="px-4 py-2 bg-(--accent) text-white text-sm font-semibold rounded-lg hover:bg-(--secondary) transition-colors flex items-center gap-1.5"><FaSearch className="text-xs" /> Search</button></form>
        {loading ? (<div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />)}</div>) : users.length === 0 ? (<div className="flex flex-col items-center justify-center py-20 text-center text-gray-400"><FaUsers className="text-4xl mb-3" /><p className="font-semibold text-gray-600">No users found</p></div>) : (
          <><div className="overflow-x-auto"><table className="w-full min-w-[560px]"><thead><tr className="border-b border-(--border-light)">{["Name", "Email", "Phone", "Status", "Joined", "Actions"].map((h) => (<th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 px-3 first:pl-0 last:pr-0">{h}</th>))}</tr></thead><tbody className="divide-y divide-[var(--border-light)]">{users.map((u) => (<tr key={u._id} className="hover:bg-(--surface-warm) transition-colors"><td className="py-3.5 px-3 pl-0"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-(--accent) text-white text-xs font-bold flex items-center justify-center shrink-0">{u.name?.charAt(0).toUpperCase()}</div><span className="text-sm font-semibold text-(--accent)">{u.name}</span></div></td><td className="py-3.5 px-3"><span className="text-sm text-gray-600">{u.email}</span></td><td className="py-3.5 px-3"><span className="text-sm text-gray-600">{u.phone || "—"}</span></td><td className="py-3.5 px-3"><span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold ${u.isBlocked ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>{u.isBlocked ? "Blocked" : "Active"}</span></td><td className="py-3.5 px-3"><span className="text-xs text-gray-500">{new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span></td><td className="py-3.5 px-3 pr-0"><div className="flex items-center gap-1.5"><button onClick={() => setViewUser(u)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 flex items-center justify-center transition-colors"><FaEye className="text-xs" /></button><button onClick={() => handleToggleBlock(u._id)} disabled={togglingId === u._id} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 ${u.isBlocked ? "bg-green-50 text-green-600 hover:bg-green-100" : "bg-red-50 text-red-500 hover:bg-red-100"}`}>{u.isBlocked ? <FaUnlock className="text-xs" /> : <FaBan className="text-xs" />}</button></div></td></tr>))}</tbody></table></div><Pagination page={page} totalPages={totalPages} onPage={setPage} /></>
        )}
      </div>
      {viewUser && (<Modal title="User Details" onClose={() => setViewUser(null)}><div className="space-y-3 mb-5">{[["Name", viewUser.name], ["Email", viewUser.email], ["Phone", viewUser.phone || "—"], ["Status", viewUser.isBlocked ? "Blocked" : "Active"], ["Role", viewUser.role], ["Joined", new Date(viewUser.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })]].map(([l, v]) => (<div key={l} className="flex gap-3"><span className="text-xs font-semibold text-gray-400 w-20 shrink-0 pt-0.5">{l}</span><span className="text-sm text-(--accent) font-medium flex-1">{v}</span></div>))}</div><button onClick={() => setViewUser(null)} className="w-full py-2.5 border border-(--border-light) text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50">Close</button></Modal>)}
      {toast && <Toast message={toast} />}
    </div>
  );
}

function AdminManagementTab() {
  const [admins, setAdmins] = useState([]); const [total, setTotal] = useState(0); const [totalPages, setTotalPages] = useState(1); const [loading, setLoading] = useState(true); const [page, setPage] = useState(1); const [searchInput, setSearchInput] = useState(""); const [search, setSearch] = useState(""); const [toast, setToast] = useState(""); const [modal, setModal] = useState(null); const [sel, setSel] = useState(null); const [deleting, setDeleting] = useState(false); const [togglingId, setTogglingId] = useState(null); const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" }); const [formError, setFormError] = useState(""); const [formLoading, setFormLoading] = useState(false);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const closeModal = () => { setModal(null); setSel(null); setForm({ name: "", email: "", phone: "", password: "" }); setFormError(""); };
  const load = useCallback(async () => { setLoading(true); try { const params = { page, limit: 10 }; if (search) params.search = search; const res = await api.get("/admins", { params }); setAdmins(res.data.admins || []); setTotal(res.data.total || 0); setTotalPages(res.data.totalPages || 1); } catch { setAdmins([]); } finally { setLoading(false); } }, [page, search]);
  useEffect(() => { load(); }, [load]);
  const handleFormSubmit = async (e) => { e.preventDefault(); setFormError(""); setFormLoading(true); try { if (sel) { const { password: _pw, ...updateData } = form; await api.put(`/admins/${sel._id}`, updateData); showToast("Admin updated"); } else { await api.post("/admins", form); showToast("Admin created"); } closeModal(); load(); } catch (err) { setFormError(err?.response?.data?.message || "Operation failed."); } finally { setFormLoading(false); } };
  const handleToggleDeactivate = async (adminId) => { setTogglingId(adminId); try { const res = await api.put(`/admins/${adminId}/deactivate`); showToast(res.data.message || "Updated"); load(); } catch { showToast("Failed to update admin"); } finally { setTogglingId(null); } };
  const handleDelete = async () => { setDeleting(true); try { await api.delete(`/admins/${sel._id}`); showToast("Admin deleted"); closeModal(); load(); } catch (err) { showToast(err?.response?.data?.message || "Failed to delete admin"); setDeleting(false); } };
  return (
    <div><SectionHeader title="Admin Management" count={total} buttonLabel="Add Admin" onAction={() => { setSel(null); setModal("form"); }} />
      <div className="px-6 py-4 space-y-4">
        <form onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(1); }} className="flex gap-2"><input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search by name or email…" className="flex-1 border border-(--border-light) rounded-lg px-4 py-2 text-sm outline-none focus:border-(--secondary) transition-all" /><button type="submit" className="px-4 py-2 bg-(--accent) text-white text-sm font-semibold rounded-lg hover:bg-(--secondary) transition-colors flex items-center gap-1.5"><FaSearch className="text-xs" /> Search</button></form>
        {loading ? (<div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />)}</div>) : admins.length === 0 ? (<div className="flex flex-col items-center justify-center py-20 text-center text-gray-400"><FaUserShield className="text-4xl mb-3" /><p className="font-semibold text-gray-600">No admins found</p></div>) : (
          <><div className="overflow-x-auto"><table className="w-full min-w-[560px]"><thead><tr className="border-b border-(--border-light)">{["Name", "Email", "Phone", "Status", "Actions"].map((h) => (<th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 px-3 first:pl-0 last:pr-0">{h}</th>))}</tr></thead><tbody className="divide-y divide-[var(--border-light)]">{admins.map((a) => (<tr key={a._id} className="hover:bg-(--surface-warm) transition-colors"><td className="py-3.5 px-3 pl-0"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-(--secondary) text-white text-xs font-bold flex items-center justify-center shrink-0">{a.name?.charAt(0).toUpperCase()}</div><span className="text-sm font-semibold text-(--accent)">{a.name}</span></div></td><td className="py-3.5 px-3"><span className="text-sm text-gray-600">{a.email}</span></td><td className="py-3.5 px-3"><span className="text-sm text-gray-600">{a.phone || "—"}</span></td><td className="py-3.5 px-3"><span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold ${a.isBlocked ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>{a.isBlocked ? "Inactive" : "Active"}</span></td><td className="py-3.5 px-3 pr-0"><div className="flex items-center gap-1.5"><button onClick={() => { setSel(a); setForm({ name: a.name, email: a.email, phone: a.phone || "", password: "" }); setModal("form"); }} className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 hover:bg-amber-100 flex items-center justify-center transition-colors"><FaEdit className="text-xs" /></button><button onClick={() => handleToggleDeactivate(a._id)} disabled={togglingId === a._id} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 ${a.isBlocked ? "bg-green-50 text-green-600 hover:bg-green-100" : "bg-orange-50 text-orange-500 hover:bg-orange-100"}`}>{a.isBlocked ? <FaUnlock className="text-xs" /> : <FaBan className="text-xs" />}</button><button onClick={() => { setSel(a); setModal("delete"); }} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"><FaTrash className="text-xs" /></button></div></td></tr>))}</tbody></table></div><Pagination page={page} totalPages={totalPages} onPage={setPage} /></>
        )}
      </div>
      {modal === "form" && (<Modal title={sel ? "Edit Admin" : "Create Admin"} onClose={closeModal}><form onSubmit={handleFormSubmit} className="space-y-4">{formError && <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{formError}</div>}<div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Name *</label><input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) transition-all" /></div><div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Email *</label><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) transition-all" /></div><div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone {sel ? "" : "*"}</label><input type="tel" required={!sel} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) transition-all" /></div>{!sel && (<div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Password *</label><input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) transition-all" /></div>)}<div className="flex gap-3 pt-1"><button type="button" onClick={closeModal} className="flex-1 py-2.5 border border-(--border-light) text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors">Cancel</button><button type="submit" disabled={formLoading} className="flex-1 py-2.5 bg-(--accent) text-white text-sm font-semibold rounded-lg hover:bg-(--secondary) transition-colors disabled:opacity-60">{formLoading ? "Saving…" : sel ? "Save Changes" : "Create Admin"}</button></div></form></Modal>)}
      {modal === "delete" && sel && (<DeleteConfirm type="Admin" name={sel.name} loading={deleting} onClose={closeModal} onConfirm={handleDelete} />)}
      {toast && <Toast message={toast} />}
    </div>
  );
}

function CartTab() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const loading = useCartStore((s) => s.loading);
  const { fetchCart, updateItem, removeItem, emptyCart } = useCart();
  const [toast, setToast] = useState(""); const [clearing, setClearing] = useState(false); const [removingId, setRemovingId] = useState(null);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  useEffect(() => { fetchCart(); }, []);
  const handleQty = async (productId, newQty) => { if (newQty < 1) return; try { await updateItem(productId, newQty); } catch { showToast("Failed to update quantity"); } };
  const handleRemove = async (productId) => { setRemovingId(productId); try { await removeItem(productId); showToast("Item removed"); } catch { showToast("Failed to remove item"); } finally { setRemovingId(null); } };
  const handleClear = async () => { setClearing(true); try { await emptyCart(); showToast("Cart cleared"); } finally { setClearing(false); } };
  const subtotal = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
  return (
    <div><SectionHeader title="My Cart" count={totalQty > 0 ? totalQty : undefined} />
      <div className="px-6 py-4">
        {loading ? (<div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}</div>) : items.length === 0 ? (<div className="flex flex-col items-center justify-center py-20 text-center text-gray-400"><FaShoppingCart className="text-4xl mb-3" /><p className="font-semibold text-gray-600">Your cart is empty</p></div>) : (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-3">
              {items.map((item) => { const product = item.product; if (!product) return null; const img = product.images?.[0]; const productId = product._id || product; const lineTotal = (product.price || 0) * item.quantity; return (
                <div key={productId} className="flex gap-4 bg-white border border-(--border-light) rounded-xl p-4 hover:border-(--secondary) transition-colors">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">{img ? <img src={img.url} alt={img.alt || product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><FaImage /></div>}</div>
                  <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-(--accent) line-clamp-1">{product.name}</p><p className="text-xs text-gray-400 mt-0.5">{product.brand}</p><p className="text-sm font-bold text-(--secondary) mt-1">₹{product.price?.toLocaleString()}</p></div>
                  <div className="flex flex-col items-end justify-between shrink-0">
                    <button onClick={() => handleRemove(productId)} disabled={removingId === productId} className="w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors disabled:opacity-50"><FaTrash className="text-[10px]" /></button>
                    <div className="flex items-center gap-1.5"><button onClick={() => handleQty(productId, item.quantity - 1)} disabled={item.quantity <= 1} className="w-7 h-7 rounded-lg border border-(--border-light) text-gray-600 hover:border-(--secondary) hover:text-(--secondary) flex items-center justify-center text-sm font-bold transition-colors disabled:opacity-40">−</button><span className="w-8 text-center text-sm font-semibold text-(--accent)">{item.quantity}</span><button onClick={() => handleQty(productId, item.quantity + 1)} className="w-7 h-7 rounded-lg border border-(--border-light) text-gray-600 hover:border-(--secondary) hover:text-(--secondary) flex items-center justify-center text-sm font-bold transition-colors">+</button></div>
                    <p className="text-xs font-bold text-gray-700">₹{lineTotal.toLocaleString()}</p>
                  </div>
                </div>
              ); })}
            </div>
            <div className="lg:w-72 shrink-0"><div className="bg-white border border-(--border-light) rounded-xl p-5 sticky top-4"><h3 className="text-sm font-bold text-(--accent) mb-4">Order Summary</h3><div className="space-y-2.5 text-sm"><div className="flex justify-between text-gray-600"><span>Items ({totalQty})</span><span>₹{subtotal.toLocaleString()}</span></div><div className="flex justify-between text-gray-600"><span>Shipping</span><span className={subtotal >= 2500 ? "text-green-600 font-semibold" : "text-gray-600"}>{subtotal >= 2500 ? "FREE" : "Calculated at checkout"}</span></div>{subtotal > 0 && subtotal < 2500 && (<p className="text-[11px] text-amber-600 bg-amber-50 rounded-lg px-3 py-2">Add ₹{(2500 - subtotal).toLocaleString()} more for free shipping</p>)}<div className="border-t border-(--border-light) pt-2.5 flex justify-between font-bold text-(--accent)"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div></div><button onClick={() => router.push("/checkout")} className="w-full mt-5 py-3 bg-(--accent) text-white text-sm font-bold rounded-xl hover:bg-(--secondary) transition-colors">Proceed to Checkout</button><button onClick={handleClear} disabled={clearing} className="w-full mt-2.5 py-2.5 border border-red-200 text-red-500 text-sm font-semibold rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50">{clearing ? "Clearing..." : "Clear Cart"}</button></div></div>
          </div>
        )}
      </div>
      {toast && <Toast message={toast} />}
    </div>
  );
}

function ProfileTab({ user }) {
  const setUser = useAuthStore((s) => s.setUser);
  const [mode, setMode] = useState("view");
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false); const [error, setError] = useState(""); const [toast, setToast] = useState("");
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const handleProfileSave = async (e) => { e.preventDefault(); setError(""); setSaving(true); try { const res = await api.put("/users/me", form); setUser(res.data.user); setMode("view"); showToast("Profile updated successfully"); } catch (err) { setError(err?.response?.data?.message || "Failed to update profile"); } finally { setSaving(false); } };
  const handlePasswordSave = async (e) => { e.preventDefault(); if (pwForm.newPassword !== pwForm.confirmPassword) { setError("New passwords do not match"); return; } setError(""); setSaving(true); try { await api.put("/users/me/password", { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }); setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); setMode("view"); showToast("Password changed successfully"); } catch (err) { setError(err?.response?.data?.message || "Failed to change password"); } finally { setSaving(false); } };
  return (
    <div className="px-6 py-6 max-w-xl"><h2 className="text-xl font-bold text-(--accent) mb-6">My Profile</h2>
      <div className="bg-white rounded-2xl border border-(--border-light) overflow-hidden">
        <div className="bg-(--accent) px-6 py-10 flex items-center gap-5"><div className="w-20 h-20 rounded-full bg-white/20 text-white text-3xl font-bold flex items-center justify-center shrink-0 border-2 border-white/40">{user?.name?.charAt(0).toUpperCase()}</div><div><h3 className="text-2xl font-bold text-white">{user?.name}</h3><p className="text-white/70 text-sm mt-0.5">{user?.email}</p><span className="inline-block mt-2 px-3 py-0.5 bg-white/20 text-white text-xs font-bold rounded-full capitalize">{user?.role || "user"}</span></div></div>
        {mode === "view" && (<div className="p-6"><div className="space-y-0 mb-5">{[{ label: "Full Name", value: user?.name }, { label: "Email Address", value: user?.email }, { label: "Phone", value: user?.phone || "Not provided" }, { label: "Role", value: user?.role || "user", cap: true }].map((f) => (<div key={f.label} className="flex items-center justify-between py-3 border-b border-(--border-light) last:border-0"><span className="text-sm text-gray-500 font-medium">{f.label}</span><span className={`text-sm font-semibold text-(--accent) ${f.cap ? "capitalize" : ""}`}>{f.value}</span></div>))}</div><div className="flex gap-3"><button onClick={() => { setForm({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "" }); setError(""); setMode("edit"); }} className="flex-1 py-2.5 bg-(--accent) text-white text-sm font-semibold rounded-xl hover:bg-(--secondary) transition-colors flex items-center justify-center gap-2"><FaEdit className="text-xs" /> Edit Profile</button><button onClick={() => { setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); setError(""); setMode("password"); }} className="flex-1 py-2.5 border border-(--border-light) text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">Change Password</button></div></div>)}
        {mode === "edit" && (<form onSubmit={handleProfileSave} className="p-6 space-y-4">{error && <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{error}</div>}<div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name *</label><input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all" /></div><div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address *</label><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all" /></div><div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone Number</label><input type="tel" maxLength={10} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all" /></div><div className="flex gap-3 pt-1"><button type="button" onClick={() => setMode("view")} className="flex-1 py-2.5 border border-(--border-light) text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">Cancel</button><button type="submit" disabled={saving} className="flex-1 py-2.5 bg-(--accent) text-white text-sm font-semibold rounded-xl hover:bg-(--secondary) transition-colors disabled:opacity-60">{saving ? "Saving…" : "Save Changes"}</button></div></form>)}
        {mode === "password" && (<form onSubmit={handlePasswordSave} className="p-6 space-y-4">{error && <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{error}</div>}<div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Current Password *</label><input type="password" required value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all" /></div><div><label className="block text-xs font-semibold text-gray-600 mb-1.5">New Password *</label><input type="password" required minLength={6} value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all" /></div><div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm New Password *</label><input type="password" required value={pwForm.confirmPassword} onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all" /></div><div className="flex gap-3 pt-1"><button type="button" onClick={() => setMode("view")} className="flex-1 py-2.5 border border-(--border-light) text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">Cancel</button><button type="submit" disabled={saving} className="flex-1 py-2.5 bg-(--accent) text-white text-sm font-semibold rounded-xl hover:bg-(--secondary) transition-colors disabled:opacity-60">{saving ? "Saving…" : "Change Password"}</button></div></form>)}
      </div>
      {toast && <Toast message={toast} />}
    </div>
  );
}

function CouponForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState({ code: initial?.code || "", discountType: initial?.discountType || "percentage", discountValue: initial?.discountValue ?? "", minimumOrderAmount: initial?.minimumOrderAmount ?? "", maximumDiscountAmount: initial?.maximumDiscountAmount ?? "", useLimit: initial?.useLimit ?? 1, expiresAt: initial?.expiresAt ? new Date(initial.expiresAt).toISOString().slice(0, 10) : "", isActive: initial?.isActive !== false });
  const [error, setError] = useState(""); const [saving, setSaving] = useState(false);
  const handleSubmit = async (e) => { e.preventDefault(); setError(""); setSaving(true); try { const payload = { ...form, code: form.code.toUpperCase(), discountValue: Number(form.discountValue), minimumOrderAmount: form.minimumOrderAmount !== "" ? Number(form.minimumOrderAmount) : 0, maximumDiscountAmount: form.maximumDiscountAmount !== "" ? Number(form.maximumDiscountAmount) : null, useLimit: Number(form.useLimit) }; await onSave(payload); } catch (err) { setError(err?.response?.data?.errors?.[0]?.message || err?.response?.data?.message || "Save failed."); } finally { setSaving(false); } };
  const inp = "w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all";
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Coupon Code *</label><input type="text" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} disabled={!!initial} className={`${inp} uppercase ${initial ? "bg-gray-50 cursor-not-allowed" : ""}`} /></div>
        <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Discount Type *</label><select required value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className={`${inp} bg-white`}><option value="percentage">Percentage (%)</option><option value="fixed">Fixed Amount (₹)</option></select></div>
        <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Discount Value *</label><input type="number" required min="1" step="0.01" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} className={inp} /></div>
        <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Min. Order Amount (₹)</label><input type="number" min="0" value={form.minimumOrderAmount} onChange={(e) => setForm({ ...form, minimumOrderAmount: e.target.value })} className={inp} /></div>
        {form.discountType === "percentage" && (<div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Max Discount Cap (₹)</label><input type="number" min="0" value={form.maximumDiscountAmount} onChange={(e) => setForm({ ...form, maximumDiscountAmount: e.target.value })} className={inp} /></div>)}
        <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Total Use Limit *</label><input type="number" required min="1" value={form.useLimit} onChange={(e) => setForm({ ...form, useLimit: e.target.value })} className={inp} /></div>
        <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Expires On *</label><input type="date" required value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className={inp} /></div>
      </div>
      {initial && (<label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-(--secondary) w-4 h-4" /><span className="text-sm text-gray-600">Active</span></label>)}
      <div className="flex gap-3 pt-1"><button type="button" onClick={onClose} className="flex-1 py-2.5 border border-(--border-light) text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors">Cancel</button><button type="submit" disabled={saving} className="flex-1 py-2.5 bg-(--accent) text-white text-sm font-semibold rounded-lg hover:bg-(--secondary) transition-colors disabled:opacity-60">{saving ? "Saving..." : initial ? "Save Changes" : "Create Coupon"}</button></div>
    </form>
  );
}

function ManageCoupons() {
  const coupons = useCouponStore((s) => s.coupons);
  const { fetchCoupons, addCoupon, editCoupon, removeCoupon } = useCoupon();
  const [loading, setLoading] = useState(true); const [modal, setModal] = useState(null); const [sel, setSel] = useState(null); const [deleting, setDeleting] = useState(false); const [toast, setToast] = useState("");
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const closeModal = () => { setModal(null); setSel(null); };
  const load = useCallback(async () => { await fetchCoupons(); setLoading(false); }, []);
  useEffect(() => { load(); }, [load]);
  const handleSave = async (form) => { if (sel) { await editCoupon(sel._id, form); showToast("Coupon updated"); } else { await addCoupon(form); showToast("Coupon created"); } closeModal(); fetchCoupons(); };
  const handleDelete = async () => { setDeleting(true); try { await removeCoupon(sel._id); showToast("Coupon deleted"); closeModal(); fetchCoupons(); } finally { setDeleting(false); } };
  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
  const isExpired = (d) => d && new Date(d) < new Date();
  return (
    <div><SectionHeader title="Manage Coupons" count={coupons.length} buttonLabel="Add Coupon" onAction={() => { setSel(null); setModal("edit"); }} />
      <div className="px-6 py-4">
        {loading ? (<div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />)}</div>) : coupons.length === 0 ? (<div className="flex flex-col items-center justify-center py-20 text-center text-gray-400"><FaPercent className="text-4xl mb-3" /><p className="font-semibold">No coupons yet</p></div>) : (
          <div className="overflow-x-auto"><table className="w-full min-w-[700px]"><thead><tr className="border-b border-(--border-light)">{["Code", "Discount", "Min Order", "Usage", "Expires", "Status", "Actions"].map((h) => (<th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 px-3 first:pl-0 last:pr-0">{h}</th>))}</tr></thead><tbody className="divide-y divide-[var(--border-light)]">{coupons.map((c) => (<tr key={c._id} className="hover:bg-(--surface-warm) transition-colors"><td className="py-3.5 px-3 pl-0"><span className="font-mono text-sm font-bold text-(--accent) bg-(--surface-warm) px-2 py-0.5 rounded">{c.code}</span></td><td className="py-3.5 px-3"><span className="text-sm font-semibold text-green-700">{c.discountType === "fixed" ? `₹${c.discountValue}` : `${c.discountValue}%`}</span>{c.maximumDiscountAmount && (<p className="text-[11px] text-gray-400">max ₹{c.maximumDiscountAmount}</p>)}</td><td className="py-3.5 px-3"><span className="text-sm text-gray-600">{c.minimumOrderAmount > 0 ? `₹${c.minimumOrderAmount.toLocaleString()}` : "—"}</span></td><td className="py-3.5 px-3"><span className="text-sm text-gray-600">{c.usedCount} / {c.useLimit}</span></td><td className="py-3.5 px-3"><span className={`text-sm ${isExpired(c.expiresAt) ? "text-red-500 font-semibold" : "text-gray-600"}`}>{fmt(c.expiresAt)}</span></td><td className="py-3.5 px-3"><span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold ${c.isActive && !isExpired(c.expiresAt) ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>{!c.isActive ? "Inactive" : isExpired(c.expiresAt) ? "Expired" : "Active"}</span></td><td className="py-3.5 px-3 pr-0"><div className="flex items-center gap-1.5"><button onClick={() => { setSel(c); setModal("edit"); }} className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 hover:bg-amber-100 flex items-center justify-center transition-colors"><FaEdit className="text-xs" /></button><button onClick={() => { setSel(c); setModal("delete"); }} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"><FaTrash className="text-xs" /></button></div></td></tr>))}</tbody></table></div>
        )}
      </div>
      {modal === "edit" && (<Modal title={sel ? "Edit Coupon" : "Create Coupon"} onClose={closeModal} wide><CouponForm initial={sel} onSave={handleSave} onClose={closeModal} /></Modal>)}
      {modal === "delete" && sel && (<DeleteConfirm type="Coupon" name={sel.code} loading={deleting} onClose={closeModal} onConfirm={handleDelete} />)}
      {toast && <Toast message={toast} />}
    </div>
  );
}

function CouponsTab() {
  const coupons = useCouponStore((s) => s.coupons);
  const loading = useCouponStore((s) => s.loading);
  const { fetchCoupons } = useCoupon();
  const [copiedCode, setCopiedCode] = useState("");
  useEffect(() => { fetchCoupons(); }, []);
  const activeCoupons = coupons.filter((c) => c.isActive && new Date(c.expiresAt) > new Date() && c.usedCount < c.useLimit);
  const handleCopy = (code) => { navigator.clipboard.writeText(code).catch(() => {}); setCopiedCode(code); setTimeout(() => setCopiedCode(""), 2000); };
  const daysLeft = (d) => Math.ceil((new Date(d) - new Date()) / (1000 * 60 * 60 * 24));
  return (
    <div><SectionHeader title="Available Coupons" count={activeCoupons.length} />
      <div className="px-6 py-4">
        {loading ? (<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />)}</div>) : activeCoupons.length === 0 ? (<div className="flex flex-col items-center justify-center py-20 text-center text-gray-400"><FaPercent className="text-4xl mb-3" /><p className="font-semibold text-gray-600">No coupons available right now</p></div>) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{activeCoupons.map((c) => { const days = daysLeft(c.expiresAt); const isCopied = copiedCode === c.code; return (<div key={c._id} className="bg-white border border-(--border-light) rounded-xl overflow-hidden hover:border-(--secondary) transition-colors"><div className="h-1.5 bg-(--accent)" /><div className="p-4"><div className="flex items-start justify-between gap-3 mb-3"><div><div className="flex items-center gap-2 mb-1"><FaPercent className="text-(--secondary) text-xs" /><span className="text-xs font-bold text-(--secondary) uppercase tracking-wide">{c.discountType === "fixed" ? "Flat Discount" : "Percentage Off"}</span></div><p className="text-2xl font-black text-(--accent)">{c.discountType === "fixed" ? `₹${c.discountValue}` : `${c.discountValue}%`}<span className="text-sm font-semibold text-gray-500 ml-1">OFF</span></p>{c.maximumDiscountAmount && (<p className="text-[11px] text-gray-400 mt-0.5">Up to ₹{c.maximumDiscountAmount.toLocaleString()} discount</p>)}</div><div className="text-right shrink-0"><p className={`text-xs font-semibold ${days <= 3 ? "text-red-500" : "text-gray-400"}`}>{days === 1 ? "Expires today!" : `${days}d left`}</p></div></div>{c.minimumOrderAmount > 0 && (<p className="text-xs text-gray-500 mb-3">Min. order: <span className="font-semibold text-(--accent)">₹{c.minimumOrderAmount.toLocaleString()}</span></p>)}<div className="flex items-center gap-2 bg-(--surface-warm) rounded-lg px-3 py-2"><span className="flex-1 font-mono text-sm font-bold text-(--accent) tracking-widest">{c.code}</span><button onClick={() => handleCopy(c.code)} className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all ${isCopied ? "bg-green-100 text-green-700" : "bg-(--accent) text-white hover:bg-(--secondary)"}`}>{isCopied ? <FaCheck className="text-[10px]" /> : <FaClipboard className="text-[10px]" />}{isCopied ? "Copied!" : "Copy"}</button></div></div></div>); })}</div>
        )}
      </div>
    </div>
  );
}

function WishlistTab() {
  const items = useWishlistStore((s) => s.items);
  const loading = useWishlistStore((s) => s.loading);
  const { fetchWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const router = useRouter();
  const [toast, setToast] = useState(""); const [removingId, setRemovingId] = useState(null); const [addingId, setAddingId] = useState(null);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  useEffect(() => { fetchWishlist(); }, []);
  const handleRemove = async (id) => { setRemovingId(id); try { await removeFromWishlist(id); showToast("Removed from wishlist"); } finally { setRemovingId(null); } };
  const handleAddToCart = async (productId) => { setAddingId(productId); try { await addToCart(productId, 1); showToast("Added to cart!"); } catch { showToast("Failed to add to cart"); } finally { setAddingId(null); } };
  return (
    <div><SectionHeader title="My Wishlist" count={items.length > 0 ? items.length : undefined} />
      <div className="px-6 py-4">
        {loading ? (<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse" />)}</div>) : items.length === 0 ? (<div className="flex flex-col items-center justify-center py-20 text-center text-gray-400"><FaHeart className="text-4xl mb-3" /><p className="font-semibold text-gray-600">Your wishlist is empty</p><button onClick={() => router.push("/products")} className="mt-4 px-5 py-2 bg-(--accent) text-white text-sm font-semibold rounded-lg hover:bg-(--secondary) transition-colors">Browse Products</button></div>) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">{items.map((item) => { const product = item.product || item; const image = product.images?.[0]?.url; return (<div key={item._id} className="bg-white border border-(--border-light) rounded-xl overflow-hidden group flex flex-col hover:border-(--secondary) transition-colors"><div className="relative h-44 overflow-hidden bg-gray-50 cursor-pointer" onClick={() => router.push(`/product/${product._id}`)}>{image ? <img src={image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><FaImage className="text-4xl" /></div>}</div><div className="p-4 flex flex-col flex-1"><p className="text-[10px] font-bold text-(--secondary) uppercase tracking-wider mb-0.5">{product.brand}</p><p className="text-sm font-bold text-(--accent) line-clamp-2 mb-1 cursor-pointer hover:text-(--secondary) transition-colors" onClick={() => router.push(`/product/${product._id}`)}>{product.title}</p><p className="text-base font-extrabold text-(--accent) mb-3">₹{product.price?.toLocaleString()}</p><div className="flex gap-2 mt-auto"><button onClick={() => handleAddToCart(product._id)} disabled={addingId === product._id} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-(--accent) text-white text-xs font-semibold rounded-lg hover:bg-(--secondary) transition-colors disabled:opacity-60"><FaShoppingCart className="text-[10px]" />{addingId === product._id ? "Adding…" : "Add to Cart"}</button><button onClick={() => handleRemove(item._id)} disabled={removingId === item._id} className="w-9 h-9 flex items-center justify-center rounded-lg border border-red-100 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"><FaTrash className="text-xs" /></button></div></div></div>); })}</div>
        )}
      </div>
      {toast && <Toast message={toast} />}
    </div>
  );
}

function ManageBanners() {
  const heroBanners = useBannerStore((s) => s.heroBanners);
  const middleBanners = useBannerStore((s) => s.middleBanners);
  const loading = useBannerStore((s) => s.loading);
  const { fetchAllBanners, createBanner, updateBanner, deleteBanner } = useBanner();
  const [modal, setModal] = useState(null); const [sel, setSel] = useState(null); const [deleting, setDeleting] = useState(false); const [toast, setToast] = useState(""); const [activeType, setActiveType] = useState("hero");
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const closeModal = () => { setModal(null); setSel(null); };
  useEffect(() => { fetchAllBanners(); }, []);
  const allBanners = activeType === "hero" ? heroBanners : middleBanners;

  const BannerForm = ({ initial, onClose }) => {
    const [form, setForm] = useState({ title: initial?.title || "", subtitle: initial?.subtitle || "", image: initial?.image || "", link: initial?.link || "", type: initial?.type || activeType, serialNo: initial?.serialNo ?? 1, isActive: initial?.isActive !== false });
    const [saving, setSaving] = useState(false); const [error, setError] = useState("");
    const handleSubmit = async (e) => { e.preventDefault(); setError(""); setSaving(true); try { if (initial) { await updateBanner(initial._id, form); showToast("Banner updated"); } else { await createBanner(form); showToast("Banner created"); } onClose(); } catch (err) { setError(err?.response?.data?.message || "Save failed"); } finally { setSaving(false); } };
    const inp = "w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all";
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{error}</div>}
        <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Title *</label><input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inp} /></div>
        <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Subtitle</label><input type="text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className={inp} /></div>
        <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Image URL *</label><input type="url" required value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={inp} />{form.image && <img src={form.image} alt="preview" className="mt-2 h-24 w-full object-cover rounded-lg border border-(--border-light)" />}</div>
        <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Link URL</label><input type="text" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className={inp} /></div>
        <div className="grid grid-cols-2 gap-4"><div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Type *</label><select required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={`${inp} bg-white`}><option value="hero">Hero</option><option value="middle">Middle</option></select></div><div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Order</label><input type="number" min="1" value={form.serialNo} onChange={(e) => setForm({ ...form, serialNo: Number(e.target.value) })} className={inp} /></div></div>
        {initial && (<label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-(--secondary) w-4 h-4" /><span className="text-sm text-gray-600">Active</span></label>)}
        <div className="flex gap-3 pt-1"><button type="button" onClick={onClose} className="flex-1 py-2.5 border border-(--border-light) text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50">Cancel</button><button type="submit" disabled={saving} className="flex-1 py-2.5 bg-(--accent) text-white text-sm font-semibold rounded-lg hover:bg-(--secondary) disabled:opacity-60">{saving ? "Saving…" : initial ? "Save Changes" : "Create Banner"}</button></div>
      </form>
    );
  };

  const handleDelete = async () => { setDeleting(true); try { await deleteBanner(sel._id); showToast("Banner deleted"); closeModal(); } finally { setDeleting(false); } };

  return (
    <div><SectionHeader title="Manage Banners" count={heroBanners.length + middleBanners.length} buttonLabel="Add Banner" onAction={() => { setSel(null); setModal("edit"); }} />
      <div className="px-6 py-4">
        <div className="flex gap-2 mb-5">{["hero", "middle"].map((t) => (<button key={t} onClick={() => setActiveType(t)} className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${activeType === t ? "bg-(--accent) text-white" : "bg-white border border-(--border-light) text-gray-600 hover:border-(--secondary)"}`}>{t} Banners ({t === "hero" ? heroBanners.length : middleBanners.length})</button>))}</div>
        {loading ? (<div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}</div>) : allBanners.length === 0 ? (<div className="flex flex-col items-center justify-center py-20 text-center text-gray-400"><FaImage className="text-4xl mb-3" /><p className="font-semibold">No {activeType} banners yet</p></div>) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{allBanners.map((b) => (<div key={b._id} className="bg-white border border-(--border-light) rounded-xl overflow-hidden hover:border-(--secondary) transition-colors group">{b.image && <img src={b.image} alt={b.title} className="w-full h-36 object-cover" />}{!b.image && <div className="w-full h-24 bg-(--surface-warm) flex items-center justify-center text-gray-300"><FaImage className="text-3xl" /></div>}<div className="p-3"><div className="flex items-start justify-between gap-2 mb-2"><div className="min-w-0"><p className="text-sm font-bold text-(--accent) line-clamp-1">{b.title}</p>{b.subtitle && <p className="text-xs text-gray-500 line-clamp-1">{b.subtitle}</p>}</div><div className="flex items-center gap-2 shrink-0"><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${b.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>{b.isActive ? "Active" : "Inactive"}</span><span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold">#{b.serialNo}</span></div></div><div className="flex gap-2"><button onClick={() => { setSel(b); setModal("edit"); }} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"><FaEdit className="text-[10px]" /> Edit</button><button onClick={() => { setSel(b); setModal("delete"); }} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors"><FaTrash className="text-[10px]" /> Delete</button></div></div></div>))}</div>
        )}
      </div>
      {modal === "edit" && (<Modal title={sel ? "Edit Banner" : "Create Banner"} onClose={closeModal} wide><BannerForm initial={sel} onClose={closeModal} /></Modal>)}
      {modal === "delete" && sel && (<DeleteConfirm type="Banner" name={sel.title} loading={deleting} onClose={closeModal} onConfirm={handleDelete} />)}
      {toast && <Toast message={toast} />}
    </div>
  );
}

const INDIAN_STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"];

function ManageShipping() {
  const config = useShippingStore((s) => s.config);
  const loading = useShippingStore((s) => s.loading);
  const { fetchShipping, createShipping, updateShipping } = useShipping();
  const [mode, setMode] = useState("view");
  const [form, setForm] = useState({ mode: "flat", flatCharge: "", freeShippingAbove: "", slabs: [], states: [], isActive: true });
  const [saving, setSaving] = useState(false); const [error, setError] = useState(""); const [toast, setToast] = useState("");
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  useEffect(() => { fetchShipping(); }, []);
  const syncFormFromConfig = () => { setForm({ mode: config?.mode || "flat", flatCharge: config?.flatCharge ?? "", freeShippingAbove: config?.freeShippingAbove ?? "", slabs: (config?.slabs || []).map((s) => ({ minAmount: s.minAmount, maxAmount: s.maxAmount, charge: s.charge })), states: (config?.states || []).map((s) => ({ state: s.state, charge: s.charge })), isActive: config?.isActive !== false }); };
  useEffect(() => { if (config) syncFormFromConfig(); }, [config]);
  const addSlab = () => setForm((f) => ({ ...f, slabs: [...f.slabs, { minAmount: "", maxAmount: "", charge: "" }] }));
  const updateSlab = (i, key, val) => setForm((f) => ({ ...f, slabs: f.slabs.map((s, idx) => idx === i ? { ...s, [key]: val } : s) }));
  const removeSlab = (i) => setForm((f) => ({ ...f, slabs: f.slabs.filter((_, idx) => idx !== i) }));
  const addState = () => setForm((f) => ({ ...f, states: [...f.states, { state: "", charge: "" }] }));
  const updateStateRow = (i, key, val) => setForm((f) => ({ ...f, states: f.states.map((s, idx) => idx === i ? { ...s, [key]: val } : s) }));
  const removeState = (i) => setForm((f) => ({ ...f, states: f.states.filter((_, idx) => idx !== i) }));
  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    if (form.mode === "flat" && form.flatCharge === "") { setError("Flat charge is required."); return; }
    if (form.mode === "state" && (form.states.length === 0 || form.states.some((s) => !s.state || s.charge === ""))) { setError("Add at least one state with a charge."); return; }
    if (form.mode === "slab" && (form.slabs.length === 0 || form.slabs.some((s) => s.minAmount === "" || s.maxAmount === "" || s.charge === ""))) { setError("Each slab needs min, max and charge."); return; }
    setSaving(true);
    try {
      const payload = { mode: form.mode, freeShippingAbove: Number(form.freeShippingAbove) || 0, flatCharge: Number(form.flatCharge) || 0, slabs: form.mode === "slab" ? form.slabs.map((s) => ({ minAmount: Number(s.minAmount), maxAmount: Number(s.maxAmount), charge: Number(s.charge) })) : [], states: form.mode === "state" ? form.states.map((s) => ({ state: s.state, charge: Number(s.charge) })) : [], isActive: form.isActive };
      if (config) { await updateShipping(config._id, payload); showToast("Shipping config updated"); } else { await createShipping(payload); showToast("Shipping config created"); }
      setMode("view");
    } catch (err) { setError(err?.response?.data?.message || "Save failed"); } finally { setSaving(false); }
  };
  const inp = "w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all";
  const modeLabel = { flat: "Flat Rate", state: "State-wise", slab: "Amount Slabs" };
  return (
    <div><SectionHeader title="Shipping Configuration" />
      <div className="px-6 py-6 max-w-2xl">
        {loading ? (<div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}</div>) : (
          <div className="bg-white rounded-2xl border border-(--border-light) overflow-hidden">
            <div className="bg-(--accent) px-6 py-5 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><FaTruck className="text-white text-lg" /></div><div className="flex-1"><p className="text-white font-bold">Shipping Settings</p><p className="text-white/70 text-xs">{config ? "Config active" : "No config yet"}</p></div>{config && (<span className={`text-[11px] px-2.5 py-1 rounded-full font-bold ${config.isActive ? "bg-green-400/30 text-white" : "bg-red-400/30 text-white"}`}>{config.isActive ? "Active" : "Inactive"}</span>)}</div>
            {mode === "view" && config ? (
              <div className="p-6">
                <div className="space-y-0 mb-5">
                  <div className="flex items-center justify-between py-3 border-b border-(--border-light)"><span className="text-sm text-gray-500 font-medium">Shipping Mode</span><span className="text-sm font-bold text-(--accent)">{modeLabel[config.mode] || config.mode}</span></div>
                  <div className="flex items-center justify-between py-3 border-b border-(--border-light)"><span className="text-sm text-gray-500 font-medium">Free Shipping Above</span><span className="text-sm font-bold text-(--accent)">{config.freeShippingAbove > 0 ? `₹${config.freeShippingAbove.toLocaleString()}` : "Not set"}</span></div>
                  {config.mode === "flat" && (<div className="flex items-center justify-between py-3"><span className="text-sm text-gray-500 font-medium">Flat Charge</span><span className="text-sm font-bold text-(--accent)">₹{(config.flatCharge || 0).toLocaleString()}</span></div>)}
                  {config.mode === "state" && (<div className="py-3"><p className="text-sm text-gray-500 font-medium mb-2">State-wise Charges</p><div className="space-y-1.5">{(config.states || []).map((s, i) => (<div key={i} className="flex items-center justify-between bg-(--surface-warm) rounded-lg px-3 py-2"><span className="text-sm text-(--accent) font-medium">{s.state}</span><span className="text-sm font-bold text-(--accent)">₹{(s.charge || 0).toLocaleString()}</span></div>))}</div></div>)}
                  {config.mode === "slab" && (<div className="py-3"><p className="text-sm text-gray-500 font-medium mb-2">Amount Slabs</p><div className="space-y-1.5">{(config.slabs || []).map((s, i) => (<div key={i} className="flex items-center justify-between bg-(--surface-warm) rounded-lg px-3 py-2"><span className="text-sm text-(--accent) font-medium">₹{s.minAmount?.toLocaleString()} – ₹{s.maxAmount?.toLocaleString()}</span><span className="text-sm font-bold text-(--accent)">₹{(s.charge || 0).toLocaleString()}</span></div>))}</div></div>)}
                </div>
                <button onClick={() => { syncFormFromConfig(); setError(""); setMode("edit"); }} className="w-full py-2.5 bg-(--accent) text-white text-sm font-semibold rounded-xl hover:bg-(--secondary) transition-colors flex items-center justify-center gap-2"><FaEdit className="text-xs" /> Edit Configuration</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{error}</div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Shipping Mode *</label><select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} className={`${inp} bg-white`}><option value="flat">Flat Rate</option><option value="state">State-wise</option><option value="slab">Amount Slabs</option></select></div>
                  <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Free Shipping Above (₹)</label><input type="number" min="0" value={form.freeShippingAbove} onChange={(e) => setForm({ ...form, freeShippingAbove: e.target.value })} className={inp} /></div>
                </div>
                {form.mode === "flat" && (<div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Flat Charge (₹) *</label><input type="number" min="0" value={form.flatCharge} onChange={(e) => setForm({ ...form, flatCharge: e.target.value })} className={inp} /></div>)}
                {form.mode === "state" && (<div><div className="flex items-center justify-between mb-2"><label className="text-xs font-semibold text-gray-600">State-wise Charges *</label><button type="button" onClick={addState} className="text-xs text-(--secondary) font-semibold flex items-center gap-1"><FaPlus className="text-[10px]" /> Add State</button></div><div className="space-y-2">{form.states.map((s, i) => (<div key={i} className="flex gap-2"><select value={s.state} onChange={(e) => updateStateRow(i, "state", e.target.value)} className={`${inp} bg-white flex-1`}><option value="">Select state</option>{INDIAN_STATES.map((st) => <option key={st} value={st}>{st}</option>)}</select><input type="number" min="0" value={s.charge} onChange={(e) => updateStateRow(i, "charge", e.target.value)} className={`${inp} w-32`} /><button type="button" onClick={() => removeState(i)} className="w-10 shrink-0 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center"><FaTrash className="text-xs" /></button></div>))}{form.states.length === 0 && <p className="text-xs text-gray-400">No states added yet.</p>}</div></div>)}
                {form.mode === "slab" && (<div><div className="flex items-center justify-between mb-2"><label className="text-xs font-semibold text-gray-600">Amount Slabs *</label><button type="button" onClick={addSlab} className="text-xs text-(--secondary) font-semibold flex items-center gap-1"><FaPlus className="text-[10px]" /> Add Slab</button></div><div className="space-y-2">{form.slabs.map((s, i) => (<div key={i} className="flex gap-2"><input type="number" min="0" value={s.minAmount} onChange={(e) => updateSlab(i, "minAmount", e.target.value)} placeholder="Min ₹" className={`${inp} flex-1`} /><input type="number" min="0" value={s.maxAmount} onChange={(e) => updateSlab(i, "maxAmount", e.target.value)} placeholder="Max ₹" className={`${inp} flex-1`} /><input type="number" min="0" value={s.charge} onChange={(e) => updateSlab(i, "charge", e.target.value)} placeholder="Charge ₹" className={`${inp} flex-1`} /><button type="button" onClick={() => removeSlab(i)} className="w-10 shrink-0 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center"><FaTrash className="text-xs" /></button></div>))}{form.slabs.length === 0 && <p className="text-xs text-gray-400">No slabs added yet.</p>}</div></div>)}
                <label className="flex items-center gap-3 cursor-pointer pt-1"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-(--secondary) w-4 h-4" /><span className="text-sm text-gray-600">Active (used at checkout)</span></label>
                <div className="flex gap-3 pt-1">{config && (<button type="button" onClick={() => { syncFormFromConfig(); setError(""); setMode("view"); }} className="flex-1 py-2.5 border border-(--border-light) text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>)}<button type="submit" disabled={saving} className="flex-1 py-2.5 bg-(--accent) text-white text-sm font-semibold rounded-xl hover:bg-(--secondary) transition-colors disabled:opacity-60">{saving ? "Saving…" : config ? "Save Changes" : "Create Config"}</button></div>
              </form>
            )}
          </div>
        )}
      </div>
      {toast && <Toast message={toast} />}
    </div>
  );
}

function PlaceholderTab({ title, icon }) {
  return (
    <div className="px-6 py-6"><h2 className="text-xl font-bold text-(--accent) mb-6">{title}</h2><div className="flex flex-col items-center justify-center h-52 text-center bg-white rounded-2xl border border-(--border-light)"><div className="w-14 h-14 rounded-full bg-(--surface-warm) flex items-center justify-center text-(--secondary) text-2xl mb-3">{icon}</div><p className="font-semibold text-gray-700">{title}</p><p className="text-sm text-gray-400 mt-1 max-w-xs">This section is coming soon.</p></div></div>
  );
}

// ─── Main Dashboard Page ──────────────────────────────────────
export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => { if (!isAuthenticated) router.replace("/auth"); }, [isAuthenticated, router]);
  useEffect(() => { const params = new URLSearchParams(window.location.search); const tab = params.get("tab"); if (tab) setActiveTab(tab); }, []);

  if (!isAuthenticated || !user) {
    return (<div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 rounded-full border-2 border-(--secondary) border-t-transparent animate-spin" /></div>);
  }

  const handleLogout = async () => { logout(); router.push("/"); };

  const renderContent = () => {
    switch (activeTab) {
      case "profile": return <ProfileTab user={user} />;
      case "analytics": return user?.role === "superadmin" ? <AnalyticsTab /> : <ProfileTab user={user} />;
      case "manage-products": return <ManageProducts />;
      case "create-product": return <CreateProductSection />;
      case "manage-categories": return <ManageCategories />;
      case "create-category": return <CreateCategorySection />;
      case "orders": return isAdminRole(user?.role) ? <AdminOrdersTab /> : <MyOrdersTab />;
      case "user-management": return <UserManagementTab />;
      case "admin-management": return <AdminManagementTab />;
      case "manage-coupons": return <ManageCoupons />;
      case "manage-banners": return <ManageBanners />;
      case "manage-shipping": return <ManageShipping />;
      case "coupons": return <CouponsTab />;
      case "cart": return <CartTab />;
      case "wishlist": return <WishlistTab />;
      case "settings": return <PlaceholderTab title="Settings" icon={<FaCog />} />;
      default: return <ProfileTab user={user} />;
    }
  };

  const tabLabel = activeTab.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="flex min-h-screen bg-(--surface-warm)">
      <Sidebar user={user} activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} mobileOpen={mobileSidebarOpen} onMobileClose={() => setMobileSidebarOpen(false)} />
      <div className="flex-1 min-w-0">
        <div className="md:hidden sticky top-0 z-20 bg-white border-b border-(--border-light) px-4 py-3 flex items-center gap-3">
          <button onClick={() => setMobileSidebarOpen(true)} className="w-9 h-9 rounded-lg bg-(--surface-warm) flex items-center justify-center text-(--accent) hover:bg-(--primary) transition-colors"><FaBars className="text-sm" /></button>
          <span className="font-bold text-(--accent) text-sm">{tabLabel}</span>
        </div>
        <div className="max-w-5xl mx-auto w-full">{renderContent()}</div>
      </div>
    </div>
  );
}