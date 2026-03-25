"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import type { Testimonial } from "@/types";
import SectionHeader from "./SectionHeader";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function TestimonialCard({
  testimonial,
  compact = false,
}: {
  testimonial: Testimonial;
  compact?: boolean;
}) {

  return (
    <div className="bg-surface-container-low rounded-2xl p-6 inner-glow h-full flex flex-col gap-4">
      {/* Quote mark */}
      <div className="text-primary/30 font-headline text-5xl leading-none font-bold select-none">
        &ldquo;
      </div>

      {/* Quote text */}
      <p className="font-body text-sm text-on-surface-variant leading-relaxed flex-1">
        {testimonial.text}
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 border-t border-outline-variant/10">
        <div className="relative w-9 h-9 rounded-full overflow-hidden bg-surface-container flex-shrink-0">
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            fill
            className="object-cover"
            sizes="36px"
            unoptimized
          />
        </div>
        <div className="min-w-0">
          <a
            href={testimonial.link}
            target="_blank"
            rel="noopener noreferrer"
            className="font-headline font-semibold text-sm tracking-tight text-on-surface hover:text-primary transition-colors truncate block"
          >
            {testimonial.name.trim()}
          </a>
          <p className="font-label text-xs text-on-surface-variant truncate">
            {testimonial.destination} · {formatDate(testimonial.date)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section id="testimonials" className="section-base">
      <SectionHeader
        label="Social Proof"
        title="What colleagues say"
        description="Feedback from the engineers and leaders I've had the privilege of working with."
      />

      {/* Featured testimonial */}
      <div className="mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <TestimonialCard testimonial={testimonials[activeIdx]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Selector dots + compact previews */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        {testimonials.map((t, idx) => (
          <button
            key={t.name}
            onClick={() => setActiveIdx(idx)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-label transition-all duration-200 ${idx === activeIdx
              ? "bg-primary/10 text-primary ring-1 ring-primary/30"
              : "bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
          >
            <div className="relative w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={t.avatar}
                alt={t.name}
                fill
                className="object-cover"
                sizes="20px"
                unoptimized
              />
            </div>
            {t.name.trim().split(" ")[0]}
          </button>
        ))}
      </div>

      {/* All testimonials grid (smaller) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.map((t, idx) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            onClick={() => setActiveIdx(idx)}
            className="cursor-pointer"
          >
            <div
              className={`bg-surface-container-low rounded-2xl p-5 inner-glow transition-all duration-200 hover:bg-surface-container ${idx === activeIdx ? "ring-1 ring-primary/30 shadow-glow" : ""
                }`}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-surface-container flex-shrink-0">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    className="object-cover"
                    sizes="32px"
                    unoptimized
                  />
                </div>
                <div>
                  <p className="font-headline font-semibold text-xs tracking-tight text-on-surface">
                    {t.name.trim()}
                  </p>
                  <p className="font-label text-[10px] text-on-surface-variant">
                    {t.destination}
                  </p>
                </div>
              </div>
              <p className="font-body text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                {t.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
