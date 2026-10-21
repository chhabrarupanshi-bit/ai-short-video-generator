"use client";

import React, { useState } from "react";
import Header from "@/app/dashboard/_components/Header";
import SideNav from "./_components/SideNav";
import { VideoContext } from "@/app/api/_context/VideoContextData";

/**
 * DashboardLayout Component
 * Manages the global video generation context, responsive desktop layout,
 * and the mobile navigation sliding drawer overlay.
 */
const DashboardLayout = ({ children }) => {
  // Global state context for handling generated video pipeline data
  const [videoData, setVideoData] = useState({});

  // Mobile state flag to toggle drawer visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <VideoContext.Provider value={{ videoData, setVideoData }}>
      <div className="min-h-screen bg-[#060813] text-white">
        
        {/* ================= DESKTOP FIXED SIDEBAR ================= */}
        {/* Visible only on tablet/desktop devices (md breakpoint and up) */}
        <aside className="hidden md:block fixed top-16 left-0 h-[calc(100vh-64px)] w-64 border-r border-[#1e2442] z-20 bg-[#060813]">
          <SideNav />
        </aside>

        {/* ================= MOBILE SLIDING DRAWER ================= */}
        {/* Dim backdrop overlay for closing drawer when clicking outside */}
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity"
            aria-hidden="true"
          />
        )}

        {/* Slide-out navigation drawer for mobile screens */}
        <div
          className={`fixed top-16 left-0 z-50 h-[calc(100vh-64px)] w-72 max-w-[80vw] bg-[#060813] border-r border-[#1e2442] transform transition-transform duration-300 ease-in-out md:hidden ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Automatically close drawer when a navigation route is clicked */}
          <SideNav onLinkClick={() => setIsMobileMenuOpen(false)} />
        </div>

        {/* ================= HEADER & MAIN VIEWPORT ================= */}
        <div className="flex flex-col min-h-screen">
          {/* Sticky responsive navigation bar with hamburger menu toggle */}
          <Header
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />

          {/* Main content body: offset by 256px on desktop (md:ml-64), full width on mobile */}
          <main className="md:ml-64 min-h-[calc(100vh-64px)] p-4 sm:p-6 lg:p-8 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </VideoContext.Provider>
  );
};

export default DashboardLayout;