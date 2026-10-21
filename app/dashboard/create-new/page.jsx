"use client";

// ==========================================
// 1. EXTERNAL & REACT HOOKS IMPORTS
// ==========================================
import React, { useState, useContext, useEffect, useRef } from "react";
import PlayerDialog from "../_components/PlayerDialog";
import axios from "axios";
import { Sparkles, AlertTriangle, ArrowRight, X } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// ==========================================
// 2. INTERNAL CUSTOM COMPONENTS & CONTEXT
// ==========================================
import SelectTopic from "./_components/SelectTopic";
import SelectStyle from "./_components/SelectStyle";
import SelectDuration from "./_components/SelectDuration";
import CustomLoading from "../_components/CustomLoading";
import { VideoContext } from "@/app/api/_context/VideoContextData";

// ==========================================
// 3. SECURE SERVER ACTION
// ==========================================
import { saveVideoDataServer } from "@/app/_actions/video";

export default function CreateNew() {
  const TEST_MODE = false;
  const CREDITS_PER_VIDEO = 35; // 👈 100 me se 35 deduct hone par 2-3 video limit banegi

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

  // Production initial states
  const [videoId, setVideoId] = useState(null);
  const [playVideo, setPlayVideo] = useState(false);

  // Credit Limit Modal State
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [userAvailableCredits, setUserAvailableCredits] = useState(null);

  const isSavingRef = useRef(false);
  const router = useRouter();
  const { user } = useUser();
  const { videoData, setVideoData } = useContext(VideoContext);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // ==========================================
  // INPUT HANDLER
  // ==========================================
  const onHandleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // ==========================================
  // CREDIT DEDUCTION & VALIDATION HELPERS
  // ==========================================
  const verifyUserCredits = async () => {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) return false;

    try {
      const res = await fetch(`/api/get-user?email=${email}`);
      if (res.ok) {
        const data = await res.json();
        const available = Number(data?.user?.credits ?? 0);
        setUserAvailableCredits(available);

        if (available < CREDITS_PER_VIDEO) {
          setShowLimitModal(true);
          return false;
        }
        return true;
      }
      return true;
    } catch (err) {
      console.error("Credit validation error:", err);
      return true; // network fallback
    }
  };

  const deductUserCredits = async () => {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email || TEST_MODE) return;

    try {
      const res = await axios.post("/api/update-credits", {
        userEmail: email,
        deduct: true,
        creditsToDeduct: CREDITS_PER_VIDEO,
      });

      console.log("=== CREDITS DEDUCTION RESPONSE ===", res.data);
    } catch (err) {
      console.error("Failed to deduct credits in database:", err);
    }
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
      console.log("=== 1. LIVE GEMINI AI GENERATED SCRIPT ===", resp.data.result);

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
  // TRIGGER VALIDATION (CREDIT GUARD)
  // ==========================================
  const onCreateClickHandler = async () => {
    if (TEST_MODE) {
      console.log("--- TEST MODE ACTIVE ---");
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

    // 🔒 Loophole Guard: Verify credits before running external APIs
    const hasEnoughCredits = await verifyUserCredits();
    if (!hasEnoughCredits) {
      return; // Stop generation pipeline immediately
    }

    GetVideoScript();
  };

  // ==========================================
  // STEP 5: SAVE VIDEO & DEDUCT CREDITS
  // ==========================================
  useEffect(() => {
    const isComplete =
      videoData?.videoScript &&
      videoData?.audioUrl &&
      videoData?.captions &&
      videoData?.imageList;

    if (isComplete && !isSavingRef.current) {
      isSavingRef.current = true;
      console.log("All assets ready! Saving to Neon Database...");
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

        // 💳 Loophole Fix: Deduct 35 credits in database atomically
        await deductUserCredits();
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
              : "Topic, style aur duration chuno, baaki kaam AI sambhal lega. (Each video: 35 credits)"}
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

      {/* ========================================================= */}
      {/* PROFESSIONAL CREDIT LIMIT MODAL POPUP */}
      {/* ========================================================= */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm rounded-2xl border border-indigo-500/30 bg-[#0c1022] p-6 text-center shadow-2xl">
            <button
              onClick={() => setShowLimitModal(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-base font-bold text-white">
              Credit Limit Reached
            </h3>

            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Video generate karne ke liye kam se kam <strong className="text-indigo-300">35 credits</strong> chahiye.
              Aapke paas abhi <strong className="text-amber-400">{userAvailableCredits ?? 0} credits</strong> bache hain.
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                onClick={() => router.push("/dashboard/upgrade")}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:brightness-110 active:scale-95 transition-all"
              >
                <span>Upgrade to Pro Creator</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setShowLimitModal(false)}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-semibold text-slate-400 hover:bg-white/10 hover:text-white transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}