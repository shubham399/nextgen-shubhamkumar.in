"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Icon } from "@iconify/react";

const LS_SUBSCRIBED = "nl-subscribed";
const LS_SEEN_AT = "nl-fullscreen-seen-at";
const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;

type Stage = "hidden" | "visible" | "loading" | "success" | "error";

interface NewsletterFullscreenProps {
  name: string;
  avatarUrl: string;
}

function readStorage(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {}
}

export default function NewsletterFullscreen({ name, avatarUrl }: NewsletterFullscreenProps) {
  const [stage, setStage] = useState<Stage>("hidden");
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const emailId = useId();
  const errorId = useId();

  useEffect(() => {
    if (readStorage(LS_SUBSCRIBED)) return;
    const seenAt = readStorage(LS_SEEN_AT);
    if (seenAt) {
      const elapsed = Date.now() - Number(seenAt);
      if (elapsed < ONE_MONTH_MS) return;
    }
    const timer = window.setTimeout(() => setStage("visible"), 2000);
    return () => window.clearTimeout(timer);
  }, []);

  const dismiss = useCallback(() => {
    writeStorage(LS_SEEN_AT, String(Date.now()));
    setStage("hidden");
  }, []);

  const isOpen = stage === "visible" || stage === "loading" || stage === "success" || stage === "error";

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dismiss();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        "button:not([disabled]), input:not([disabled]), a[href]"
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [dismiss, isOpen]);

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
        writeStorage(LS_SUBSCRIBED, "1");
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-surface-container-lowest/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
            aria-hidden="true"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={stage === "success" ? "Newsletter signup" : undefined}
            aria-labelledby={stage === "success" ? undefined : titleId}
            className="relative w-full max-w-md"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={dismiss}
              className="absolute -right-1 -top-12 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-content-muted transition-colors hover:bg-surface-container hover:text-on-surface"
              aria-label="Close newsletter signup"
            >
              <Icon icon="ion:close" width={20} aria-hidden="true" />
            </button>

            {stage === "success" ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Icon icon="ion:checkmark-done" width={28} className="text-primary" aria-hidden="true" />
                </div>
                <h2 className="mb-2 font-headline text-2xl font-bold tracking-tighter text-on-surface">
                  You&apos;re subscribed
                </h2>
                <p className="mb-6 font-body text-sm text-on-surface-variant">Check your inbox for a welcome note.</p>
                <button type="button" onClick={dismiss} className="btn-ghost text-sm">
                  Continue to site
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="relative mx-auto mb-5 h-20 w-20 overflow-hidden rounded-full ring-2 ring-primary/20 ring-offset-2 ring-offset-surface-container-lowest">
                  <Image
                    src={avatarUrl}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="80px"
                    unoptimized
                  />
                </div>

                <p className="mb-1 font-headline text-sm font-semibold tracking-tight text-on-surface">{name}</p>
                <p className="mb-6 font-label text-xs text-content-muted">writes about backend systems</p>

                <h1 id={titleId} className="mb-3 font-headline text-2xl font-bold leading-[1.15] tracking-tighter text-on-surface sm:text-3xl">
                  Lessons from systems that stay up<span className="text-secondary">.</span>
                </h1>
                <p className="mx-auto mb-8 max-w-sm font-body text-sm leading-relaxed text-on-surface-variant">
                  Fintech, distributed systems, and production engineering. One useful dispatch at a time.
                </p>

                {stage === "error" && errMsg && (
                  <p id={errorId} role="alert" className="mb-4 font-body text-sm text-error">
                    {errMsg}
                  </p>
                )}

                <form
                  className="mx-auto flex max-w-sm gap-2"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void subscribe();
                  }}
                >
                  <label htmlFor={emailId} className="sr-only">Email address</label>
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
                  <button
                    type="submit"
                    disabled={stage === "loading"}
                    className="btn-primary min-h-11 flex-shrink-0 disabled:opacity-50"
                  >
                    {stage === "loading" ? (
                      <Icon icon="ion:loader" width={14} className="animate-spin" aria-label="Subscribing" />
                    ) : (
                      "Subscribe"
                    )}
                  </button>
                </form>

                <button
                  type="button"
                  onClick={dismiss}
                  className="mt-6 min-h-11 font-body text-xs text-content-muted transition-colors hover:text-on-surface"
                >
                  No thanks
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
