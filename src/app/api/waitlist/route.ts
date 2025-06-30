import { NextRequest } from "next/server";
import { db } from "@/db";
import { waitlist } from "@/db/schema";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "global";
  const rate = await checkRateLimit(ip);

  if (!rate.success) {
    const retryAfter = rate.reset
      ? Math.ceil((rate.reset - Date.now()) / 1000)
      : 30;
    return new Response(
      JSON.stringify({
        success: false,
        message: "Too many requests. Please try again later.",
      }),
      {
        status: 429,
        headers: { "Retry-After": retryAfter.toString() },
      }
    );
  }

  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid email." }),
        { status: 400 }
      );
    }
    await db.insert(waitlist).values({ email });
    return new Response(
      JSON.stringify({
        success: true,
        message: "Successfully joined the waitlist!",
      }),
      { status: 200 }
    );
  } catch (error: any) {
    if (
      error.message?.includes("duplicate") ||
      error.message?.includes("unique")
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "You have already joined the waitlist.",
        }),
        { status: 200 }
      );
    }
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await db.select({ id: waitlist.id }).from(waitlist);
    return new Response(JSON.stringify({ count: result.length }), {
      status: 200,
    });
  } catch {
    return new Response(JSON.stringify({ count: 0 }), { status: 500 });
  }
}
