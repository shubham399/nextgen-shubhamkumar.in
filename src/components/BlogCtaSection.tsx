"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { GetCtasResult } from "@/lib/wisp";

type Stage = "idle" | "loading" | "success" | "error";

type Props = {
  cta?: GetCtasResult["ctas"][0] | null;
};

export default function BlogCtaSection({ cta }: Props) {
  const [stage, setStage] = useState<Stage>("idle");
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const subscribe = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrMsg("Please enter a valid email");
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
      throw new Error(data.error || "Failed to subscribe");
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Something went wrong");
      setStage("error");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") subscribe();
  };

  const title = cta?.title || "Stay in the loop";
  const description = cta?.description || "New posts and projects land in your inbox. No spam, no filler - just the good stuff.";

  return (
    <section className="section-base">
      <div className="relative overflow-hidden rounded-2xl bg-surface-container-low p-8 sm:p-12 inner-glow border border-outline-variant/10">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary-gradient-subtle rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="relative z-10">
          {stage === "success" ? (
            <div className="flex flex-col items-center text-center py-6">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Icon icon="ion:checkmark-circle" width={28} className="text-primary" />
              </div>
              <h3 className="font-headline font-bold text-xl tracking-tighter text-on-surface">
                You&apos;re on the list.
              </h3>
              <p className="font-body text-sm text-on-surface-variant mt-2 max-w-md">
                Check your inbox - I sent a welcome note.
              </p>
              <button
                onClick={() => { setStage("idle"); setEmail(""); }}
                className="btn-ghost mt-4"
              >
                Subscribe another email
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10">
              <div className="flex-1">
                <div className="w-12 h-12 rounded-xl bg-primary-gradient-subtle flex items-center justify-center mb-4">
                  <Icon icon="ion:mail-unread" width={22} className="text-primary" />
                </div>
                <h3 className="font-headline font-bold text-xl tracking-tighter text-on-surface">
                  {title}
                </h3>
                <p className="font-body text-sm text-on-surface-variant mt-1.5 max-w-md">
                  {description}
                </p>
              </div>

              <div className="w-full sm:w-auto flex-shrink-0 sm:min-w-[340px]">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="your@email.com"
                    disabled={stage === "loading"}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-surface-container text-on-surface text-sm font-body placeholder:text-on-surface-variant/50 border border-outline-variant/20 focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
                  />
                  <button
                    onClick={subscribe}
                    disabled={stage === "loading"}
                    className="btn-primary flex-shrink-0 disabled:opacity-50"
                  >
                    {stage === "loading" ? (
                      <Icon icon="ion:loader" width={16} className="animate-spin" />
                    ) : (
                      <Icon icon="ion:arrow-forward" width={16} />
                    )}
                    Subscribe
                  </button>
                </div>
                {stage === "error" && (
                  <p className="font-body text-xs text-red mt-2">{errMsg}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
