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
    <div className="relative min-h-screen w-full overflow-hidden bg-[#060814] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Precision Ambient Glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[320px] w-[90vw] max-w-[650px] rounded-full bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-[90px]" />
      <div className="pointer-events-none absolute top-1/3 -left-32 h-[300px] w-[300px] rounded-full bg-blue-600/10 blur-[100px]" />

      {/* 1. CLEAN MODERN HEADER */}
      <header className="relative z-30 mx-auto max-w-6xl px-4 py-4 sm:px-8">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-md shadow-indigo-600/20 ring-1 ring-white/10 transition-transform group-hover:scale-105">
              <Video className="h-4 w-4 text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[15px] sm:text-base font-bold tracking-tight text-white">
                AI Video Engine
              </span>
              <span className="rounded-md border border-indigo-400/20 bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
                Studio
              </span>
            </div>
          </Link>

          {/* Navigation & Auth */}
          <nav className="flex items-center gap-2 sm:gap-3">
            {!isLoaded ? (
              <div className="h-8 w-20 animate-pulse rounded-lg bg-white/10" />
            ) : isSignedIn ? (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:brightness-110 active:scale-95"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
                <div className="flex items-center justify-center rounded-full border border-white/10 p-0.5 bg-slate-900">
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "h-7 w-7",
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
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition-all hover:brightness-110 active:scale-95"
                >
                  <span>Get Started</span>
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <main className="relative z-20 mx-auto max-w-4xl px-4 pt-6 pb-20 text-center sm:pt-14 sm:pb-28">
        {/* Release Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/[0.08] px-3 py-1 text-[11px] font-medium text-indigo-300 backdrop-blur-md">
          <Sparkles className="h-3 w-3 text-indigo-400" />
          <span>Next-Gen Video Synthesis</span>
        </div>

        {/* Polished Balanced Heading */}
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white leading-tight">
          Generate Viral Shorts <br />
          <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-100 bg-clip-text text-transparent">
            From A Single Topic in Seconds.
          </span>
        </h1>

        {/* Crisp Subtitle */}
        <p className="mx-auto mt-3.5 max-w-xl text-xs sm:text-sm md:text-base leading-relaxed text-slate-400 px-2">
          Automate scripts, dynamic style-based image generation, AI voiceover sync, and captions tailored for YouTube Shorts, Reels, and TikTok.
        </p>

        {/* Balanced Dual Buttons */}
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 max-w-xs sm:max-w-none mx-auto">
          <Link
            href={isSignedIn ? "/dashboard" : "/sign-up"}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:brightness-110 active:scale-95"
          >
            <span>{isSignedIn ? "Go To Workspace" : "Start Creating Free"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <Link
            href={isSignedIn ? "/dashboard/upgrade" : "/sign-in"}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#0e1224]/80 px-5 py-3 text-xs sm:text-sm font-medium text-slate-300 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white active:scale-95"
          >
            <Crown className="h-3.5 w-3.5 text-amber-400" />
            <span>Pricing & Credits</span>
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-3.5 sm:gap-5 sm:grid-cols-3 text-left">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c1022]/70 p-5 backdrop-blur-md transition-all hover:border-indigo-500/30">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Zap className="h-4 w-4" />
            </div>
            <h3 className="mt-3.5 text-sm font-semibold text-white">AI Script & Voiceover</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              Multi-scene script synthesis paired with natural text-to-speech pipelines.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#0c1022]/70 p-5 backdrop-blur-md transition-all hover:border-purple-500/30">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Layers className="h-4 w-4" />
            </div>
            <h3 className="mt-3.5 text-sm font-semibold text-white">5 Visual Art Styles</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              Switch across Comic, GTA vector, Cartoon 3D, Realistic 8K, and WaterColor.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#0c1022]/70 p-5 backdrop-blur-md transition-all hover:border-emerald-500/30">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="mt-3.5 text-sm font-semibold text-white">Production Ready SaaS</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              Clerk Auth, Neon Serverless DB, Drizzle ORM, and Razorpay transactions.
            </p>
          </div>
        </div>
      </main>

      {/* 3. MINIMAL FOOTER */}
      <footer className="relative z-10 border-t border-white/[0.06] py-6 text-center text-[11px] text-slate-500">
        <p>© {new Date().getFullYear()} AI Video Engine Studio. All rights reserved.</p>
      </footer>
    </div>
  );
}