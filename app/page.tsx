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
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050711] text-white selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Ambient Background Glows */}
      <div className="pointer-events-none absolute left-1/2 -top-20 -translate-x-1/2 h-[340px] w-[360px] sm:w-[750px] rounded-full bg-gradient-to-b from-indigo-500/25 via-purple-600/15 to-transparent blur-[90px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

      {/* 1. NAVBAR */}
      <header className="relative z-30 mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8 sm:py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-md shadow-indigo-500/30 ring-1 ring-white/15">
            <Video className="h-4 w-4 text-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[15px] sm:text-base font-bold tracking-tight text-white">
              AI Video Engine
            </span>
            <span className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-indigo-300">
              Studio
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          {!isLoaded ? (
            <div className="h-8 w-20 animate-pulse rounded-lg bg-white/10" />
          ) : isSignedIn ? (
            <div className="flex items-center gap-2.5">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition-all hover:opacity-95 active:scale-95"
              >
                <span>Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <div className="flex items-center justify-center rounded-full border border-white/10 p-0.5 bg-[#0e1326]">
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
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition-all hover:opacity-95 active:scale-95"
              >
                <span>Get Started</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* 2. HERO SECTION */}
      <main className="relative z-20 mx-auto max-w-4xl px-4 pt-6 pb-16 text-center sm:pt-16 sm:pb-24">
        {/* Subtle Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/[0.08] px-3.5 py-1 text-[11px] font-medium text-indigo-300 backdrop-blur-md">
          <Sparkles className="h-3 w-3 text-indigo-400" />
          <span>Next-Gen AI Short Video Generator</span>
        </div>

        {/* Polished Heading with Visual Punch */}
        <h1 className="mt-5 text-[28px] xs:text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.18] sm:leading-[1.12]">
          Generate Viral Shorts{" "}
          <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
            From A Single Topic
          </span>{" "}
          in Seconds.
        </h1>

        {/* Crisp Subtitle */}
        <p className="mx-auto mt-3.5 max-w-xl text-[13px] sm:text-sm md:text-base leading-relaxed text-slate-400">
          Automate scripts, dynamic style-based image generation, AI voiceover sync, and captions designed for YouTube Shorts, Reels, and TikTok.
        </p>

        {/* Polished Action Buttons */}
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 max-w-sm mx-auto sm:max-w-none">
          <Link
            href={isSignedIn ? "/dashboard" : "/sign-up"}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-6 py-3 text-xs sm:text-sm font-bold tracking-wide text-white shadow-lg shadow-indigo-600/35 transition-all hover:brightness-110 active:scale-95"
          >
            <span>{isSignedIn ? "Go To Workspace" : "Start Creating Free"}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href={isSignedIn ? "/dashboard/upgrade" : "/sign-in"}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#0f1429]/70 px-5 py-3 text-xs sm:text-sm font-medium text-slate-300 backdrop-blur-md transition-all hover:border-white/20 hover:text-white active:scale-95"
          >
            <Crown className="h-4 w-4 text-amber-400" />
            <span>Explore Pricing & Credits</span>
          </Link>
        </div>

        {/* Subtle Visual Divider Line */}
        <div className="mt-12 mx-auto h-px w-24 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

        {/* Modern Feature Cards */}
        <div className="mt-10 grid grid-cols-1 gap-3.5 sm:gap-5 sm:grid-cols-3 text-left">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c1022]/60 p-5 backdrop-blur-md transition-all hover:border-indigo-500/30">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Zap className="h-4 w-4" />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-white">AI Script & Voiceover</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              Multi-scene script synthesis paired with natural text-to-speech audio pipelines.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#0c1022]/60 p-5 backdrop-blur-md transition-all hover:border-purple-500/30">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Layers className="h-4 w-4" />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-white">5 Visual Art Styles</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              Switch across Comic, GTA art, Cartoon 3D, Realistic 8K, and WaterColor.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#0c1022]/60 p-5 backdrop-blur-md transition-all hover:border-emerald-500/30">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-white">Full SaaS Infrastructure</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              Powered by Clerk Auth, Neon PostgreSQL, Drizzle ORM, and Razorpay payments.
            </p>
          </div>
        </div>
      </main>

      {/* 3. FOOTER */}
      <footer className="relative z-10 border-t border-white/[0.06] py-6 text-center text-[11px] text-slate-500">
        <p>© {new Date().getFullYear()} AI Video Engine Studio. All rights reserved.</p>
      </footer>
    </div>
  );
}