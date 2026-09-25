"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Icon } from "@iconify/react";
import type { Me, Social, Nav, Experience } from "@/types";
import { UTMLink } from "../ui/UTMLink";
import CTA from "./CTA";

interface HeroProps {
  me: Me;
  socials: Social[];
  nav: Nav;
  experience: Experience[];
}

function getYearsOfExperience(experience: Experience[]): string {
  const starts = experience
    .filter((entry) => !entry.skip)
    .map((entry) => new Date(entry.start).getFullYear())
    .filter((year) => Number.isFinite(year));
  if (!starts.length) return "0+";
  return `${new Date().getFullYear() - Math.min(...starts)}+`;
}

export default function Hero({ me, socials, nav, experience }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, 28]);
  const avatarY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, -28]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex items-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <motion.div style={{ y: contentY }} className="flex flex-col gap-6">
            {/* Location chip */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: shouldReduceMotion ? 0 : 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <a
                href={me.locationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="interactive-surface inline-flex min-h-11 items-center gap-2 rounded-full bg-surface-container px-3 text-xs font-label text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" aria-hidden="true" />
                {me.location}
                <Icon icon="ion:chevron-forward" width={12} aria-hidden="true" />
              </a>
            </motion.div>

            {/* Main title — display scale */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="font-headline font-bold tracking-tighter leading-[0.9]">
                <span className="block text-6xl sm:text-7xl lg:text-8xl text-on-surface">
                  {me.name.split(" ")[0]}
                </span>
                <span className="block text-6xl sm:text-7xl lg:text-8xl text-primary">
                  {me.name.split(" ").slice(1).join(" ")}
                </span>
              </h1>
            </motion.div>

            {/* Role — prominent, not muted */}
            <motion.p
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: shouldReduceMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-headline text-xl sm:text-2xl text-on-surface font-semibold tracking-tight"
            >
              {me.about}
            </motion.p>

            {/* Summary — tighter, punchier */}
            <motion.p
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: shouldReduceMotion ? 0 : 0.27, ease: [0.16, 1, 0.3, 1] }}
              className="font-body text-base leading-relaxed text-on-surface-variant max-w-lg"
            >
              {me.summary}
            </motion.p>

            {/* CTAs — bolder */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: shouldReduceMotion ? 0 : 0.34, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-3"
            >
              <CTA
                btn={`${me.cal}`}
                className="btn-primary px-6 py-3 text-base"
              >
                <Icon icon="ion:calendar-outline" width={18} />
                Book a call
              </CTA>
              <UTMLink
                href={nav.resume}
                className="btn-ghost px-6 py-3 text-base"
              >
                <Icon icon="ion:document-outline" width={18} />
                Resume
              </UTMLink>
            </motion.div>

            {/* Socials */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: shouldReduceMotion ? 0 : 0.41, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-start gap-3"
            >
              <p className="font-label text-xs font-semibold uppercase tracking-[0.18em] text-content-subtle">
                Find me elsewhere
              </p>
              <div className="flex items-center gap-2 lg:gap-3">
                {socials.map((social) => (
                  <UTMLink
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    className="interactive-surface inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary"
                  >
                    <Icon icon={social.icon} width={18} aria-hidden="true" />
                    <span className="sr-only">{social.name}</span>
                  </UTMLink>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Avatar */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: shouldReduceMotion ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{ y: avatarY }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden bg-surface-container-low">
                <Image
                  src={me.avatarUrl}
                  alt={me.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 640px) 288px, (max-width: 1024px) 320px, 384px"
                />
              </div>
              {/* Floating badge — bolder */}
              <div className="absolute -bottom-4 -left-4 px-5 py-3 rounded-xl bg-surface-container">
                <p className="font-headline font-bold text-base tracking-tight text-secondary">
                  {getYearsOfExperience(experience)} years
                </p>
                <p className="font-label text-xs text-on-surface-variant mt-0.5">
                  in production
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
