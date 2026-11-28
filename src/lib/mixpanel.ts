import mixpanel from "mixpanel-browser";

const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
const DIRECT = "https://api-eu.mixpanel.com";
let ready: Promise<void> | undefined;

// Ad blockers block mixpanel.com. Probe it once; if that fails, send through
// our own /relay route (src/app/relay), which forwards to the same host.
async function pickHost() {
  try {
    // The root answers HEAD with 405; /track/ answers 200.
    await fetch(`${DIRECT}/track/`, {
      method: "HEAD",
      mode: "no-cors",
      signal: AbortSignal.timeout(3000),
    });
    return { api_host: DIRECT };
  } catch {
    return {
      api_host: `${window.location.origin}/relay`,
      // No trailing slash: Next.js would answer "track/" with a redirect first.
      api_routes: { track: "track", engage: "engage", groups: "groups" },
    };
  }
}

// Autocapture sends page views (on every route change, UTMs included), clicks,
// form submits and scroll depth. The named events below mark funnel steps.
export function initMixpanel() {
  if (ready || !token || typeof window === "undefined") return;
  ready = pickHost().then((host) => {
    mixpanel.init(token, {
      ...host,
      autocapture: { pageview: "url-with-path", capture_text_content: true },
      persistence: "localStorage",
      // Without this, browsers with Do Not Track on (Safari, Brave, many Firefox setups) send nothing.
      ignore_dnt: true,
      debug: process.env.NODE_ENV !== "production",
    });
  });
}

// Events fired before the probe finishes wait for it instead of being dropped.
export function track(event: string, props?: Record<string, unknown>) {
  // Child effects (e.g. BlogViewCounter) run before <MixpanelInit /> in the layout.
  initMixpanel();
  void ready?.then(() => mixpanel.track(event, props));
}
