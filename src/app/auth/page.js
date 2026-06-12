"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import Link from "next/link";
import {
  FaUser, FaLock, FaEnvelope, FaPhone, FaEye, FaEyeSlash,
  FaLeaf, FaCheckCircle, FaTruck, FaShieldAlt, FaBuilding, FaStar,
} from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import useAuthStore from "@/store/auth.store";

const panelContent = {
  login: {
    headline: "Welcome back.",
    sub: "Manage your hotel supply orders, track shipments and reorder essentials — all in one place.",
    points: [
      { icon: FaTruck,     text: "Track all your bulk orders in real time" },
      { icon: FaStar,      text: "Exclusive returning-customer pricing" },
      { icon: FaShieldAlt, text: "GST invoices auto-generated for every order" },
    ],
    badge: "Trusted by 500+ hotels across India",
    quote: "The best hotel supply partner we have worked with.",
    quoteBy: "GM, Taj Gateway, Pune",
  },
  signup: {
    headline: "Supply smarter.",
    sub: "Join 500+ hotels sourcing premium Biotique amenities directly from the manufacturer.",
    points: [
      { icon: FaBuilding,  text: "Wholesale pricing from your very first order" },
      { icon: FaTruck,     text: "Free shipping on orders above ₹2,500" },
      { icon: FaStar,      text: "Custom branding available for your property" },
      { icon: FaShieldAlt, text: "100% authentic hotel-grade products" },
    ],
    badge: "5% off your first order — code FIRST5",
    quote: "Switching to HGS cut our procurement costs by 30%.",
    quoteBy: "Operations Head, Marriott, Mumbai",
  },
};

export default function AuthPage() {
  const [tab, setTab] = useState("login");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const wrapRef = useRef(null);
  const columnsRef = useRef(null);
  const isAnimating = useRef(false);

  const { login, register } = useAuth();
  const loading = useAuthStore((s) => s.loading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  useEffect(() => {
    gsap.from(wrapRef.current, { opacity: 0, y: 40, duration: 0.7, ease: "power3.out" });
  }, []);

  function switchTab(newTab) {
    if (newTab === tab || isAnimating.current) return;
    setError("");
    setSuccessMsg("");
    isAnimating.current = true;

    gsap.timeline()
      .to(columnsRef.current, { opacity: 0, y: 8, duration: 0.22, ease: "power2.in" })
      .call(() => {
        setTab(newTab);
        setShowPass(false);
        gsap.set(columnsRef.current, { y: -8 });
      })
      .to(columnsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
        delay: 0.05,
        onComplete: () => { isAnimating.current = false; },
      });
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.target);
    try {
      await login({ email: fd.get("email"), password: fd.get("password") });
      router.push("/account");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Please try again.");
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.target);
    try {
      const data = await register({
        name: fd.get("name"),
        email: fd.get("email"),
        phone: fd.get("mobile"),
        password: fd.get("password"),
      });
      setSuccessMsg(data.message || "Registered successfully!");
      setTimeout(() => router.push("/account"), 1800);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    }
  }

  const content = panelContent[tab];
  const isLogin = tab === "login";

  return (
    <div className="min-h-screen bg-[var(--surface-warm)] flex flex-col items-center justify-center px-4 py-14">

      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[480px] h-[480px] rounded-full bg-[var(--primary)] opacity-50" />
        <div className="absolute -bottom-40 -left-40 w-[380px] h-[380px] rounded-full bg-[var(--secondary)] opacity-10" />
      </div>

      <div ref={wrapRef} className="relative w-full max-w-5xl">

        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <FaLeaf className="text-[var(--secondary)] text-2xl" />
            <div className="leading-tight">
              <p className="text-[10px] font-semibold text-gray-400 tracking-[0.18em] uppercase">Hotel Guest</p>
              <p className="text-2xl font-extrabold text-[var(--accent)] leading-none">Supplys</p>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-[var(--border-light)]">

          {/* ── Centered tab bar ── */}
          <div className="bg-white border-b border-[var(--border-light)] flex flex-col items-center pt-6 pb-0">
            <div className="relative flex bg-[var(--surface-warm)] rounded-full p-1 border border-[var(--border-light)]">
              {/* Sliding indicator */}
              <div
                className="absolute top-1 bottom-1 rounded-full bg-[var(--accent)] pointer-events-none"
                style={{
                  width: "calc(50% - 4px)",
                  left: isLogin ? "4px" : "50%",
                  transition: "left 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
              {[
                { key: "login",  label: "Sign In" },
                { key: "signup", label: "Sign Up" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => switchTab(key)}
                  className={`relative z-10 w-32 py-2.5 text-sm font-bold tracking-wide rounded-full transition-colors duration-300 ${
                    tab === key ? "text-white" : "text-gray-500 hover:text-[var(--accent)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="w-full mt-5 border-t border-[var(--border-light)]" />
          </div>

          {/* ── Two-column body ── */}
          <div ref={columnsRef} className="grid grid-cols-1 lg:grid-cols-2">

            {/* Form panel — LEFT for signup, RIGHT for login */}
            <div className={`bg-white px-10 py-10 flex flex-col ${isLogin ? "lg:order-2" : "lg:order-1"}`}>
              {tab === "login" ? (
                <LoginForm
                  showPass={showPass}
                  setShowPass={setShowPass}
                  onSwitch={() => switchTab("signup")}
                  onSubmit={handleLogin}
                  loading={loading}
                  error={error}
                />
              ) : (
                <SignupForm
                  showPass={showPass}
                  setShowPass={setShowPass}
                  onSwitch={() => switchTab("login")}
                  onSubmit={handleRegister}
                  loading={loading}
                  error={error}
                  successMsg={successMsg}
                />
              )}
              <p className="mt-6 text-center text-[11px] text-gray-400">
                By continuing you agree to our{" "}
                <Link href="/terms" className="text-[var(--secondary)] hover:underline">Terms</Link>
                {" "}&amp;{" "}
                <Link href="/privacy" className="text-[var(--secondary)] hover:underline">Privacy Policy</Link>.
              </p>
            </div>

            {/* Quote panel — RIGHT for signup, LEFT for login */}
            <div
              className={`relative bg-[var(--accent)] text-white px-10 py-12 flex flex-col justify-between min-h-[480px] ${
                isLogin ? "lg:order-1" : "lg:order-2"
              }`}
            >
              <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-white/5" />
              <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-white/5 translate-x-10 translate-y-10" />

              <div className="relative z-10">
                <span className="inline-flex items-center gap-1.5 bg-white/15 text-[var(--primary)] text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-8 border border-white/20">
                  <FaCheckCircle className="text-[10px]" /> {content.badge}
                </span>
                <h2 className="text-4xl font-extrabold leading-tight mb-3 tracking-tight">{content.headline}</h2>
                <p className="text-sm text-white/75 leading-relaxed max-w-xs">{content.sub}</p>
                <ul className="mt-8 space-y-4">
                  {content.points.map(({ icon: Icon, text }, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0 border border-white/20">
                        <Icon className="text-xs text-[var(--primary)]" />
                      </span>
                      <span className="text-sm text-white/85 leading-snug">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="relative z-10 mt-10 text-[11px] text-white/40 italic">
                &ldquo;{content.quote}&rdquo;
                <br />
                <span className="not-italic font-semibold text-white/55">— {content.quoteBy}</span>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ icon: Icon, type = "text", placeholder, name, autoComplete, rightElement, required }) {
  return (
    <div className="relative flex items-center border border-[var(--border-light)] rounded-lg overflow-hidden focus-within:border-[var(--secondary)] focus-within:ring-1 focus-within:ring-[var(--secondary)] transition-all bg-[var(--surface-warm)]">
      <span className="pl-4 text-gray-400 flex-shrink-0">
        <Icon className="text-sm" />
      </span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="flex-1 px-3 py-3 text-sm outline-none bg-transparent text-[var(--text-primary-l)] placeholder-gray-400"
      />
      {rightElement && <span className="pr-4">{rightElement}</span>}
    </div>
  );
}

function LoginForm({ showPass, setShowPass, onSwitch, onSubmit, loading, error }) {
  return (
    <form className="flex-1 space-y-4" onSubmit={onSubmit}>
      <div className="mb-5">
        <h3 className="text-xl font-bold text-[var(--accent)]">Sign in to your account</h3>
        <p className="text-xs text-gray-500 mt-1">Enter your credentials to continue</p>
      </div>

      {error && (
        <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          {error}
        </div>
      )}

      <InputField icon={FaEnvelope} type="email" placeholder="Email address" name="email" autoComplete="email" required />
      <InputField
        icon={FaLock}
        type={showPass ? "text" : "password"}
        placeholder="Password"
        name="password"
        autoComplete="current-password"
        required
        rightElement={
          <button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-400 hover:text-[var(--secondary)] transition-colors">
            {showPass ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
          </button>
        }
      />

      <div className="flex items-center justify-between text-xs pt-1">
        <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
          <input type="checkbox" className="accent-[var(--secondary)]" /> Remember me
        </label>
        <Link href="/forgot-password" className="text-[var(--secondary)] hover:underline font-medium">
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[var(--accent)] text-white font-bold text-sm rounded-lg hover:bg-[var(--secondary)] transition-colors shadow-md hover:shadow-lg mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Signing in…" : "Sign In"}
      </button>

      <p className="text-center text-xs text-gray-500 pt-1">
        New here?{" "}
        <button type="button" onClick={onSwitch} className="text-[var(--secondary)] font-bold hover:underline">
          Create a free account
        </button>
      </p>
    </form>
  );
}

function SignupForm({ showPass, setShowPass, onSwitch, onSubmit, loading, error, successMsg }) {
  return (
    <form className="flex-1 space-y-4" onSubmit={onSubmit}>
      <div className="mb-5">
        <h3 className="text-xl font-bold text-[var(--accent)]">Create your account</h3>
        <p className="text-xs text-gray-500 mt-1">Start ordering wholesale in under 2 minutes</p>
      </div>

      {error && (
        <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          {error}
        </div>
      )}

      <InputField icon={FaUser} placeholder="Full name" name="name" autoComplete="name" required />
      <InputField icon={FaEnvelope} type="email" placeholder="Email address" name="email" autoComplete="email" required />
      <InputField icon={FaPhone} type="tel" placeholder="Mobile number" name="mobile" autoComplete="tel" required />
      <InputField
        icon={FaLock}
        type={showPass ? "text" : "password"}
        placeholder="Create password"
        name="password"
        autoComplete="new-password"
        required
        rightElement={
          <button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-400 hover:text-[var(--secondary)] transition-colors">
            {showPass ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
          </button>
        }
      />

      {successMsg ? (
        <div className="flex items-center justify-center gap-2 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">
          <FaCheckCircle className="flex-shrink-0" />
          {successMsg}
        </div>
      ) : (
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[var(--accent)] text-white font-bold text-sm rounded-lg hover:bg-[var(--secondary)] transition-colors shadow-md hover:shadow-lg mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Creating account…" : "Create Account"}
        </button>
      )}

      <p className="text-center text-xs text-gray-500 pt-1">
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} className="text-[var(--secondary)] font-bold hover:underline">
          Sign in
        </button>
      </p>
    </form>
  );
}
