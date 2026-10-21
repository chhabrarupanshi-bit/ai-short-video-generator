"use client";

import React, { useState } from "react";
import PlayerDialog from "./PlayerDialog";
import { Play } from "lucide-react";

/**
 * VideoList Component
 * Renders the creator's generated shorts in a 9:16 vertical aspect ratio.
 * Features mobile-first grid columns, touch feedback, and responsive play dialog triggers.
 */
export default function VideoList({ videoList }) {
  const [openPlayerDialog, setOpenPlayerDialog] = useState(false);
  const [videoId, setVideoId] = useState(null);

  return (
    <div className="w-full">
      {/* ================= 9:16 SHORTS RESPONSIVE GRID ================= */}
      {/* Mobile: 2 cols (gap-3) | Tablet (sm): 3 cols | Laptop (md): 4 cols | Desktop (xl): 5 cols */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
        {videoList &&
          videoList.map((video, index) => {
            const thumbnailImage =
              video?.imageList?.[0] || "/placeholder.jpg";

            return (
              <div
                key={video.id || index}
                onClick={() => {
                  setVideoId(video.id);
                  setOpenPlayerDialog(Date.now());
                }}
                className="group relative aspect-[9/16] w-full cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f19] shadow-lg transition-all duration-300 ease-out active:scale-[0.98] sm:hover:-translate-y-1 sm:hover:border-indigo-500/80 sm:hover:shadow-xl sm:hover:shadow-indigo-500/20"
              >
                {/* 1. Full Cover Image Thumbnail */}
                <img
                  src={thumbnailImage}
                  alt="Video Thumbnail"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out sm:group-hover:scale-105"
                  loading="lazy"
                />

                {/* 2. Ambient Gradient Vignette & Content Meta */}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/40 to-transparent p-3 sm:p-4">
                  {/* Scene 1 Script Caption preview */}
                  <p className="line-clamp-2 text-[11px] sm:text-xs font-semibold leading-snug text-white drop-shadow-md">
                    {video?.script?.[0]?.contentText || "AI Short Video"}
                  </p>

                  {/* Play Action Indicator */}
                  <div className="mt-1.5 flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-indigo-400">
                    <Play className="h-3 w-3 fill-indigo-400" />
                    <span>Watch Video</span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* ================= REMOTION VIDEO PREVIEW MODAL ================= */}
      <PlayerDialog playVideo={Boolean(openPlayerDialog)} videoId={videoId} />
    </div>
  );
}