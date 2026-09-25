"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Icon } from "@iconify/react";
import type { Me, Social, Nav, Experience } from "@/types";
import { UTMLink } from "../ui/UTMLink";
import FloatingShapes from "../ui/FloatingShapes";
import CTA from "./CTA";

interface HeroProps {
  me: Me;
  socials: Social[];
  nav: Nav;
  experience: Experience[];
}

function getYearsOfExperience(experience: Experience[]): string {
  const starts = experience.filter((e) => !e.skip).map((e) => new Date(e.start).getFullYear());
  const earliest = Math.min(...starts);
  const years = new Date().getFullYear() - earliest;
  return `${years}+`;
}

export default function Hero({ me, socials, nav, experience }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Animated background glow — replaced static blob */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-[0.07] pointer-events-none animate-pulse-glow"
        aria-hidden="true"
        style={{
          background: "radial-gradient(circle, rgba(85,198,209,0.16) 0%, rgba(241,179,92,0.06) 34%, transparent 70%)",
        }}
      />
      <FloatingShapes />

      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <div className="flex flex-col gap-6">
            {/* Location chip */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <a
                href={me.locationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-label hover:text-primary transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" aria-hidden="true" />
                {me.location}
                <Icon icon="ion:chevron-forward" width={12} aria-hidden="true" />
              </a>
            </motion.div>

            {/* Main title — display scale */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="font-headline font-bold tracking-tighter leading-[0.9]">
                <span className="block text-6xl sm:text-7xl lg:text-8xl text-on-surface">
                  {me.name.split(" ")[0]}
                </span>
                <span className="block text-6xl sm:text-7xl lg:text-8xl gradient-text">
                  {me.name.split(" ").slice(1).join(" ")}
                </span>
              </h1>
            </motion.div>

            {/* Role — prominent, not muted */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="font-headline text-xl sm:text-2xl text-on-surface font-semibold tracking-tight"
            >
              {me.about}
            </motion.p>

            {/* Summary — tighter, punchier */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="font-body text-base leading-relaxed text-on-surface-variant max-w-lg"
            >
              {me.summary}
            </motion.p>

            {/* CTAs — bolder */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
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
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="flex items-center gap-2 lg:gap-4"
            >
              {socials.map((social) => (
                <UTMLink
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
                >
                  <Icon icon={social.icon} width={18} aria-hidden="true" />
                  <span className="sr-only">{social.name}</span>
                </UTMLink>
              ))}
            </motion.div>
          </div>

          {/* Right: Avatar — amplified glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Outer glow ring — stronger */}
              <div
                className="absolute inset-0 rounded-2xl opacity-30"
                style={{
                  background: "radial-gradient(circle at 35% 30%, rgba(85,198,209,0.28) 0%, rgba(241,179,92,0.12) 48%, transparent 72%)",
                  filter: "blur(32px)",
                  transform: "scale(1.08)",
                }}
              />
              {/* Avatar container */}
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden bg-surface-container-low inner-glow">
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
              <div
                className="absolute -bottom-4 -left-4 px-5 py-3 rounded-xl glass-card inner-glow"
                style={{ boxShadow: "0 0 40px rgba(112,213,223,0.12)" }}
              >
                <p className="font-headline font-bold text-base tracking-tight text-secondary">
                  {getYearsOfExperience(experience)} years
                </p>
                <p className="font-label text-xs text-on-surface-variant mt-0.5">
                  shipping at scale
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
