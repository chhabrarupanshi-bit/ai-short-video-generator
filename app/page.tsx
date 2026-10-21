"use client";

import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { 
  Sparkles, 
  Video, 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Crown,
  ChevronRight
} from "lucide-react";

export default function HomePage() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#070913] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Background Soft Glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[260px] w-[90vw] max-w-[550px] rounded-full bg-gradient-to-b from-indigo-500/20 via-purple-600/10 to-transparent blur-[80px]" />

      {/* 1. CLEAN SENIOR DEVELOPER NAVBAR */}
      <header className="relative z-30 mx-auto max-w-6xl px-4 py-3.5 sm:px-8 sm:py-5">
        <div className="flex items-center justify-between">
          {/* Logo & Studio Tag */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-md shadow-indigo-600/30">
              <Video className="h-4 w-4 text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm sm:text-base font-bold tracking-tight text-white">
                AI Video Engine
              </span>
              <span className="rounded border border-indigo-400/20 bg-indigo-500/10 px-1.5 py-0.2 text-[9px] font-semibold uppercase tracking-wider text-indigo-300">
                Studio
              </span>
            </div>
          </Link>

          {/* Action buttons */}
          <nav className="flex items-center gap-2">
            {!isLoaded ? (
              <div className="h-7 w-16 animate-pulse rounded-lg bg-white/10" />
            ) : isSignedIn ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow transition-all hover:bg-indigo-500 active:scale-95"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
                <div className="flex items-center justify-center rounded-full border border-white/10 p-0.5 bg-slate-900">
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "h-6 w-6",
                        userButtonTrigger: "focus:outline-none",
                      },
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/sign-in"
                  className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow transition-all hover:bg-indigo-500 active:scale-95"
                >
                  <span>Get Started</span>
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* 2. BALANCED HERO SECTION */}
      <main className="relative z-20 mx-auto max-w-3xl px-4 pt-6 pb-16 text-center sm:pt-14 sm:pb-24">
        {/* Release Pill Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-[11px] font-medium text-indigo-300">
          <Sparkles className="h-3 w-3 text-indigo-400" />
          <span>Next-Gen Video Synthesis</span>
        </div>

        {/* Clean Responsive Heading */}
        <h1 className="mt-4 text-2xl xs:text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
          Generate Viral Shorts <br />
          <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-100 bg-clip-text text-transparent">
            From A Single Topic in Seconds
          </span>
        </h1>

        {/* Clean Subtitle */}
        <p className="mx-auto mt-3 max-w-lg text-xs sm:text-sm text-slate-400 leading-relaxed">
          Automate scripts, dynamic style-based image generation, AI voiceover sync, and captions designed for YouTube Shorts, Reels, and TikTok.
        </p>

        {/* Dual Primary Buttons */}
        <div className="mt-6 flex flex-col items-center justify-center gap-2.5 sm:flex-row sm:gap-3 max-w-xs sm:max-w-none mx-auto">
          <Link
            href={isSignedIn ? "/dashboard" : "/sign-up"}
            className="flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-95"
          >
            <span>{isSignedIn ? "Go To Workspace" : "Start Creating Free"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <Link
            href={isSignedIn ? "/dashboard/upgrade" : "/sign-in"}
            className="flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white active:scale-95"
          >
            <Crown className="h-3.5 w-3.5 text-amber-400" />
            <span>Pricing & Credits</span>
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-10 sm:mt-14 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-3 text-left">
          <div className="rounded-xl border border-white/10 bg-[#0d1020] p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Zap className="h-4 w-4" />
            </div>
            <h3 className="mt-2.5 text-xs sm:text-sm font-semibold text-white">AI Script & Voiceover</h3>
            <p className="mt-1 text-[11px] sm:text-xs text-slate-400 leading-relaxed">
              Multi-scene script synthesis paired with natural text-to-speech audio pipelines.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0d1020] p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
              <Layers className="h-4 w-4" />
            </div>
            <h3 className="mt-2.5 text-xs sm:text-sm font-semibold text-white">5 Visual Art Styles</h3>
            <p className="mt-1 text-[11px] sm:text-xs text-slate-400 leading-relaxed">
              Switch across Comic, GTA vector, Cartoon 3D, Realistic 8K, and WaterColor.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0d1020] p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="mt-2.5 text-xs sm:text-sm font-semibold text-white">Production Ready SaaS</h3>
            <p className="mt-1 text-[11px] sm:text-xs text-slate-400 leading-relaxed">
              Clerk Auth, Neon Serverless DB, Drizzle ORM, and Razorpay transactions.
            </p>
          </div>
        </div>
      </main>

      {/* 3. FOOTER */}
      <footer className="relative z-10 border-t border-white/5 py-5 text-center text-[10px] text-slate-500">
        <p>© {new Date().getFullYear()} AI Video Engine Studio. All rights reserved.</p>
      </footer>
    </div>
  );
}