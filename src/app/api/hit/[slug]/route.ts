import { NextRequest, NextResponse } from "next/server";
import { fetchAPI, BASE_URL } from "@/lib/api";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const start = Date.now();
  const { slug } = await params;
  const readonly = req.nextUrl.searchParams.get("readonly") === "true";

  console.log(`[hit route] ===== INCOMING REQUEST =====`);
  console.log(`[hit route] fullUrl=${req.nextUrl.href}`);
  console.log(`[hit route] slug=${slug}`);
  console.log(`[hit route] searchParams=`, Object.fromEntries(req.nextUrl.searchParams.entries()));
  console.log(`[hit route] readonly=${readonly}`);

  const method = readonly ? "GET" : "POST";
  const path = `/api/blog/views/${slug}`;
  console.log(`[hit route] method=${method} path=${path} base=${BASE_URL}`);

  try {
    const startFetch = Date.now();
    const data = await fetchAPI<{ total: number; daily: number }>(path, { method });
    console.log(`[hit route] fetchAPI ok time=${Date.now() - startFetch}ms`);
    console.log(`[hit route] response data=`, data);
    console.log(`[hit route] total=${Date.now() - start}ms`);
    console.log(`[hit route] ===== END REQUEST =====`);
    return NextResponse.json(data);
  } catch (err) {
    console.error(`[hit route] fetchAPI FAILED slug=${slug} method=${method}`, err);
    return NextResponse.json({ today: 0, total: 0 });
  }
}
