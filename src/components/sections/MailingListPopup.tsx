"use client";

import { useEffect, useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
import type { GetCtasResult } from "@/lib/wisp";

const LS_SUBSCRIBED = "ml-subscribed";
const SS_DISMISSED = "ml-session-dismissed";

type Stage = "idle" | "visible" | "loading" | "success" | "error" | "dismissed";

type Props = {
  cta?: GetCtasResult["ctas"][0] | null;
};

function readStorage(storage: Storage, key: string) {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(storage: Storage, key: string, value: string) {
  try {
    storage.setItem(key, value);
  } catch {}
}

export default function MailingListPopup({ cta }: Props) {
  const pathname = usePathname();
  const emailId = useId();
  const errorId = useId();
  const [stage, setStage] = useState<Stage>("idle");
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const title = (cta?.title || "Weekly lessons from fintech, distributed systems, and production engineering.").replace(/—/g, "-");
  const description = (cta?.description || "New posts and projects land in your inbox. No spam, no filler - just the good stuff.").replace(/—/g, "-");

  useEffect(() => {
    if (readStorage(localStorage, LS_SUBSCRIBED) || readStorage(sessionStorage, SS_DISMISSED)) {
      setStage("dismissed");
      return;
    }
    setStage("idle");
    const timer = window.setTimeout(() => setStage("visible"), 5000);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  const dismiss = () => {
    writeStorage(sessionStorage, SS_DISMISSED, "1");
    setStage("dismissed");
  };

  const subscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
      if (res.status === 409) {
        writeStorage(localStorage, LS_SUBSCRIBED, "1");
        setStage("success");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to subscribe");
      }
      writeStorage(localStorage, LS_SUBSCRIBED, "1");
      setStage("success");
      window.setTimeout(dismiss, 3000);
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Something went wrong");
      setStage("error");
    }
  };

  const isOpen = stage === "visible" || stage === "loading" || stage === "success" || stage === "error";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          aria-label="Newsletter signup"
          className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center p-3 sm:p-4"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 32 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <motion.div className="pointer-events-auto w-full max-w-3xl" layout>
            <div className="relative overflow-hidden rounded-2xl bg-surface-container-low p-4 sm:p-5">
              <button
                type="button"
                onClick={dismiss}
                className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-lg text-content-subtle transition-colors hover:bg-surface-container hover:text-on-surface"
                aria-label="Close newsletter signup"
              >
                <Icon icon="ion:close" width={18} />
              </button>

              <div className="relative z-10">
                {stage === "success" ? (
                  <div className="flex items-center gap-3 py-1" role="status" aria-live="polite">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon icon="ion:checkmark-circle" width={20} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-headline text-sm font-bold tracking-tight text-on-surface">Signal received.</p>
                      <p className="truncate font-body text-xs text-content-muted">Check your inbox - I sent a welcome note.</p>
                    </div>
                  </div>
                ) : stage === "error" && errMsg ? (
                  <div className="flex items-center gap-3 py-1" role="alert">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-error/10">
                      <Icon icon="ion:alert-circle" width={20} className="text-error" />
                    </div>
                    <p className="min-w-0 flex-1 truncate font-body text-sm text-error">{errMsg}</p>
                    <button type="button" onClick={() => setStage("visible")} className="btn-ghost flex-shrink-0 text-xs">
                      Try again
                    </button>
                  </div>
                ) : (
                  <form onSubmit={subscribe} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 flex-1 items-center gap-2.5">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Icon icon="ion:mail-unread" width={16} className="text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-headline text-sm font-bold tracking-tight text-on-surface">{title}</p>
                        <p className="line-clamp-1 font-body text-xs leading-snug text-content-muted">{description}</p>
                      </div>
                    </div>
                    <div className="flex w-full flex-shrink-0 gap-1.5 sm:w-auto">
                      <label htmlFor={emailId} className="sr-only">Email address</label>
                      <input
                        id={emailId}
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="your@email.com"
                        disabled={stage === "loading"}
                        aria-invalid={stage === "error"}
                        aria-describedby={stage === "error" ? errorId : undefined}
                        className="form-control min-w-0 flex-1 py-3"
                      />
                      <button type="submit" disabled={stage === "loading"} className="btn-primary flex-shrink-0 px-5 py-3 disabled:opacity-50">
                        {stage === "loading" ? (
                          <Icon icon="ion:loader" width={14} className="animate-spin" />
                        ) : (
                          <Icon icon="ion:arrow-forward" width={14} />
                        )}
                        Join
                      </button>
                    </div>
                    {stage === "error" && errMsg && <span id={errorId} className="sr-only">{errMsg}</span>}
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
