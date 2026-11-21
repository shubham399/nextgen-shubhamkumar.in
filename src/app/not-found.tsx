"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "@iconify/react";

const QUICK_LINKS = [
  { label: "Home", href: "/", icon: "ion:home-outline", desc: "Back to the start" },
  { label: "Blog", href: "/blogs", icon: "ion:newspaper-outline", desc: "Latest posts" },
  { label: "Consulting", href: "/consulting", icon: "ion:briefcase-outline", desc: "Work together" },
  { label: "Contact", href: "/#contact", icon: "ion:mail-outline", desc: "Get in touch" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function NotFound() {
  const shouldReduceMotion = useReducedMotion() ?? false;
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <main id="main-content" tabIndex={-1} className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-3xl mx-auto w-full text-center">
        {/* 404 */}
        <motion.p
          aria-hidden="true"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
          className="font-headline font-bold text-[6rem] sm:text-[10rem] lg:text-[12rem] leading-none text-primary"
        >
          404
        </motion.p>

        {/* Subtitle */}
        <motion.h1
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.15 }}
          className="mt-4 font-headline text-xl font-semibold tracking-tight text-on-surface sm:text-2xl"
        >
          Page not found
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.25 }}
          className="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed max-w-md mx-auto mt-3"
        >
          This page doesn&apos;t exist or was moved. Pick a destination below.
        </motion.p>

        {/* Quick links grid */}
        <motion.div
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 sm:mt-12"
        >
          {QUICK_LINKS.map((link) => (
            <motion.div key={link.href} variants={itemVariants}>
              <Link
                href={link.href}
                className="group flex flex-col items-center gap-2 rounded-xl bg-surface-container-low p-4 transition-colors duration-200 hover:bg-surface-container"
              >
                <Icon
                  icon={link.icon}
                  width={20}
                  className="text-on-surface-variant group-hover:text-primary transition-colors"
                />
                <span className="font-headline font-semibold text-xs tracking-tight text-on-surface group-hover:text-primary transition-colors">
                  {link.label}
                </span>
                <span className="font-body text-xs leading-tight text-content-muted">
                  {link.desc}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </div>
      </main>
    </>
  );
}
