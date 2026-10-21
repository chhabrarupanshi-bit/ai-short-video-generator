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
  Crown
} from "lucide-react";

export default function HomePage() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#060813] text-white selection:bg-indigo-500 selection:text-white">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-transparent blur-[140px]" />
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[400px] w-[500px] rounded-full bg-cyan-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute -right-40 bottom-20 h-[450px] w-[550px] rounded-full bg-purple-600/15 blur-[140px]" />

      {/* 1. NAVBAR */}
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-lg shadow-indigo-600/30">
            <Video className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-black tracking-tight text-white">
            AI Video Engine <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 rounded-full ml-1.5">Studio</span>
          </span>
        </div>

        <nav className="flex items-center gap-4">
          {!isLoaded ? (
            <div className="h-8 w-24 animate-pulse rounded-xl bg-white/10" />
          ) : isSignedIn ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <span>Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <UserButton  />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/sign-in"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <span>Get Started Free</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* 2. HERO SECTION */}
      <main className="relative z-10 mx-auto max-w-5xl px-6 pt-16 pb-24 text-center sm:px-8 sm:pt-24">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-md transition-all hover:border-indigo-400/50">
          <Sparkles className="h-3.5 w-3.5 animate-pulse text-indigo-400" />
          <span>Next-Gen AI Short Video Generator</span>
        </div>

        {/* Title */}
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
          Generate Viral Shorts <br />
          <span className="bg-gradient-to-r from-white via-indigo-200 to-[#a5b0f0] bg-clip-text text-transparent">
            From A Single Topic in Seconds.
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-[#8a94b8] sm:text-base">
          Automate scripts, dynamic style-based image generation, AI voiceover sync, and word-by-word captions designed exclusively for YouTube Shorts, Reels, and TikTok.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={isSignedIn ? "/dashboard" : "/sign-up"}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-500 bg-[length:200%_auto] px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-indigo-600/30 transition-all hover:bg-[position:right_center] hover:scale-105 active:scale-95 sm:w-auto"
          >
            <span>{isSignedIn ? "Go To Workspace" : "Start Creating Free"}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href={isSignedIn ? "/dashboard/upgrade" : "/sign-in"}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-sm font-semibold text-slate-200 backdrop-blur-xl transition-all hover:bg-white/10 hover:border-white/20 sm:w-auto"
          >
            <Crown className="h-4 w-4 text-yellow-400" />
            <span>Explore Pricing & Credits</span>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
          <div className="rounded-3xl border border-white/10 bg-[#0b0f19]/80 p-6 backdrop-blur-xl shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-white">AI Script & Voiceover</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#8a94b8]">
              Instant multi-scene script synthesis paired with natural-sounding text-to-speech audio pipelines.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0b0f19]/80 p-6 backdrop-blur-xl shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-white">5 Visual Art Styles</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#8a94b8]">
              Switch effortlessly across Comic, GTA vector art, Cartoon 3D, Realistic 8K, and WaterColor.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0b0f19]/80 p-6 backdrop-blur-xl shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-white">Full SaaS Infrastructure</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#8a94b8]">
              Powered by Clerk Auth, Neon PostgreSQL, Drizzle ORM, and secure Razorpay payment verification.
            </p>
          </div>
        </div>
      </main>

      {/* 3. FOOTER */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-xs text-[#8a94b8]">
        <p>© {new Date().getFullYear()} AI Video Engine Studio. All rights reserved.</p>
      </footer>
    </div>
  );
}