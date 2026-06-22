"use client";

import { useState, useEffect } from "react";
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

export default function MailingListPopup({ cta }: Props) {
  const pathname = usePathname();
  const [stage, setStage] = useState<Stage>("idle");
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const title = (cta?.title || "Weekly lessons from fintech, distributed systems, and production engineering.").replace(/—/g, "-");
  const description = (cta?.description || "New posts and projects land in your inbox. No spam, no filler - just the good stuff.").replace(/—/g, "-");

  useEffect(() => {
    if (localStorage.getItem(LS_SUBSCRIBED)) {
      setStage("dismissed");
      return;
    }
    if (sessionStorage.getItem(SS_DISMISSED)) {
      setStage("dismissed");
      return;
    }
    setStage("idle");
    const timer = setTimeout(() => setStage("visible"), 5000);
    return () => clearTimeout(timer);
  }, [pathname]);

  const dismiss = () => {
    sessionStorage.setItem(SS_DISMISSED, "1");
    setStage("dismissed");
  };

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
      setTimeout(dismiss, 3000);
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
          className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-3 sm:p-4 pointer-events-none"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 32 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <motion.div
            className="pointer-events-auto w-full max-w-none"
            layout
          >
            <div className="relative overflow-hidden rounded-2xl bg-surface-container-low p-4 sm:p-5 inner-glow border border-outline-variant/10 shadow-glow">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary-gradient-subtle rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />

              <button
                onClick={dismiss}
                className="absolute top-2 right-2 text-on-surface-variant/50 hover:text-on-surface transition-colors z-10"
                aria-label="Close"
              >
                <Icon icon="ion:close" width={18} />
              </button>

              <div className="relative z-10">
                {stage === "success" ? (
                  <div className="flex items-center gap-3 py-1">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon icon="ion:checkmark-circle" width={20} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-headline font-bold text-sm tracking-tighter text-on-surface">
                        Signal received.
                      </p>
                      <p className="font-body text-xs text-on-surface-variant truncate">
                        Check your inbox - I sent a welcome note.
                      </p>
                    </div>
                  </div>
                ) : stage === "error" && errMsg ? (
                  <div className="flex items-center gap-3 py-1">
                    <div className="w-9 h-9 rounded-lg bg-red/10 flex items-center justify-center flex-shrink-0">
                      <Icon icon="ion:alert-circle" width={20} className="text-red" />
                    </div>
                    <p className="font-body text-sm text-red flex-1 min-w-0 truncate">{errMsg}</p>
                    <button
                      onClick={() => setStage("visible")}
                      className="btn-ghost text-xs flex-shrink-0"
                    >
                      Try again
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 w-full sm:w-auto">
                      <div className="w-9 h-9 rounded-lg bg-primary-gradient-subtle flex items-center justify-center flex-shrink-0">
                        <Icon icon="ion:mail-unread" width={16} className="text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-headline font-bold text-sm tracking-tighter text-on-surface truncate">
                          {title}
                        </p>
                        <p className="font-body text-xs text-on-surface-variant leading-snug line-clamp-1">
                          {description}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-1.5 w-full sm:w-auto flex-shrink-0">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="your@email.com"
                        disabled={stage === "loading"}
                        className="flex-1 min-w-0 px-4 py-3 rounded-lg bg-surface-container text-on-surface text-sm font-body placeholder:text-on-surface-variant/50 border border-outline-variant/20 focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
                      />
                      <button
                        onClick={subscribe}
                        disabled={stage === "loading"}
                        className="btn-primary text-sm px-5 py-3 flex-shrink-0 disabled:opacity-50"
                      >
                        {stage === "loading" ? (
                          <Icon icon="ion:loader" width={14} className="animate-spin" />
                        ) : (
                          <Icon icon="ion:arrow-forward" width={14} />
                        )}
                        Join
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
