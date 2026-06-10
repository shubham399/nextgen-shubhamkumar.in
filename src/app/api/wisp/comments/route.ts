import { wisp } from "@/lib/wisp";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { slug, author, email } = body;

  console.log("[comments] POST received", { slug, author, email });

  try {
    const result = await wisp.createComment(body);
    console.log("[comments] wisp response", JSON.stringify(result));

    if (result && "error" in result) {
      const message = result.error?.message || "Request failed";
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
