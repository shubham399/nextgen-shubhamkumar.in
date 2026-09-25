import { Icon } from "@iconify/react";
import type { Contact, Me, Social } from "@/types";
import SectionHeader from "../ui/SectionHeader";
import AnimateOnScroll from "../ui/AnimateOnScroll";
import { UTMLink } from "../ui/UTMLink";
import CTA from "./CTA";

interface ContactProps {
  contacts: Contact[];
  me: Me;
  socials: Social[];
}

export default function Contact({ contacts, me, socials }: ContactProps) {
  return (
    <section id="contact" className="section-base">
      <SectionHeader
        label="Start a conversation"
        title="Have a hard system problem?"
        description="Start with the bottleneck, the trade-off, or the idea you want to pressure-test."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <AnimateOnScroll className="lg:col-span-2" direction="left">
          <div className="surface-card p-5 sm:p-6">
            <p className="signal-label">Direct channels</p>
            <div className="mt-4 flex flex-col gap-1">
              {contacts.map((contact) => (
                <div key={contact.title} className="flex items-center gap-3 rounded-xl px-2 py-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                    <Icon icon={contact.icon} width={16} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-label text-xs text-content-muted">{contact.title}</p>
                    {contact.href ? (
                      <a
                        href={contact.href}
                        className="block truncate font-headline text-sm font-semibold text-on-surface transition-colors hover:text-primary"
                      >
                        {contact.text}
                      </a>
                    ) : (
                      <p className="truncate font-headline text-sm font-semibold text-on-surface">
                        {contact.text}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl bg-surface-container p-4">
              <p className="font-label text-xs text-content-muted">Elsewhere</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {socials.map((social) => (
                  <UTMLink
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    className="interactive-surface inline-flex min-h-11 items-center gap-2 rounded-lg bg-surface-container-low px-3 py-2 font-label text-xs text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
                  >
                    <Icon icon={social.icon} width={16} aria-hidden="true" />
                    {social.name}
                  </UTMLink>
                ))}
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll className="lg:col-span-3" delay={0.1}>
          <div className="flex h-full flex-col justify-between gap-10 rounded-2xl bg-surface-container p-8 sm:p-10">
            <div>
              <div className="flex items-center gap-2 text-secondary">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" aria-hidden="true" />
                <span className="font-label text-xs font-semibold uppercase tracking-[0.18em]">
                  Open to focused collaborations
                </span>
              </div>
              <h3 className="mb-3 mt-5 font-headline text-3xl font-bold tracking-tighter text-on-surface">
                Bring the bottleneck.
              </h3>
              <p className="max-w-xl font-body text-sm leading-relaxed text-on-surface-variant">
                {me.cta.message}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <CTA btn={me.cal} className="btn-primary justify-center">
                <Icon icon="ion:calendar-outline" width={16} aria-hidden="true" />
                Book a 15-minute call
              </CTA>
              <a href="mailto:hello@shubhkumar.in" className="btn-ghost justify-center">
                <Icon icon="ion:mail-outline" width={16} aria-hidden="true" />
                Send an email
              </a>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
