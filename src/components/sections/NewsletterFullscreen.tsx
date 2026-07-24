"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Icon } from "@iconify/react";

const LS_SUBSCRIBED = "nl-subscribed";
const LS_SEEN = "nl-fullscreen-seen";
const LS_SEEN_AT = "nl-fullscreen-seen-at";
const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;

type Stage = "hidden" | "visible" | "loading" | "success" | "error";

interface NewsletterFullscreenProps {
  name: string;
  avatarUrl: string;
}

export default function NewsletterFullscreen({ name, avatarUrl }: NewsletterFullscreenProps) {
  const [stage, setStage] = useState<Stage>("hidden");
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (localStorage.getItem(LS_SUBSCRIBED)) {
      return;
    }
    const seenAt = localStorage.getItem(LS_SEEN_AT);
    if (seenAt) {
      const elapsed = Date.now() - Number(seenAt);
      if (elapsed < ONE_MONTH_MS) return;
    }
    const timer = setTimeout(() => setStage("visible"), 2000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    localStorage.setItem(LS_SEEN, "1");
    localStorage.setItem(LS_SEEN_AT, String(Date.now()));
    setStage("hidden");
  };

  const subscribe = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrMsg("Enter a valid email");
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
        localStorage.setItem(LS_SUBSCRIBED, "1");
        setStage("success");
        return;
      }
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to subscribe");
      }
      localStorage.setItem(LS_SUBSCRIBED, "1");
      setStage("success");
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Something went wrong");
      setStage("error");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") subscribe();
  };

  const isOpen = stage === "visible" || stage === "loading" || stage === "success" || stage === "error";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-surface-container-lowest/95 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
          />

          {/* Content */}
          <motion.div
            className="relative w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Close */}
            <button
              onClick={dismiss}
              className="absolute -top-10 right-0 text-on-surface-variant/30 hover:text-on-surface-variant transition-colors"
              aria-label="Close"
            >
              <Icon icon="ion:close" width={20} />
            </button>

            {stage === "success" ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <Icon icon="ion:checkmark-done" width={28} className="text-primary" />
                </div>
                <h2 className="font-headline text-2xl font-bold tracking-tighter text-on-surface mb-2">
                  You&apos;re subscribed
                </h2>
                <p className="font-body text-sm text-on-surface-variant mb-6">
                  Check your inbox for a welcome note.
                </p>
                <button onClick={dismiss} className="btn-ghost text-sm">
                  Continue to site
                </button>
              </div>
            ) : (
              <div className="text-center">
                {/* Avatar */}
                <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto mb-5 ring-2 ring-primary/20 ring-offset-2 ring-offset-surface-container-lowest">
                  <Image
                    src={avatarUrl}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="80px"
                    unoptimized
                  />
                </div>

                {/* Author */}
                <p className="font-headline font-semibold text-sm tracking-tight text-on-surface mb-1">
                  {name}
                </p>
                <p className="font-label text-xs text-on-surface-variant/60 mb-6">
                  writes about backend systems
                </p>

                {/* Title */}
                <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tighter text-on-surface mb-3 leading-[1.15]">
                  Lessons from building<br />
                  <span className="gradient-text">high-scale systems</span>
                </h1>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-8 max-w-sm mx-auto">
                  Fintech, distributed systems, and production engineering.
                  Delivered to your inbox. No spam, no filler.
                </p>

                {stage === "error" && errMsg && (
                  <div className="flex items-center justify-center gap-2 mb-4 text-red text-sm font-body">
                    <Icon icon="ion:alert-circle" width={14} />
                    {errMsg}
                  </div>
                )}

                {/* Subscribe form */}
                <div className="flex gap-2 max-w-sm mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="your@email.com"
                    disabled={stage === "loading"}
                    className="flex-1 min-w-0 px-4 py-3 rounded-lg bg-surface-container-low text-on-surface text-sm font-body placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all disabled:opacity-50"
                  />
                  <button
                    onClick={subscribe}
                    disabled={stage === "loading"}
                    className="btn-primary px-5 py-3 flex-shrink-0 disabled:opacity-50"
                  >
                    {stage === "loading" ? (
                      <Icon icon="ion:loader" width={14} className="animate-spin" />
                    ) : (
                      "Subscribe"
                    )}
                  </button>
                </div>

                {/* Dismiss */}
                <button
                  onClick={dismiss}
                  className="mt-6 font-body text-xs text-on-surface-variant/30 hover:text-on-surface-variant/60 transition-colors"
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
