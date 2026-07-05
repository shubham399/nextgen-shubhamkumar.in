export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Skills", href: "/#skills" },
  { label: "Services", href: "/#services" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Blog", href: "/blogs" },
  { label: "Consulting", href: "/consulting" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "RSS", href: "/rss" },
  { label: "Contact", href: "/#contact" },
];
