import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_URL || "http://localhost:3001";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const readonly = req.nextUrl.searchParams.get("readonly") === "true";

  const secret = process.env.INTERNAL_SECRET;
  const method = readonly ? "GET" : secret ? "POST" : "GET";
  const headers: Record<string, string> = {};
  if (secret) {
    headers["x-internal-secret"] = secret;
  }

  const res = await fetch(`${API_BASE}/api/blog/views/${slug}`, {
    method,
    headers,
  });

  if (!res.ok) {
    return NextResponse.json({ today: 0, total: 0 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
