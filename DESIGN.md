# Design System Specification: Editorial Engineering

## 1. Creative Direction

The interface is a dark editorial system for senior backend engineering. It should feel precise, calm, and built from deliberate layers rather than a dashboard of interchangeable cards.

The organizing ideas are:

- **Evidence over decoration:** show concrete work, constraints, and outcomes.
- **Tonal depth over scaffolding:** separate regions with surface shifts and spacing.
- **Asymmetry over repetition:** vary scale and span when content has a natural hierarchy.
- **Motion with purpose:** use parallax and reveals to clarify depth, never as decoration alone.

## 2. Color and Surfaces

`src/lib/theme.ts` is the single source of truth. `tailwind.config.ts` imports it, chart components import it, and the newsletter email interpolates from it. Change a hex there and the whole product follows. No colour literal belongs anywhere else.

The palette is **Ember**: a warm signal on cool graphite ink. The base is `surface` (`#0d1314`), with no pure black. Darkest-to-lightest hierarchy:

1. `surface-container-lowest` (`#070c0e`) for the deepest canvas.
2. `surface-container-low` (`#131a1b`) for large content blocks.
3. `surface-container` (`#1b2325`) for interactive or nested surfaces.
4. `surface-container-high` (`#262e30`) for hover and selected states.
5. `surface-container-highest` (`#2f383b`) for rare emphasis.
6. `surface-overlay` (`#222a2d`) for menus and transient panels.

All neutrals sit on hue `215` with chroma `0.010` to `0.013`. That faint cool cast is load-bearing: it makes the gray feel authored, and it is what lets a warm accent separate cleanly. Do not return to warm neutral grays, and do not add a second neutral hue.

Text roles, lightest first: `on-surface` (`#edf1f2`), `on-surface-variant` (`#c8cfd1`), `content-muted` (`#b6c0c2`), `content-subtle` (`#8f999b`).

Chromatic roles, each with exactly one job:

| Role | Hex | Job |
|---|---|---|
| `primary` | `#ff9c5e` | Ember. Structure: links, primary action, focus ring, selection |
| `secondary` | `#8bbee3` | Azure. Signals: section markers, metadata accents |
| `tertiary` | `#c1ad9d` | Warm ash. Supporting status, near-neutral so it recedes |
| `success` | `#50d2a7` | Jade. Nominal, available, passing |
| `warning` | `#f0d94f` | Yellow. Caution |
| `error` | `#fd617f` | Rose. Failure, destructive, invalid |

The chromatic roles separate by hue **and** descending lightness (`primary` `.800`, `warning` `.880`, `secondary` `.780`, `success` `.780`, `tertiary` `.760`, `error` `.700`), so the palette survives grayscale and deuteranopia, where ember and error both collapse toward yellow. Never let two roles compete in one block: one accent per view region.

Use `content-muted` and `content-subtle` instead of stacking opacity utilities for secondary text.

Boundaries normally come from a tonal shift. `divider` (`#4c5658`) and `outline-variant` (`#475053`) clear APCA Lc 32, which is why the `gap-px` grid technique stays readable. Avoid decorative borders, glass blur, and repeated inner glows.

Chart series use a separate `dataViz` set in the same file. A categorical series needs hues far apart from each other, which is the opposite of what UI accents need, so the two sets are kept separate on purpose.

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
- Generic cyan-only palettes, and any return to the old pale-ice `#c4eef2` primary.
- Warm neutral grays on the surface ladder; the ink cast is load-bearing.
- Ember and azure used as competing accents in the same block.
- A second neutral hue, or a colour literal outside `src/lib/theme.ts`.
- Repeated `135deg` gradients, gradient text, glass panels, or decorative blur.
- Stat monuments, icon toppers, and equal-card repetition without a content reason.
- Low-opacity text as a substitute for semantic hierarchy.
- Decorative motion that competes with reading or violates reduced-motion preferences.
