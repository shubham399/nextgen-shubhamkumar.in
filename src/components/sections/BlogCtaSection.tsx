"use client";

import { useId, useState } from "react";
import { Icon } from "@iconify/react";
import { GetCtasResult } from "@/lib/wisp";

type Stage = "idle" | "loading" | "success" | "error";

type Props = {
  cta?: GetCtasResult["ctas"][0] | null;
};

export default function BlogCtaSection({ cta }: Props) {
  const emailId = useId();
  const errorId = useId();
  const [stage, setStage] = useState<Stage>("idle");
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const subscribe = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrMsg("Enter a valid email address.");
      setStage("error");
      return;
    }
    setStage("loading");
    setErrMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.status === 409 || res.ok) {
        setStage("success");
        return;
      }
      const data = await res.json();
      throw new Error(data.error || "Subscription failed. Try again.");
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Subscription failed. Try again.");
      setStage("error");
    }
  };

  const title = (cta?.title || "Stay in the loop").replace(/—/g, "-");
  const description = (cta?.description || "New posts and projects land in your inbox. No spam, no filler.").replace(/—/g, "-");

  return (
    <section className="section-base">
      <div className="rounded-2xl bg-surface-container p-8 sm:p-10">
        {stage === "success" ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <Icon icon="ion:checkmark-circle" width={28} className="text-primary" aria-hidden="true" />
            </div>
            <h3 className="font-headline text-xl font-bold tracking-tighter text-on-surface">You&apos;re on the list.</h3>
            <p className="mt-2 max-w-md font-body text-sm text-on-surface-variant">Check your inbox for a welcome note.</p>
            <button
              type="button"
              onClick={() => { setStage("idle"); setEmail(""); }}
              className="btn-ghost mt-4"
            >
              Subscribe another email
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <div>
              <p className="signal-label mb-4">Weekly dispatch</p>
              <h3 className="font-headline text-2xl font-bold tracking-tighter text-on-surface">{title}</h3>
              <p className="mt-2 max-w-md font-body text-sm leading-relaxed text-on-surface-variant">{description}</p>
            </div>

            <form
              className="w-full"
              onSubmit={(event) => {
                event.preventDefault();
                void subscribe();
              }}
            >
              <label htmlFor={emailId} className="sr-only">Email address</label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id={emailId}
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={stage === "loading"}
                  aria-invalid={stage === "error"}
                  aria-describedby={stage === "error" ? errorId : undefined}
                  className="form-control min-h-11 min-w-0 flex-1 rounded-lg px-4 py-3 text-base sm:text-sm disabled:opacity-50"
                />
                <button type="submit" disabled={stage === "loading"} className="btn-primary min-h-11 flex-shrink-0 justify-center disabled:opacity-50">
                  {stage === "loading" ? (
                    <Icon icon="ion:loader" width={16} className="animate-spin" aria-label="Subscribing" />
                  ) : (
                    <Icon icon="ion:arrow-forward" width={16} aria-hidden="true" />
                  )}
                  Subscribe
                </button>
              </div>
              {stage === "error" && (
                <p id={errorId} role="alert" className="mt-2 font-body text-xs text-error">{errMsg}</p>
              )}
              <p className="mt-2 font-body text-xs text-content-muted">No spam. Unsubscribe anytime.</p>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
