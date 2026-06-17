"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuthStore from "@/store/auth.store";
import useCartStore from "@/store/cart.store";
import { useCart } from "@/hooks/useCart";
import { placeOrder } from "@/routes/order.routes";
import { getAllCoupons } from "@/routes/coupon.routes";
import { createPaymentOrder, verifyPayment } from "@/routes/payment.routes";
import {
  FaArrowLeft, FaShoppingBag, FaMapMarkerAlt,
  FaCheckCircle, FaImage, FaTruck, FaTag, FaTimes,
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

  const [step, setStep] = useState("address"); // address | success
  const [createdOrder, setCreatedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [addr, setAddr] = useState({
    name: "", phone: "", address: "", city: "", state: "", pincode: "",
  });

  // ─── Coupon state ─────────────────────────────────────────────
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth");
      return;
    }
    if (user?.name) {
      setAddr((a) => ({ ...a, name: user.name, phone: user.phone || "" }));
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (step !== "success" && isAuthenticated && items.length === 0) {
      router.replace(`${dashboardPath}?tab=cart`);
    }
  }, [items, step, isAuthenticated]);

  const subtotal = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);
  const shipping = subtotal >= 2500 ? 0 : 100;
  const total = subtotal + shipping - discountAmount;

  // ─── Apply coupon ─────────────────────────────────────────────
  const handleApplyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setCouponError("");
    setCouponLoading(true);
    try {
      const data = await getAllCoupons();
      const coupon = (data.coupons || []).find(
        (c) => c.code === code && c.isActive
      );

      if (!coupon) { setCouponError("Invalid or inactive coupon code."); return; }
      if (new Date(coupon.expiresAt) < new Date()) { setCouponError("This coupon has expired."); return; }
      if (coupon.usedCount >= coupon.useLimit) { setCouponError("This coupon's usage limit has been reached."); return; }
      if (subtotal < coupon.minimumOrderAmount) {
        setCouponError(`Minimum order of ₹${coupon.minimumOrderAmount.toLocaleString()} required for this coupon.`);
        return;
      }

      let discount = coupon.discountType === "fixed"
        ? coupon.discountValue
        : (subtotal * coupon.discountValue) / 100;

      if (coupon.maximumDiscountAmount && discount > coupon.maximumDiscountAmount) {
        discount = coupon.maximumDiscountAmount;
      }
      discount = Math.min(discount, subtotal);

      setAppliedCoupon(coupon);
      setDiscountAmount(discount);
    } catch {
      setCouponError("Failed to validate coupon. Please try again.");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponInput("");
    setCouponError("");
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const orderItems = items.map((item) => ({
        productId: item.product?._id || item.product,
        quantity: item.quantity,
      }));

      // Step 1: Create the order (pending payment), pass coupon code if applied
      const result = await placeOrder(orderItems, addr, appliedCoupon?.code);
      const order = result.order;
      setCreatedOrder(order);

      // Step 2: Load Razorpay and open payment modal
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        await emptyCart().catch(() => {});
        router.push(`${dashboardPath}?tab=orders`);
        return;
      }

      const { razorpayOrder } = await createPaymentOrder(order._id);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "HGS Store",
        description: `Order #${order._id.slice(-8).toUpperCase()}`,
        order_id: razorpayOrder.id,
        prefill: { name: user?.name || "", email: user?.email || "" },
        theme: { color: "#1a1a2e" },
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            await emptyCart().catch(() => {});
            setStep("success");
          } catch {
            setError("Payment verification failed. Your order is saved — pay from My Orders.");
          }
          setLoading(false);
        },
        modal: {
          ondismiss: () => {
            emptyCart().catch(() => {});
            router.push(`${dashboardPath}?tab=orders`);
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        emptyCart().catch(() => {});
        router.push(`${dashboardPath}?tab=orders`);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(
        err?.response?.data?.errors?.[0]?.message ||
        err?.response?.data?.message ||
        "Failed to place order. Please try again."
      );
      setLoading(false);
    }
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
          <h2 className="text-2xl font-bold text-(--accent) mb-2">Order Placed & Paid!</h2>
          <p className="text-gray-500 text-sm mb-1">
            Order <span className="font-semibold text-(--accent)">#{createdOrder?._id?.slice(-8).toUpperCase()}</span> confirmed.
          </p>
          {discountAmount > 0 && (
            <p className="text-green-600 text-xs font-semibold mb-1">
              You saved ₹{discountAmount.toLocaleString()} with coupon <span className="uppercase">{appliedCoupon?.code}</span>!
            </p>
          )}
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

  // ─── Order summary sidebar ────────────────────────────────────────────────
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

      {/* ── Coupon section ── */}
      <div className="border-t border-(--border-light) pt-4 mb-3">
        {appliedCoupon ? (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <FaTag className="text-green-600 text-xs" />
              <div>
                <p className="text-xs font-bold text-green-700 uppercase">{appliedCoupon.code}</p>
                <p className="text-[11px] text-green-600">
                  {appliedCoupon.discountType === "fixed"
                    ? `₹${appliedCoupon.discountValue} off`
                    : `${appliedCoupon.discountValue}% off`}
                  {appliedCoupon.maximumDiscountAmount ? ` (max ₹${appliedCoupon.maximumDiscountAmount})` : ""}
                </p>
              </div>
            </div>
            <button onClick={handleRemoveCoupon} className="text-gray-400 hover:text-red-500 transition-colors ml-2">
              <FaTimes className="text-xs" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-600">Have a coupon?</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                placeholder="Enter code"
                className="flex-1 border border-(--border-light) rounded-lg px-3 py-2 text-xs outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all uppercase"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleApplyCoupon())}
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={couponLoading || !couponInput.trim()}
                className="px-3 py-2 bg-(--accent) text-white text-xs font-bold rounded-lg hover:bg-(--secondary) transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {couponLoading ? "…" : "Apply"}
              </button>
            </div>
            {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}
          </div>
        )}
      </div>

      <div className="border-t border-(--border-light) pt-3 space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-green-600 font-semibold">
            <span>Coupon discount</span><span>−₹{discountAmount.toLocaleString()}</span>
          </div>
        )}
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
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push(`${dashboardPath}?tab=cart`)}
            className="w-9 h-9 rounded-lg bg-white border border-(--border-light) flex items-center justify-center text-gray-500 hover:text-(--accent) transition-colors"
          >
            <FaArrowLeft className="text-xs" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-(--accent)">Checkout</h1>
            <p className="text-xs text-gray-500">Enter delivery details to proceed to payment</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
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
                  {loading ? "Creating order…" : `Proceed to Payment →${discountAmount > 0 ? ` (₹${total.toLocaleString()})` : ""}`}
                </button>
              </form>
            </div>
          </div>
          <div className="lg:w-80 shrink-0">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
