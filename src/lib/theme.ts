/**
 * Theme: single source of truth for every colour in the product.
 *
 * `tailwind.config.ts` imports `theme` from this file, so every colour class
 * used in the app resolves from here. Change a hex below, run the dev server,
 * and the whole surface updates. Nothing else should hold a colour literal.
 *
 * ## The palette: EMBER
 *
 * A warm signal on cool graphite ink. The previous accent was signal lime;
 * ember replaces it. The neutrals did not move, and that is the point: the
 * ink ladder carries the surface, the accent carries the voice.
 *
 * - **Ink** (hue `215`, chroma `0.010`-`0.013`) for every neutral. A faint cool
 *   cast, so the grays feel authored and the warm accent separates cleanly.
 * - **Ember** (hue `48`) for structure: links, primary action, focus, selection.
 *   The one loud hue. It stays under 10% of any surface.
 * - **Azure** (hue `240`) for signals. Cool against the warm primary, so the two
 *   accents argue instead of blending.
 * - **Warm ash** (hue `60`, chroma `0.032`) for supporting status. Deliberately
 *   close to neutral so it recedes.
 *
 * Warm accents read optically thinner on a dark ground than cool ones, so
 * `primary` sits at `L 0.800` rather than higher. The `on-primary` ink is
 * pushed down to `L 0.160` to keep the button label above `Lc 75`.
 *
 * ## How to re-key the palette
 *
 * Each value carries its OKLCH source in a comment. The palette was authored in
 * OKLCH because it is perceptually uniform: equal `L` steps look equal, and the
 * hue is stated directly instead of inferred from RGB. When you retune a value,
 * edit the OKLCH triple, convert it to a clamped sRGB hex, and paste both.
 *
 * The rules that hold the palette together:
 *
 * - **Descending lightness across chromatic roles.** Primary `.800`, warning
 *   `.880`, secondary `.780`, success `.780`, tertiary `.760`, error `.700`.
 *   This is what keeps the accent set legible in grayscale and under
 *   deuteranopia, where ember and error both collapse toward yellow.
 * - **One job per role.** Primary is structure, secondary is a signal,
 *   tertiary is supporting status, the state ramp is status. Never let two
 *   roles share a block as competing accents.
 * - **No pure black, no pure white.** `on-surface` is `.955`, `on-error` `.98`.
 *
 * ## Measured contrast (APCA `Lc`, WCAG ratio) against the surface it renders on
 *
 * | Pair                                |  WCAG |    Lc |
 * | ----------------------------------- | ----- | ----- |
 * | `on-surface` on `surface`           | 16.48 |  94.4 |
 * | `on-surface-variant` on `surface`   | 11.87 |  81.8 |
 * | `content-muted` on `surface`        | 10.09 |  76.0 |
 * | `content-subtle` on `surface`       |  6.42 |  61.2 |
 * | `primary` on `surface`              |  9.08 |  72.3 |
 * | `secondary` on `surface`            |  9.44 |  73.6 |
 * | `tertiary` on `surface`             |  8.69 |  70.8 |
 * | `success` on `surface`              |  9.92 |  75.4 |
 * | `warning` on `surface`              | 13.16 |  85.6 |
 * | `error` on `surface`                |  6.42 |  61.1 |
 * | `on-primary` on `primary`           |  9.44 |  75.8 |
 * | `divider` on `surface`              |  2.48 |  34.3 |
 * | `outline-variant` on `surface`      |  2.27 |  31.9 |
 *
 * If you swap the palette, re-measure this table. Body text wants `Lc` 75,
 * labels and links want 60, UI boundaries want 30.
 */

export interface ColorScale {
  [role: string]: string;
}

/** Canvas. One hue, chroma barely above zero, never pure black. */
const surface: ColorScale = {
  "surface-container-lowest": "#070c0e", // oklch(0.15 0.01 215)
  "surface-dim": "#0d1314", // oklch(0.18 0.01 215)
  surface: "#0d1314", // oklch(0.18 0.01 215)
  background: "#0d1314", // oklch(0.18 0.01 215)
  "surface-container-low": "#131a1b", // oklch(0.21 0.011 215)
  "surface-container": "#1b2325", // oklch(0.25 0.012 215)
  "surface-overlay": "#222a2d", // oklch(0.28 0.012 215)
  "surface-container-high": "#262e30", // oklch(0.295 0.012 215)
  "surface-container-highest": "#2f383b", // oklch(0.335 0.013 215)
  "surface-variant": "#2f383b", // oklch(0.335 0.013 215)
  "surface-bright": "#3c4648", // oklch(0.385 0.013 215)
  "surface-tint": "#ff9c5e", // oklch(0.8 0.155 48)
};

/** Text. Descending lightness, all on hue 215. */
const content: ColorScale = {
  "on-surface": "#edf1f2", // oklch(0.955 0.005 215)
  "on-background": "#edf1f2", // oklch(0.955 0.005 215)
  "on-surface-variant": "#c8cfd1", // oklch(0.85 0.009 215)
  "content-muted": "#b6c0c2", // oklch(0.8 0.011 215)
  "content-subtle": "#8f999b", // oklch(0.675 0.012 215)
};

/**
 * Ember. Structure only: links, primary action, focus ring, selection.
 * The single most saturated role in the system, so it stays rare. Never pair it
 * with `secondary` as a competing accent in the same block.
 */
const primary: ColorScale = {
  primary: "#ff9c5e", // oklch(0.8 0.155 48)
  "primary-fixed": "#ffc79a", // oklch(0.89 0.105 52)
  "primary-fixed-dim": "#ff9c5e", // oklch(0.8 0.155 48)
  "primary-container": "#511900", // oklch(0.3 0.09 42)
  "on-primary": "#170904", // oklch(0.16 0.028 48)
  "on-primary-fixed": "#281308", // oklch(0.215 0.04 48)
  "on-primary-fixed-variant": "#884627", // oklch(0.47 0.1 45)
  "on-primary-container": "#ffca9a", // oklch(0.9 0.11 52)
  "inverse-primary": "#934319", // oklch(0.48 0.12 45)
  "focus-ring": "#ff9c5e", // oklch(0.8 0.155 48)
};

/** Azure. Signals: section markers and metadata, one per viewport at most. */
const secondary: ColorScale = {
  secondary: "#8bbee3", // oklch(0.78 0.075 240)
  "secondary-fixed": "#b4daf5", // oklch(0.87 0.055 240)
  "secondary-fixed-dim": "#8bbee3", // oklch(0.78 0.075 240)
  "secondary-container": "#163045", // oklch(0.3 0.05 244)
  "on-secondary": "#0b151c", // oklch(0.19 0.02 240)
  "on-secondary-fixed": "#0a1a25", // oklch(0.21 0.03 240)
  "on-secondary-fixed-variant": "#223b4d", // oklch(0.34 0.045 242)
  "on-secondary-container": "#bedcf3", // oklch(0.88 0.045 240)
};

/** Warm ash. Supporting status. Low chroma so it recedes behind primary. */
const tertiary: ColorScale = {
  tertiary: "#c1ad9d", // oklch(0.76 0.032 60)
  "tertiary-fixed": "#decec1", // oklch(0.86 0.025 60)
  "tertiary-fixed-dim": "#c1ad9d", // oklch(0.76 0.032 60)
  "tertiary-container": "#3a2a1f", // oklch(0.3 0.03 55)
  "on-tertiary": "#1a120c", // oklch(0.19 0.018 60)
  "on-tertiary-fixed": "#21150c", // oklch(0.21 0.026 60)
  "on-tertiary-fixed-variant": "#43352a", // oklch(0.34 0.028 58)
  "on-tertiary-container": "#e4d4c7", // oklch(0.88 0.025 60)
};

/** State ramp. Hue and lightness both separate, so states read without colour. */
const state: ColorScale = {
  success: "#50d2a7", // oklch(0.78 0.13 168)
  "success-container": "#003928", // oklch(0.3 0.07 170)
  warning: "#f0d94f", // oklch(0.88 0.155 100)
  error: "#fd617f", // oklch(0.7 0.19 12)
  "error-container": "#52011a", // oklch(0.28 0.11 12)
  "on-error": "#fff6f6", // oklch(0.98 0.01 20)
  "on-error-container": "#ffc0bf", // oklch(0.87 0.08 20)
};

/** Boundaries. `divider` and `outline-variant` clear Lc 32 for 1px structure. */
const boundary: ColorScale = {
  outline: "#8f999b", // oklch(0.675 0.012 215)
  "outline-variant": "#475053", // oklch(0.425 0.013 215)
  divider: "#4c5658", // oklch(0.445 0.013 215)
};

/** Light-on-dark swaps, for content that sits on an inverted panel. */
const inverse: ColorScale = {
  "inverse-surface": "#edf1f2", // oklch(0.955 0.005 215)
  "inverse-on-surface": "#141c1e", // oklch(0.22 0.012 215)
};

/**
 * Chart categories. Kept out of the brand roles on purpose: a categorical series
 * needs hues that are far apart from each other, which is the opposite of what
 * the UI accents need. Import `dataViz` in chart components instead of
 * hardcoding hexes, so this stays the one place a colour is written down.
 */
const dataViz: ColorScale = {
  "data-1": "#ff9c5e", // oklch(0.8 0.155 48)   ember
  "data-2": "#79c2e7", // oklch(0.78 0.09 232)  azure
  "data-3": "#50d2a7", // oklch(0.78 0.13 168)  jade
  "data-4": "#c39dee", // oklch(0.76 0.12 305)  lilac
  "data-5": "#f6cc52", // oklch(0.86 0.145 90)  gold
};

export const colorGroups = {
  surface,
  content,
  primary,
  secondary,
  tertiary,
  state,
  boundary,
  inverse,
  dataViz,
} as const;

export type ColorGroup = keyof typeof colorGroups;
export type ColorRole = keyof (typeof colorGroups)[ColorGroup];

export interface Theme {
  name: string;
  colors: Record<string, string>;
}

/**
 * Flatten the groups into the flat `Record<string, string>` Tailwind expects.
 * Flat keys are what make the opacity modifier work, so `bg-primary/10` and
 * `ring-error/70` keep resolving as colour values rather than CSS variables.
 *
 * The `data-*` group is excluded: chart series read them as imported constants,
 * and emitting `bg-data-1` utilities for them would only invite drift.
 */
export const ember: Theme = {
  name: "ember",
  colors: Object.assign({}, ...Object.values(colorGroups).filter((g) => g !== dataViz)),
};

/** The palette Tailwind compiles against. Swap here to re-key the product. */
export const theme: Theme = ember;

/** Chart series colours, keyed by role. */
export const charts = dataViz;
