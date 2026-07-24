# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Recruiters & hiring managers:** Evaluating Shubham Kumar for senior/lead engineering roles. Need to quickly assess experience depth, technical breadth, and career trajectory.
- **Potential consulting clients:** Startup founders, growing product teams, and non-technical founders seeking fractional CTO or technical advisory. Need to evaluate expertise, fit, and pricing before booking a call.

Both audiences are equally important; neither is secondary.

## Product Purpose

Dual-purpose personal site:
1. **Portfolio:** Showcase work history, skills, services, testimonials, and certifications to establish credibility for career opportunities.
2. **Consulting landing page:** Convert visitors into booked calls by presenting services, pricing, honest boundaries, and social proof.

Success = booked consulting calls and inbound recruiting opportunities.

## Positioning

Associate Lead Engineer with deep backend/systems experience across fintech, airline IFE systems, and SaaS. Offers consulting as a fractional CTO or technical advisor — not a full-time hire, not an agency. First hour free. Three pricing tiers: hourly ($30/hr), discounted ($25/hr), enterprise (custom).

## Operating Context

- Visitor arrives → sees hero with name, role, avatar, summary → scrolls through experience, skills, services, testimonials, certificates → either books a call (consulting) or explores further.
- Consulting page is a self-contained funnel: services → boundaries → audience → pricing → about → testimonials → FAQ → contact.
- Blog (powered by Wisp CMS) provides long-form technical content.
- Dashboard (personal, not indexed) shows workout tracking, blog views, social metrics.

## Capabilities and Constraints

- All profile data (name, experience, skills, services, testimonials, certificates, contacts) served from MongoDB via internal API at `https://www.shubhkumar.in/api/*`.
- API requires `x-internal-secret` header for authenticated requests; public endpoints available without.
- Blog content managed via Wisp CMS (`@wisp-cms/client`).
- Cal.com embed for scheduling (`@calcom/embed-react`).
- Resend for newsletter/mailing list.
- Vercel Analytics + Google Analytics + Cloudflare Beacon for tracking.
- Recharts for dashboard data visualization.
- Framer Motion for animations.
- `next: { revalidate: 600 }` on API calls (10-minute ISR cache).
- No fabricated content — all testimonials, metrics, and company data are real, sourced from MongoDB.

## Brand Commitments

- Domain: `shubhkumar.in` (canonical production URL).
- Social handles: `shubhamkumar` (GitHub), `shubhamkumar` (LinkedIn), `shubhkumar01` (Twitter/X).
- Avatar: hosted at API-provided URL (`me.avatarUrl`).
- No light/dark mode toggle — dark theme only ("The Digital Monolith" aesthetic per DESIGN.md).

## Evidence on Hand

- Full API with 9+ endpoints serving real data (me, socials, contacts, nav, experience, skills, services, testimonials, certificates, workouts, blog views).
- 20 section components already built and functional.
- Multiple routes: `/` (portfolio), `/consulting`, `/blogs/[slug]`, `/dashboard`, `/newsletter`, `/health`, `/rss`, `/sitemap.xml`.
- Existing DESIGN.md with detailed design system specification.

## Product Principles

1. **Data authenticity over fabrication.** Every testimonial, metric, and company name is real. Never invent content.
2. **Dual-audience parity.** Portfolio and consulting must serve both audiences equally — neither is a secondary page.
3. **Speed to contact.** The path from landing to booked call should be frictionless: clear pricing, honest boundaries, one-click scheduling.
4. **Technical credibility.** The site itself is proof of engineering quality — fast, accessible, well-crafted.

## Accessibility & Inclusion

No product-specific accessibility requirements established beyond standard web accessibility (semantic HTML, ARIA labels on interactive elements, keyboard navigation).
