"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";
import EmptyState from "./_components/EmptyState";
import VideoList from "./_components/VideoList";
import { useUser } from "@clerk/nextjs";
import { getUserVideosServer } from "@/app/_actions/video";

/**
 * DashboardPage Component
 * Main landing workspace displaying the creator's video projects,
 * real-time server fetching, responsive skeleton loaders, and empty-state fallbacks.
 */
const DashboardPage = () => {
  // Video collection fetched from Neon Database
  const [videoList, setVideoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  // Trigger video fetch once Clerk authentication resolves
  useEffect(() => {
    if (user) {
      fetchUserVideos();
    }
  }, [user]);

  // Fetches user videos via secure Server Action
  const fetchUserVideos = async () => {
    setLoading(true);
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (email) {
        const res = await getUserVideosServer(email);
        if (res?.success && res?.data) {
          console.log("=== USER VIDEOS FETCHED ===", res.data);
          setVideoList(res.data);
        }
      }
    } catch (err) {
      console.error("Failed to load user videos:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#060813] text-white">
      
      {/* ================= WORKSPACE HEADER ================= */}
      {/* Mobile: Vertical column layout | Desktop: Row layout */}
      <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-white via-white to-[#a5b0f0] bg-clip-text text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-transparent">
            Your creative workspace
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#8a94b8]">
            Turn ideas into engaging viral short videos.
          </p>
        </div>

        {/* CREATE VIDEO ACTION (Mobile: Full-width button | Tablet+: Auto-width) */}
        {videoList.length > 0 && (
          <Link
            href="/dashboard/create-new"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7f5af0] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-600/50 active:translate-y-0 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Video</span>
          </Link>
        )}
      </div>

      {/* ================= CONTENT SECTION ================= */}
      {loading ? (
        /* RESPONSIVE SKELETON LOADERS */
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-[320px] sm:h-[360px] w-full animate-pulse rounded-2xl border border-white/5 bg-[#0b0f19]/80 backdrop-blur-md"
            />
          ))}
        </div>
      ) : videoList.length === 0 ? (
        /* ZERO VIDEOS CREATED FALLBACK */
        <EmptyState />
      ) : (
        /* PROJECTS LIST SECTION */
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-white">
              Recent projects
            </h2>
            <span className="text-xs text-[#8a94b8]">
              {videoList.length} {videoList.length === 1 ? "video" : "videos"}
            </span>
          </div>

          {/* Dynamic Video Grid Component */}
          <VideoList videoList={videoList} />
        </section>
      )}
    </div>
  );
};

export default DashboardPage;