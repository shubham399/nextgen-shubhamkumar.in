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
    <article className="surface-card flex h-full flex-col gap-7 p-7 sm:p-10">
      <div className="flex items-center justify-between gap-4">
        <p className="signal-label">Selected note</p>
        <span className="font-headline text-4xl leading-none text-primary/50" aria-hidden="true">
          &ldquo;
        </span>
      </div>
      <blockquote className="max-h-96 max-w-3xl overflow-y-auto overscroll-contain pr-2 font-headline text-2xl leading-[1.3] tracking-tight text-on-surface sm:text-3xl">
        {testimonial.text.replace(/—/g, "-")}
      </blockquote>
      <div className="mt-auto flex items-center gap-3">
        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-surface-container-high">
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
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
  const notesListRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);
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

  useEffect(() => {
    const list = notesListRef.current;
    const activeButton = activeButtonRef.current;
    if (!list || !activeButton) return;

    const itemTop = activeButton.offsetTop;
    const itemBottom = itemTop + activeButton.offsetHeight;
    const visibleTop = list.scrollTop;
    const visibleBottom = visibleTop + list.clientHeight;
    const behavior: ScrollBehavior = shouldReduceMotion ? "auto" : "smooth";

    if (itemTop < visibleTop) {
      list.scrollTo({ top: itemTop, behavior });
    } else if (itemBottom > visibleBottom) {
      list.scrollTo({ top: itemBottom - list.clientHeight, behavior });
    }
  }, [activeIdx, shouldReduceMotion]);

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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.div style={{ y: noteY }} className="h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full"
                >
                  <FeaturedTestimonial testimonial={activeTestimonial} />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          <motion.div style={{ y: listY }} className="lg:col-span-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="signal-label">More notes</p>
              {!shouldReduceMotion && (
                <button
                  type="button"
                  onClick={() => setIsManuallyPaused((paused) => !paused)}
                  aria-pressed={isManuallyPaused}
                  aria-label={isManuallyPaused ? "Resume notes rotation" : "Pause notes rotation"}
                  className="flex min-h-11 items-center gap-1.5 rounded-lg px-2 font-label text-[10px] uppercase tracking-wider text-content-subtle transition-colors hover:bg-surface-container hover:text-on-surface"
                >
                  <Icon icon={isManuallyPaused ? "ion:play" : "ion:pause"} width={13} />
                  {isManuallyPaused ? "Play" : "Pause"}
                </button>
              )}
            </div>
            <div ref={notesListRef} className="relative flex max-h-[22rem] flex-col gap-2 overflow-y-auto pr-1">
              {testimonials.map((testimonial, index) => (
                <button
                  key={testimonial.name}
                  ref={index === activeIdx ? activeButtonRef : undefined}
                  type="button"
                  aria-pressed={index === activeIdx}
                  onClick={() => setActiveIdx(index)}
                  className={`group flex min-h-16 w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
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
                    <span className="block truncate font-headline text-sm font-semibold text-on-surface group-hover:text-primary">
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
