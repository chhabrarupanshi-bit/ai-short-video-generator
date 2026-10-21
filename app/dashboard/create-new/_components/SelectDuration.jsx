"use client";

import React, { useState } from "react";
import { Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * SelectDuration Component
 * Allows creators to select target video length (15s, 30s, 60s).
 * Features mobile-first trigger scaling, touch padding, and visual icon pairing.
 */
const SelectDuration = ({ onUserSelect }) => {
  const [selectedOption, setSelectedOption] = useState("");

  // Updates local component state and dispatches duration value to parent form handler
  const handleSelectChange = (value) => {
    setSelectedOption(value);
    onUserSelect("duration", value);
  };

  const itemClass =
    "cursor-pointer rounded-lg py-2.5 text-xs sm:text-sm text-[#b4bde0] transition-colors focus:bg-[#1d2347] focus:text-white data-[state=checked]:text-[#a5b0f0]";

  return (
    <div className="rounded-2xl border border-[#1b2349]/70 bg-gradient-to-b from-[#0c1124] to-[#080b1a] p-4 sm:p-5 shadow-[0_8px_30px_-12px_rgba(99,102,241,0.25)] transition-colors duration-300 hover:border-indigo-400/30">
      
      {/* SECTION HEADER: Responsive Typography */}
      <h2 className="text-base sm:text-lg font-semibold tracking-tight text-white">
        Duration
      </h2>
      <p className="mt-1 text-xs sm:text-sm text-[#8a94b8]">
        Select the duration of your video
      </p>

      {/* DROPDOWN SELECT TRIGGER */}
      {/* Mobile: Full Width | Tablet/Desktop (sm): 280px */}
      <Select onValueChange={handleSelectChange} value={selectedOption}>
        <SelectTrigger className="group mt-3 sm:mt-4 h-11 w-full sm:w-[280px] rounded-xl border border-[#232b56] bg-[#121731] px-4 text-xs sm:text-sm text-white outline-none transition-all duration-200 hover:border-indigo-400/50 focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-500/30 data-[state=open]:border-indigo-400/70 data-[state=open]:ring-2 data-[state=open]:ring-indigo-500/30 data-[placeholder]:text-[#64748b] [&>svg]:text-[#8a94b8]">
          <span className="flex items-center gap-2.5">
            <Clock className="h-4 w-4 text-[#7b8ef8]" />
            <SelectValue placeholder="Duration" />
          </span>
        </SelectTrigger>

        {/* DROPDOWN POPOVER OPTIONS */}
        <SelectContent className="rounded-xl border border-[#232b56] bg-[#0c1124] text-white shadow-2xl shadow-black/50">
          <SelectGroup>
            <SelectItem value="15 seconds" className={itemClass}>
              15 seconds
            </SelectItem>
            <SelectItem value="30 seconds" className={itemClass}>
              30 seconds
            </SelectItem>
            <SelectItem value="60 seconds" className={itemClass}>
              60 seconds
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectDuration;