"use client";

import React, { useState } from "react";
import Image from "next/image";

/**
 * SelectStyle Component
 * Visual art style picker for AI image rendering.
 * Features mobile-first responsive grid, glowing hover/selection states, and adaptive badge padding.
 */
const SelectStyle = ({ onUserSelect }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  // Available generative art styles
  const styleOptions = [
    {
      name: "Realistic",
      image: "/realistic.png",
      id: 1,
      fit: "cover",
    },
    {
      name: "Cartoon",
      image: "/cartoon2.png",
      id: 2,
      fit: "contain",
    },
    {
      name: "Comic",
      image: "/comic2.png",
      id: 3,
      fit: "cover",
    },
    {
      name: "WaterColor",
      image: "/watercolor.png",
      id: 4,
      fit: "contain",
    },
    {
      name: "GTA",
      image: "/gta.png",
      id: 5,
      fit: "contain",
    },
  ];

  // Dispatches selection to parent form handler
  const handleSelect = (name) => {
    setSelectedOption(name);
    if (onUserSelect) {
      onUserSelect("style", name);
    }
  };

  return (
    <div className="rounded-2xl border border-[#1b2349]/70 bg-gradient-to-b from-[#0c1124] to-[#080b1a] p-4 sm:p-5 shadow-[0_8px_30px_-12px_rgba(99,102,241,0.25)]">
      
      {/* SECTION HEADER */}
      <h2 className="text-base sm:text-lg font-semibold tracking-tight text-white">
        Style
      </h2>
      <p className="mt-1 text-xs sm:text-sm text-[#8a94b8]">
        Select your video style
      </p>

      {/* RESPONSIVE STYLES GRID */}
      {/* Mobile: 2 cols | Tablet (sm): 3 cols | Desktop (lg): 5 cols */}
      <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {styleOptions.map((item) => {
          const isSelected = selectedOption === item.name;

          return (
            <div
              key={item.id}
              onClick={() => handleSelect(item.name)}
              className={`group relative aspect-square cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 active:scale-95 sm:hover:-translate-y-1.5 ${
                isSelected
                  ? "border-indigo-400 ring-2 ring-indigo-500/70 shadow-[0_10px_28px_-6px_rgba(99,102,241,0.7)]"
                  : "border-[#232b56] bg-gradient-to-br from-[#1a2150] via-[#121731] to-[#0c1124] hover:border-indigo-400/60"
              }`}
            >
              {/* Radial ambient glow behind asset */}
              <div
                className={`pointer-events-none absolute left-1/2 top-1/3 h-20 w-20 sm:h-24 sm:w-24 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl transition-opacity duration-300 ${
                  isSelected
                    ? "bg-indigo-500/40 opacity-100"
                    : "bg-indigo-500/20 opacity-60 group-hover:opacity-100"
                }`}
              />

              {/* Dynamic Thumbnail Display */}
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
                className={`transition-transform duration-500 ease-out sm:group-hover:scale-105 ${
                  item.fit === "cover"
                    ? "object-cover"
                    : "object-contain p-3 sm:p-4 pb-10 sm:pb-12"
                }`}
              />

              {/* Gradient Bottom Overlay with Title Badge */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center bg-gradient-to-t from-[#060813] via-[#060813]/80 to-transparent px-2 pb-2.5 sm:pb-3 pt-8 sm:pt-10">
                <p
                  className={`rounded-full border px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-semibold tracking-wide backdrop-blur-sm transition-all duration-300 ${
                    isSelected
                      ? "border-indigo-400 bg-indigo-500/50 text-white"
                      : "border-white/10 bg-white/5 text-slate-200 group-hover:border-indigo-400/50 group-hover:bg-indigo-500/30"
                  }`}
                >
                  {item.name}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectStyle;