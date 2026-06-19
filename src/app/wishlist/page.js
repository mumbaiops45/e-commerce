"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuthStore from "@/store/auth.store";
import useWishlistStore from "@/store/wishlist.store";
import { useWishlist } from "@/hooks/useWishlist";
import { FaRegHeart, FaHeart, FaTrash, FaShoppingCart } from "react-icons/fa";
import { useCart } from "@/hooks/useCart";

export default function WishlistPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const items = useWishlistStore((s) => s.items);
  const loading = useWishlistStore((s) => s.loading);
  const { fetchWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    if (!isAuthenticated) { router.replace("/auth"); return; }
    fetchWishlist();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-(--surface-warm) flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-(--secondary) border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--surface-warm)">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <FaHeart className="text-2xl text-(--secondary)" />
          <h1 className="text-2xl font-extrabold text-(--accent)">My Wishlist</h1>
          {items.length > 0 && (
            <span className="text-sm text-gray-400 font-medium">({items.length} item{items.length !== 1 ? "s" : ""})</span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-(--border-light) p-16 flex flex-col items-center text-center">
            <FaRegHeart className="text-6xl text-gray-200 mb-4" />
            <p className="text-lg font-bold text-gray-500 mb-2">Your wishlist is empty</p>
            <p className="text-sm text-gray-400 mb-6">Save products you love and find them here later.</p>
            <Link
              href="/products"
              className="px-6 py-2.5 bg-(--accent) text-white font-semibold text-sm rounded-xl hover:bg-(--secondary) transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((item) => {
              const product = item.product || item;
              const image = product.images?.[0]?.url || `https://picsum.photos/seed/${product._id}/400/400`;
              return (
                <div key={item._id} className="bg-white rounded-2xl border border-(--border-light) overflow-hidden group flex flex-col">
                  <Link href={`/product/${product._id}`} className="block relative overflow-hidden">
                    <img
                      src={image}
                      alt={product.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-[10px] font-bold text-(--secondary) uppercase tracking-wider mb-1">{product.brand}</p>
                    <Link href={`/product/${product._id}`}>
                      <h3 className="text-sm font-bold text-(--accent) leading-snug mb-2 line-clamp-2 hover:text-(--secondary) transition-colors">
                        {product.title}
                      </h3>
                    </Link>
                    <p className="text-lg font-extrabold text-(--accent) mb-4">₹{product.price?.toLocaleString()}</p>
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => addToCart(product._id, 1)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-(--accent) text-white text-xs font-semibold rounded-lg hover:bg-(--secondary) transition-colors"
                      >
                        <FaShoppingCart className="text-[10px]" /> Add to Cart
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item._id)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-red-100 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
