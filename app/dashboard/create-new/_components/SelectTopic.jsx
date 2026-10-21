"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

/**
 * SelectTopic Component
 * Handles topic selection via predefined categories or a custom prompt textarea.
 * Optimized for mobile touch devices and desktop viewports.
 */
const SelectTopic = ({ onUserSelect }) => {
  const options = [
    "Custom Prompt",
    "Random AI Story",
    "Scary Story",
    "Historical fact",
    "Bed Time Story",
    "Motivational Story",
    "fun facts",
  ];

  const [selectedOption, setSelectedOption] = useState("");

  // Handle dropdown value changes
  const handleSelectChange = (value) => {
    setSelectedOption(value);
    // If not custom prompt, immediately update parent formData
    if (value !== "Custom Prompt") {
      onUserSelect("topic", value);
    }
  };

  return (
    <div className="rounded-2xl border border-[#1b2349]/70 bg-gradient-to-b from-[#0c1124] to-[#080b1a] p-4 sm:p-5 shadow-[0_8px_30px_-12px_rgba(99,102,241,0.25)] transition-colors duration-300 hover:border-indigo-400/30">
      
      {/* SECTION HEADER: Mobile responsive fonts */}
      <h2 className="text-base sm:text-lg font-semibold tracking-tight text-white">
        Select a Topic
      </h2>
      <p className="mt-1 text-xs sm:text-sm text-[#8a94b8]">
        What is the topic of your video?
      </p>

      {/* DROPDOWN SELECT TRIGGER */}
      {/* Mobile: Full Width | Tablet/Desktop: 280px */}
      <Select onValueChange={handleSelectChange} value={selectedOption}>
        <SelectTrigger className="mt-3 sm:mt-4 h-11 w-full sm:w-[280px] rounded-xl border border-[#232b56] bg-[#121731] px-4 text-xs sm:text-sm text-white outline-none transition-all duration-200 hover:border-indigo-400/50 focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-500/30 data-[state=open]:border-indigo-400/70 data-[state=open]:ring-2 data-[state=open]:ring-indigo-500/30 data-[placeholder]:text-[#64748b] [&>svg]:text-[#8a94b8]">
          <SelectValue placeholder="Content Type" />
        </SelectTrigger>
        <SelectContent className="max-h-[260px] rounded-xl border border-[#232b56] bg-[#0c1124] text-white shadow-2xl shadow-black/50">
          <SelectGroup>
            {options.map((item) => (
              <SelectItem
                key={item}
                value={item}
                className="cursor-pointer rounded-lg py-2.5 text-xs sm:text-sm text-[#b4bde0] transition-colors focus:bg-[#1d2347] focus:text-white data-[state=checked]:text-[#a5b0f0]"
              >
                {item}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* CONDITIONAL CUSTOM PROMPT TEXTAREA */}
      {selectedOption === "Custom Prompt" && (
        <Textarea
          className="mt-3 sm:mt-4 min-h-[110px] sm:min-h-[130px] w-full resize-none rounded-xl border border-[#232b56] bg-[#121731] p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed text-white outline-none transition-all duration-200 placeholder:text-[#64748b] hover:border-indigo-400/40 focus:border-indigo-400/70 focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:ring-offset-0 animate-in fade-in slide-in-from-top-2 duration-300"
          placeholder="Write the prompt on which you want to generate a video..."
          onChange={(e) => onUserSelect("topic", e.target.value)}
        />
      )}
    </div>
  );
};

export default SelectTopic;