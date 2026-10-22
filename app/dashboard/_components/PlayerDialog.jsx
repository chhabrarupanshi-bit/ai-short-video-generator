"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { Download, Loader2 } from "lucide-react";

/**
 * PlayerDialog Component
 * Displays a 9:16 vertical short preview player powered by Remotion.
 * Features client-side video frame capture to save complete video directly to gallery.
 */
const PlayerDialog = ({ playVideo, videoId }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [videoRecord, setVideoRecord] = useState(null);
  const [durationInFrames, setDurationInFrames] = useState(120);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const playerRef = useRef(null);
  const router = useRouter();

  // Dialog visibility & database record sync
  useEffect(() => {
    setOpenDialog(Boolean(playVideo));
    if (videoId) {
      GetVideoData();
    }
  }, [playVideo, videoId]);

  // Fetch full video record from Neon PostgreSQL
  const GetVideoData = async () => {
    try {
      console.log("Fetching DB row securely for videoId:", videoId);
      const res = await getVideoByIdServer(videoId);

      if (res?.success && res?.data) {
        setVideoRecord(res.data);

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

  // 🎬 Real Video (.webm/.mp4) Export & Gallery Download Handler
  const handleDownloadToGallery = async () => {
    // 1. Agar backend pe direct MP4 URL pehle se bana hai
    if (videoRecord?.videoUrl && videoRecord.videoUrl.endsWith(".mp4")) {
      try {
        setDownloading(true);
        const response = await fetch(videoRecord.videoUrl);
        const blob = await response.blob();
        triggerFileDownload(blob, `ai-short-video-${Date.now()}.mp4`);
      } catch (e) {
        window.open(videoRecord.videoUrl, "_blank");
      } finally {
        setDownloading(false);
      }
      return;
    }

    // 2. Client-side Canvas + Audio Stream Capture
    const playerContainer = document.querySelector("#remotion-player-container");
    const canvasElement = playerContainer?.querySelector("canvas");

    if (!canvasElement || typeof canvasElement.captureStream !== "function") {
      // Fallback agar canvas stream support na ho toh pehli scene image export karein
      fallbackAssetDownload();
      return;
    }

    try {
      setDownloading(true);
      setDownloadProgress(10);

      const canvasStream = canvasElement.captureStream(30);
      const combinedTracks = [...canvasStream.getVideoTracks()];

      // Audio track sync agar available ho
      const audioElement = playerContainer?.querySelector("audio");
      if (audioElement && typeof audioElement.captureStream === "function") {
        const audioStream = audioElement.captureStream();
        const audioTrack = audioStream.getAudioTracks()[0];
        if (audioTrack) combinedTracks.push(audioTrack);
      }

      const mediaStream = new MediaStream(combinedTracks);
      const mimeType = MediaRecorder.isTypeSupported("video/mp4")
        ? "video/mp4"
        : "video/webm";

      const recorder = new MediaRecorder(mediaStream, { mimeType });
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: mimeType });
        const ext = mimeType.includes("mp4") ? "mp4" : "webm";
        triggerFileDownload(videoBlob, `ai-short-video-${Date.now()}.${ext}`);
        setDownloading(false);
        setDownloadProgress(0);
      };

      // Player ko start position par le jayein aur record karein
      if (playerRef.current) {
        playerRef.current.seekTo(0);
        playerRef.current.play();
      }

      recorder.start();

      const totalDurationMs = (durationInFrames / 30) * 1000;
      const intervalTimer = setInterval(() => {
        setDownloadProgress((prev) => Math.min(prev + 15, 95));
      }, totalDurationMs / 6);

      setTimeout(() => {
        clearInterval(intervalTimer);
        if (recorder.state === "recording") {
          recorder.stop();
          if (playerRef.current) playerRef.current.pause();
        }
      }, totalDurationMs + 400);

    } catch (err) {
      console.error("Client video capture failed:", err);
      fallbackAssetDownload();
      setDownloading(false);
    }
  };

  const triggerFileDownload = (blob, filename) => {
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  };

  const fallbackAssetDownload = () => {
    const imgUrl = videoRecord?.imageList?.[0];
    if (imgUrl) {
      window.open(imgUrl, "_blank");
    } else if (videoRecord?.audioFileUrl) {
      window.open(videoRecord.audioFileUrl, "_blank");
    }
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };

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
        <div
          id="remotion-player-container"
          className="relative mt-2 sm:mt-3 flex aspect-[9/16] max-h-[55vh] sm:max-h-none sm:h-[460px] w-full justify-center overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
        >
          {videoRecord ? (
            <Player
              ref={playerRef}
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
        <div className="mt-4 sm:mt-5 flex flex-col gap-2.5 w-full">
          {/* 📥 REAL VIDEO DOWNLOAD BUTTON */}
          <button
            type="button"
            onClick={handleDownloadToGallery}
            disabled={downloading || !videoRecord}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-emerald-500/25 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {downloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving Video ({downloadProgress}%)...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Save Video to Gallery</span>
              </>
            )}
          </button>

          <div className="flex w-full gap-2.5">
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
              Dashboard
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerDialog;