import React from "react";
import Link from "next/link";
import { Clapperboard, Plus, Sparkles } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="group relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-indigo-400/20 bg-gradient-to-b from-[#0c1124] to-[#080b1a] px-6 py-20 text-center transition-colors duration-300 hover:border-indigo-400/40">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-[28rem] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-indigo-600/20 blur-3xl" />

      {/* Icon */}
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3b52d4]/30 to-[#7f5af0]/30 ring-1 ring-indigo-400/30 shadow-[0_0_40px_-8px_rgba(99,102,241,0.6)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105">
          <Clapperboard className="h-9 w-9 text-[#a5b0f0]" strokeWidth={1.6} />
        </div>
        <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#121731] ring-1 ring-indigo-400/30">
          <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
        </span>
      </div>

      {/* Text */}
      <h2 className="relative text-2xl font-bold tracking-tight text-white">
        No videos found
      </h2>
      <p className="relative mt-2 max-w-sm text-sm leading-relaxed text-[#8a94b8]">
        Aapne abhi tak koi video nahi banaya. Apna pehla AI video create karo
        aur yahan dekho.
      </p>

      {/* CTA */}
      <Link
        href="/dashboard/create-new"
        className="relative mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7f5af0] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 outline-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-600/50 focus-visible:ring-2 focus-visible:ring-indigo-300/60 active:translate-y-0"
      >
        <Plus className="h-4 w-4" />
        Create New Video
      </Link>
    </div>
  );
};

export default EmptyState;