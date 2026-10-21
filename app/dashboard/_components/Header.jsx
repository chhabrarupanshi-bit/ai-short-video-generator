"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Show, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";

/**
 * Header Component
 * Sticky top navigation bar handling user credits synchronization,
 * brand branding, Clerk profile controls, and mobile hamburger drawer toggling.
 */
const Header = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { user } = useUser();
  const [credits, setCredits] = useState(100);

  // Sync remaining user compute credits from Neon PostgreSQL
  useEffect(() => {
    async function fetchUserCredits() {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) return;

      try {
        const res = await fetch(`/api/get-user?email=${email}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.user?.credits !== undefined) {
            setCredits(data.user.credits);
          }
        }
      } catch (err) {
        console.error("Failed to load header credits:", err);
      }
    }

    fetchUserCredits();
  }, [user]);

  return (
    <header className="sticky top-0 z-30 w-full overflow-hidden border-b border-[#12172b] bg-[#060813]">
      {/* Decorative ambient glows & border lines */}
      <div className="pointer-events-none absolute -left-24 top-1/2 h-40 w-72 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

      <div className="relative flex h-16 w-full items-center justify-between px-3 sm:px-6 lg:px-8">

        {/* ================= LEFT: HAMBURGER & LOGO ================= */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile hamburger toggle (Hidden on desktop md breakpoint) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen?.(!isMobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#121731] text-slate-300 transition-colors hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {/* Workspace Brand Logo & Title */}
          <Link
            href="/dashboard"
            className="group flex select-none items-center gap-2.5 sm:gap-3 outline-none"
          >
            <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#3b52d4]/25 to-[#7f5af0]/25 ring-1 ring-white/10 transition-all duration-300 group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="AI Video Engine logo"
                width={20}
                height={20}
                className="object-contain"
                priority
              />
            </div>

            <span className="text-sm sm:text-[16px] font-semibold tracking-tight text-white truncate max-w-[120px] xs:max-w-none">
              AI Video Engine
            </span>

            <span className="hidden xs:inline rounded-full border border-indigo-400/20 bg-[#181d36] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8b97dc]">
              Studio
            </span>
          </Link>
        </div>

        {/* ================= RIGHT: CREDITS & AUTH ================= */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live credits balance indicator badge */}
          <div className="flex h-8 sm:h-9 items-center gap-1.5 sm:gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.07] px-2.5 sm:px-3.5 text-xs transition-colors">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-semibold text-emerald-200">
              {credits}
              <span className="hidden sm:inline font-normal"> credits</span>
            </span>
          </div>

          {/* Quick link button to dashboard view */}
          <Link
            href="/dashboard"
            className="group flex h-8 sm:h-9 items-center gap-2 rounded-xl border border-indigo-400/25 bg-[#121731] px-2.5 sm:px-3 text-xs font-medium text-[#9ba8e8] transition-all hover:text-white"
            title="Dashboard"
          >
            <svg
              className="h-3.5 w-3.5 text-[#7382d6] transition-colors group-hover:text-indigo-300"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          {/* Clerk authentication avatar and modal trigger */}
          <div className="flex items-center">
            <Show when="signed-in">
              <div className="flex items-center justify-center rounded-full p-0.5 transition-all duration-300 hover:ring-2 hover:ring-indigo-400/50">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox:
                        "h-8 w-8 rounded-full border border-indigo-400/30 shadow-md shadow-indigo-500/20 overflow-hidden",
                      userButtonAvatarImage: "rounded-full object-cover",
                      userButtonTrigger: "rounded-full focus:outline-none",
                      avatarBox: "h-8 w-8",
                      avatarImage:
                        "bg-gradient-to-tr from-[#3b52d4] via-[#5c46e0] to-[#7f5af0] text-white font-semibold",
                    },
                  }}
                />
              </div>
            </Show>

            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="h-8 sm:h-9 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#6d5ef0] px-3 sm:px-4 text-xs font-medium text-white shadow-md shadow-indigo-600/25 cursor-pointer"
                >
                  Sign in
                </button>
              </SignInButton>
            </Show>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;