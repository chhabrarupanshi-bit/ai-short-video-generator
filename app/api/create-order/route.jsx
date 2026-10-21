import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req) {
  try {
    const { amount, planId } = await req.json();

    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    console.log("Checking Razorpay Keys in Backend:", {
      hasKeyId: Boolean(key_id),
      hasKeySecret: Boolean(key_secret),
      amount,
      planId,
    });

    if (!key_id || !key_secret) {
      console.error("Missing Razorpay Keys in .env.local!");
      return NextResponse.json(
        { error: "Razorpay Key ID or Secret missing in .env.local" },
        { status: 500 }
      );
    }

    const instance = new Razorpay({
      key_id: key_id,
      key_secret: key_secret,
    });

    // Amount paise mein hona chahiye (₹499 = 49900 paise)
    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: `receipt_${planId || "plan"}_${Date.now()}`.slice(0, 40),
    };

    const order = await instance.orders.create(options);
    console.log("Razorpay Order Created Successfully:", order.id);

    return NextResponse.json(order);
  } catch (error) {
    console.error("Razorpay Order API Catch Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create order" },
      { status: 500 }
    );
  }
}