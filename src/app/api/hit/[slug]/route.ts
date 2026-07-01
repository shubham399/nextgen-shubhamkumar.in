import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_URL || "http://localhost:3001";

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

  const secret = process.env.INTERNAL_SECRET_VALUE;
  console.log(`[hit route] INTERNAL_SECRET_VALUE present=${!!secret} length=${secret?.length ?? 0}`);

  const method = readonly ? "GET" : secret ? "POST" : "GET";
  console.log(`[hit route] resolved method=${method} (readonly=${readonly} hasSecret=${!!secret})`);

  const headers: Record<string, string> = {};
  if (secret) {
    headers["x-internal-secret"] = secret;
    console.log(`[hit route] added x-internal-secret header`);
  }

  const backendUrl = `${API_BASE}/api/blog/views/${slug}`;
  console.log(`[hit route] forwarding to backend: method=${method} url=${backendUrl}`);
  console.log(`[hit route] request headers=`, headers);

  let res: Response;
  try {
    res = await fetch(backendUrl, { method, headers });
    console.log(`[hit route] fetch completed in ${Date.now() - start}ms`);
  } catch (fetchErr) {
    console.error(`[hit route] fetch FAILED for slug=${slug} url=${backendUrl}`, fetchErr);
    return NextResponse.json({ today: 0, total: 0 });
  }

  console.log(`[hit route] backend response: status=${res.status} ${res.statusText}`);
  console.log(`[hit route] backend response headers=`, Object.fromEntries(res.headers.entries()));

  if (!res.ok) {
    const bodyText = await res.text().catch(() => "(failed to read body)");
    console.warn(`[hit route] backend returned ${res.status} for slug=${slug} body=${bodyText}`);
    return NextResponse.json({ today: 0, total: 0 });
  }

  let data: unknown;
  try {
    const raw = await res.text();
    console.log(`[hit route] raw response body=${raw}`);
    data = JSON.parse(raw);
  } catch (parseErr) {
    console.error(`[hit route] JSON parse FAILED for slug=${slug}`, parseErr);
    return NextResponse.json({ today: 0, total: 0 });
  }

  console.log(`[hit route] parsed response data=`, data);
  console.log(`[hit route] total processing time=${Date.now() - start}ms`);
  console.log(`[hit route] ===== END REQUEST =====`);
  return NextResponse.json(data);
}
