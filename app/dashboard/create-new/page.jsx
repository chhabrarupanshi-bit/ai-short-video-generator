"use client";

// ==========================================
// 1. EXTERNAL & REACT HOOKS IMPORTS
// ==========================================
import React, { useState, useContext, useEffect, useRef } from "react";
import PlayerDialog from "../_components/PlayerDialog";
import axios from "axios";
import { Sparkles } from "lucide-react";
import { useUser } from "@clerk/nextjs";

// ==========================================
// 2. INTERNAL CUSTOM COMPONENTS & CONTEXT
// ==========================================
import SelectTopic from "./_components/SelectTopic";
import SelectStyle from "./_components/SelectStyle";
import SelectDuration from "./_components/SelectDuration";
import CustomLoading from "../_components/CustomLoading";
import { VideoContext } from "@/app/api/_context/VideoContextData";

// ==========================================
// 3. SECURE SERVER ACTION (Client-side DB leak roknay ke liye)
// ==========================================
import { saveVideoDataServer } from "@/app/_actions/video";

export default function CreateNew() {
  // ==========================================
  // CREDIT SAVER TOGGLE (TESTING VS PRODUCTION)
  // ==========================================
  const TEST_MODE = false;

  // Dummy scenes preview testing ke liye
  const dummyScenes = [
    {
      imagePrompt:
        "A cozy aesthetic study desk with glowing laptop and books, comic illustration, vibrant colors, 8k",
      contentText: "Testing scene one without consuming any external AI credits.",
    },
    {
      imagePrompt:
        "A cute orange cat sleeping peacefully on a soft sofa in warm morning sunlight, comic style, sharp focus",
      contentText: "Testing scene two with direct preview.",
    },
  ];

  // ==========================================
  // LOCAL COMPONENT STATES
  // ==========================================
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [videoScript, setVideoScript] = useState(null);
  const [audioFileUrl, setAudioFileUrl] = useState(null);
  const [captions, setCaptions] = useState(null);
  const [imageList, setImageList] = useState([]);

  // Production initial states (Video save hone ke baad dialog khulega)
  const [videoId, setVideoId] = useState(null);
  const [playVideo, setPlayVideo] = useState(false);

  // Database me duplicate save execution rokne ke liye flag
  const isSavingRef = useRef(false);

  // Clerk authentication hook
  const { user } = useUser();

  // Global Context state
  const { videoData, setVideoData } = useContext(VideoContext);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // ==========================================
  // INPUT HANDLER
  // ==========================================
  const onHandleInputChange = (field, value) => {
    console.log(`Field updated: [${field}] -> Value:`, value);
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // ==========================================
  // STEP 1: GEMINI AI SCRIPT GENERATION
  // ==========================================
  const GetVideoScript = async () => {
    setLoading(true);
    isSavingRef.current = false;

    const prompt = `Write a script to generate ${formData.duration || "30 seconds"} video on topic: "${formData.topic}" along with AI image prompt in ${formData.style} format for each scene. Return strictly a JSON array of objects with keys: "imagePrompt" and "contentText".`;

    try {
      const resp = await axios.post("/api/get-video-script", { prompt });
      console.log("=== 1. LIVE GEMINI AI GENERATED SCRIPT ===");
      console.log(resp.data.result);

      const generatedScript = resp.data.result;
      setVideoScript(generatedScript);

      if (generatedScript && Array.isArray(generatedScript)) {
        setVideoData((prev) => ({ ...prev, videoScript: generatedScript }));
        await GenerateAudioFile(generatedScript);
      } else {
        alert("Script format invalid mila.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Error generating script:", err);
      alert("Script generate nahi ho payi, console check karein.");
      setLoading(false);
    }
  };

  // ==========================================
  // STEP 2: GOOGLE TTS + IMAGEKIT AUDIO
  // ==========================================
  const GenerateAudioFile = async (videoScriptData) => {
    let scriptText = "";

    if (Array.isArray(videoScriptData)) {
      videoScriptData.forEach((item) => {
        scriptText += (item.contentText || item.ContentText || "") + " ";
      });
    }

    try {
      const uniqueAudioId = Date.now().toString();
      const resp = await axios.post("/api/generate-audio", {
        text: scriptText,
        id: uniqueAudioId,
      });

      const audioUrl = resp.data.Result || resp.data.audioUrl;
      console.log("=== 2. AUDIO STORED ON IMAGEKIT ===", audioUrl);

      setVideoData((prev) => ({ ...prev, audioUrl: audioUrl }));
      setAudioFileUrl(audioUrl);
      setFormData((prev) => ({
        ...prev,
        audioUrl: audioUrl,
        videoScript: videoScriptData,
      }));

      if (audioUrl) {
        await GenerateAudioCaption(audioUrl, videoScriptData);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Audio generation failed:", error);
      setLoading(false);
    }
  };

  // ==========================================
  // STEP 3: ASSEMBLYAI CAPTIONS GENERATION
  // ==========================================
  const GenerateAudioCaption = async (fileUrl, videoScriptData) => {
    try {
      const resp = await axios.post("/api/generate-caption", { audioUrl: fileUrl });
      console.log("=== 3. CAPTIONS GENERATED ===", resp.data.result);

      const generatedCaptions = resp.data.result;
      setCaptions(generatedCaptions);

      setVideoData((prev) => ({ ...prev, captions: generatedCaptions }));
      setFormData((prev) => ({
        ...prev,
        captions: generatedCaptions,
      }));

      if (generatedCaptions) {
        await GenerateImage(videoScriptData);
      }
    } catch (err) {
      console.error("Caption generation error:", err);
      setLoading(false);
    }
  };

  // ==========================================
  // STEP 4: AI SCENE VISUALS CREATION
  // ==========================================
  const GenerateImage = async (videoScriptData) => {
    let images = [];
    const scriptList = videoScriptData || videoScript;

    console.log("Generating images for scenes count:", scriptList?.length);

    try {
      for (let i = 0; i < scriptList.length; i++) {
        const element = scriptList[i];
        console.log(`Creating image ${i + 1}/${scriptList.length} for:`, element?.imagePrompt);

        const resp = await axios.post("/api/generate-image", {
          prompt: element?.imagePrompt,
          style: formData.style,
          topic: formData.topic,
          isTesting: TEST_MODE,
        });

        console.log("Image URL:", resp.data.result);
        images.push(resp.data.result);

        if (i < scriptList.length - 1) {
          await delay(2500);
        }
      }

      console.log("=== ALL IMAGES READY ===", images);
      setImageList(images);

      setVideoData((prev) => ({ ...prev, imageList: images }));
      setFormData((prev) => ({
        ...prev,
        imageList: images,
      }));
    } catch (error) {
      console.error("Error generating images:", error);
      alert("Image pipeline mein error aaya, terminal check karein.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // TRIGGER VALIDATION
  // ==========================================
  const onCreateClickHandler = () => {
    if (TEST_MODE) {
      console.log("--- TEST MODE ACTIVE: Skipping Gemini, TTS & AssemblyAI ---");
      GenerateImage(dummyScenes);
      return;
    }

    if (!formData.topic) {
      alert("Pehle video ka topic select ya type karein!");
      return;
    }
    if (!formData.style) {
      alert("Pehle visual art style pasand karein!");
      return;
    }

    GetVideoScript();
  };

  // ==========================================
  // STEP 5: AUTOMATIC DATABASE SAVE ON COMPLETION
  // ==========================================
  useEffect(() => {
    console.log("Global Video Data Updated:", videoData);

    const isComplete =
      videoData?.videoScript &&
      videoData?.audioUrl &&
      videoData?.captions &&
      videoData?.imageList;

    if (isComplete && !isSavingRef.current) {
      isSavingRef.current = true;
      console.log("All 4 assets ready! Saving to Neon Database...");
      SaveVideoData(videoData);
    }
  }, [videoData]);

  const SaveVideoData = async (currentVideoData) => {
    setLoading(true);

    try {
      const resp = await saveVideoDataServer({
        script: currentVideoData?.videoScript || null,
        audioFileUrl: currentVideoData?.audioUrl || null,
        captions: currentVideoData?.captions || null,
        imageList: currentVideoData?.imageList || null,
        createdBy: user?.primaryEmailAddress?.emailAddress || "anonymous",
      });

      if (resp.success) {
        console.log("Saved Video ID in Neon DB:", resp.id);
        setVideoId(resp.id);
        setPlayVideo(true);
      } else {
        console.error("Failed to save video to DB:", resp.error);
        alert("Database save error: " + resp.error);
      }
    } catch (err) {
      console.error("SaveVideoData Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#060813] text-white">
      <div className="mx-auto w-full max-w-4xl px-2 sm:px-4">
        {/* RESPONSIVE HEADER */}
        <div className="mb-6 sm:mb-8">
          <h2 className="bg-gradient-to-r from-white via-white to-[#a5b0f0] bg-clip-text text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-transparent">
            Create New
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#8a94b8] leading-relaxed">
            {TEST_MODE
              ? "🟢 TEST MODE ON (Zero external credits + No ImageKit storage used)"
              : "Topic, style aur duration chuno, baaki kaam AI sambhal lega."}
          </p>
        </div>

        {/* FORM CONTAINER WITH RESPONSIVE SPACING */}
        <div className="flex flex-col gap-5 sm:gap-6">
          <SelectTopic onUserSelect={onHandleInputChange} />
          <SelectStyle onUserSelect={onHandleInputChange} />
          <SelectDuration onUserSelect={onHandleInputChange} />

          {/* TOUCH-FRIENDLY ACTION BUTTON */}
          <button
            onClick={onCreateClickHandler}
            disabled={loading}
            className="group relative mt-2 sm:mt-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7f5af0] px-5 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-indigo-600/30 outline-none transition-all duration-300 hover:shadow-indigo-600/50 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="relative h-4 w-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            <span className="relative">
              {TEST_MODE ? "Test Image Pipeline (Zero Credit)" : "Create Video"}
            </span>
          </button>

          <CustomLoading loading={loading} />
          <PlayerDialog playVideo={playVideo} videoId={videoId} />
        </div>
      </div>
    </div>
  );
}