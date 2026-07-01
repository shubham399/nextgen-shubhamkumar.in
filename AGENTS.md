# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

**Data flow:** All 9 API endpoints at `https://www.shubhkumar.in/api/*` are fetched in parallel in `app/page.tsx` (a server component) using `Promise.all`. Responses are cached for 1 hour via `next: { revalidate: 3600 }`. See `lib/api.ts` for all fetch functions.

**Folder structure:**
- `app/` — Next.js App Router (layout, page, globals.css)
- `components/` — One file per section + shared utilities
- `lib/api.ts` — Typed fetch wrappers for all 9 APIs
- `types/index.ts` — TypeScript interfaces matching API shapes

**Component split:**
- Server components: About, Experience, Skills, Services, Certificates, Contact, Footer, SectionHeader
- Client components (`"use client"`): Navigation (scroll state + mobile menu), Hero (Framer Motion entry animations), Testimonials (interactive carousel), AnimateOnScroll (scroll-triggered animations)

**API endpoints used:**

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

Strictly follows `DESIGN.md` — "The Digital Monolith" aesthetic.

**Key rules:**
- No 1px solid borders — use background color shifts between surface tokens
- No pure black — use `surface` (#131313) or `surface-container-lowest` (#0e0e0e)
- No drop shadows — use `shadow-glow` (cyan ambient: `0 0 48px rgba(71,214,255,0.06)`)
- Primary gradient: `linear-gradient(135deg, #a5e7ff 0%, #00d2ff 100%)`

**Surface hierarchy (darkest→lightest):** `surface-container-lowest` → `surface-container-low` → `surface-container` → `surface-container-high` → `surface-container-highest`

**Typography:** `font-headline` = Space Grotesk (display/titles), `font-body` = Inter (paragraphs), tracking-tighter on headlines

**Reusable CSS classes** (in `globals.css`):
- `.btn-primary` — gradient CTA button
- `.btn-ghost` — tertiary ghost button
- `.badge` — small label chip
- `.surface-card` — standard bento card
- `.inner-glow` — top-edge 1px primary glow (chamfered glass effect)
- `.glass-card` — frosted glass with backdrop-blur
- `.gradient-text` — cyan gradient text fill
- `.section-base` — standard section padding + max-width

**Skill icons:** The `/api/skills` response returns icons as `{ light: string, dark: string }` base64 data URIs or URL strings. Always use the `dark` variant. Helper: `getIconSrc(icon: Skill["icon"])` in `components/Skills.tsx`.
