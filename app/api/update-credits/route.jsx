import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/confige/db";
import { Users } from "@/confige/schema";
import { eq } from "drizzle-orm";

// Har plan ke fixed credits
const PLAN_CREDITS = {
  free: 100,
  pro: 2500,
  agency: 10000,
  enterprise: 10000,
};

export async function POST(req) {
  try {
    const { paymentId, orderId, signature, planId, userEmail, userName } =
      await req.json();

    console.log("=== UPDATE CREDITS CALLED ===", {
      userEmail,
      planId,
      paymentId,
      orderId,
    });

    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: "User email is required" },
        { status: 400 }
      );
    }

    // 1. Razorpay Signature Verification
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

    // Normalized plan key aur direct fixed credits (Add nahi honge)
    const normalizedPlan = (planId || "pro").toLowerCase();
    const assignedCredits = PLAN_CREDITS[normalizedPlan] || 2500;

    // 2. Database update: subscription true aur fixed credits set karein
    const existingUsers = await db
      .select()
      .from(Users)
      .where(eq(Users.email, userEmail));

    if (existingUsers && existingUsers.length > 0) {
      await db
        .update(Users)
        .set({
          subscription: true,             // 👈 Boolean true
          subscriptionPlan: normalizedPlan, // "pro"
          credits: assignedCredits,       // 2500
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
        subscription: true,               // 👈 Naye user ke liye bhi TRUE
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