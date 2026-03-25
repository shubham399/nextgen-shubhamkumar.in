import { Icon } from "@iconify/react";
import type { Contact, Me, Social } from "@/types";
import SectionHeader from "./SectionHeader";
import AnimateOnScroll from "./AnimateOnScroll";
import { UTMLink } from "./UTMLink";
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
        description="Whether it's a new project, a technical challenge, or just a chat — I'm always open to connecting."
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Contact info — 2 cols */}
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
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all duration-200 text-xs font-label"
                >
                  <Icon icon={social.icon} width={16} />
                  {social.name}
                </UTMLink>
              ))}
            </div>
          </div>
        </AnimateOnScroll>

        {/* CTA card — 3 cols */}
        <AnimateOnScroll className="lg:col-span-3" delay={0.1}>
          <div
            className="h-full rounded-2xl p-8 flex flex-col justify-between gap-8 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(165,231,255,0.07) 0%, rgba(0,210,255,0.07) 100%)",
            }}
          >
            {/* Ambient glow */}
            <div
              className="absolute -top-8 -right-8 w-48 h-48 rounded-full opacity-10 pointer-events-none"
              style={{
                background: "radial-gradient(circle, #00d2ff 0%, transparent 70%)",
              }}
            />

            <div className="relative">
              <h3 className="font-headline font-bold text-2xl tracking-tighter text-on-surface mb-3">
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
                <Icon icon="ion:calendar-outline" width={16} />
                Book a 15-min call
              </CTA>
              <a
                href={`mailto:hello@shubhkumar.in`}
                className="btn-ghost justify-center"
              >
                <Icon icon="ion:mail-outline" width={16} />
                Send an email
              </a>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
