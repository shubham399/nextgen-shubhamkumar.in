# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in this repository.

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server at http://localhost:3000
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint
```

## Architecture

**Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, `@iconify/react`

**Data flow:** The home page fetches its API data in parallel in `src/app/page.tsx` using `Promise.all`. Fetch wrappers live in `src/lib/api.ts`; responses use the configured API base and revalidation windows. Types live in `src/types/index.ts`.

**Folder structure:**
- `src/app/` — Next.js App Router routes, metadata, and global styles
- `src/components/` — Section components and shared UI utilities
- `src/lib/` — API, GitHub, CMS, and utility integrations
- `src/types/` — TypeScript interfaces matching API shapes

**Component split:**
- Server components: About, Experience, Skills, Services, Certificates, Contact, Footer, SectionHeader
- Client components: Navigation, Hero, Testimonials, AnimateOnScroll, newsletter forms, and interactive dashboard/blog controls

**API endpoints used on the home page:**

| Export | Endpoint | Type |
|--------|----------|------|
| `getMe` | `/api/me` | `Me` |
| `getSocials` | `/api/socials` | `Social[]` |
| `getContacts` | `/api/contacts` | `Contact[]` |
| `getNav` | `/api/nav` | `Nav` |
| `getExperience` | `/api/experience` | `Experience[]` |
| `getSkills` | `/api/skills` | `Skill[]` |
| `getServices` | `/api/services` | `Service[]` |
| `getTestimonials` | `/api/testimonials` | `Testimonial[]` |
| `getCertificates` | `/api/certificates` | `Certificate[]` |

## Design System

Follow `DESIGN.md`: the Editorial Engineering system.

**Key rules:**
- No pure black — use `surface` (`#131313`) or `surface-container-lowest` (`#0e0e0e`)
- Use tonal surface shifts instead of decorative borders or glass blur
- Use ice/teal for structure, amber for signals, and sage for supporting status
- Keep gradients limited to functional cases; avoid generic `135deg` decoration
- Use `content-muted` and `content-subtle` for secondary text
- Respect `prefers-reduced-motion` for CSS, Framer Motion, canvas, parallax, and auto-rotation

**Surface hierarchy (darkest to lightest):** `surface-container-lowest` → `surface-container-low` → `surface-container` → `surface-container-high` → `surface-container-highest`

**Typography:** `font-headline` = Space Grotesk; `font-body` = Inter; use tight tracking on headlines

**Reusable CSS classes in `src/app/globals.css`:**
- `.btn-primary` — flat primary CTA
- `.btn-ghost` — tonal secondary action
- `.badge` — borderless signal chip
- `.surface-card` — opaque content surface
- `.signal-label` — amber section marker
- `.form-control` — shared input and focus treatment
- `.editorial-row` — compact ledger row
- `.section-base` — standard section padding and max width

**Skill icons:** The `/api/skills` response returns icons as `{ light: string, dark: string }` base64 data URIs or URL strings. Always use the `dark` variant. Helper: `getIconSrc(icon: Skill["icon"])` in `src/components/sections/Skills.tsx`.
