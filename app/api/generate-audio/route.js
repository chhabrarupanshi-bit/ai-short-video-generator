import { NextResponse } from "next/server";
import * as googleTTS from "google-tts-api";
import { imagekit } from "@/confige/ImageKitConfige";

export async function POST(req) {
  try {
    const { text, id } = await req.json();

    if (!text || typeof text !== "string" || text.trim() === "") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    console.log("Generating audio for text length:", text.length);

    // 1. Text to Speech chunks generate karein
    const results = await googleTTS.getAllAudioBase64(text, {
      lang: "en",
      slow: false,
      host: "https://translate.google.com",
      timeout: 10000,
      splitPunct: ".,?!;:",
    });

    // 2. Chunks ko combine karke single binary buffer banayein
    const audioBuffers = results.map((chunk) =>
      Buffer.from(chunk.base64, "base64")
    );
    const finalBuffer = Buffer.concat(audioBuffers);

    const fileName = `audio_${id || Date.now()}.mp3`;

    // 3. Direct ImageKit Cloud par upload karein
    const uploadResponse = await imagekit.upload({
      file: finalBuffer, // Direct buffer upload
      fileName: fileName,
      folder: "/ai-short-video-files",
    });

    console.log("Uploaded to ImageKit successfully:", uploadResponse.url);

    // 4. Frontend ko direct public CDN URL return karein (Firebase ki tarah)
    return NextResponse.json({
      Result: uploadResponse.url,
    });
  } catch (error) {
    console.error("Audio Generation & Upload Error:", error);
    return NextResponse.json(
      { error: "Audio generation failed", details: error.message },
      { status: 500 }
    );
  }
}