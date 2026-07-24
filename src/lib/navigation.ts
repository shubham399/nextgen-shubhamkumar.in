export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Services", href: "/#services" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Blog", href: "/blogs" },
  { label: "Consulting", href: "/consulting" },
  { label: "Contact", href: "/#contact" },
];

export const FOOTER_NAV_LINKS: NavLink[] = [
  ...NAV_LINKS,
  { label: "Newsletter", href: "/newsletter" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "RSS", href: "/rss" },
];
