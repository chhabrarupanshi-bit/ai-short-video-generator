import { NextResponse } from "next/server";
import { AssemblyAI } from "assemblyai";

// 1. AssemblyAI client initialize karein
const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY,
});

export async function POST(req) {
  try {
    // 2. Frontend se audio link receive karein
    const { audioUrl } = await req.json();

    if (!audioUrl) {
      return NextResponse.json(
        { error: "Audio URL is required" },
        { status: 400 }
      );
    }

    console.log("Transcribing audio from URL:", audioUrl);

    // 3. Audio ko AssemblyAI se transcribe karwayein
    const transcript = await client.transcripts.transcribe({
      audio: audioUrl,
    });

    console.log("=== CAPTION GENERATED SUCCESSFULLY ===");
    console.log("Words received:", transcript.words?.length);

    // 4. Word-by-word timestamps frontend ko bhej dein
    return NextResponse.json({
      result: transcript.words,
    });
  } catch (error) {
    console.error("Caption Generation Error:", error);
    return NextResponse.json(
      { error: "Caption generation failed", details: error.message },
      { status: 500 }
    );
  }
}