"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  CirclePlus,
  Crown,
  User,
  ChevronDown,
} from "lucide-react";

// Sidebar route mapping definitions
const MenuOptions = [
  { id: 1, name: "Dashboard", path: "/dashboard", icon: LayoutGrid },
  {
    id: 2,
    name: "Create New",
    path: "/dashboard/create-new",
    icon: CirclePlus,
  },
  { id: 3, name: "Upgrade", path: "/dashboard/upgrade", icon: Crown },
  { id: 4, name: "Account", path: "/dashboard/account", icon: User },
];

/**
 * SideNav Component
 * Main navigation rail providing dynamic route highlighting,
 * automated drawer dismiss callback, and workspace account preview.
 */
const SideNav = ({ onLinkClick }) => {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-full select-none flex-col justify-between bg-[#060813] p-4">
      
      {/* ================= PRIMARY NAVIGATION LINKS ================= */}
      <nav className="flex flex-col gap-1.5">
        {MenuOptions.map((item) => {
          // Precise active route evaluation to avoid false highlights on sub-routes
          const isActive =
            item.path === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.path || pathname.startsWith(`${item.path}/`);

          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.path}
              onClick={() => onLinkClick && onLinkClick()} // Auto-close drawer on mobile navigation
              aria-current={isActive ? "page" : undefined}
              className={`group relative flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-medium outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-400/50 ${
                isActive
                  ? "bg-gradient-to-r from-[#1d2347] to-[#161b3a] text-white shadow-[0_4px_20px_-6px_rgba(99,102,241,0.45)] ring-1 ring-indigo-400/20"
                  : "text-[#8a94b8] hover:translate-x-1 hover:bg-[#12172f]/70 hover:text-white"
              }`}
            >
              {/* Active left glowing bar indicator */}
              {isActive && (
                <span className="absolute left-1.5 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-white shadow-[0_0_8px_#ffffff] z-10" />
              )}

              <Icon
                className={`h-[18px] w-[18px] transition-all duration-200 ${
                  isActive
                    ? "text-[#7b8ef8]"
                    : "text-[#8a94b8] group-hover:scale-110 group-hover:text-[#a5b0f0]"
                }`}
              />

              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* ================= BOTTOM WORKSPACE PILL ================= */}
      <button
        type="button"
        className="group flex w-full items-center justify-between rounded-2xl border border-[#1b2349]/70 bg-[#0f1429]/60 p-2 text-left outline-none transition-all duration-200 hover:border-[#2a3770] hover:shadow-[0_8px_24px_-8px_rgba(99,102,241,0.4)]"
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#3b52d4] via-[#5c46e0] to-[#7f5af0] text-xs font-bold text-white shadow-sm transition-transform duration-300 group-hover:rotate-6">
            R
          </div>

          <div className="flex min-w-0 flex-col">
            <span className="truncate text-xs font-semibold text-white">
              Rupanshi&apos;s Workspace
            </span>
            <span className="text-[10px] font-medium text-[#64748b]">
              Pro Plan
            </span>
          </div>
        </div>

        <ChevronDown className="mr-1 h-4 w-4 shrink-0 text-[#64748b] transition-transform duration-200 group-hover:translate-y-0.5 group-hover:text-slate-300" />
      </button>
    </div>
  );
};

export default SideNav;