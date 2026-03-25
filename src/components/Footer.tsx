import { Icon } from "@iconify/react";
import type { Social, Nav, Me } from "@/types";
import { UTMLink } from "./UTMLink";

interface FooterProps {
  socials: Social[];
  nav: Nav;
  me: Me;
}

const FOOTER_LINKS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Services", href: "#services" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export default function Footer({ me, socials, nav }: FooterProps) {
  return (
    <footer className="border-t border-outline-variant/10 bg-surface-container-lowest">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <p className="font-headline font-bold text-base tracking-tighter text-on-surface mb-2">
              {me.name}
            </p>
            <p className="font-body text-xs text-on-surface-variant leading-relaxed">
              {nav.footer_note || "Building high-performance backend systems that scale."}
            </p>
          </div>

          {/* Nav links */}
          <div>
            <p className="font-label text-xs font-semibold tracking-widest uppercase text-on-surface-variant mb-4">
              Navigation
            </p>
            <div className="flex flex-col gap-2">
              {FOOTER_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-body text-sm text-on-surface-variant hover:text-on-surface transition-colors w-fit"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Social + CTA */}
          <div>
            <p className="font-label text-xs font-semibold tracking-widest uppercase text-on-surface-variant mb-4">
              Connect
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {socials.map((social) => (
                <UTMLink
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all duration-200"
                >
                  <Icon icon={social.icon} width={16} />
                </UTMLink>
              ))}
            </div>
            <UTMLink
              href={nav.resume}
              className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-1.5"
            >
              <Icon icon="ion:document-outline" width={14} />
              Download Resume
            </UTMLink>
          </div>
        </div>

        <div className="border-t border-outline-variant/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-on-surface-variant">
            © {new Date().getFullYear()} {me.name}. All rights reserved.
          </p>
          <p className="font-body text-xs text-on-surface-variant flex items-center gap-1">
            Built with Next.js & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
