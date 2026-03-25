"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Icon } from "@iconify/react";
import type { Me, Social, Nav, Experience } from "@/types";
import { UTMLink } from "./UTMLink";
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
      {/* Ambient background glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, #00d2ff 0%, transparent 70%)",
        }}
      />

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
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
                {me.location}
                <Icon icon="ion:chevron-forward" width={12} />
              </a>
            </motion.div>

            {/* Main title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="font-headline font-bold tracking-tighter leading-[0.95]">
                <span className="block text-5xl sm:text-6xl lg:text-7xl text-on-surface">
                  {me.name.split(" ")[0]}
                </span>
                <span className="block text-5xl sm:text-6xl lg:text-7xl gradient-text">
                  {me.name.split(" ").slice(1).join(" ")}
                </span>
              </h1>
            </motion.div>

            {/* Role */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="font-headline text-lg sm:text-xl text-on-surface-variant font-medium tracking-tight"
            >
              {me.about}
            </motion.p>

            {/* Summary */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="font-body text-sm leading-[1.7] text-on-surface-variant max-w-lg"
            >
              {me.summary}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="flex flex-wrap gap-3"
            >
              <CTA
                btn={`${me.cal}`}
                className="btn-primary"
              >
                <Icon icon="ion:calendar-outline" width={16} />
                Book a call
              </CTA>
              <UTMLink
                href={nav.resume}
                className="btn-ghost"
              >
                <Icon icon="ion:document-outline" width={16} />
                View Resume
              </UTMLink>
            </motion.div>
            {/* Socials */}
            <motion.div

              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="flex items-center gap-1 lg:gap-4"
            >
              {socials.map((social) => (
                <UTMLink
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}

                >
                  <Icon icon={social.icon} width={18} />
                </UTMLink>
              ))}
            </motion.div>
          </div>

          {/* Right: Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Outer glow ring */}
              <div
                className="absolute inset-0 rounded-2xl opacity-20"
                style={{
                  background:
                    "linear-gradient(135deg, #a5e7ff 0%, #00d2ff 100%)",
                  filter: "blur(24px)",
                  transform: "scale(1.05)",
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
              {/* Floating role badge */}
              <div
                className="absolute -bottom-4 -left-4 px-4 py-2.5 rounded-xl glass-card inner-glow"
                style={{ boxShadow: "0 0 32px rgba(71,214,255,0.08)" }}
              >
                <p className="font-headline font-bold text-sm tracking-tight text-on-surface">
                  {me.about}
                </p>
                <p className="font-label text-xs text-on-surface-variant mt-0.5">
                  {getYearsOfExperience(experience)} years experience
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA message bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-20 p-6 rounded-xl bg-surface-container-low inner-glow"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <p className="font-body text-sm text-on-surface-variant leading-relaxed max-w-xl">
              {me.cta.message}
            </p>
            <CTA
              btn={`${me.cta.btn}`}
              className="btn-primary whitespace-nowrap flex-shrink-0"
            >
              <Icon icon="ion:arrow-forward" width={14} />
              Schedule a meeting
            </CTA>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
