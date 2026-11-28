import { resetTurnstile } from "@/components/ui/Turnstile";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;
const SS_UTM = "landing-utm";
const loadedAt = Date.now();

// Runs on first load because the root layout imports NewsletterFullscreen, which imports this.
// Saves the landing page UTMs so a signup on a later page still credits them.
if (typeof window !== "undefined") {
  try {
    const params = new URLSearchParams(window.location.search);
    const utm = Object.fromEntries(
      UTM_KEYS.flatMap((k) => (params.get(k) ? [[k, params.get(k)]] : [])),
    );
    if (Object.keys(utm).length && !sessionStorage.getItem(SS_UTM)) {
      sessionStorage.setItem(
        SS_UTM,
        JSON.stringify({ ...utm, landing_page: window.location.pathname }),
      );
    }
  } catch {}
}

export async function subscribeEmail(email: string, form: HTMLFormElement) {
  let utm: Record<string, string> = {};
  try {
    utm = JSON.parse(sessionStorage.getItem(SS_UTM) || "{}");
  } catch {}

  const data = new FormData(form);
  const res = await fetch("/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      ...utm,
      signup_page: window.location.pathname,
      // Honeypot and fill time: bots fill every field and submit instantly.
      company: data.get("company") ?? "",
      turnstileToken: data.get("cf-turnstile-response") ?? "",
      elapsed: Date.now() - loadedAt,
    }),
  });
  resetTurnstile(form);
  return res;
}
