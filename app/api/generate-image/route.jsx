import { NextResponse } from "next/server";
import ImageKit from "imagekit";

// --- IMAGEKIT CLIENT SETUP (ACTIVE PRODUCTION) ---
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Har style ke scenes ko sequence me track karne ke liye (Zero Repetition)
let usedIndices = {
  Realistic: 0,
  Cartoon: 0,
  Comic: 0,
  WaterColor: 0,
  GTA: 0,
};

// ==========================================
//   STYLE ENHANCERS MAP (PROMPT AESTHETICS)
// ==========================================
const STYLE_PROMPTS = {
  Realistic:
    "photorealistic, 8k resolution, cinematic volumetric lighting, 35mm photograph, hyperdetailed, sharp focus",
  Cartoon:
    "disney pixar 3d animation style, cute character design, smooth lighting, octane render 3d, vibrant colors",
  Comic:
    "american graphic comic book style, bold black ink outlines, halftone dot textures, vibrant pop-art colors, dynamic action scene",
  WaterColor:
    "handcrafted watercolor painting, soft pastel color wash, artistic ink bleed, textured rough paper, fluid strokes",
  GTA:
    "gta v loading screen official digital illustration, rockstar games artwork, vivid saturated colors, heavy stylized outlines",
};

// ==========================================
//   MASSIVE STYLE-SPECIFIC HD 9:16 VERTICAL FALLBACK POOLS
// ==========================================
// Har style ke mutabiq 8+ completely unique aur varied visuals
const FALLBACK_POOLS = {
  Realistic: [
    // 1. Dark Moody Bedroom / Corridor (Horror & Mystery)
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=720&h=1280&fit=crop&q=85",
    // 2. Cinematic Rain on Glass Window at Night
    "https://images.unsplash.com/photo-1723683323848-e25a105e198d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    // 3. Misty Foggy Forest Path (Suspense & Eerie)
    "https://images.unsplash.com/photo-1448375240586-882707db888b?w=720&h=1280&fit=crop&q=85",
    // 4. Dramatic Vintage Old Hallway / Shadows
    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=720&h=1280&fit=crop&q=85",
    // 5. Deep Space Galaxy & Cosmic Nebula
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=720&h=1280&fit=crop&q=85",
    // 6. Abandoned Ancient Architecture
    "https://images.unsplash.com/photo-1533158307587-828f0a76ef46?w=720&h=1280&fit=crop&q=85",
    // 7. Dramatic Sunset over Mountain Horizon
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=720&h=1280&fit=crop&q=85",
    // 8. Dark Night City Skyline with Fog
    "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=720&h=1280&fit=crop&q=85",
  ],

  Cartoon: [
    // 1. Tim Burton Gothic Whimsical Character Scene
    "https://images.unsplash.com/photo-1614252653172-b54e3fcc1b5f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    // 2. Glowing Magical Fantasy Wonderland Forest
    "https://images.unsplash.com/photo-1609372332255-611485350f25?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    // 3. Cute Stylized 3D Room Interior & Toys
    "https://images.unsplash.com/photo-1676873261959-173b91552b0d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    // 4. Dreamy Pastel Animated Mountains
    "https://images.unsplash.com/photo-1685360798969-395cf93b7d2d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    // 5. Playful Vibrant 3D Abstract Sculpture Lighting
    "https://plus.unsplash.com/premium_photo-1693579944297-c503697f4f73?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    // 6. Whimsical Cartoon Castle Under Moonlight
    "https://images.unsplash.com/photo-1627901573417-4b462f3eaec8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    // 7. Colorful Futuristic Wonderland Cityscape
    "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=720&h=1280&fit=crop&q=85",
    // 8. Cute Fairy Lights Fantasy Nature
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=720&h=1280&fit=crop&q=85",
  ],

  Comic: [
    // 1. Classic Pop Art Explosion Halftone Print
    "https://images.unsplash.com/photo-1778096781302-a5cde1cbe2fd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    // 2. Cyberpunk Graphic Novel Alleyway & Neon
    "https://images.unsplash.com/photo-1579718619873-d82333054124?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    // 3. Bold Contrast Ink Silhouette Scene
    "https://images.unsplash.com/photo-1566041728194-8776567c58d1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    // 4. Vibrant Dynamic Urban Action Comic Grid
    "https://images.unsplash.com/photo-1631681536163-4724a68d77b2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    // 5. Vintage Comic Halftone Color Dots Pattern
    "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    // 6. High-Energy Graphic Hero Night Skyline
    "https://images.unsplash.com/photo-1631852869420-36432d121429?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    // 7. Gritty Downtown Comic Book Sketch Architecture
    "https://images.unsplash.com/photo-1714733171323-1625319ed0f1?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    // 8. Dramatic Action Cloudburst Comic Sky
    "https://images.unsplash.com/photo-1663790628011-09beb481198c?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  ],

  WaterColor: [
    // 1. Moody Rainy Watercolor Forest & Mist
    "https://images.unsplash.com/photo-1688225206417-0bb2c9e9c4f2?q=80&w=791&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    // 2. Hand-Painted Pastel Mountain Fog
    "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=720&h=1280&fit=crop&q=85",
    // 3. Liquid Colored Ink Bleed & Cold-Press Paper
    "https://images.unsplash.com/photo-1704123298677-9415e95d1133?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    // 4. Soft Ocean Waves Watercolor Gradient
    "https://images.unsplash.com/photo-1705582803658-0df043e38c68?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    // 5. Vintage Textured Canvas Oil & Watercolor
    "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=720&h=1280&fit=crop&q=85",
    // 6. Fluid Ethereal Sunset Cloudscape
    "https://images.unsplash.com/photo-1708142181961-ac00fee94e8f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    // 7. Soft Minimalist Floral & Branch Wash
    "https://images.unsplash.com/photo-1620628194503-fae41320456a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    // 8. Starry Night Sky with Watercolor Bleed
    "https://images.unsplash.com/photo-1599797574782-fd636bdb5cd2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",

  ],

  GTA: [
    // 1. Miami Vice Golden Hour Palm Trees & Sunset
    "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=720&h=1280&fit=crop&q=85",
    // 2. High-Speed Car Headlights on Dark Highway
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=720&h=1280&fit=crop&q=85",
    // 3. Sprawling Metropolitan City Twilight Overview
    "https://images.unsplash.com/photo-1780090329252-d2dbf799bfa7?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    // 4. Moody Urban Underpass with Warm Saturated Streetlamps
    "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=720&h=1280&fit=crop&q=85",
    // 5. Sun-Drenched Ocean Boulevard & Palms
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=720&h=1280&fit=crop&q=85",
    // 6. Crime Noir Night Skyline Silhouette
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=720&h=1280&fit=crop&q=85",
    // 7. Coastal Pier with Neon Lights at Dusk
    "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=720&h=1280&fit=crop&q=85",
    // 8. Downtown Concrete Canyon in Midnight Rain
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=720&h=1280&fit=crop&q=85",
  ],
};

export async function POST(req) {
  try {
    const { prompt, style = "Realistic", topic } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    console.log(`\n==============================================`);
    console.log(`SCENE PROMPT: "${prompt}"`);
    console.log(`Style: ${style} | Topic: ${topic || "N/A"}`);
    console.log(`==============================================`);

    const selectedEnhancers = STYLE_PROMPTS[style] || STYLE_PROMPTS["Realistic"];
    const cleanRaw = prompt.replace(/[^a-zA-Z0-9 ]/g, " ").slice(0, 110).trim();
    const fullPrompt = `${cleanRaw}, ${selectedEnhancers}`;
    const encodedPrompt = encodeURIComponent(fullPrompt);

    let imageBuffer = null;
    let chosenSourceUrl = "";

    // =========================================================================
    // TIER 1 & TIER 2: MULTI-MODEL AI GENERATION CHAIN
    // =========================================================================
    const aiModelCandidates = [
      {
        name: "Pollinations Free Default",
        getUrl: (seed) =>
          `https://image.pollinations.ai/prompt/${encodedPrompt}?width=720&height=1280&nologo=true&seed=${seed}`,
      },
      /*{
        name: "SDXL Turbo Model",
        getUrl: (seed) =>
          `https://image.pollinations.ai/prompt/${encodedPrompt}?width=720&height=1280&nologo=true&seed=${seed}&model=turbo`,
      },
      {
        name: "FLUX Model",
        getUrl: (seed) =>
          `https://image.pollinations.ai/prompt/${encodedPrompt}?width=720&height=1280&nologo=true&seed=${seed}&model=flux`,
      },*/
    ];

    for (let i = 0; i < aiModelCandidates.length; i++) {
      const candidate = aiModelCandidates[i];
      const randomSeed = Math.floor(Math.random() * 899999 + 100000);
      const targetUrl = candidate.getUrl(randomSeed);

      try {
        console.log(`[AI Engine ${i + 1}/${aiModelCandidates.length}] Requesting: ${candidate.name}...`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const res = await fetch(targetUrl, {
          signal: controller.signal,
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            Accept: "image/*",
          },
          cache: "no-store",
        });

        clearTimeout(timeoutId);
        const contentType = res.headers.get("content-type") || "";

        if (res.status === 200 && contentType.startsWith("image/")) {
          const arrayBuffer = await res.arrayBuffer();
          imageBuffer = Buffer.from(arrayBuffer);
          console.log(`Success! Real AI image generated by: ${candidate.name}`);
          break;
        } else {
          console.warn(`${candidate.name} returned HTTP ${res.status}. Trying next...`);
          await delay(800);
        }
      } catch (err) {
        console.warn(`${candidate.name} failed (${err.message}). Trying next...`);
        await delay(800);
      }
    }

    // =========================================================================
    // TIER 3: LEXICA AI SEMANTIC SEARCH (Scene Keyword Match)
    // =========================================================================
    if (!imageBuffer) {
      try {
        console.log("[AI Tier 3] Querying Lexica Semantic AI Search for prompt keywords...");
        const lexicaQuery = encodeURIComponent(`${style} ${cleanRaw}`.slice(0, 70));
        const lexicaRes = await fetch(`https://lexica.art/api/v1/search?q=${lexicaQuery}`);

        if (lexicaRes.ok) {
          const lexicaData = await lexicaRes.json();
          if (lexicaData.images && lexicaData.images.length > 0) {
            const topResults = lexicaData.images.slice(0, 3);
            const matchedImageUrl = topResults[Math.floor(Math.random() * topResults.length)].src;
            console.log("Found prompt visual on Lexica AI:", matchedImageUrl);

            const downloadRes = await fetch(matchedImageUrl);
            if (downloadRes.ok) {
              const arrayBuffer = await downloadRes.arrayBuffer();
              imageBuffer = Buffer.from(arrayBuffer);
              console.log("Lexica AI buffer downloaded successfully!");
            }
          }
        }
      } catch (lexErr) {
        console.warn("Lexica AI tier failed:", lexErr.message);
      }
    }

    // =========================================================================
    // TIER 4: STYLE-SPECIFIC DIVERSE FALLBACK POOL (Anti-Repeat)
    // =========================================================================
    if (!imageBuffer) {
      const activeStyle = STYLE_PROMPTS[style] ? style : "Realistic";
      console.warn(`All online AI engines busy. Picking next distinct visual from [${activeStyle}] collection...`);

      const pool = FALLBACK_POOLS[activeStyle] || FALLBACK_POOLS["Realistic"];

      // Sequential Anti-Repeat: Scene 1, 2, 3 sabhi me alag image aayegi
      const currentIndex = usedIndices[activeStyle] % pool.length;
      usedIndices[activeStyle] = (usedIndices[activeStyle] + 1) % pool.length;

      chosenSourceUrl = pool[currentIndex];
      console.log(`Using Curated Scene #${currentIndex + 1} for style [${activeStyle}]:`, chosenSourceUrl);

      try {
        const fallbackRes = await fetch(chosenSourceUrl);
        const fbArrayBuffer = await fallbackRes.arrayBuffer();
        imageBuffer = Buffer.from(fbArrayBuffer);
        console.log("Curated style fallback image downloaded successfully!");
      } catch (fbErr) {
        console.error("Fallback buffer download failed:", fbErr.message);
      }
    }

    if (!imageBuffer) {
      throw new Error("Unable to obtain any image buffer from all 4 tiers.");
    }

    // =========================================================================
    // 100% PRODUCTION IMAGEKIT PERMANENT CDN STORAGE
    // =========================================================================
    console.log("Uploading final buffer to ImageKit CDN...");
    const uploadResponse = await imagekit.upload({
      file: imageBuffer,
      fileName: `scene_${Date.now()}_${Math.floor(Math.random() * 10000)}.jpg`,
      folder: "/ai-short-videos/images",
    });

    console.log("=== SCENE SAVED 100% ON IMAGEKIT ===");
    console.log("CDN URL:", uploadResponse.url);

    return NextResponse.json({
      result: uploadResponse.url,
    });
  } catch (error) {
    console.error("Final Image pipeline error:", error);
    return NextResponse.json(
      { error: "Image generation failed", details: error.message },
      { status: 500 }
    );
  }
}