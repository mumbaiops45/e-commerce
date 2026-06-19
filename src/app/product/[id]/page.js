"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import useAuthStore from "@/store/auth.store";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import useWishlistStore from "@/store/wishlist.store";
import { getProductById } from "@/routes/product.routes";
import { getProductReviews, createReview } from "@/routes/review.routes";
import {
  FaStar, FaRegStar, FaShoppingCart, FaArrowLeft,
  FaCheck, FaImage, FaTruck, FaShieldAlt, FaTag,
  FaRegHeart, FaHeart,
} from "react-icons/fa";

function StarRating({ rating, onRate, readonly = false }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hover || rating);
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onRate?.(star)}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => !readonly && setHover(0)}
            className={readonly ? "cursor-default" : "cursor-pointer"}
          >
            {filled
              ? <FaStar className={`${readonly ? "text-amber-400 text-sm" : "text-amber-400 text-lg"}`} />
              : <FaRegStar className={`${readonly ? "text-gray-300 text-sm" : "text-gray-300 text-lg"}`} />
            }
          </button>
        );
      })}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, fetchWishlist } = useWishlist();
  const wishlistItems = useWishlistStore((s) => s.items);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [adding, setAdding] = useState(false);
  const [addedMsg, setAddedMsg] = useState("");
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Review form
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  const wishlisted = wishlistItems.some((w) => (w.product?._id || w.product) === id);

  const handleWishlist = async () => {
    if (!isAuthenticated) { router.push("/auth"); return; }
    setWishlistLoading(true);
    try {
      if (wishlisted) {
        const entry = wishlistItems.find((w) => (w.product?._id || w.product) === id);
        await removeFromWishlist(entry._id);
      } else {
        await addToWishlist(id);
      }
    } catch {}
    finally { setWishlistLoading(false); }
  };

  useEffect(() => {
    if (isAuthenticated) fetchWishlist();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!id) return;
    setLoadingProduct(true);
    getProductById(id)
      .then((d) => setProduct(d.product || d))
      .catch(() => setProduct(null))
      .finally(() => setLoadingProduct(false));

    getProductReviews(id)
      .then((d) => setReviews(d.reviews || []))
      .catch(() => setReviews([]));
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { router.push("/auth"); return; }
    setAdding(true);
    try {
      await addToCart(id, 1);
      setAddedMsg("Added to cart!");
      setTimeout(() => setAddedMsg(""), 2500);
    } catch {
      setAddedMsg("Failed to add");
      setTimeout(() => setAddedMsg(""), 2500);
    } finally {
      setAdding(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!rating) { setReviewError("Please select a rating"); return; }
    setReviewError("");
    setSubmitting(true);
    try {
      const data = await createReview(id, { rating, comment });
      setReviews((prev) => [data.review, ...prev]);
      setRating(0);
      setComment("");
      setReviewSuccess("Review submitted!");
      setTimeout(() => setReviewSuccess(""), 3000);
    } catch (err) {
      setReviewError(err?.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-(--surface-warm) flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-(--secondary) border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-(--surface-warm) flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg font-semibold">Product not found</p>
        <Link href="/" className="text-sm text-(--secondary) hover:underline">← Back to Home</Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [{ url: `https://picsum.photos/seed/${id}/600/600`, alt: product.title }];

  return (
    <div className="min-h-screen bg-(--surface-warm)">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-(--accent) transition-colors mb-6"
        >
          <FaArrowLeft className="text-xs" /> Back
        </button>

        {/* Product section */}
        <div className="bg-white rounded-2xl border border-(--border-light) overflow-hidden mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

            {/* Image gallery */}
            <div className="p-6 border-b lg:border-b-0 lg:border-r border-(--border-light)">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 mb-4">
                {images[activeImg]?.url
                  ? <img src={images[activeImg].url} alt={images[activeImg].alt || product.title} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-gray-400"><FaImage className="text-4xl" /></div>
                }
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImg(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImg === idx ? "border-(--accent)" : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <img src={img.url} alt={img.alt || ""} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="p-6 flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-xs font-bold text-(--secondary) uppercase tracking-wider mb-1">{product.brand}</p>
                  <h1 className="text-xl font-extrabold text-(--accent) leading-snug">{product.title}</h1>
                </div>
                {product.isFeatured && (
                  <span className="shrink-0 text-[10px] font-bold bg-(--accent) text-white px-2.5 py-1 rounded-full uppercase tracking-wide">
                    Featured
                  </span>
                )}
              </div>

              {/* Rating */}
              {product.numReviews > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <StarRating rating={Math.round(product.averageRating || 0)} readonly />
                  <span className="text-sm font-semibold text-(--accent)">{product.averageRating?.toFixed(1)}</span>
                  <span className="text-xs text-gray-400">({product.numReviews} review{product.numReviews !== 1 ? "s" : ""})</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-extrabold text-(--accent)">₹{product.price?.toLocaleString()}</span>
                {product.stock === 0
                  ? <span className="text-sm font-semibold text-red-500">Out of Stock</span>
                  : <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">{product.stock} in stock</span>
                }
              </div>

              {/* Category */}
              {product.category && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                  <FaTag className="text-[10px]" />
                  <span>{product.category?.name || product.category}</span>
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1">{product.description}</p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-3 mb-6">
                {[
                  { icon: FaTruck, text: "Free shipping over ₹2,500" },
                  { icon: FaShieldAlt, text: "100% authentic" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Icon className="text-[10px] text-(--secondary)" /> {text}
                  </div>
                ))}
              </div>

              {/* Add to cart + Wishlist */}
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || adding}
                  className="flex-1 py-3.5 bg-(--accent) text-white font-bold text-sm rounded-xl hover:bg-(--secondary) transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {adding ? (
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : addedMsg ? (
                    <><FaCheck className="text-xs" /> {addedMsg}</>
                  ) : (
                    <><FaShoppingCart className="text-xs" /> Add to Cart</>
                  )}
                </button>
                <button
                  onClick={handleWishlist}
                  disabled={wishlistLoading}
                  title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  className={`w-12 rounded-xl border-2 flex items-center justify-center transition-colors disabled:opacity-50 ${
                    wishlisted
                      ? "border-(--secondary) bg-(--secondary) text-white"
                      : "border-(--border-light) text-gray-400 hover:border-(--secondary) hover:text-(--secondary)"
                  }`}
                >
                  {wishlistLoading
                    ? <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    : wishlisted ? <FaHeart /> : <FaRegHeart />
                  }
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews section */}
        <div className="bg-white rounded-2xl border border-(--border-light) overflow-hidden">
          <div className="px-6 py-4 border-b border-(--border-light)">
            <h2 className="font-bold text-(--accent) text-lg">
              Reviews {reviews.length > 0 && <span className="text-gray-400 font-normal text-sm">({reviews.length})</span>}
            </h2>
          </div>

          <div className="p-6">
            {/* Write review — only for authenticated users */}
            {isAuthenticated && user?.role === "user" && (
              <div className="mb-6 pb-6 border-b border-(--border-light)">
                <h3 className="text-sm font-bold text-(--accent) mb-3">Write a Review</h3>
                <p className="text-xs text-gray-400 mb-3">You can only review products from delivered & paid orders.</p>
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  {reviewError && (
                    <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-4 py-2">{reviewError}</div>
                  )}
                  {reviewSuccess && (
                    <div className="text-green-700 text-xs bg-green-50 border border-green-200 rounded-lg px-4 py-2 flex items-center gap-2">
                      <FaCheck className="text-[10px]" /> {reviewSuccess}
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Your Rating *</label>
                    <StarRating rating={rating} onRate={setRating} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Comment (optional)</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                      placeholder="Share your experience with this product..."
                      className="w-full border border-(--border-light) rounded-lg px-4 py-2.5 text-sm outline-none focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary) transition-all resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-(--accent) text-white text-sm font-semibold rounded-lg hover:bg-(--secondary) transition-colors disabled:opacity-60"
                  >
                    {submitting ? "Submitting…" : "Submit Review"}
                  </button>
                </form>
              </div>
            )}

            {/* Review list */}
            {reviews.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <FaStar className="text-3xl mx-auto mb-2 text-gray-200" />
                <p className="text-sm font-semibold text-gray-500">No reviews yet</p>
                <p className="text-xs mt-1">Be the first to review this product.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev._id} className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-(--accent) text-white text-sm font-bold flex items-center justify-center shrink-0">
                      {rev.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-(--accent)">{rev.user?.name || "User"}</span>
                        <StarRating rating={rev.rating} readonly />
                        <span className="text-xs text-gray-400 ml-auto">
                          {new Date(rev.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      {rev.comment && <p className="text-sm text-gray-600 leading-relaxed">{rev.comment}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
