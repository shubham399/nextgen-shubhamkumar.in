"use client";

import { useId, useState } from "react";
import { Icon } from "@iconify/react";

type Stage = "idle" | "loading" | "success" | "error";

export default function NewsletterSubscribe() {
  const emailId = useId();
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

  if (stage === "success") {
    return (
      <div className="mx-auto flex max-w-md items-center gap-3 rounded-2xl bg-surface-container-low p-5" role="status">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon icon="ion:checkmark-circle" width={22} className="text-primary" aria-hidden="true" />
        </div>
        <div>
          <p className="font-headline text-sm font-semibold text-on-surface">You&apos;re on the list.</p>
          <p className="font-body text-xs text-on-surface-variant">Check your inbox for a welcome note.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <form
        className="flex flex-col gap-2 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          void subscribe();
        }}
      >
        <label htmlFor={emailId} className="sr-only">
          Email address
        </label>
        <input
          id={emailId}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="your@email.com"
          required
          disabled={stage === "loading"}
          aria-invalid={stage === "error"}
          className="form-control min-h-11 flex-1 rounded-lg px-4 py-3 text-base sm:text-sm disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={stage === "loading"}
          className="btn-primary min-h-11 flex-shrink-0 justify-center disabled:opacity-50"
        >
          {stage === "loading" ? (
            <Icon icon="ion:loader" width={16} className="animate-spin" aria-label="Subscribing" />
          ) : (
            <Icon icon="ion:arrow-forward" width={16} aria-hidden="true" />
          )}
          Subscribe
        </button>
      </form>
      {stage === "error" && (
        <p className="mt-2 text-center font-body text-xs text-error" role="alert">
          {errMsg}
        </p>
      )}
      <p className="mt-2 text-center font-body text-xs text-content-muted">No spam. Unsubscribe anytime.</p>
    </div>
  );
}
