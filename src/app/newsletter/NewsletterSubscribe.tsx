"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

type Stage = "idle" | "loading" | "success" | "error";

export default function NewsletterSubscribe() {
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

  if (stage === "success") {
    return (
      <div className="flex items-center gap-3 bg-surface-container-low rounded-2xl p-5 inner-glow max-w-md mx-auto">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon icon="ion:checkmark-circle" width={22} className="text-primary" />
        </div>
        <div>
          <p className="font-headline font-semibold text-sm tracking-tight text-on-surface">
            You&apos;re on the list.
          </p>
          <p className="font-body text-xs text-on-surface-variant">
            Check your inbox for a welcome note.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
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
        <p className="font-body text-xs text-red mt-2 text-center">{errMsg}</p>
      )}
      <p className="font-body text-xs text-on-surface-variant/60 mt-2 text-center">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
