---
target: src/app/page.tsx
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 2
p1_count: 2
timestamp: 2026-07-24T17-54-04Z
slug: src-app-page-tsx
---
# Design Critique: shubhkumar.in Homepage

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|:-----:|-----------|
| 1 | Visibility of System Status | 3 | Smooth scroll + nav highlights work. No active-section indicator for long scroll. |
| 2 | Match System / Real World | 3 | Natural language. "Social Proof" label feels marketing-speak, not developer voice. |
| 3 | User Control and Freedom | 3 | Mobile menu closes on nav click. No back-to-top button. No skip-to-content link. |
| 4 | Consistency and Standards | 3 | Consistent card treatment. Footer border-t violates DESIGN.md "No-Line" rule. |
| 5 | Error Prevention | 2 | No error states for failed API calls. No fallback UI. |
| 6 | Recognition Rather Than Recall | 3 | Section labels are clear. 11 nav links exceeds cognitive limit. |
| 7 | Flexibility and Efficiency | n/a | Portfolio surface, not an interactive tool. |
| 8 | Aesthetic and Minimalist Design | 2 | 11 nav links. Triple CTA redundancy in Hero. Testimonials render same data 3x. |
| 9 | Error Recovery | 2 | No error boundaries. No fallback if API is down. |
| 10 | Help and Documentation | n/a | Portfolio surface. |
| **Total** | | **21/32** | **Good (66%)** |

## Design Specificity Verdict

Moderate — template-derivative. The Digital Monolith system is coherent and well-documented, but the composition (Hero, About, Experience, Skills, Services, Testimonials, Certificates, Contact) is the exact IA order of thousands of Tailwind portfolio starters. The differentiators are content, not design.

## What's Working

1. Design system execution — inner-glow chamfer, surface hierarchy, No-Line rule applied with rare consistency.
2. Cal.com as primary CTA — one-click booking in Hero, Nav, and Contact. No form friction.
3. Server-side parallel data fetching — zero client-side waterfalls. Fast and resilient.

## Priority Issues

### P0 — Blocking
C1: "M+" stat is broken. Visible data bug undermining credibility.
C2: Navigation overload (11 links). Creates decision paralysis.

### P1 — Major
C3: Triple CTA redundancy in Hero. Four competing action groups above the fold.
C4: Services section has zero visual differentiation. Same SVG icon for all.

### P2 — Minor
C5: Testimonials triple-render same data. Carousel + grid adds complexity.
C6: DESIGN.md "No-Line" rule violated in Footer and MailingListPopup.
C7: Hero social icons missing initial prop. Breaks animation pattern.

### P3 — Polish
C8: me.about reused 3 times in one viewport.

## Persona Red Flags

Alex (recruiter): 11 nav links force mental filtering. No quick-scan summary in Experience.
Jordan (consulting client): Services generic with no outcomes or pricing signals. No indication of what "Book a call" means.
Casey (mobile user): 11-link mobile nav is a wall of text. Skills chips have no filtering. Small testimonial selector targets.
