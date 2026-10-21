import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/confige/db";
import { Users } from "@/confige/schema";
import { eq, sql } from "drizzle-orm";

// Har plan ke fixed credits
const PLAN_CREDITS = {
  free: 100,
  pro: 2500,
  agency: 10000,
  enterprise: 10000,
};

export async function POST(req) {
  try {
    const body = await req.json();
    const { 
      userEmail, 
      userName, 
      deduct, 
      creditsToDeduct = 35, // 👈 100 me se 35 deduct hoga toh exact 2-3 video banegi
      paymentId, 
      orderId, 
      signature, 
      planId 
    } = body;

    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: "User email is required" },
        { status: 400 }
      );
    }

    // =========================================================================
    // 1. DEDUCT MODE: JAB USER VIDEO GENERATE KARE (LOOPHOLE FIX)
    // =========================================================================
    if (deduct) {
      const existingUsers = await db
        .select()
        .from(Users)
        .where(eq(Users.email, userEmail));

      if (!existingUsers || existingUsers.length === 0) {
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        );
      }

      const currentCredits = Number(existingUsers[0].credits || 0);

      // Agar user ke paas sufficient credit nahi hai
      if (currentCredits < creditsToDeduct) {
        return NextResponse.json(
          {
            success: false,
            error: "Insufficient credits! Please upgrade to continue creating videos.",
            currentCredits,
          },
          { status: 403 }
        );
      }

      // Database mein atomic deduction
      const updatedUser = await db
        .update(Users)
        .set({
          credits: sql`${Users.credits} - ${creditsToDeduct}`,
          updatedAt: new Date(),
        })
        .where(eq(Users.email, userEmail))
        .returning();

      console.log(`[CREDITS DEDUCTED] ${userEmail}: Deducted ${creditsToDeduct}, Remaining: ${updatedUser[0].credits}`);

      return NextResponse.json({
        success: true,
        message: "Credits deducted successfully",
        remainingCredits: updatedUser[0].credits,
      });
    }

    // =========================================================================
    // 2. PAYMENT MODE: JAB RAZORPAY SE PLAN UPGRADE HO
    // =========================================================================
    console.log("=== UPDATE CREDITS CALLED (PAYMENT) ===", {
      userEmail,
      planId,
      paymentId,
      orderId,
    });

    const secret =
      process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_API_SECRET;

    if (!secret) {
      return NextResponse.json(
        { success: false, error: "Razorpay secret missing on server" },
        { status: 500 }
      );
    }

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (generatedSignature !== signature) {
      console.error("Signature Mismatch!");
      return NextResponse.json(
        { success: false, error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    const normalizedPlan = (planId || "pro").toLowerCase();
    const assignedCredits = PLAN_CREDITS[normalizedPlan] || 2500;

    const existingUsers = await db
      .select()
      .from(Users)
      .where(eq(Users.email, userEmail));

    if (existingUsers && existingUsers.length > 0) {
      await db
        .update(Users)
        .set({
          subscription: true,
          subscriptionPlan: normalizedPlan,
          credits: assignedCredits,
          paymentId: paymentId,
          orderId: orderId,
          updatedAt: new Date(),
        })
        .where(eq(Users.email, userEmail));

      console.log(
        `Updated user ${userEmail} -> Plan: ${normalizedPlan}, Credits: ${assignedCredits}, Subscription: true`
      );
    } else {
      await db.insert(Users).values({
        name: userName || "User",
        email: userEmail,
        subscription: true,
        subscriptionPlan: normalizedPlan,
        credits: assignedCredits,
        paymentId: paymentId,
        orderId: orderId,
        updatedAt: new Date(),
      });

      console.log(
        `Inserted user ${userEmail} -> Plan: ${normalizedPlan}, Credits: ${assignedCredits}, Subscription: true`
      );
    }

    return NextResponse.json({
      success: true,
      message: `Account upgraded to ${normalizedPlan}!`,
      credits: assignedCredits,
    });
  } catch (error) {
    console.error("Update Credits Server Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update credits" },
      { status: 500 }
    );
  }
}