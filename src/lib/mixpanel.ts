import mixpanel from "mixpanel-browser";

const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
let ready = false;

// Autocapture sends page views (on every route change, UTMs included), clicks,
// form submits and scroll depth. The named events below mark funnel steps.
export function initMixpanel() {
  if (ready || !token || typeof window === "undefined") return;
  mixpanel.init(token, {
    api_host: "https://api-eu.mixpanel.com",
    autocapture: { pageview: "url-with-path", capture_text_content: true },
    persistence: "localStorage",
    debug: process.env.NODE_ENV !== "production",
  });
  ready = true;
}

export function track(event: string, props?: Record<string, unknown>) {
  if (ready) mixpanel.track(event, props);
}
