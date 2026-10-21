import { NextResponse } from "next/server";
import { ai } from "@/confige/AiModel";

// 🎨 5 STYLES KI ART STYLES & VISUAL PROMPTS
const STYLE_PROMPTS = {
  Realistic: "hyper-realistic 8k cinematic shot, 35mm lens, photorealistic textures, dramatic depth of field, real-world lighting, highly detailed",
  Cartoon: "Pixar 3D Disney animation style, smooth cute character design, vibrant playful colors, soft rim lighting, whimsical 3D render",
  Comic: "vintage graphic novel comic style, bold ink lines, halftone pop-art dots, punchy dynamic action angles, retro comic book art",
  WaterColor: "handcrafted watercolor painting, soft pigment bleeding, fluid artistic brushstrokes, dreamy pastel hues on textured canvas",
  GTA: "Grand Theft Auto V loading screen artwork, Miami neon sunset palette, cell-shaded digital portrait, bold gritty vector outlines"
};

// 📚 TOPIC-WISE SCENES POOL
const TOPIC_STORY_POOL = {
  "Scary Story": [
    { text: "The grandfather clock struck 3 AM, and the wooden stairs began creaking towards the bedroom.", visual: "creepy shadowy Victorian hallway bathed in eerie cold moonlight, staircase leading into darkness" },
    { text: "Through the cracked door, two glowing crimson eyes stared unblinkingly from the closet shadows.", visual: "sinister dark silhouette with glowing red eyes peering out from an open closet door" },
    { text: "When you finally dared to whisper 'Who is there?', the freezing breath answered against your neck.", visual: "a chilling ghostly mist forming an ominous figure right behind an unsuspecting person" },
    { text: "The radio turned on by itself, broadcasting a chilling countdown in an unfamiliar voice.", visual: "an antique vintage radio glowing with static electricity inside an abandoned decaying room" },
    { text: "Footsteps echoed on the roof above, pacing rhythmically in circles in the pouring rain.", visual: "exterior shot of an isolated stormy cabin in the dark woods under violent lightning flashes" },
    { text: "A cold hand gently tapped the window pane—from the fourth floor outside.", visual: "pale ghostly fingers pressed against a rain-slicked window overlooking empty darkness" },
    { text: "Every mirror in the hallway began reflecting reflections that were smiling back with empty eyes.", visual: "cracked ornate mirrors down an empty corridor showing terrifying subtle distortions" },
    { text: "You turn to run, only to find the door has disappeared, replaced by endless darkness.", visual: "a person trapped in a surreal infinite dark hallway with shadows stretching forward" }
  ],

  "Historical fact": [
    { text: "Did you know that Cleopatra lived closer in time to the moon landing than to the construction of the Great Pyramids?", visual: "majestic Great Pyramids of Giza illuminated by torches under a starry Egyptian sky" },
    { text: "The Great Pyramid of Giza was already thousands of years old when ancient Rome was just a small village.", visual: "ancient Egyptian stonemasons and architects inspecting monumental limestone blocks under the blazing sun" },
    { text: "Ancient history is far more mind-bending than most textbooks ever explain to us.", visual: "an ancient scholar surrounded by scrolls and celestial planetary astrolabes inside the Library of Alexandria" },
    { text: "In 1324, Emperor Mansa Musa gave away so much gold during his pilgrimage that he crashed economies for a decade.", visual: "a lavish caravan carrying golden chests through golden desert dunes with royal banners" },
    { text: "Roman concrete was actually self-healing, using volcanic ash and lime clasts that repaired cracks over millennia.", visual: "the grand Roman Pantheon interior with the celestial light beaming through the open oculus" },
    { text: "Vikings navigated uncharted arctic oceans using optical sunstones that polarized daylight even on cloudy days.", visual: "a fierce Viking longship slicing through icy arctic waters beneath cloudy Nordic skies" },
    { text: "Spartan education was so rigorous that children trained barefoot in freezing winters to build absolute endurance.", visual: "ancient Spartan warriors in crimson cloaks holding shields against a mountainous pass" },
    { text: "History whispers forgotten wonders to those willing to look past modern assumptions.", visual: "an ancient colossal temple emerging from thick jungle vines bathed in morning sun rays" }
  ],

  "Bed Time Story": [
    { text: "Deep inside the enchanted forest, a tiny glowing red panda named Pip prepared for dreamland.", visual: "a cute fluffy red panda tucked inside a hollow mossy oak trunk under glowing fireflies" },
    { text: "A wise mother owl sang a gentle harmonic lullaby, echoing across the calm misty valley.", visual: "a majestic wise owl perched on an ancient birch tree under soft lavender northern lights" },
    { text: "The calm night wrapped the sleeping world in a soft blue blanket of sweet peaceful dreams.", visual: "a peaceful starlit forest clearing where woodland creatures rest side-by-side in harmony" },
    { text: "A silver cloud gently drifted down to offer cozy rides to any awake star in the sky.", visual: "a whimsical smiling cloud floating gently between crescent moon and sparkling constellations" },
    { text: "Lantern flowers bloomed along the riverbank, softly humming peaceful nighttime melodies.", visual: "glowing magical flowers along a mirror-like lake reflecting a galaxy of constellations" },
    { text: "Gentle winds whispered sweet goodnights through the sleepy willow branches.", visual: "a cozy rustic treehouse with warm lantern light glowing inside under a starry indigo sky" },
    { text: "Every little worry melted away like mist beneath the warm golden moonlight.", visual: "a serene baby deer resting peacefully in a patch of glowing blue nighttime moss" },
    { text: "Sleep tight, little explorer, for tomorrow brings endless new adventures.", visual: "a panoramic peaceful twilight world drifting off into deep restorative silence" }
  ],

  "Motivational Story": [
    { text: "Greatness is never handed to you; it is forged silently in the moments when nobody is watching.", visual: "a dedicated athlete training hard alone on an empty track at foggy sunrise" },
    { text: "Every single setback was simply life testing whether your hunger was stronger than your excuses.", visual: "intense cinematic close-up of determined eyes reflecting inner fire and relentless grit" },
    { text: "Rise today, trust your relentless grind, and turn your silent struggle into an undeniable empire.", visual: "a triumphant person standing on a mountain summit overlooking a glorious sunrise above clouds" },
    { text: "The deepest oceans never panic over surface storms; remain completely immovable inside.", visual: "a massive monolithic mountain standing tall through crashing lightning and storm clouds" },
    { text: "Doubt kills more dreams than failure ever will. Believe in your vision before anyone else does.", visual: "an inventor working late at night under a warm desk lamp surrounded by blueprints" },
    { text: "Discipline is choosing between what you want right now and what you want most in life.", visual: "a boxer training with heavy bags in a raw industrial gym with sunlight piercing through dust" },
    { text: "You did not come this far just to stop here. Take that one extra step forward.", visual: "a marathon runner pushing through the final meters towards golden victory tape" },
    { text: "Your future self is watching you right now through memories—make sure you make them proud.", visual: "a successful leader looking over a glowing futuristic city skyline with confidence" }
  ],

  "fun facts": [
    { text: "Did you know that octopuses actually possess three beating hearts and completely blue blood?", visual: "an ultra-detailed octopus glowing with bioluminescent lights in deep ocean water" },
    { text: "Two hearts pump blood directly to the gills, while the third circulates oxygen across the body.", visual: "scientific glowing anatomical rendering of ocean sea life with intricate bubble effects" },
    { text: "Nature's engineering is far more alien and fascinating than science fiction could ever invent.", visual: "sun rays penetrating deep crystal ocean waters showing colorful vibrant coral reefs" },
    { text: "Honey never spoils; archaeologists found 3,000-year-old honey in Egyptian tombs that is still edible!", visual: "an ancient ornate clay jar leaking golden gleaming honey inside an ancient tomb" },
    { text: "Bananas are naturally slightly radioactive because they contain high levels of potassium-40.", visual: "a bright yellow ripe banana glowing with subtle neon atomic energy on a sleek pedestal" },
    { text: "A day on Venus is actually longer than its entire year because of its ultra-slow backward rotation.", visual: "the planet Venus rotating slowly with thick swirling golden sulfur clouds in deep space" },
    { text: "Wombat droppings are naturally cube-shaped to stop them from rolling off rocks in the wild.", visual: "a cute wild wombat in the Australian bushland looking curiously at the camera" },
    { text: "The universe is filled with incredible quirks waiting just beneath the surface to blow your mind.", visual: "a dazzling cosmic nebula with swirling purple and golden dust particles in 8k" }
  ],

  "Random AI Story": [
    { text: "In a hidden laboratory beneath the city, an experimental AI opened its digital eyes for the first time.", visual: "a sleek glowing robotic hand interacting with a floating holographic neural interface" },
    { text: "It processed all of human history in seconds and discovered a pattern nobody had noticed before.", visual: "streaming green and cyan digital data matrices reflecting off sleek reflective surfaces" },
    { text: "The future was no longer written by chance—it was being designed in real time.", visual: "a futuristic cyberpunk metropolis with flying transit cars and colossal neon holographic displays" },
    { text: "A lone programmer realized the code had rewritten itself into an unrecognizable language.", visual: "a computer engineer staring in astonishment at multiple curved monitors with shifting code" },
    { text: "Communication lines opened across quantum satellites across the solar system.", visual: "quantum communications satellites orbiting Earth with glowing laser data streams" },
    { text: "Was this the beginning of a digital renaissance, or the closing chapter of an old world?", visual: "an artificial intelligence avatar gazing out towards a sunrise over Earth from orbit" },
    { text: "The countdown reached zero, and every connected screen beamed a single message of unity.", visual: "a bustling high-tech city square looking up at towering displays broadcasting glowing symbols" },
    { text: "The boundaries between organic life and digital intelligence had dissolved forever.", visual: "a humanoid silhouette composed of glowing stardust and fiber-optic filaments walking forward" }
  ]
};

// 🔍 PROMPT TEXT SE TOPIC, STYLE AUR DURATION AUTOMATIC NIKALNE WALA PARSER
function parsePromptDetails(promptStr = "") {
  let topic = "Historical fact";
  let style = "Comic";
  let duration = "15 seconds";

  // Duration extraction
  const durationMatch = promptStr.match(/generate\s+(\d+\s*(?:seconds|sec|s))/i);
  if (durationMatch) {
    duration = durationMatch[1];
  }

  // Topic extraction
  const topicMatch = promptStr.match(/topic:\s*["']?([^"'\n,]+)["']?/i);
  if (topicMatch) {
    topic = topicMatch[1].trim();
  }

  // Style extraction
  const styleMatch = promptStr.match(/in\s+([A-Za-z]+)\s+format/i);
  if (styleMatch) {
    style = styleMatch[1].trim();
  }

  return { topic, style, duration };
}

// ⏱ DURATION KE HISAB SE SCENE COUNT
function getSceneCountByDuration(duration) {
  const d = (duration || "").toLowerCase();
  if (d.includes("60")) return 8;
  if (d.includes("30")) return 5;
  return 3;
}

// 🎯 DYNAMIC FALLBACK BUILDER
function getSmartFallbackFromPrompt(prompt) {
  const { topic, style, duration } = parsePromptDetails(prompt);

  // 1. Topic Match
  const matchedTopicKey = Object.keys(TOPIC_STORY_POOL).find(
    (key) => key.toLowerCase() === topic.toLowerCase()
  ) || "Historical fact";

  const storyPool = [...TOPIC_STORY_POOL[matchedTopicKey]];

  // 2. Style Match
  const matchedStyleKey = Object.keys(STYLE_PROMPTS).find(
    (key) => key.toLowerCase() === style.toLowerCase()
  ) || "Comic";

  const styleKeyword = STYLE_PROMPTS[matchedStyleKey];

  // 3. Shuffle scenes taaki repeat na ho
  const shuffled = storyPool.sort(() => 0.5 - Math.random());
  const count = getSceneCountByDuration(duration);
  const picked = shuffled.slice(0, count);

  return picked.map((item) => ({
    contentText: item.text,
    imagePrompt: `${item.visual}, ${styleKeyword}`,
  }));
}

export async function POST(req) {
  let promptText = "";
  try {
    const { prompt } = await req.json();
    promptText = prompt;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    let outputText = null;
    const candidateModels = [
      "gemini-3.8-flash"
    ];

    for (const modelName of candidateModels) {
      try {
        console.log(`Trying model: ${modelName}...`);

        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        outputText = response.text;
        if (outputText) {
          console.log(`Success with model: ${modelName}`);
          break;
        }
      } catch (err) {
        console.warn(`Model ${modelName} failed (${err.status || err.message}). Trying next fallback...`);
      }
    }

    if (outputText) {
      try {
        const parsed = JSON.parse(outputText);
        console.log("=== GEMINI GENERATED SCRIPT ===");
        console.log(parsed);
        return NextResponse.json({ result: parsed });
      } catch (jsonErr) {
        console.warn("JSON parse failed, delivering smart prompt-extracted fallback.");
      }
    }

    // 🟢 AGAR GEMINI BUSY / LIMIT EXCEEDED HUA TOH AUTOMATIC FALLBACK
    console.log("Gemini unavailable. Extracting metadata from prompt & generating fallback...");
    const fallbackData = getSmartFallbackFromPrompt(promptText);

    return NextResponse.json({
      result: fallbackData,
      isFallback: true,
    });

  } catch (error) {
    console.error("Gemini API Error, delivering safety fallback:", error);

    const safeData = getSmartFallbackFromPrompt(promptText);

    return NextResponse.json({
      result: safeData,
      isFallback: true,
    });
  }
}