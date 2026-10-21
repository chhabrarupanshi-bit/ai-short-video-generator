import { NextResponse } from "next/server";
import { db } from "@/confige/db";
import { Users } from "@/confige/schema";
import { eq } from "drizzle-orm";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const users = await db.select().from(Users).where(eq(Users.email, email));

    if (users && users.length > 0) {
      return NextResponse.json({ success: true, user: users[0] });
    }

    return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}