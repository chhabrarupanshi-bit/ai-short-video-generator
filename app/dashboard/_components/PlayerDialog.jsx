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
 * Features full video capture (images + captions + audio) directly into a video file.
 */
const PlayerDialog = ({ playVideo, videoId }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [videoRecord, setVideoRecord] = useState(null);
  const [durationInFrames, setDurationInFrames] = useState(120);
  const [downloading, setDownloading] = useState(false);
  const [progressText, setProgressText] = useState("");

  const playerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setOpenDialog(Boolean(playVideo));
    if (videoId) {
      GetVideoData();
    }
  }, [playVideo, videoId]);

  const GetVideoData = async () => {
    try {
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
      }
    } catch (err) {
      console.error("Error fetching video data:", err);
    }
  };

  // 🎥 FULL VIDEO RECORDER (Visuals + Changing Images + Captions + Audio)
  const handleDownloadFullVideo = async () => {
    if (!videoRecord) return;

    setDownloading(true);
    setProgressText("Starting video recorder...");

    try {
      const playerWrapper = document.getElementById("remotion-player-container");
      if (!playerWrapper) throw new Error("Player container not found");

      // Player ko shuruat se start karein
      if (playerRef.current) {
        playerRef.current.seekTo(0);
        playerRef.current.play();
      }

      // 1. Audio stream ready karein
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const dest = audioCtx.createMediaStreamDestination();

      if (videoRecord?.audioFileUrl) {
        const audio = new Audio();
        audio.crossOrigin = "anonymous";
        audio.src = videoRecord.audioFileUrl;
        const source = audioCtx.createMediaElementSource(audio);
        source.connect(dest);
        source.connect(audioCtx.destination);
        audio.play();
      }

      // 2. Video element / canvas stream capture
      const videoOrCanvas =
        playerWrapper.querySelector("canvas") ||
        playerWrapper.querySelector("video");

      let visualStream = null;
      if (videoOrCanvas && typeof videoOrCanvas.captureStream === "function") {
        visualStream = videoOrCanvas.captureStream(30);
      }

      // 3. Combined Tracks
      const combinedTracks = [];
      if (visualStream) {
        visualStream.getVideoTracks().forEach((t) => combinedTracks.push(t));
      }
      dest.stream.getAudioTracks().forEach((t) => combinedTracks.push(t));

      // Agar direct element capture na ho paye toh fallback standard video stream
      if (combinedTracks.length === 0) {
        alert("Video stream direct record nahi ho payi. Direct audio/image link open kar rahe hain.");
        if (videoRecord?.videoUrl) window.open(videoRecord.videoUrl, "_blank");
        setDownloading(false);
        return;
      }

      const finalStream = new MediaStream(combinedTracks);
      const mimeType = MediaRecorder.isTypeSupported("video/mp4")
        ? "video/mp4"
        : "video/webm";

      const recorder = new MediaRecorder(finalStream, { mimeType });
      const recordedChunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.push(e.data);
      };

      recorder.onstop = () => {
        const videoBlob = new Blob(recordedChunks, { type: mimeType });
        const ext = mimeType.includes("mp4") ? "mp4" : "webm";
        const downloadUrl = window.URL.createObjectURL(videoBlob);

        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `ai-short-video-${Date.now()}.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);

        setDownloading(false);
        setProgressText("");
      };

      recorder.start();
      setProgressText("Recording video in progress...");

      const totalDurationMs = (durationInFrames / 30) * 1000;

      setTimeout(() => {
        if (recorder.state === "recording") {
          recorder.stop();
          if (playerRef.current) playerRef.current.pause();
        }
      }, totalDurationMs + 500);

    } catch (err) {
      console.error("Recording error:", err);
      alert("Browser ne direct video capture block kar diya. Media link direct open kar rahe hain.");
      setDownloading(false);
      setProgressText("");
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
          {/* 📥 REAL FULL VIDEO DOWNLOAD BUTTON */}
          <button
            type="button"
            onClick={handleDownloadFullVideo}
            disabled={downloading || !videoRecord}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-emerald-500/25 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {downloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{progressText || "Processing Video..."}</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Save Full Video to Gallery</span>
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