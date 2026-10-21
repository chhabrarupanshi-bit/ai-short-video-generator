"use client";

import React, { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { 
  User, 
  Mail, 
  Crown, 
  Coins, 
  Receipt, 
  Calendar, 
  Copy, 
  Check, 
  ArrowUpRight, 
  LogOut, 
  ShieldCheck, 
  Sparkles,
  Zap
} from "lucide-react";

/**
 * AccountPage Component
 * Manages user profile information, live Neon PostgreSQL compute balance,
 * tier visual meter, and Razorpay transaction records with copyable IDs.
 */
export default function AccountPage() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState(null);

  // Syncs user compute credits and active subscription plan from Neon DB
  useEffect(() => {
    async function loadUserData() {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) return;

      try {
        const res = await fetch(`/api/get-user?email=${email}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            setDbUser(data.user);
          }
        }
      } catch (err) {
        console.error("Account page user fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [user]);

  // Utility to copy payment and order hashes to system clipboard
  const copyToClipboard = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const planName = (dbUser?.subscriptionPlan || "free").toUpperCase();
  const isSubscribed = Boolean(dbUser?.subscription);
  const credits = dbUser?.credits ?? 100;
  
  // Dynamic quota percentage calculation
  const maxCredits = planName === "AGENCY" ? 10000 : planName === "PRO" ? 2500 : 100;
  const creditPercentage = Math.min(Math.round((credits / maxCredits) * 100), 100);

  return (
    <div className="relative w-full overflow-hidden bg-[#060813] text-white">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -left-20 top-0 h-[280px] sm:h-[320px] w-[400px] sm:w-[500px] rounded-full bg-indigo-600/10 blur-3xl" />
      <div className="pointer-events-none absolute right-4 top-1/4 h-[250px] w-[350px] rounded-full bg-purple-600/10 blur-3xl" />

      {/* ================= HEADER SECTION ================= */}
      <div className="relative mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-[11px] sm:text-xs font-semibold text-indigo-300">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
              <span>Workspace Account</span>
            </div>
            <h1 className="mt-2.5 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-[#a5b0f0] bg-clip-text text-transparent">
              Account & Subscription
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#8a94b8] leading-relaxed">
              Manage your profile credentials, billing tier, and compute balance.
            </p>
          </div>

          {/* Sign Out Button (Mobile full/auto width) */}
          <button
            type="button"
            onClick={() => signOut({ redirectUrl: "/" })}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-semibold text-rose-300 transition-all hover:bg-rose-500/20 active:scale-95 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* ================= MAIN RESPONSIVE CARDS GRID ================= */}
        {/* Mobile: 1 col | Tablet/Laptop: 3 cols */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3">
          
          {/* 1. USER PROFILE CARD */}
          <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0b0f19]/80 p-4 sm:p-6 backdrop-blur-xl">
            <div>
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#3b52d4] to-[#7f5af0] text-lg sm:text-xl font-bold text-white shadow-lg ring-1 ring-white/10">
                  {user?.imageUrl ? (
                    <img 
                      src={user.imageUrl} 
                      alt="Avatar" 
                      className="h-full w-full rounded-2xl object-cover" 
                    />
                  ) : (
                    user?.firstName?.[0] || "U"
                  )}
                </div>

                <div className="overflow-hidden min-w-0">
                  <h3 className="truncate text-base sm:text-lg font-bold text-white">
                    {user?.fullName || "Creator"}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#8a94b8]">
                    <Mail className="h-3 w-3 shrink-0" />
                    <span className="truncate">{user?.primaryEmailAddress?.emailAddress}</span>
                  </div>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="mt-5 sm:mt-6 space-y-2.5 sm:space-y-3 border-t border-white/5 pt-4 sm:pt-5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#8a94b8]">Auth Provider</span>
                  <span className="font-medium text-slate-200">Clerk Authentication</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8a94b8]">Account Status</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-semibold text-emerald-400 border border-emerald-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Verified
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 sm:mt-6 rounded-2xl border border-white/5 bg-white/[0.02] p-3 text-[11px] text-[#8a94b8] break-words">
              Signed in via <span className="font-semibold text-white">{user?.primaryEmailAddress?.emailAddress}</span>
            </div>
          </div>

          {/* 2. SUBSCRIPTION & CREDITS METER */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-[#10142b]/90 to-[#0b0f19]/90 p-4 sm:p-6 backdrop-blur-xl shadow-[0_0_40px_-15px_rgba(99,102,241,0.25)]">
            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-indigo-500/20 blur-2xl" />

            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <Crown className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-bold text-white">Active Tier</span>
                </div>

                <span className={`rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-black uppercase tracking-wider border ${
                  isSubscribed 
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" 
                    : "bg-slate-700/30 text-slate-400 border-slate-600/30"
                }`}>
                  {planName}
                </span>
              </div>

              {/* Credits Big Display */}
              <div className="mt-5 sm:mt-6">
                <span className="text-xs font-semibold text-[#8a94b8] uppercase tracking-wider">Available Compute</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                    {credits}
                  </span>
                  <span className="text-xs font-medium text-emerald-400">Credits Remaining</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#8a94b8]">
                  <span>Tier Quota</span>
                  <span>{creditPercentage}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${creditPercentage}%` }}
                  />
                </div>
                <span className="mt-1 block text-[10px] text-[#6b769e]">
                  Allocated: {maxCredits} credits / month
                </span>
              </div>
            </div>

            <Link
              href="/dashboard/upgrade"
              className="mt-5 sm:mt-6 flex w-full items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-500 bg-[length:200%_auto] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-[position:right_center] active:scale-[0.98]"
            >
              <span>{planName === "AGENCY" ? "Plan Active" : "Upgrade / Change Plan"}</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {/* 3. TRANSACTION & INVOICE DETAILS */}
          <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0b0f19]/80 p-4 sm:p-6 backdrop-blur-xl">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-slate-300 border border-white/10">
                  <Receipt className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold text-white">Latest Transaction</span>
              </div>

              <div className="mt-4 sm:mt-5 space-y-3 text-xs">
                {/* Payment ID (Overflow-proof) */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#8a94b8]">Razorpay Payment ID</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(dbUser?.paymentId, "pay")}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                      title="Copy Payment ID"
                    >
                      {copiedKey === "pay" ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-slate-200 truncate max-w-[220px] xs:max-w-[260px]">
                    {dbUser?.paymentId || "No direct payment record"}
                  </p>
                </div>

                {/* Order ID (Overflow-proof) */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#8a94b8]">Razorpay Order ID</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(dbUser?.orderId, "ord")}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                      title="Copy Order ID"
                    >
                      {copiedKey === "ord" ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-slate-200 truncate max-w-[220px] xs:max-w-[260px]">
                    {dbUser?.orderId || "N/A (Free Tier)"}
                  </p>
                </div>

                {/* DB Engine Indicator */}
                <div className="flex items-center justify-between px-1 text-[11px]">
                  <span className="text-[#8a94b8]">Database Engine</span>
                  <span className="font-semibold text-emerald-400">Neon Serverless PG</span>
                </div>
              </div>
            </div>

            <div className="mt-5 sm:mt-6 flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] px-3.5 py-2.5 text-[11px] text-[#8a94b8]">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                Updated at
              </span>
              <span className="font-medium text-slate-200">
                {dbUser?.updatedAt 
                  ? new Date(dbUser.updatedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })
                  : "Active"}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}