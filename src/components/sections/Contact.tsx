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
        label="Get In Touch"
        title="Let's build something"
        description="Start with the bottleneck, the trade-off, or the idea you want to pressure-test."
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Contact info -  2 cols */}
        <AnimateOnScroll className="lg:col-span-2 flex flex-col gap-4" direction="left">
          {contacts.map((contact) => (
            <div
              key={contact.title}
              className="flex items-center gap-4 bg-surface-container-low rounded-2xl p-5 inner-glow"
            >
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center flex-shrink-0">
                <Icon icon={contact.icon} width={18} className="text-primary" />
              </div>
              <div>
                <p className="font-label text-xs text-on-surface-variant">
                  {contact.title}
                </p>
                {contact.href ? (
                  <a
                    href={contact.href}
                    className="font-headline font-semibold text-sm tracking-tight text-on-surface hover:text-primary transition-colors"
                  >
                    {contact.text}
                  </a>
                ) : (
                  <p className="font-headline font-semibold text-sm tracking-tight text-on-surface">
                    {contact.text}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Social links */}
          <div className="bg-surface-container-low rounded-2xl p-5 inner-glow">
            <p className="font-label text-xs text-on-surface-variant mb-3">
              Find me on
            </p>
            <div className="flex flex-wrap gap-2">
              {socials.map((social) => (
                <UTMLink
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="flex min-h-11 items-center gap-2 px-3 py-2 rounded-lg bg-surface-container text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all duration-200 text-xs font-label"
                >
                  <Icon icon={social.icon} width={16} aria-hidden="true" />
                  {social.name}
                </UTMLink>
              ))}
            </div>
          </div>
        </AnimateOnScroll>

        {/* CTA card -  3 cols */}
        <AnimateOnScroll className="lg:col-span-3" delay={0.1}>
          <div className="h-full rounded-2xl p-8 flex flex-col justify-between gap-8 relative overflow-hidden bg-surface-container">
            <div className="relative">
              <div className="inline-flex items-center gap-2 text-secondary font-label text-xs font-semibold tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" aria-hidden="true" />
                Open to focused collaborations
              </div>
              <h3 className="font-headline font-bold text-2xl tracking-tighter text-on-surface mt-5 mb-3">
                Ready to collaborate?
              </h3>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                {me.cta.message}
              </p>
            </div>

            <div className="relative flex flex-col sm:flex-row gap-3">
              <CTA
                btn={`${me.cal}`}
                className="btn-primary justify-center"
              >
                <Icon icon="ion:calendar-outline" width={16} aria-hidden="true" />
                Book a 15-min call
              </CTA>
              <a
                href="mailto:hello@shubhkumar.in"
                className="btn-ghost justify-center"
              >
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
