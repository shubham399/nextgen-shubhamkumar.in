import type { NextRequest } from "next/server";

// Server check for a Cloudflare Turnstile token. Never call siteverify from the browser.
// Needs TURNSTILE_SECRET and TURNSTILE_HOSTNAMES (comma list, e.g. "shubhkumar.in,www.shubhkumar.in").
// Outside production, a missing secret skips the check so local dev works without Cloudflare.
export async function verifyTurnstile(
  token: unknown,
  expectedAction: string,
  req: NextRequest,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[turnstile] TURNSTILE_SECRET not set, skipping check");
      return true;
    }
    console.error("[turnstile] TURNSTILE_SECRET not set");
    return false;
  }

  const hostnames = new Set(
    (process.env.TURNSTILE_HOSTNAMES ?? "")
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean),
  );
  if (
    typeof token !== "string" ||
    token.length === 0 ||
    token.length > 2048 ||
    hostnames.size === 0
  ) {
    return false;
  }

  const body = new URLSearchParams({ secret, response: token });
  const ip =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim();
  if (ip) body.set("remoteip", ip);

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        signal: AbortSignal.timeout(10_000),
        body,
      },
    );
    if (!res.ok) throw new Error(`siteverify ${res.status}`);
    const data = (await res.json()) as {
      success: boolean;
      action?: string;
      hostname?: string;
      "error-codes"?: string[];
    };
    const ok =
      data.success &&
      data.action === expectedAction &&
      hostnames.has(data.hostname ?? "");
    if (!ok)
      console.warn("[turnstile] rejected", {
        success: data.success,
        allowedHostnames: [...hostnames],
        codes: data["error-codes"],
        action: data.action,
        hostname: data.hostname,
      });
    return ok;
  } catch (err) {
    console.error("[turnstile] verify failed", err);
    return false;
  }
}
