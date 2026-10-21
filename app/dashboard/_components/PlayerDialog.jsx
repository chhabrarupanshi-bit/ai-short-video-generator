"use client";

import React, { useState, useEffect } from "react";
import { Player } from "@remotion/player";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RemotionVideo from "./RemotionVideo";
import { getVideoByIdServer } from "@/app/_actions/video";
import { useRouter } from "next/navigation";

/**
 * PlayerDialog Component
 * Displays a 9:16 vertical short preview player powered by Remotion.
 * Features automated frame calculation based on caption timings,
 * responsive modal scaling for mobile devices, and routing controls.
 */
const PlayerDialog = ({ playVideo, videoId }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [videoRecord, setVideoRecord] = useState(null);
  const [durationInFrames, setDurationInFrames] = useState(120);

  const router = useRouter();

  // Sync dialog visibility and fetch asset record when videoId updates
  useEffect(() => {
    setOpenDialog(Boolean(playVideo));
    if (videoId) {
      GetVideoData();
    }
  }, [playVideo, videoId]);

  // Fetch full video record from Neon PostgreSQL via Server Action
  const GetVideoData = async () => {
    try {
      console.log("Fetching DB row securely for videoId:", videoId);
      const res = await getVideoByIdServer(videoId);

      if (res?.success && res?.data) {
        console.log("=== VIDEO ROW FETCHED SECURELY ===", res.data);
        setVideoRecord(res.data);

        // Dynamically compute total Remotion composition frames based on AssemblyAI caption end-times
        const captions = res.data?.captions;
        if (Array.isArray(captions) && captions.length > 0) {
          const lastWordEnd = captions[captions.length - 1]?.end;
          if (lastWordEnd) {
            const calculatedFrames = Math.ceil((lastWordEnd / 1000) * 30);
            setDurationInFrames(calculatedFrames + 30);
          }
        }
      } else {
        console.warn("Video not found or fetch error:", res?.error);
      }
    } catch (err) {
      console.error("Error fetching video data in dialog:", err);
    }
  };

  // Closes dialog without redirect
  const handleCancel = () => {
    setOpenDialog(false);
  };

  // Closes dialog and routes creator to the main dashboard workspace
  const handleExport = () => {
    setOpenDialog(false);
    router.push("/dashboard");
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="w-[92vw] max-w-[420px] rounded-3xl border border-white/10 bg-[#0b0f19] p-4 sm:p-6 text-white shadow-2xl backdrop-blur-xl">
        {/* MODAL HEADER */}
        <DialogHeader className="w-full text-center">
          <DialogTitle className="bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-lg sm:text-xl font-bold text-transparent">
            Your Video is Ready
          </DialogTitle>
          <DialogDescription className="text-xs text-[#8a94b8]">
            Preview your generated AI vertical short video
          </DialogDescription>
        </DialogHeader>

        {/* ================= 9:16 VERTICAL REMOTION PLAYER ================= */}
        <div className="relative mt-2 sm:mt-3 flex aspect-[9/16] max-h-[55vh] sm:max-h-none sm:h-[460px] w-full justify-center overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
          {videoRecord ? (
            <Player
              component={RemotionVideo}
              durationInFrames={durationInFrames}
              compositionWidth={720}
              compositionHeight={1280}
              fps={30}
              controls={true}
              acknowledgeRemotionLicense={true}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "16px",
              }}
              inputProps={{
                ...videoRecord,
                setDurationInFrames: (frameValue) =>
                  setDurationInFrames(frameValue),
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-4 text-center text-xs text-[#8a94b8]">
              Loading video data from database...
            </div>
          )}
        </div>

        {/* ================= MODAL ACTIONS ================= */}
        <div className="mt-4 sm:mt-5 flex w-full gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs sm:text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white cursor-pointer active:scale-95"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-indigo-600/30 transition-all hover:opacity-95 cursor-pointer active:scale-95"
          >
            Export
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerDialog;