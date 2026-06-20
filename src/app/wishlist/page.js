"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuthStore from "@/store/auth.store";
import useWishlistStore from "@/store/wishlist.store";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { FaRegHeart, FaHeart, FaTrash, FaShoppingCart, FaCheck, FaArrowLeft, FaStar } from "react-icons/fa";

export default function WishlistPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const items = useWishlistStore((s) => s.items);
  const loading = useWishlistStore((s) => s.loading);
  const { fetchWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addingId, setAddingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  useEffect(() => {
    if (!isAuthenticated) { router.replace("/auth"); return; }
    fetchWishlist();
  }, [isAuthenticated]);

  const handleAddToCart = async (productId) => {
    setAddingId(productId);
    try {
      await addToCart(productId, 1);
      showToast("Added to cart!");
    } catch {
      showToast("Failed to add to cart");
    } finally {
      setAddingId(null);
    }
  };

  const handleRemove = async (itemId) => {
    setRemovingId(itemId);
    try { await removeFromWishlist(itemId); }
    finally { setRemovingId(null); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-(--surface-warm)">
        {/* Skeleton header */}
        <div className="bg-white border-b border-(--border-light) px-4 md:px-10 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="h-4 w-24 bg-gray-100 rounded-full animate-pulse mb-4" />
            <div className="h-8 w-48 bg-gray-100 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 md:px-10 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-(--border-light) animate-pulse">
                <div className="aspect-[4/3] bg-gray-100" />
                <div className="p-4 space-y-2.5">
                  <div className="h-2.5 bg-gray-100 rounded-full w-1/3" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-6 bg-gray-100 rounded w-1/3" />
                  <div className="h-9 bg-gray-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--surface-warm)">

      {/* Page Header */}
      <div className="bg-white border-b border-(--border-light) px-4 md:px-10 py-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-(--accent) mb-4 transition-colors"
          >
            <FaArrowLeft className="text-xs" /> Back
          </button>
          <div className="flex items-end gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-(--secondary) mb-1">My Account</p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-(--accent) flex items-center gap-3">
                <FaHeart className="text-2xl text-red-400" />
                Wishlist
              </h1>
            </div>
            {items.length > 0 && (
              <span className="mb-1 inline-flex items-center px-3 py-1 bg-(--surface-warm) border border-(--border-light) text-(--accent) text-sm font-bold rounded-full">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-10 py-8">

        {items.length === 0 ? (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-28 h-28 rounded-full bg-white border border-(--border-light) flex items-center justify-center mb-6 shadow-sm">
              <FaRegHeart className="text-5xl text-gray-200" />
            </div>
            <h2 className="text-xl font-extrabold text-(--accent) mb-2">Your wishlist is empty</h2>
            <p className="text-sm text-gray-400 mb-8 max-w-xs">
              Browse our collection and tap the heart icon on any product to save it here.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-(--accent) text-white font-bold text-sm rounded-xl hover:bg-(--secondary) transition-colors shadow-sm hover:shadow-md active:scale-95"
            >
              <FaShoppingCart className="text-xs" /> Browse Products
            </Link>
          </div>
        ) : (
          /* ── Product grid ── */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map((item) => {
              const product = item.product || item;
              const image = product.images?.[0]?.url || `https://picsum.photos/seed/${product._id}/400/400`;
              const isAdding = addingId === product._id;
              const isRemoving = removingId === item._id;

              return (
                <div
                  key={item._id}
                  className="group bg-white rounded-2xl overflow-hidden border border-(--border-light) hover:border-(--secondary)/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                    <img
                      src={image}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Stock overlay */}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <span className="bg-gray-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-full">
                          Out of Stock
                        </span>
                      </div>
                    )}

                    {/* Low stock badge */}
                    {product.stock > 0 && product.stock <= 5 && (
                      <span className="absolute top-3 left-3 bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide shadow">
                        Only {product.stock} left
                      </span>
                    )}

                    {/* Remove button */}
                    <button
                      onClick={() => handleRemove(item._id)}
                      disabled={isRemoving}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-red-50 hover:scale-110 active:scale-95 transition-all duration-200 disabled:opacity-60 z-10 group/btn"
                      title="Remove from wishlist"
                    >
                      {isRemoving
                        ? <span className="w-3.5 h-3.5 rounded-full border-2 border-red-400 border-t-transparent animate-spin" />
                        : <FaHeart className="text-sm text-red-400 group-hover/btn:text-red-600 transition-colors" />}
                    </button>

                    {/* View pill */}
                    <Link
                      href={`/product/${product._id}`}
                      className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-(--accent) text-[11px] font-bold px-4 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10"
                    >
                      View Product →
                    </Link>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-[9px] font-black text-(--secondary) uppercase tracking-widest mb-1">{product.brand}</p>
                    <Link href={`/product/${product._id}`} className="flex-1">
                      <h3 className="text-sm font-semibold text-(--accent) leading-snug line-clamp-2 hover:text-(--secondary) transition-colors">
                        {product.title}
                      </h3>
                    </Link>

                    {product.numReviews > 0 && (
                      <div className="flex items-center gap-1 mt-1.5">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={`text-[10px] ${i < Math.round(product.averageRating) ? "text-amber-400" : "text-gray-200"}`} />
                        ))}
                        <span className="text-[11px] text-gray-400 font-medium ml-0.5">({product.numReviews})</span>
                      </div>
                    )}

                    <div className="mt-2 mb-3">
                      <span className="text-xl font-black text-(--accent)">₹{product.price?.toLocaleString()}</span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product._id)}
                      disabled={product.stock === 0 || isAdding}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-(--accent) text-white text-xs font-bold rounded-xl hover:bg-(--secondary) active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                    >
                      {isAdding
                        ? <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        : <FaShoppingCart className="text-xs" />}
                      {isAdding ? "Adding…" : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-600 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-xl">
          <FaCheck className="text-xs" /> {toast}
        </div>
      )}
    </div>
  );
}
