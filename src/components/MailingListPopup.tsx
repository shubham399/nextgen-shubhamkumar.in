"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

const LS_SUBSCRIBED = "ml-subscribed";
const LS_DISMISSED_UNTIL = "ml-dismissed-until";
const DISMISS_TTL_MS = 30 * 24 * 60 * 60 * 1000;

type Stage = "idle" | "visible" | "loading" | "success" | "error" | "dismissed";

export default function MailingListPopup() {
  const [stage, setStage] = useState<Stage>("idle");
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (localStorage.getItem(LS_SUBSCRIBED)) {
      setStage("dismissed");
      return;
    }
    const until = localStorage.getItem(LS_DISMISSED_UNTIL);
    if (until && Date.now() < Number(until)) {
      setStage("dismissed");
      return;
    }
    localStorage.removeItem(LS_DISMISSED_UNTIL);
    const timer = setTimeout(() => setStage("visible"), 5000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    localStorage.setItem(LS_DISMISSED_UNTIL, String(Date.now() + DISMISS_TTL_MS));
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={dismiss}
          />

          <motion.div
            className="relative w-full max-w-md rounded-2xl bg-surface-container-low p-8 inner-glow border border-outline-variant/10"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors"
              aria-label="Close"
            >
              <Icon icon="ion:close" width={20} />
            </button>

            {stage === "success" ? (
              <>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon icon="ion:checkmark-circle" width={24} className="text-primary" />
                </div>
                <h3 className="font-headline font-bold text-lg tracking-tighter text-on-surface text-center">
                  You&apos;re in
                </h3>
                <p className="font-body text-sm text-on-surface-variant text-center mt-2">
                  Welcome aboard. Check your inbox for a welcome email.
                </p>
              </>
            ) : stage === "error" ? (
              <>
                <div className="w-12 h-12 rounded-xl bg-red/10 flex items-center justify-center mx-auto mb-4">
                  <Icon icon="ion:alert-circle" width={24} className="text-red" />
                </div>
                <h3 className="font-headline font-bold text-lg tracking-tighter text-on-surface text-center">
                  Oops
                </h3>
                <p className="font-body text-sm text-on-surface-variant text-center mt-2">
                  {errMsg}
                </p>
                <button
                  onClick={() => setStage("visible")}
                  className="btn-ghost w-full justify-center mt-4"
                >
                  Try again
                </button>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-primary-gradient-subtle flex items-center justify-center mx-auto mb-4">
                  <Icon icon="ion:mail-unread" width={22} className="text-primary" />
                </div>

                <h3 className="font-headline font-bold text-lg tracking-tighter text-on-surface text-center">
                  Stay in the loop
                </h3>
                <p className="font-body text-sm text-on-surface-variant text-center mt-2 mb-6">
                  Get notified when I publish new content and projects.
                </p>

                <div className="flex gap-2">
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
                    Join
                  </button>
                </div>

                <button
                  onClick={dismiss}
                  className="w-full text-center text-xs font-label text-on-surface-variant/60 hover:text-on-surface-variant transition-colors mt-4"
                >
                  No thanks
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
