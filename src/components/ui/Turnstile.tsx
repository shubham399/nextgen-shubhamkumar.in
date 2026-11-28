"use client";

import { useRef, useState } from "react";
import Script from "next/script";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (el: HTMLElement) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

// Site keys are public. Override with Cloudflare's test key (1x00000000000000000000AA) for local dev.
const SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAGXR8echRl335Gx6";

// Cloudflare Turnstile. Puts a hidden `cf-turnstile-response` input inside the parent form.
// Stays invisible unless Cloudflare wants the visitor to click.
// Place it outside flex rows: when the challenge shows it stretches to the full form width.
export default function Turnstile({
  action,
  className = "",
}: {
  action: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [interactive, setInteractive] = useState(false);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        onReady={() => {
          const el = ref.current;
          if (el && window.turnstile && !el.hasChildNodes()) {
            window.turnstile.render(el, {
              sitekey: SITE_KEY,
              action,
              theme: "dark",
              appearance: "interaction-only",
              size: "flexible",
              "before-interactive-callback": () => setInteractive(true),
              "after-interactive-callback": () => setInteractive(false),
            });
          }
        }}
      />
      <div
        ref={ref}
        data-turnstile
        className={
          `${interactive ? "mt-3" : ""} ${className}`.trim() || undefined
        }
      />
    </>
  );
}

// Tokens work once. Call after each submit so a retry gets a fresh one.
export function resetTurnstile(form: HTMLFormElement) {
  const el = form.querySelector<HTMLElement>("[data-turnstile]");
  if (el && window.turnstile) window.turnstile.reset(el);
}
