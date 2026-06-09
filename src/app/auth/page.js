"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import {
  FaUser, FaLock, FaEnvelope, FaPhone, FaEye, FaEyeSlash,
  FaLeaf, FaCheckCircle, FaTruck, FaShieldAlt, FaBuilding, FaStar,
} from "react-icons/fa";

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
  },
};

export default function AuthPage() {
  const [tab, setTab] = useState("login");
  const [showPass, setShowPass] = useState(false);
  const leftRef  = useRef(null);
  const formRef  = useRef(null);
  const wrapRef  = useRef(null);

  useEffect(() => {
    gsap.from(wrapRef.current, { opacity: 0, y: 40, duration: 0.7, ease: "power3.out" });
  }, []);

  useEffect(() => {
    gsap.from(leftRef.current?.querySelectorAll(".panel-item"), {
      opacity: 0, x: -20, stagger: 0.1, duration: 0.45, ease: "power2.out",
    });
    gsap.from(formRef.current?.querySelectorAll(".form-field"), {
      opacity: 0, y: 18, stagger: 0.08, duration: 0.4, ease: "power2.out",
    });
  }, [tab]);

  const content = panelContent[tab];

  return (
    <div className="min-h-screen bg-[var(--surface-warm)] flex items-center justify-center px-4 py-14">

      {/* Subtle blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[480px] h-[480px] rounded-full bg-[var(--primary)] opacity-50" />
        <div className="absolute -bottom-40 -left-40 w-[380px] h-[380px] rounded-full bg-[var(--secondary)] opacity-10" />
      </div>

      <div ref={wrapRef} className="relative w-full max-w-5xl">

        {/* Logo above card */}
        <div className="mb-8 flex justify-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <FaLeaf className="text-[var(--secondary)] text-2xl" />
            <div className="leading-tight">
              <p className="text-[10px] font-semibold text-gray-400 tracking-[0.18em] uppercase">Hotel Guest</p>
              <p className="text-2xl font-extrabold text-[var(--accent)] leading-none">Supplys</p>
            </div>
          </Link>
        </div>

        {/* Two-column card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl border border-[var(--border-light)]">

          {/* ── LEFT: content panel ── */}
          <div
            ref={leftRef}
            className="relative bg-[var(--accent)] text-white px-10 py-12 flex flex-col justify-between min-h-[480px]"
          >
            {/* Decorative circle */}
            <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-white/5" />
            <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-white/5 translate-x-10 translate-y-10" />

            <div className="relative z-10">
              {/* Badge */}
              <span className="panel-item inline-flex items-center gap-1.5 bg-white/15 text-[var(--primary)] text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-8 border border-white/20">
                <FaCheckCircle className="text-[10px]" /> {content.badge}
              </span>

              <h2 className="panel-item text-4xl font-extrabold leading-tight mb-3 tracking-tight">
                {content.headline}
              </h2>
              <p className="panel-item text-sm text-white/75 leading-relaxed max-w-xs">
                {content.sub}
              </p>

              {/* Feature list */}
              <ul className="mt-8 space-y-4">
                {content.points.map(({ icon: Icon, text }, i) => (
                  <li key={i} className="panel-item flex items-start gap-3">
                    <span className="mt-0.5 w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0 border border-white/20">
                      <Icon className="text-xs text-[var(--primary)]" />
                    </span>
                    <span className="text-sm text-white/85 leading-snug">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom quote */}
            <p className="panel-item relative z-10 mt-10 text-[11px] text-white/40 italic">
              "The best hotel supply partner we have worked with."
              <br />
              <span className="not-italic font-semibold text-white/50">— GM, Taj Gateway, Pune</span>
            </p>
          </div>

          {/* ── RIGHT: form panel ── */}
          <div className="bg-white px-10 py-10 flex flex-col">

            {/* Tabs */}
            <div className="flex border-b border-[var(--border-light)] mb-8">
              {[
                { key: "login",  label: "Sign In" },
                { key: "signup", label: "Sign Up" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => { setTab(key); setShowPass(false); }}
                  className={`flex-1 pb-3 text-sm font-bold tracking-wide transition-colors relative ${
                    tab === key
                      ? "text-[var(--accent)]"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {label}
                  {tab === key && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--secondary)] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Form */}
            {tab === "login" ? (
              <LoginForm showPass={showPass} setShowPass={setShowPass} formRef={formRef} onSwitch={() => setTab("signup")} />
            ) : (
              <SignupForm showPass={showPass} setShowPass={setShowPass} formRef={formRef} onSwitch={() => setTab("login")} />
            )}

            <p className="mt-6 text-center text-[11px] text-gray-400">
              By continuing you agree to our{" "}
              <Link href="/terms" className="text-[var(--secondary)] hover:underline">Terms</Link>{" "}
              &amp;{" "}
              <Link href="/privacy" className="text-[var(--secondary)] hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ icon: Icon, type = "text", placeholder, name, autoComplete, rightElement }) {
  return (
    <div className="form-field relative flex items-center border border-[var(--border-light)] rounded-lg overflow-hidden focus-within:border-[var(--secondary)] focus-within:ring-1 focus-within:ring-[var(--secondary)] transition-all bg-[var(--surface-warm)]">
      <span className="pl-4 text-gray-400 flex-shrink-0">
        <Icon className="text-sm" />
      </span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="flex-1 px-3 py-3 text-sm outline-none bg-transparent text-[var(--text-primary-l)] placeholder-gray-400"
      />
      {rightElement && <span className="pr-4">{rightElement}</span>}
    </div>
  );
}

function LoginForm({ showPass, setShowPass, formRef, onSwitch }) {
  return (
    <form ref={formRef} className="flex-1 space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div className="mb-5">
        <h3 className="text-xl font-bold text-[var(--accent)]">Sign in to your account</h3>
        <p className="text-xs text-gray-500 mt-1">Enter your credentials to continue</p>
      </div>

      <InputField icon={FaEnvelope} type="email" placeholder="Email address" name="email" autoComplete="email" />
      <InputField
        icon={FaLock}
        type={showPass ? "text" : "password"}
        placeholder="Password"
        name="password"
        autoComplete="current-password"
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
        <Link href="/forgot-password" className="text-[var(--secondary)] hover:underline font-medium">Forgot password?</Link>
      </div>

      <button
        type="submit"
        className="form-field w-full py-3 bg-[var(--accent)] text-white font-bold text-sm rounded-lg hover:bg-[var(--secondary)] transition-colors shadow-md hover:shadow-lg mt-2"
      >
        Sign In
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

function SignupForm({ showPass, setShowPass, formRef, onSwitch }) {
  return (
    <form ref={formRef} className="flex-1 space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div className="mb-5">
        <h3 className="text-xl font-bold text-[var(--accent)]">Create your account</h3>
        <p className="text-xs text-gray-500 mt-1">Start ordering wholesale in under 2 minutes</p>
      </div>

      <InputField icon={FaUser}    placeholder="Full name"      name="name"     autoComplete="name" />
      <InputField icon={FaEnvelope} type="email" placeholder="Email address" name="email" autoComplete="email" />
      <InputField icon={FaPhone}   type="tel"   placeholder="Mobile number"  name="mobile"   autoComplete="tel" />
      <InputField
        icon={FaLock}
        type={showPass ? "text" : "password"}
        placeholder="Create password"
        name="password"
        autoComplete="new-password"
        rightElement={
          <button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-400 hover:text-[var(--secondary)] transition-colors">
            {showPass ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
          </button>
        }
      />

      <button
        type="submit"
        className="form-field w-full py-3 bg-[var(--accent)] text-white font-bold text-sm rounded-lg hover:bg-[var(--secondary)] transition-colors shadow-md hover:shadow-lg mt-2"
      >
        Create Account
      </button>

      <p className="text-center text-xs text-gray-500 pt-1">
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} className="text-[var(--secondary)] font-bold hover:underline">
          Sign in
        </button>
      </p>
    </form>
  );
}
