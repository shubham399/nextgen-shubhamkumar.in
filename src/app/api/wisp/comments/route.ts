import { wisp } from "@/lib/wisp";
import { NextRequest, NextResponse } from "next/server";
import { verifyTurnstile } from "@/lib/turnstile";

export async function POST(request: NextRequest) {
  const { turnstileToken, ...body } = await request.json();
  const { slug, author, email } = body;

  if (!(await verifyTurnstile(turnstileToken, "comment", request))) {
    return NextResponse.json({ success: false, error: "Verification failed. Refresh and try again." }, { status: 403 });
  }

  console.log("[comments] POST received", { slug, author, email });

  try {
    const result = await wisp.createComment(body);
    console.log("[comments] wisp response", JSON.stringify(result));

    const data = JSON.parse(JSON.stringify(result));
    if (data.error) {
      const message = data.error?.message || "Request failed";
      console.error("[comments] wisp returned error", message);
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create comment";
    console.error("[comments] error", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
