# Design System Specification: Editorial Engineering

## 1. Creative Direction

The interface is a dark editorial system for senior backend engineering. It should feel precise, calm, and built from deliberate layers rather than a dashboard of interchangeable cards.

The organizing ideas are:

- **Evidence over decoration:** show concrete work, constraints, and outcomes.
- **Tonal depth over scaffolding:** separate regions with surface shifts and spacing.
- **Asymmetry over repetition:** vary scale and span when content has a natural hierarchy.
- **Motion with purpose:** use parallax and reveals to clarify depth, never as decoration alone.

## 2. Color and Surfaces

The base is `surface` (`#131313`), with no pure black. Use the following darkest-to-lightest hierarchy:

1. `surface-container-lowest` (`#0e0e0e`) for the deepest canvas.
2. `surface-container-low` (`#1c1b1b`) for large content blocks.
3. `surface-container` (`#201f1f`) for interactive or nested surfaces.
4. `surface-container-high` (`#2a2a2a`) for hover and selected states.
5. `surface-container-highest` (`#353534`) for rare emphasis.
6. `surface-overlay` (`#252424`) for menus and transient panels.

Use `primary` (`#c4eef2`) for structural emphasis and links, `secondary` (`#f1b35c`) for signals and metadata, and `tertiary` (`#b8d6a3`) for supporting status. Use `content-muted` and `content-subtle` instead of stacking opacity utilities for secondary text.

Boundaries should normally come from a tonal shift. If a semantic divider is needed, use `divider` or spacing. Avoid decorative borders, glass blur, and repeated inner glows.

## 3. Typography

- **Space Grotesk** (`font-headline`) carries names, section titles, metrics, and compact labels.
- **Inter** (`font-body` and `font-label`) carries prose, metadata, and controls.
- Headlines use tight tracking and a clear scale; body copy stays comfortable at approximately `1.6` to `1.8` line height.
- Sentence case is preferred for UI labels and actions. Use uppercase only for short signal labels.

## 4. Layout and Components

- `section-base` provides the standard page rhythm and maximum content width.
- Use asymmetrical editorial ledgers, split panels, and one prominent item before repeating a pattern.
- `.surface-card` is the default content surface. It is opaque and tonal; it does not imply a border or glow.
- `.btn-primary` is a flat primary action. `.btn-ghost` is a tonal hover action.
- `.badge` is a small, borderless signal chip.
- `.form-control` is the shared input treatment with a visible focus ring.
- `.signal-label` is the standard amber section marker.
- `.editorial-row` is available for compact ledger rows.

Avoid uniform grids of icon-topper cards when a list, split panel, or timeline communicates the content more honestly.

## 5. Motion and Interaction

- Reveal sections with `AnimateOnScroll` and use short, consistent easing.
- Use Framer Motion `MotionConfig reducedMotion="user"` and respect `prefers-reduced-motion` in canvas and CSS effects.
- Parallax should be subtle, bounded, and disabled for reduced-motion users.
- Auto-rotating content must pause on hover and keyboard focus and expose a visible pause control.
- Scrollable regions should keep their active item visible without moving the entire page unexpectedly.
- Interactive targets should meet a minimum 44px touch size where practical and always have a visible focus state.

## 6. Content Rules

- Prefer specific technical outcomes over vague claims.
- Do not repeat the same biography in multiple sections.
- Keep role, summary, and biography as distinct content types.
- Use sentence case for actions and avoid decorative punctuation such as em dashes in interface copy.

## 7. Avoid

- Pure black (`#000000`).
- Generic cyan-only palettes.
- Repeated `135deg` gradients, gradient text, glass panels, or decorative blur.
- Stat monuments, icon toppers, and equal-card repetition without a content reason.
- Low-opacity text as a substitute for semantic hierarchy.
- Decorative motion that competes with reading or violates reduced-motion preferences.
