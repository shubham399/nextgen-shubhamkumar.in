"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Me, Nav, Social } from "@/types";
import { NAV_LINKS } from "@/lib/navigation";
import CTA from "./CTA";
import { UTMLink } from "../ui/UTMLink";

interface NavigationProps {
  nav: Nav;
  me: Me;
  socials: Social[];
}

export default function Navigation({ me, nav, socials }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    firstMobileLinkRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMobileOpen(false);
      menuButtonRef.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (navRef.current?.contains(event.target as Node)) return;
      setMobileOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [mobileOpen]);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      {/* Desktop nav -  pill */}
      <nav
        ref={navRef}
        aria-label="Primary navigation"
        className={`fixed top-0 left-0 right-0 z-50 transition-[padding] duration-300 ${scrolled ? "pt-3" : "pt-5"
          }`}
      >
        <div
          className={`mx-auto w-[calc(100%-2rem)] max-w-6xl px-4 sm:px-5 py-3 rounded-xl flex items-center gap-6 font-label font-semibold text-sm transition-colors duration-300 ${scrolled
            ? "bg-surface-container"
            : "bg-surface-container-low"
            }`}
        >
          {/* Brand */}
          <Link
            href="/"
            className="font-headline text-base font-bold tracking-tight text-on-surface transition-colors hover:text-primary"
          >
            {me.name}
          </Link>

          {/* Nav links -  hidden on mobile */}
          <div className="hidden lg:flex items-center gap-5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-on-surface-variant hover:text-on-surface transition-colors text-xs font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTAs */}
          <div className="ml-auto hidden items-center gap-2 lg:flex">
            <UTMLink
              href={nav.resume}
              className="btn-ghost px-3 text-xs"
            >
              Resume
            </UTMLink>
            <CTA
              btn={`${nav.cal}`}
              className="btn-primary px-3 text-xs"
            >
              Book a call
            </CTA>
          </div>

          {/* Mobile hamburger */}
          <button
            ref={menuButtonRef}
            type="button"
            className="ml-auto inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            <Icon icon={mobileOpen ? "ion:close" : "ion:menu"} width={20} />
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-navigation"
              className="lg:hidden mt-2 mx-4 rounded-xl bg-surface-container p-4"
              initial={shouldReduceMotion ? false : { opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <a
                    ref={link === NAV_LINKS[0] ? firstMobileLinkRef : undefined}
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="interactive-surface flex min-h-11 items-center rounded-lg px-4 py-2.5 text-sm font-medium text-on-surface-variant hover:text-on-surface"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="mt-2 pt-3 flex gap-2">
                  <a
                    href={nav.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost text-xs flex-1 justify-center"
                  >
                    Resume
                  </a>
                  <a
                    href={`https://cal.com/${nav.cal}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-xs flex-1 justify-center"
                  >
                    Book a call
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
