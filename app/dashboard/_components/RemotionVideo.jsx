"use client";

import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export default function RemotionVideo({
  script,
  imageList,
  audioFileUrl,
  captions,
  setDurationInFrames,
}) {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  // 1. Dynamic frame calculation per image
  const getDurationPerImage = () => {
    if (!imageList || imageList.length === 0) return 60;
    const totalAudioDurationMs =
      captions && captions.length > 0
        ? captions[captions.length - 1]?.end
        : 5000;
    const totalFrames = Math.ceil((totalAudioDurationMs / 1000) * fps);
    return Math.max(30, Math.ceil(totalFrames / imageList.length));
  };

  // 2. Exact word caption matcher
  const getCurrentCaption = () => {
    const currentTimeMs = (frame / fps) * 1000;
    const activeWord = captions?.find(
      (item) => currentTimeMs >= item.start && currentTimeMs <= item.end
    );
    return activeWord ? activeWord.text : "";
  };

  const currentCaptionText = getCurrentCaption();
  const durationPerImage = getDurationPerImage();

  return (
    <AbsoluteFill className="bg-black text-white overflow-hidden select-none">
      {/* 1. Voiceover Audio */}
      {audioFileUrl && <Audio src={audioFileUrl} />}

      {/* 2. Scene Visuals with Scene-Specific Zoom */}
      {imageList &&
        imageList.map((imgUrl, index) => {
          const startTime = index * durationPerImage;

          return (
            <Sequence
              key={index}
              from={startTime}
              durationInFrames={durationPerImage}
            >
              <SceneImage imgUrl={imgUrl} durationInFrames={durationPerImage} />
            </Sequence>
          );
        })}

      {/* 3. Viral Shorts/Reels Glowing Captions Overlay */}
      {currentCaptionText && (
        <div className="absolute bottom-[110px] left-0 right-0 px-6 text-center z-50 flex justify-center">
          <span className="inline-block bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-3xl font-black uppercase tracking-wider text-yellow-300 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] border border-yellow-400/30">
            {currentCaptionText}
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
}

// Scene image with smooth Ken Burns zoom using native <img>
function SceneImage({ imgUrl, durationInFrames }) {
  const localFrame = useCurrentFrame();

  const scale = interpolate(localFrame, [0, durationInFrames], [1, 1.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div className="w-full h-full overflow-hidden flex items-center justify-center">
      <img
        src={imgUrl}
        alt="Scene visual"
        crossOrigin="anonymous"
        loading="eager"
        style={{
          transform: `scale(${scale})`,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}