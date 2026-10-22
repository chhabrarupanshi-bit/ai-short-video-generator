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

const PlayerDialog = ({ playVideo, videoId }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [videoRecord, setVideoRecord] = useState(null);
  const [durationInFrames, setDurationInFrames] = useState(120);
  const [downloading, setDownloading] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);

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

  // 🎬 Client-side Full Video Compositor (Images + Audio + Captions)
  const handleDownloadFullVideo = async () => {
    if (!videoRecord) return;

    setDownloading(true);
    setRenderProgress(5);

    try {
      const images = videoRecord?.imageList || [];
      const captions = videoRecord?.captions || [];
      const audioUrl = videoRecord?.audioFileUrl;

      const canvas = document.createElement("canvas");
      canvas.width = 720;
      canvas.height = 1280;
      const ctx = canvas.getContext("2d");

      // 1. Preload all scene images
      setRenderProgress(15);
      const loadedImages = await Promise.all(
        images.map((src) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = src;
          });
        })
      );

      const validImages = loadedImages.filter(Boolean);
      if (validImages.length === 0) {
        throw new Error("No visual scenes loaded");
      }

      // 2. Setup Audio Track
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioDestination = audioContext.createMediaStreamDestination();
      let audioNode = null;

      if (audioUrl) {
        const audio = new Audio();
        audio.crossOrigin = "anonymous";
        audio.src = audioUrl;
        audioNode = audio;
        const source = audioContext.createMediaElementSource(audio);
        source.connect(audioDestination);
        source.connect(audioContext.destination);
      }

      // 3. Setup Video Stream & MediaRecorder
      const canvasStream = canvas.captureStream(30);
      const outputTracks = [...canvasStream.getVideoTracks()];

      const audioTrack = audioDestination.stream.getAudioTracks()[0];
      if (audioTrack) {
        outputTracks.push(audioTrack);
      }

      const combinedStream = new MediaStream(outputTracks);
      const mimeType = MediaRecorder.isTypeSupported("video/mp4")
        ? "video/mp4"
        : "video/webm";

      const recorder = new MediaRecorder(combinedStream, { mimeType });
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const ext = mimeType.includes("mp4") ? "mp4" : "webm";
        const downloadUrl = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `ai-short-video-${Date.now()}.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);

        setDownloading(false);
        setRenderProgress(0);
      };

      recorder.start();
      if (audioNode) audioNode.play();

      const totalDurationSec = durationInFrames / 30;
      const startTime = performance.now();

      // 4. Render Frame-by-Frame Loop
      const renderLoop = () => {
        const elapsedSec = (performance.now() - startTime) / 1000;
        const elapsedMs = elapsedSec * 1000;

        if (elapsedSec >= totalDurationSec) {
          recorder.stop();
          if (audioNode) audioNode.pause();
          return;
        }

        // Calculate active image
        const imgIndex = Math.min(
          Math.floor((elapsedSec / totalDurationSec) * validImages.length),
          validImages.length - 1
        );
        const activeImg = validImages[imgIndex];

        // Draw background scene
        if (activeImg) {
          ctx.drawImage(activeImg, 0, 0, 720, 1280);
        }

        // Draw active caption text
        const currentCaption = captions.find(
          (c) => elapsedMs >= c.start && elapsedMs <= c.end
        );

        if (currentCaption && currentCaption.text) {
          ctx.save();
          ctx.font = "bold 52px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // Caption background tag
          const text = currentCaption.text;
          const textMetrics = ctx.measureText(text);
          const padding = 24;

          ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
          ctx.roundRect?.(
            360 - textMetrics.width / 2 - padding,
            1050 - 35,
            textMetrics.width + padding * 2,
            70,
            16
          ) || ctx.fillRect(
            360 - textMetrics.width / 2 - padding,
            1050 - 35,
            textMetrics.width + padding * 2,
            70
          );
          ctx.fill();

          // Caption text
          ctx.fillStyle = "#ffffff";
          ctx.fillText(text, 360, 1050);
          ctx.restore();
        }

        setRenderProgress(Math.min(Math.round((elapsedSec / totalDurationSec) * 100), 99));
        requestAnimationFrame(renderLoop);
      };

      requestAnimationFrame(renderLoop);

    } catch (err) {
      console.error("Video export pipeline error:", err);
      alert("Video export karne me dikkat aayi, please try again.");
      setDownloading(false);
      setRenderProgress(0);
    }
  };

  const handleCancel = () => setOpenDialog(false);
  const handleExport = () => {
    setOpenDialog(false);
    router.push("/dashboard");
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="w-[92vw] max-w-[420px] rounded-3xl border border-white/10 bg-[#0b0f19] p-4 sm:p-6 text-white shadow-2xl backdrop-blur-xl">
        <DialogHeader className="w-full text-center">
          <DialogTitle className="bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-lg sm:text-xl font-bold text-transparent">
            Your Video is Ready
          </DialogTitle>
          <DialogDescription className="text-xs text-[#8a94b8]">
            Preview your generated AI vertical short video
          </DialogDescription>
        </DialogHeader>

        {/* 9:16 PLAYER */}
        <div className="relative mt-2 sm:mt-3 flex aspect-[9/16] max-h-[55vh] sm:max-h-none sm:h-[460px] w-full justify-center overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
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

        {/* ACTIONS */}
        <div className="mt-4 sm:mt-5 flex flex-col gap-2.5 w-full">
          <button
            type="button"
            onClick={handleDownloadFullVideo}
            disabled={downloading || !videoRecord}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-emerald-500/25 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {downloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating Video File ({renderProgress}%)...</span>
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