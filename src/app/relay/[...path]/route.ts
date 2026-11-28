import type { NextRequest } from "next/server";

// Mixpanel traffic goes through our own domain, so ad blockers that block
// mixpanel.com do not drop it. The host is fixed, so this cannot reach anywhere else.
const UPSTREAM = "https://api-eu.mixpanel.com";

async function forward(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  // Pass the visitor's IP on, or Mixpanel would place every visitor at Vercel's data centre.
  const ip =
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim();

  const res = await fetch(
    `${UPSTREAM}/${path.join("/")}/${req.nextUrl.search}`,
    {
      method: req.method,
      headers: {
        "content-type":
          req.headers.get("content-type") ??
          "application/x-www-form-urlencoded",
        ...(ip ? { "x-real-ip": ip, "x-forwarded-for": ip } : {}),
      },
      body: req.method === "POST" ? await req.arrayBuffer() : undefined,
    },
  );

  return new Response(res.body, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") ?? "application/json",
    },
  });
}

export { forward as GET, forward as POST };
