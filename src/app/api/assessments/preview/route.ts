import { NextResponse } from "next/server";
import { z } from "zod";
import { assessAdmission } from "@/lib/assessment";
import { checkRateLimit } from "@/lib/rate-limit";

const assessmentRequestSchema = z.object({
  exam: z.enum(["JEE Main", "MHT-CET", "CAT"]),
  rank: z.coerce.number().int().positive().max(10_000_000),
  course: z.string().trim().min(2).max(100),
  category: z.enum(["Open", "OBC", "SC", "ST", "EWS"]),
  state: z.string().trim().min(2).max(80),
});

export async function POST(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const clientKey = forwardedFor?.split(",")[0]?.trim() || "unknown-client";
  const rateLimit = checkRateLimit(`assessment:${clientKey}`);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { message: "Too many assessment requests. Please try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  try {
    const payload = await request.json();
    const parsed = assessmentRequestSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Please check your assessment details and try again." },
        { status: 400 },
      );
    }

    const matches = assessAdmission(parsed.data);
    return NextResponse.json({
      matches,
      metadata: {
        rulesVersion: "source-linked-mvp-0.2",
        dataStatus: "Source-linked MVP — official cutoff rows are not yet imported",
        disclaimer:
          "This estimate is based on historical data; actual admission depends on official counselling, eligibility, seat availability and final cutoffs. Results with no official comparable cutoff are marked Insufficient data rather than guessed."
      },
    });
  } catch {
    return NextResponse.json(
      { message: "We could not complete the assessment. Please try again." },
      { status: 500 },
    );
  }
}
