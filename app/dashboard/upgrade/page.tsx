"use client";

import React, { useState, useEffect } from "react";
import { Check, Zap, Crown, Sparkles, ArrowRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";

/**
 * Dynamically loads the Razorpay checkout script on demand
 */
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * SaaS subscription tier configurations
 */
const rawPlans = [
  {
    id: "free",
    name: "Free Trial",
    price: "₹0",
    amount: 0,
    duration: "/month",
    description: "Explore AI video creation with essential features.",
    features: [
      "100 Free Credits",
      "Standard SD Quality",
      "Basic Voiceover (TTS)",
      "Community Support",
    ],
    isPopular: false,
    accent: "from-slate-500/10 via-zinc-500/5 to-transparent",
    glow: "group-hover:border-slate-500/40 group-hover:shadow-[0_0_35px_-5px_rgba(148,163,184,0.15)]",
    iconColor: "text-zinc-400 group-hover:text-zinc-200",
  },
  {
    id: "pro",
    name: "Pro Creator",
    price: "₹499",
    amount: 499,
    duration: "/month",
    description: "Built for creators publishing daily viral Shorts & Reels.",
    features: [
      "2,500 Credits / Month",
      "Full HD 1080p Export",
      "Ultra-Fast AI Image Generation",
      "AssemblyAI High-Precision Captions",
      "Custom Subtitles & No Watermark",
      "Priority Rendering Queue",
    ],
    isPopular: true,
    accent: "from-indigo-600/20 via-purple-600/10 to-transparent",
    glow: "border-indigo-500/80 shadow-[0_0_50px_-10px_rgba(99,102,241,0.4)] group-hover:border-indigo-400 group-hover:shadow-[0_0_65px_-5px_rgba(129,140,248,0.55)]",
    iconColor: "text-indigo-400 group-hover:scale-110 group-hover:rotate-6",
  },
  {
    id: "agency",
    name: "Agency / Business",
    price: "₹1,499",
    amount: 1499,
    duration: "/month",
    description: "High-volume generation for agencies and content teams.",
    features: [
      "10,000 Credits / Month",
      "4K Ultra-Sharp Export Support",
      "All Premium AI Voice Models",
      "Dedicated Cloud Storage",
      "24/7 Priority VIP Support",
      "Commercial Usage License",
    ],
    isPopular: false,
    accent: "from-cyan-500/15 via-blue-600/5 to-transparent",
    glow: "group-hover:border-cyan-500/50 group-hover:shadow-[0_0_40px_-5px_rgba(6,182,212,0.25)]",
    iconColor: "text-cyan-400 group-hover:scale-110 group-hover:text-cyan-300",
  },
];

/**
 * UpgradePage Component
 * Manages plan selection, active tier detection, Razorpay checkout,
 * and database credit synchronization via Neon PostgreSQL.
 */
export default function UpgradePage() {
  const { user } = useUser();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  // Mounted guard to ensure zero hydration mismatch during client render
  const [mounted, setMounted] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const cachedPlan = localStorage.getItem("user_active_plan");
    if (cachedPlan) {
      setCurrentPlan(cachedPlan);
    }

    async function fetchUserPlan() {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) return;

      try {
        const res = await fetch(`/api/get-user?email=${email}`);
        if (res.ok) {
          const data = await res.json();
          const activePlan = data?.user?.subscriptionPlan
            ? data.user.subscriptionPlan.toLowerCase()
            : "free";

          setCurrentPlan(activePlan);
          localStorage.setItem("user_active_plan", activePlan);
        } else {
          setCurrentPlan((prev) => prev || "free");
        }
      } catch (err) {
        console.error("Failed to load user plan:", err);
        setCurrentPlan((prev) => prev || "free");
      }
    }

    fetchUserPlan();
  }, [user]);

  // Initializes Razorpay checkout pipeline
  const handleUpgrade = async (plan: any) => {
    if (plan.id === currentPlan || plan.amount === 0) return;
    setLoadingPlan(plan.id);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Razorpay SDK load nahi ho paya. Internet connection check karein.");
        setLoadingPlan(null);
        return;
      }

      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: plan.amount,
          planId: plan.id,
        }),
      });

      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error || "Order creation failed");

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        alert("Razorpay Key ID nahi mili! .env.local check karein.");
        setLoadingPlan(null);
        return;
      }

      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "AI Short Video Engine",
        description: `Upgrade to ${plan.name}`,
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/update-credits", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                planId: plan.id,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                userName: user?.fullName || "User",
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              alert(`Mubarak ho! Aapka account ${plan.name} plan mein upgrade ho gaya hai.`);
              setCurrentPlan(plan.id);
              localStorage.setItem("user_active_plan", plan.id);
              window.location.reload();
            } else {
              alert("Database update error: " + (verifyData.error || "Payment verification failed"));
            }
          } catch (verifyErr) {
            console.error("Verification Request Error:", verifyErr);
            alert("Payment successful raha, lekin DB sync nahi ho paya.");
          }
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
        },
        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on("payment.failed", function (failResponse: any) {
        console.error("=== PAYMENT FAILED ===", failResponse.error);
        alert(`Payment fail ho gaya: ${failResponse.error.description}`);
      });

      rzp.open();
    } catch (error: any) {
      console.error("Payment initiation error:", error);
      alert("Payment initialize karne me error: " + error.message);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#060813] text-white">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[350px] w-[500px] sm:w-[600px] rounded-full bg-gradient-to-tr from-indigo-600/15 via-purple-600/15 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute right-4 top-1/3 h-[200px] w-[250px] rounded-full bg-cyan-500/10 blur-3xl" />

      {/* ================= HEADER SECTION ================= */}
      <div className="relative mx-auto max-w-3xl text-center px-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-[11px] sm:text-xs font-semibold text-indigo-300 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 animate-pulse text-indigo-400" />
          <span>Flexible Creator Pricing</span>
        </div>
        <h1 className="mt-3 text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-[#a5b0f0] bg-clip-text text-transparent">
          Upgrade your Creative Power
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#8a94b8] max-w-xl mx-auto leading-relaxed">
          Unlock high-speed credits, ultra-clear generation and watermark-free video exports.
        </p>
      </div>

      {/* ================= PRICING CARDS GRID ================= */}
      {/* Mobile: 1 column | Desktop (md): 3 columns */}
      <div className="relative mx-auto mt-10 sm:mt-14 grid max-w-6xl grid-cols-1 items-stretch gap-6 sm:gap-8 md:grid-cols-3">
        {rawPlans.map((plan) => {
          const isCurrentActive = mounted && currentPlan === plan.id;
          const isDisabled =
            !mounted ||
            isCurrentActive ||
            plan.id === "free" ||
            (currentPlan === "agency" && plan.id === "pro");

          const buttonLabel = !mounted
            ? plan.id === "free"
              ? "Default Plan"
              : `Upgrade to ${plan.name.split(" ")[0]}`
            : isCurrentActive
            ? "Current Plan"
            : plan.id === "free"
            ? "Default Plan"
            : `Upgrade to ${plan.name.split(" ")[0]}`;

          return (
            <div
              key={plan.id}
              className={`group relative flex flex-col justify-between overflow-visible rounded-3xl border bg-[#0b0f19]/90 p-5 sm:p-7 lg:p-8 backdrop-blur-xl transition-all duration-300 ${
                isCurrentActive
                  ? "border-emerald-500/70 shadow-[0_0_35px_-5px_rgba(16,185,129,0.3)]"
                  : plan.isPopular
                  ? `border-indigo-500/80 md:-translate-y-2 ${plan.glow}`
                  : `border-white/10 ${plan.glow}`
              }`}
            >
              {/* ACTIVE OR POPULAR STATUS BADGE */}
              {isCurrentActive ? (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-0.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white shadow-[0_0_20px_rgba(16,185,129,0.6)] border border-white/20 whitespace-nowrap">
                    <Check className="h-3 w-3 stroke-[3]" />
                    <span>Active Plan</span>
                  </div>
                </div>
              ) : plan.isPopular ? (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                  <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-500 px-3.5 py-0.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white shadow-[0_0_25px_rgba(99,102,241,0.7)] border border-white/20 whitespace-nowrap">
                    <Sparkles className="h-3 w-3 text-yellow-300" />
                    <span>Most Popular</span>
                  </div>
                </div>
              ) : null}

              {/* Interior subtle glow */}
              <div
                className={`pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b ${plan.accent} opacity-60 transition-opacity duration-300 group-hover:opacity-100`}
              />

              {/* CARD HEADER & FEATURES */}
              <div className="relative z-10 pt-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white transition-colors duration-200 group-hover:text-indigo-200">
                      {plan.name}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#8a94b8]">
                      {plan.description}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-all duration-300">
                    {plan.isPopular ? (
                      <Crown className={`h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 ${plan.iconColor}`} />
                    ) : (
                      <Zap className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 ${plan.iconColor}`} />
                    )}
                  </div>
                </div>

                {/* Pricing Display */}
                <div className="mt-4 sm:mt-6 flex items-baseline gap-1 border-b border-white/5 pb-4 sm:pb-6">
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                    {plan.price}
                  </span>
                  <span className="text-xs font-semibold text-[#8a94b8]">
                    {plan.duration}
                  </span>
                </div>

                {/* Feature Bullet Points */}
                <ul className="mt-4 sm:mt-6 space-y-2.5 sm:space-y-3.5">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2.5 sm:gap-3 text-xs text-slate-300"
                    >
                      <div
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                          isCurrentActive
                            ? "bg-emerald-500/20 text-emerald-400"
                            : plan.isPopular
                            ? "bg-indigo-500/20 text-indigo-400"
                            : "bg-white/10 text-slate-300"
                        }`}
                      >
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ACTION TRIGGER BUTTON */}
              <div className="relative z-10 mt-6 sm:mt-8 pt-2">
                <button
                  type="button"
                  onClick={() => handleUpgrade(plan)}
                  disabled={isDisabled || loadingPlan === plan.id}
                  className={`group/btn relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl sm:rounded-2xl py-3 sm:py-3.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 active:scale-[0.98] ${
                    isCurrentActive
                      ? "border border-emerald-500/40 bg-emerald-950/40 text-emerald-400 cursor-not-allowed"
                      : isDisabled
                      ? "border border-white/5 bg-zinc-800/40 text-zinc-500 cursor-not-allowed"
                      : plan.isPopular
                      ? "bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-500 bg-[length:200%_auto] text-white shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-indigo-600/50 cursor-pointer"
                      : "border border-indigo-400/20 bg-indigo-500/10 text-indigo-200 hover:border-indigo-400/40 hover:bg-indigo-500/20 hover:text-white cursor-pointer"
                  }`}
                >
                  <span className="relative">
                    {loadingPlan === plan.id ? "Processing..." : buttonLabel}
                  </span>

                  {!isDisabled && (
                    <ArrowRight className="relative h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}