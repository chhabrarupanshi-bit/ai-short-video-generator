"use server";

import { db } from "@/confige/db";
import { VideoData } from "@/confige/schema";
import { eq, desc } from "drizzle-orm";

// 1. Neon DB me naya video data save karne ka secure Server Action
export async function saveVideoDataServer({
  script,
  audioFileUrl,
  captions,
  imageList,
  createdBy,
}) {
  try {
    const result = await db
      .insert(VideoData)
      .values({
        script: script,
        audioFileUrl: audioFileUrl,
        captions: captions,
        imageList: imageList,
        createdBy: createdBy,
      })
      .returning({ id: VideoData.id });

    if (result && result.length > 0) {
      return { success: true, id: result[0].id };
    }

    return { success: false, error: "Failed to insert record" };
  } catch (error) {
    console.error("Server Action saveVideoDataServer Error:", error);
    return { success: false, error: error.message };
  }
}

// 2. ID ke zariye single video fetch karne ka secure Server Action
export async function getVideoByIdServer(id) {
  try {
    const result = await db
      .select()
      .from(VideoData)
      .where(eq(VideoData.id, Number(id)));

    if (result && result.length > 0) {
      return { success: true, data: result[0] };
    }
    return { success: false, error: "Video not found" };
  } catch (error) {
    console.error("Server Action getVideoByIdServer Error:", error);
    return { success: false, error: error.message };
  }
}

// 3. Current logged-in user ki saari videos dashboard ke liye fetch karne ka Server Action
export async function getUserVideosServer(userEmail) {
  try {
    if (!userEmail) {
      return { success: false, error: "Email is required" };
    }

    const result = await db
      .select()
      .from(VideoData)
      .where(eq(VideoData.createdBy, userEmail))
      .orderBy(desc(VideoData.id)); // Nayi video sabse pehle dikhegi

    return { success: true, data: result };
  } catch (error) {
    console.error("Server Action getUserVideosServer Error:", error);
    return { success: false, error: error.message };
  }
}