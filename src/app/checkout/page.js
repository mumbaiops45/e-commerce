"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuthStore from "@/store/auth.store";
import useCartStore from "@/store/cart.store";
import { useCart } from "@/hooks/useCart";
import { placeOrder } from "@/routes/order.routes";
import {
  FaArrowLeft, FaShoppingBag, FaMapMarkerAlt, FaCreditCard,
  FaCheckCircle, FaImage, FaTruck, FaLock,
} from "react-icons/fa";

export default function CheckoutPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const dashboardPath = user?.role === "superadmin"
    ? "/superadmin/dashboard"
    : user?.role === "admin"
    ? "/admin/dashboard"
    : "/user/dashboard";
  const items = useCartStore((s) => s.items);
  const { emptyCart } = useCart();

  const [step, setStep] = useState("address"); // address | payment | success
  const [createdOrder, setCreatedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [addr, setAddr] = useState({
    name: "", phone: "", address: "", city: "", state: "", pincode: "",
  });

  const [payCard, setPayCard] = useState({ number: "", name: "", expiry: "", cvv: "" });

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth");
      return;
    }
    if (user?.name) {
      setAddr((a) => ({ ...a, name: user.name, phone: user.phone || "" }));
    }
  }, [isAuthenticated, user]);

  // If cart empties and not on success, go back
  useEffect(() => {
    if (step !== "success" && isAuthenticated && items.length === 0) {
      router.replace(`${dashboardPath}?tab=cart`);
    }
  }, [items, step, isAuthenticated]);

  const subtotal = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);
  const shipping = subtotal >= 2500 ? 0 : 100;
  const total = subtotal + shipping;

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const orderItems = items.map((item) => ({
        productId: item.product?._id || item.product,
        quantity: item.quantity,
      }));
      const result = await placeOrder(orderItems, addr);
      setCreatedOrder(result.order);
      setStep("payment");
    } catch (err) {
      setError(
        err?.response?.data?.errors?.[0]?.message ||
        err?.response?.data?.message ||
        "Failed to create order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDummyPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    try { await emptyCart(); } catch {}
    setStep("success");
    setLoading(false);
  };

  if (!isAuthenticated) return null;

  // ─── Success ──────────────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <div className="min-h-screen bg-(--surface-warm) flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <FaCheckCircle className="text-green-500 text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-(--accent) mb-2">Order Placed!</h2>
          <p className="text-gray-500 text-sm mb-1">
            Order <span className="font-semibold text-(--accent)">#{createdOrder?._id?.slice(-8).toUpperCase()}</span> confirmed.
          </p>
          <p className="text-gray-400 text-xs mb-8">
            View it anytime in your account under <strong>My Orders</strong>.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href={`${dashboardPath}?tab=orders`}
              className="py-3 bg-(--accent) text-white text-sm font-bold rounded-xl hover:bg-(--secondary) transition-colors block"
            >
              View My Orders
            </Link>
            <Link
              href="/"
              className="py-3 border border-(--border-light) text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors block"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Order summary sidebar (shared across steps) ──────────────────────────
  const OrderSummary = () => (
    <div className="bg-white rounded-2xl border border-(--border-light) p-5 sticky top-4">
      <h3 className="font-bold text-(--accent) mb-4 flex items-center gap-2 text-sm">
        <FaShoppingBag /> Order Summary
      </h3>

      <div className="space-y-3 max-h-56 overflow-y-auto mb-4 pr-1">
        {items.map((item) => {
          const product = item.product;
          if (!product) return null;
          const img = product.images?.[0];
          return (
            <div key={product._id || product} className="flex gap-3 items-center">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                {img
                  ? <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-gray-400"><FaImage className="text-xs" /></div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-(--accent) line-clamp-1">{product.title || product.name}</p>
                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
              </div>
              <p className="text-xs font-bold text-gray-700 shrink-0">
                ₹{((product.price || 0) * item.quantity).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      {step === "payment" && (
        <div className="mb-4 p-3 bg-(--surface-warm) rounded-xl text-xs text-gray-600">
          <p className="font-semibold text-(--accent) mb-1 flex items-center gap-1.5">
            <FaMapMarkerAlt className="text-[10px]" /> Deliver To
          </p>
          <p className="font-semibold">{addr.name}</p>
          <p>{addr.address}, {addr.city}</p>
          <p>{addr.state} – {addr.pincode}</p>
          <p className="mt-0.5">Ph: {addr.phone}</p>
        </div>
      )}

      <div className="border-t border-(--border-light) pt-4 space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>
            {shipping === 0 ? "FREE" : `₹${shipping}`}
          </span>
        </div>
        <div className="flex justify-between font-bold text-(--accent) text-base border-t border-(--border-light) pt-2">
          <span>Total</span><span>₹{total.toLocaleString()}</span>
        </div>
      </div>

      {subtotal > 0 && subtotal < 2500 && (
        <p className="text-[11px] text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mt-3">
          Add ₹{(2500 - subtotal).toLocaleString()} more for free shipping
        </p>
      )}

      <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-400">
        <FaTruck className="text-[10px]" />
        <span>Estimated delivery: 3–5 business days</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-(--surface-warm) py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => step === "payment" ? setStep("address") : router.push(dashboardPath)}
            className="w-9 h-9 rounded-lg bg-white border border-(--border-light) flex items-center justify-center text-gray-500 hover:text-(--accent) transition-colors"
          >
            <FaArrowLeft className="text-xs" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-(--accent)">Checkout</h1>
            <p className="text-xs text-gray-500">
              {step === "address" ? "Enter delivery details" : "Complete payment"}
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-7">
          {[{ label: "Address", key: "address" }, { label: "Payment", key: "payment" }].map((s, idx) => {
            const active = step === s.key;
            const done = s.key === "address" && step === "payment";
            return (
              <div key={s.key} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${done ? "bg-green-500 text-white" : active ? "bg-(--accent) text-white" : "bg-gray-200 text-gray-500"}`}>
                  {done ? "✓" : idx + 1}
                </div>
                <span className={`text-sm font-semibold ${active ? "text-(--accent)" : done ? "text-green-600" : "text-gray-400"}`}>
                  {s.label}
                </span>
                {idx < 1 && <div className={`w-8 h-0.5 ${done ? "bg-green-400" : "bg-gray-200"}`} />}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Address step ───────────────────────────────────── */}
          {step === "address" && (
            <div className="flex-1">
              <div className="bg-white rounded-2xl border border-(--border-light) overflow-hidden">
                <div className="px-6 py-4 border-b border-(--border-light) flex items-center gap-3">
                  <FaMapMarkerAlt className="text-(--accent)" />
                  <h2 className="font-bold text-(--accent)">Delivery Address</h2>
                </div>
                <form onSubmit={handleAddressSubmit} className="px-6 py-5 space-y-4">
                  {error && (
                    <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{error}</div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name *</label>
                      <input type="text" required value={addr.name}
                        onChange={(e) => setAddr({ ...addr, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone Number *</label>
                      <input type="tel" required pattern="\d{10}" maxLength={10} value={addr.phone}
                        onChange={(e) => setAddr({ ...addr, phone: e.target.value.replace(/\D/g, "") })}
                        placeholder="10-digit number"
                        className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Address *</label>
                      <input type="text" required value={addr.address}
                        onChange={(e) => setAddr({ ...addr, address: e.target.value })}
                        placeholder="House no., Street, Area"
                        className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">City *</label>
                      <input type="text" required value={addr.city}
                        onChange={(e) => setAddr({ ...addr, city: e.target.value })}
                        placeholder="e.g. Mumbai"
                        className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">State *</label>
                      <input type="text" required value={addr.state}
                        onChange={(e) => setAddr({ ...addr, state: e.target.value })}
                        placeholder="e.g. Maharashtra"
                        className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Pincode *</label>
                      <input type="text" required pattern="\d{6}" maxLength={6} value={addr.pincode}
                        onChange={(e) => setAddr({ ...addr, pincode: e.target.value.replace(/\D/g, "") })}
                        placeholder="6-digit pincode"
                        className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all" />
                    </div>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full mt-2 py-3 bg-(--accent) text-white font-bold text-sm rounded-xl hover:bg-(--secondary) transition-colors disabled:opacity-60">
                    {loading ? "Processing…" : "Continue to Payment →"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ── Payment step ───────────────────────────────────── */}
          {step === "payment" && (
            <div className="flex-1">
              <div className="bg-white rounded-2xl border border-(--border-light) overflow-hidden">
                <div className="px-6 py-4 border-b border-(--border-light) flex items-center gap-3">
                  <FaCreditCard className="text-(--accent)" />
                  <div>
                    <h2 className="font-bold text-(--accent)">Dummy Payment</h2>
                    <p className="text-xs text-amber-600 font-medium">Test mode — no real charge</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5 text-green-600 text-xs font-semibold">
                    <FaLock className="text-[10px]" /> Secure
                  </div>
                </div>
                <form onSubmit={handleDummyPayment} className="px-6 py-5 space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700 font-medium">
                    This is a test payment. Enter any values to proceed. Real Razorpay integration will replace this.
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Card Number</label>
                    <input type="text" maxLength={19} value={payCard.number}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                        setPayCard({ ...payCard, number: v.replace(/(.{4})/g, "$1 ").trim() });
                      }}
                      placeholder="1234 5678 9012 3456"
                      className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Name on Card</label>
                    <input type="text" value={payCard.name}
                      onChange={(e) => setPayCard({ ...payCard, name: e.target.value })}
                      placeholder="Rahul Sharma"
                      className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Expiry (MM/YY)</label>
                      <input type="text" maxLength={5} value={payCard.expiry}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                          setPayCard({ ...payCard, expiry: v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v });
                        }}
                        placeholder="MM/YY"
                        className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all font-mono" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">CVV</label>
                      <input type="password" maxLength={3} value={payCard.cvv}
                        onChange={(e) => setPayCard({ ...payCard, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                        placeholder="•••"
                        className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all font-mono" />
                    </div>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-3 bg-green-600 text-white font-bold text-sm rounded-xl hover:bg-green-700 transition-colors disabled:opacity-60">
                    {loading ? "Processing Payment…" : `Pay ₹${total.toLocaleString()} (Test Mode)`}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Order summary sidebar */}
          <div className="lg:w-80 shrink-0">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
