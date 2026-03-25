"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import type { Me, Nav, Social } from "@/types";
import CTA from "./CTA";
import { UTMLink } from "./UTMLink";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Services", href: "#services" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

interface NavigationProps {
  nav: Nav;
  me: Me;
  socials: Social[];
}

export default function Navigation({ me, nav, socials }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Desktop nav — pill */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "pt-3" : "pt-5"
          }`}
      >
        <div
          className={`mx-auto max-w-fit px-6 py-2.5 rounded-full flex items-center gap-6 font-headline font-semibold tracking-tighter text-sm transition-all duration-300 ${scrolled
            ? "bg-surface-container-low/80 backdrop-blur-xl shadow-glow"
            : "bg-surface/60 backdrop-blur-xl"
            }`}
          style={{ boxShadow: "0 0 48px rgba(71,214,255,0.06)" }}
        >
          {/* Brand */}
          <Link
            href="#hero"
            className="text-base font-bold tracking-tighter text-on-surface hover:text-primary transition-colors"
          >
            {me.name}
          </Link>

          {/* Nav links — hidden on mobile */}
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
          <div className="hidden lg:flex items-center gap-2">
            <UTMLink
              href={nav.resume}
              className="btn-ghost text-xs px-3 py-1.5"
            >
              Resume
            </UTMLink>
            <CTA
              btn={`${nav.cal}`}
              className="btn-primary text-xs px-3 py-1.5"
            >
              Book a call
            </CTA>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-on-surface-variant hover:text-on-surface transition-colors ml-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <Icon icon={mobileOpen ? "ion:close" : "ion:menu"} width={20} />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden mt-2 mx-4 rounded-xl bg-surface-container-low/95 backdrop-blur-xl p-4 shadow-glow-md">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all text-sm font-medium"
                >
                  {link.label}
                </a>
              ))}
              <div className="border-t border-outline-variant/20 mt-2 pt-3 flex gap-2">
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
          </div>
        )}
      </nav>
    </>
  );
}
