"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

const QUICK_LINKS = [
  { label: "Home", href: "/", icon: "ion:home-outline", desc: "Back to the start" },
  { label: "About", href: "/#about", icon: "ion:person-outline", desc: "Who I am" },
  { label: "Experience", href: "/#experience", icon: "ion:briefcase-outline", desc: "My journey" },
  { label: "Skills", href: "/#skills", icon: "ion:code-outline", desc: "Tech stack" },
  { label: "Services", href: "/#services", icon: "ion:settings-outline", desc: "What I offer" },
  { label: "Testimonials", href: "/#testimonials", icon: "ion:chatbubbles-outline", desc: "Kind words" },
  { label: "Blog", href: "/blogs", icon: "ion:newspaper-outline", desc: "Latest posts" },
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
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04] pointer-events-none"
        style={{
          background: "radial-gradient(circle, #00d2ff 0%, transparent 70%)",
        }}
      />

      <div className="max-w-3xl mx-auto w-full text-center">
        {/* 404 */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-headline font-bold text-[8rem] sm:text-[10rem] lg:text-[12rem] leading-none gradient-text"
        >
          404
        </motion.p>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="font-headline text-xl sm:text-2xl font-semibold tracking-tighter text-on-surface mt-4"
        >
          Page not found
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed max-w-md mx-auto mt-3"
        >
          This page doesn&apos;t exist or was moved. Pick a destination below.
        </motion.p>

        {/* Quick links grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-12"
        >
          {QUICK_LINKS.map((link) => (
            <motion.div key={link.href} variants={itemVariants}>
              <Link
                href={link.href}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all duration-200 inner-glow group"
              >
                <Icon
                  icon={link.icon}
                  width={20}
                  className="text-on-surface-variant group-hover:text-primary transition-colors"
                />
                <span className="font-headline font-semibold text-xs tracking-tight text-on-surface group-hover:text-primary transition-colors">
                  {link.label}
                </span>
                <span className="font-body text-[10px] text-on-surface-variant/60 leading-tight">
                  {link.desc}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-10"
        >
          <Link href="/" className="btn-primary">
            <Icon icon="ion:arrow-back" width={16} />
            Go home
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
