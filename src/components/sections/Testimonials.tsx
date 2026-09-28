"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { Testimonial } from "@/types";
import SectionHeader from "../ui/SectionHeader";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function FeaturedTestimonial({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="surface-card flex h-full min-h-0 flex-col gap-7 p-7 sm:p-10">
      <div className="flex min-h-11 flex-shrink-0 items-center justify-between gap-4">
        <p className="signal-label">Selected note</p>
        <span className="font-headline text-4xl leading-none text-primary/50" aria-hidden="true">
          &ldquo;
        </span>
      </div>
      <div className="relative min-h-0 flex-1">
        <blockquote className="h-full max-w-3xl overflow-y-auto overscroll-contain pr-2 font-headline text-xl leading-[1.4] tracking-tight text-on-surface lg:text-2xl">
          {testimonial.text.replace(/—/g, "-")}
        </blockquote>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-surface-container-low via-surface-container-low/70 to-transparent"
          aria-hidden="true"
        />
      </div>
      <div className="mt-auto flex flex-shrink-0 items-center gap-3">
        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-surface-container-high">
          <Image
            src={testimonial.avatar}
            alt=""
            fill
            className="object-cover"
            sizes="40px"
            unoptimized
          />
        </div>
        <div className="min-w-0">
          <a
            href={testimonial.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate font-headline text-sm font-semibold text-on-surface transition-colors hover:text-primary"
          >
            {testimonial.name.trim()}
          </a>
          <p className="truncate font-label text-xs text-content-muted">
            {testimonial.destination} · {formatDate(testimonial.date)}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const isPaused = isInteracting || isManuallyPaused;
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const noteY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [18, -18]);
  const listY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [-12, 12]);
  const activeTestimonial = testimonials[activeIdx] ?? testimonials[0];

  useEffect(() => {
    if (shouldReduceMotion || isPaused || testimonials.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveIdx((current) => (current + 1) % testimonials.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [isPaused, shouldReduceMotion, testimonials.length]);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="section-base"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onFocus={() => setIsInteracting(true)}
      onBlur={() => setIsInteracting(false)}
    >
      <SectionHeader
        label="Social proof"
        title="Notes from the work"
        description="A few words from people who have seen the systems up close."
      />

      {!activeTestimonial ? (
        <p className="font-body text-sm text-on-surface-variant">New references are on the way.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:h-[30rem] lg:grid-cols-12 lg:grid-rows-1">
          <div className="min-h-0 lg:col-span-7">
            <motion.div style={{ y: noteY }} className="h-full min-h-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full min-h-0"
                >
                  <FeaturedTestimonial testimonial={activeTestimonial} />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          <motion.div style={{ y: listY }} className="flex h-full flex-col lg:col-span-5">
            <div className="mb-4 flex min-h-11 flex-shrink-0 items-center justify-between gap-3">
              <p className="signal-label">More notes</p>
              {!shouldReduceMotion && (
                <button
                  type="button"
                  onClick={() => setIsManuallyPaused((paused) => !paused)}
                  aria-pressed={isManuallyPaused}
                  aria-label={isManuallyPaused ? "Resume notes rotation" : "Pause notes rotation"}
                  className="interactive-surface flex min-h-11 items-center gap-1.5 rounded-lg px-3 font-label text-xs font-medium text-content-subtle hover:text-on-surface"
                >
                  <Icon icon={isManuallyPaused ? "ion:play" : "ion:pause"} width={13} />
                  {isManuallyPaused ? "Play" : "Pause"}
                </button>
              )}
            </div>
            <div className="relative flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
              {testimonials.map((testimonial, index) => (
                <button
                  key={testimonial.name}
                  type="button"
                  aria-pressed={index === activeIdx}
                  onClick={() => setActiveIdx(index)}
                  className={`interactive-surface group flex min-h-14 w-full flex-shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-left ${
                    index === activeIdx
                      ? "bg-surface-container"
                      : "bg-surface-container-low hover:bg-surface-container"
                  }`}
                >
                  <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-surface-container-high">
                    <Image
                      src={testimonial.avatar}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="32px"
                      unoptimized
                    />
                  </div>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-headline text-sm font-semibold text-on-surface transition-colors group-hover:text-primary group-focus-visible:text-primary">
                      {testimonial.name.trim()}
                    </span>
                    <span className="block truncate font-label text-xs text-content-muted">
                      {testimonial.destination.replace(/—/g, "-")}
                    </span>
                  </span>
                  <span className="font-label text-xs text-content-subtle">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
