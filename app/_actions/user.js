"use server";

import { db } from "@/confige/db";
import { Users } from "@/confige/schema";
import { eq } from "drizzle-orm";

export async function checkAndSaveUser(name, email) {
  try {
    if (!email) return;

    // Check karo user pehle se database me hai ya nahi
    const existingUser = await db
      .select()
      .from(Users)
      .where(eq(Users.email, email));

    // Agar user nahi hai, to naya user insert karo
    if (!existingUser || existingUser.length === 0) {
      await db.insert(Users).values({
        name: name,
        email: email,
      });
      console.log("New user saved successfully!");
    }
  } catch (error) {
    console.error("Error saving user on server:", error);
  }
}