/**
 * Theme: single source of truth for every colour in the product.
 *
 * `tailwind.config.ts` imports `cssVarColors` from this file and `themeCss()`
 * emits the matching custom properties into the document, so every colour class
 * used in the app resolves from here. Nothing else should hold a colour literal.
 *
 * This module holds **the palette that ships**. Candidate palettes live in
 * `src/lib/palette-candidates.ts` and are a local-only comparison tool; keeping
 * them in a separate module is what stops them reaching a production payload.
 *
 * ## The palette: EMBER
 *
 * A warm signal on cool graphite ink. The previous accent was signal lime;
 * ember replaces it. The neutrals did not move, and that is the point: the ink
 * ladder carries the surface, the accent carries the voice.
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
 * ## Why a CSS-variable layer
 *
 * Tailwind v3 compiles a hex to a fixed `rgb(...)`, so a palette could never
 * move the UI at runtime. Every role is therefore published as a channel triple
 * (`--primary: 255 156 94`) and Tailwind resolves
 * `rgb(var(--primary) / <alpha-value>)`. Two things fall out of that:
 *
 * - Switching palette is a single `data-theme` attribute on `<html>`.
 * - The opacity modifier keeps working, so `bg-primary/10` is real alpha rather
 *   than a hardcoded eight-digit hex.
 *
 * Each hex below is the sRGB rendering of the OKLCH triple in its comment. The
 * palette is authored in OKLCH because it is perceptually uniform: equal `L`
 * steps look equal, and hue is stated directly instead of inferred from RGB.
 *
 * ## The rules that hold the palette together
 *
 * - **Descending lightness across chromatic roles.** Warning `.880` is the
 *   lightest, error `.700` the darkest, with secondary and success on `.780`.
 *   This is what keeps the accent set legible in grayscale and under
 *   deuteranopia, where ember and error both collapse toward yellow.
 * - **Warm accents read optically thinner on a dark ground than cool ones**, so
 *   `primary` sits at `L 0.800` rather than higher, and `on-primary` is pushed
 *   down to `L 0.110` to hold the button label above `Lc 75`.
 * - **One job per role.** Primary is structure, secondary is a signal, tertiary
 *   is supporting status, the state ramp is status. Never let two roles share a
 *   block as competing accents.
 * - **No pure black, no pure white.** `on-surface` is `.955`, `on-error` `.98`.
 *
 * ## Measured contrast, WCAG ratio / APCA `Lc`, against the surface it renders on
 *
 * | Pair                                |    WCAG |    Lc |
 * | ----------------------------------- | ------ | ----- |
 * | `on-surface` on `surface`           |  16.48 |  94.4 |
 * | `on-surface` on `surface-container` |  14.03 |  82.2 |
 * | `on-surface-variant` on `surface`   |  11.87 |  81.8 |
 * | `content-muted` on `surface`        |  10.09 |  76.0 |
 * | `content-subtle` on `surface`       |   6.42 |  61.2 |
 * | `primary` on `surface`              |   9.08 |  72.3 |
 * | `secondary` on `surface`            |   9.44 |  73.6 |
 * | `tertiary` on `surface`             |   6.96 |  64.4 |
 * | `success` on `surface`              |   9.92 |  75.4 |
 * | `warning` on `surface`              |  13.16 |  85.6 |
 * | `error` on `surface`                |   6.42 |  61.1 |
 * | `on-primary` on `primary`           |   9.94 |  81.6 |
 * | `divider` on `surface`              |   2.48 |  34.3 |
 * | `outline-variant` on `surface`      |   2.27 |  31.9 |
 *
 * Body text wants `Lc` 75, labels and links 60, UI boundaries 30. Re-measure
 * this table if you re-key the palette; `palette-candidates.ts` carries the same
 * measurement for all three.
 */

export interface ColorScale {
  [role: string]: string;
}

export type ColorGroups = {
  surface: ColorScale;
  content: ColorScale;
  primary: ColorScale;
  secondary: ColorScale;
  tertiary: ColorScale;
  state: ColorScale;
  boundary: ColorScale;
  inverse: ColorScale;
  dataViz: ColorScale;
};

export interface Palette {
  /** Short name for the picker. The lookup key is the identifier. */
  label: string;
  /** One line, shown as the picker tooltip. */
  blurb: string;
  /** Why the palette exists, for whoever re-keys it next. */
  story: string;
  colors: ColorGroups;
}

/** A palette is identified by its key, so the name is not stored twice. */
export type PaletteName = string;

export const defaultPaletteName: PaletteName = "ember";

/**
 * The palette that ships.
 *
 * Deliberately a standalone literal rather than an entry in a map of candidates:
 * a reference into a shared object keeps every candidate alive in the client
 * bundle, and the candidates are a local-only exploration tool that has no
 * business being in a production payload. See `src/lib/palette-candidates.ts`.
 */
export const defaultPalette: Palette = {
  label: "Ember",
  blurb:
    "Warm signal on cool graphite ink. The shipped default.",
  story:
    "Ink sits at hue 215 with chroma 0.010-0.013, which is what lets a warm accent separate cleanly instead of vibrating. Ember carries structure and stays under 10% of any surface; azure is the cool counterweight that stops the page going monochrome warm.",
  colors: {
    surface: {
      "surface-container-lowest": "#070c0e", // oklch(0.15 0.01 215)
      "surface-dim": "#0d1314", // oklch(0.18 0.01 215)
      surface: "#0d1314", // oklch(0.18 0.01 215)
      background: "#0d1314", // oklch(0.18 0.01 215)
      "surface-container-low": "#131a1b", // oklch(0.21 0.01 215)
      "surface-container": "#1c2325", // oklch(0.25 0.01 215)
      "surface-overlay": "#232a2c", // oklch(0.28 0.01 215)
      "surface-container-high": "#272e30", // oklch(0.295 0.01 215)
      "surface-container-highest": "#31383a", // oklch(0.335 0.01 215)
      "surface-variant": "#31383a", // oklch(0.335 0.01 215)
      "surface-bright": "#3e4547", // oklch(0.385 0.01 215)
      "surface-tint": "#ff9c5e", // oklch(0.8 0.155 48)
    },
    content: {
      "on-surface": "#edf1f2", // oklch(0.955 0.005 215)
      "on-background": "#edf1f2", // oklch(0.955 0.005 215)
      "on-surface-variant": "#c8cfd1", // oklch(0.85 0.009 215)
      "content-muted": "#b6c0c2", // oklch(0.8 0.011 215)
      "content-subtle": "#8f999b", // oklch(0.675 0.012 215)
    },
    primary: {
      primary: "#ff9c5e", // oklch(0.8 0.155 48)
      "primary-fixed": "#ffc79a", // oklch(0.89 0.10540000000000001 52)
      "primary-fixed-dim": "#ff9c5e", // oklch(0.8 0.155 48)
      "primary-container": "#511900", // oklch(0.3 0.0899 42)
      "on-primary": "#0b0200", // oklch(0.11 0.027899999999999998 48)
      "on-primary-fixed": "#281308", // oklch(0.215 0.0403 48)
      "on-primary-fixed-variant": "#884626", // oklch(0.47 0.10075 45)
      "on-primary-container": "#ffca9a", // oklch(0.9 0.11005 52)
      "inverse-primary": "#93431a", // oklch(0.48 0.11935 45)
      "focus-ring": "#ff9c5e", // oklch(0.8 0.155 48)
    },
    secondary: {
      secondary: "#8bbee3", // oklch(0.78 0.075 240)
      "secondary-fixed": "#b4daf5", // oklch(0.87 0.05475 240)
      "secondary-fixed-dim": "#8bbee3", // oklch(0.78 0.075 240)
      "secondary-container": "#153045", // oklch(0.3 0.05025 244)
      "on-secondary": "#0b151c", // oklch(0.19 0.02025 240)
      "on-secondary-fixed": "#0a1a25", // oklch(0.21 0.03 240)
      "on-secondary-fixed-variant": "#223b4d", // oklch(0.34 0.045 242)
      "on-secondary-container": "#bedcf3", // oklch(0.88 0.045 240)
    },
    tertiary: {
      tertiary: "#ae9a8b", // oklch(0.7 0.032 60)
      "tertiary-fixed": "#decec1", // oklch(0.86 0.024960000000000003 60)
      "tertiary-fixed-dim": "#ae9a8b", // oklch(0.7 0.032 60)
      "tertiary-container": "#3a2a1f", // oklch(0.3 0.03008 55)
      "on-tertiary": "#1a120c", // oklch(0.19 0.017920000000000002 60)
      "on-tertiary-fixed": "#21150c", // oklch(0.21 0.025920000000000002 60)
      "on-tertiary-fixed-variant": "#43342a", // oklch(0.34 0.02816 58)
      "on-tertiary-container": "#e4d4c8", // oklch(0.88 0.024960000000000003 60)
    },
    state: {
      success: "#50d2a7", // oklch(0.78 0.13 168)
      "success-container": "#003928", // oklch(0.3 0.07 170)
      warning: "#f0d94f", // oklch(0.88 0.155 100)
      error: "#fd617f", // oklch(0.7 0.19 12)
      "error-container": "#52011a", // oklch(0.28 0.11 12)
      "on-error": "#fff6f6", // oklch(0.98 0.01 20)
      "on-error-container": "#ffc0bf", // oklch(0.87 0.08 20)
    },
    boundary: {
      outline: "#8f999b", // oklch(0.675 0.012 215)
      "outline-variant": "#475053", // oklch(0.425 0.013 215)
      divider: "#4c5658", // oklch(0.445 0.013 215)
    },
    inverse: {
      "inverse-surface": "#edf1f2", // oklch(0.955 0.005 215)
      "inverse-on-surface": "#141c1e", // oklch(0.22 0.012 215)
    },
    dataViz: {
      "data-1": "#ff9c5e", // oklch(0.8 0.155 48)
      "data-2": "#79c2e7", // oklch(0.78 0.09 232)
      "data-3": "#50d2a7", // oklch(0.78 0.13 168)
      "data-4": "#c39dee", // oklch(0.76 0.12 305)
      "data-5": "#f6cc52", // oklch(0.86 0.145 90)
    },
  },
};

export const colorGroups: ColorGroups = defaultPalette.colors;

export type ColorGroup = keyof ColorGroups;
export type ColorRole = keyof ColorGroups[ColorGroup];

export interface Theme {
  name: string;
  colors: Record<string, string>;
}

/**
 * Flatten the groups into the flat `Record<string, string>` role map.
 *
 * The `data-*` group is excluded from Tailwind: chart series read them through
 * `themeVar()` so they follow the active palette, and emitting `bg-data-1`
 * utilities for them would only invite drift.
 */
export function flattenColors(palette: Palette): Record<string, string> {
  return Object.assign(
    {},
    ...Object.values(palette.colors).filter((g) => g !== palette.colors.dataViz),
  );
}

/** The default palette, flattened. Kept for the non-runtime consumers. */
export const theme: Theme = {
  name: defaultPaletteName,
  colors: flattenColors(defaultPalette),
};

/** Default-palette chart series, for contexts with no CSS available. */
export const charts: ColorScale = defaultPalette.colors.dataViz;

/** `#ff9c5e` to `255 156 94`, the form `rgb(var(--x))` needs. */
function toChannels(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/**
 * A live colour reference for a role. Use this wherever a role reaches a
 * non-Tailwind consumer, so the value follows the active palette:
 *
 *     fill={themeVar("data-1")}
 *     backgroundColor={themeVarAlpha("error", 0.125)}
 *
 * `var()` resolves in SVG presentation attributes, so this is safe inside
 * recharts elements.
 */
export function themeVar(role: string): string {
  return `rgb(var(--${role}))`;
}

/** As `themeVar`, with an explicit alpha, replacing the `${hex}20` habit. */
export function themeVarAlpha(role: string, alpha: number): string {
  return `rgb(var(--${role}) / ${alpha})`;
}

/** Every role name, chart series included. */
const allRoles: string[] = Object.values(defaultPalette.colors).flatMap((g) => Object.keys(g));

let resolvedCache: { key: string; channels: Record<string, string> } | null = null;

/**
 * Resolve a role to RGB channels against the palette currently on `<html>`.
 *
 * The canvas is the one consumer that cannot use `var()`: `CanvasRenderingContext2D`
 * takes a colour string, not a reference. Reading the computed value is the only
 * honest way to theme it, so the read is cached per `data-theme` value and the
 * animation frame loop pays nothing after the first frame of a switch.
 */
function resolvedChannels(role: string): string {
  if (typeof document === "undefined") {
    const flat = flattenColors(defaultPalette);
    return toChannels(flat[role] ?? defaultPalette.colors.dataViz[role]);
  }
  const key = document.documentElement.getAttribute("data-theme") ?? "";
  if (!resolvedCache || resolvedCache.key !== key) {
    const computed = getComputedStyle(document.documentElement);
    const channels: Record<string, string> = {};
    for (const name of allRoles) channels[name] = computed.getPropertyValue(`--${name}`).trim();
    resolvedCache = { key, channels };
  }
  return resolvedCache.channels[role] || resolvedCache.channels.primary;
}

/**
 * A resolved `rgba()` string for a role, for consumers that cannot hold a CSS
 * reference. Alpha is passed explicitly because that is the whole point.
 */
export function themeRgba(role: string, alpha: number): string {
  return `rgba(${resolvedChannels(role).replace(/\s+/g, ", ")}, ${alpha})`;
}

/**
 * What Tailwind compiles against. The `<alpha-value>` placeholder is what keeps
 * `bg-primary/10` and `ring-error/70` real alpha, so the colour map stays a map
 * of colours rather than a bag of literal strings.
 */
export const cssVarColors: Record<string, string> = Object.fromEntries(
  Object.keys(theme.colors).map((role) => [role, `rgb(var(--${role}) / <alpha-value>)`]),
);

/**
 * Emit the custom properties for one palette.
 *
 * `data-*` roles are included, which is what lets the charts re-theme alongside
 * the rest of the UI.
 */
function paletteBlock(palette: Palette, scope: string): string {
  const flat = flattenColors(palette);
  const roles = [...Object.keys(flat), ...Object.keys(palette.colors.dataViz)];
  const body = roles.map(
    (role) => `  --${role}: ${toChannels(flat[role] ?? palette.colors.dataViz[role])};`,
  );
  return `${scope} {\n${body.join("\n")}\n}`;
}

/**
 * The stylesheet half of the theme layer.
 *
 * Called from the root layout with the palettes to publish. The shipped palette
 * always goes on `:root`; the candidates are only requested in local dev, so a
 * production document never contains them and cannot be switched even by hand.
 */
export function themeCss(lookup: Record<PaletteName, Palette>): string {
  return Object.entries(lookup)
    .map(([name, palette]) =>
      name === defaultPaletteName
        ? paletteBlock(palette, ":root")
        : paletteBlock(palette, `:root[data-theme="${name}"]`),
    )
    .join("\n");
}

/** The storage key `ThemePicker` and `themeInitScript` both agree on. */
export const themeStorageKey = "site-theme";

/**
 * Apply a stored palette before first paint.
 *
 * Goes in `<head>` and runs ahead of the body, otherwise a stored non-default
 * palette flashes the default during hydration. Guarded by the caller: in
 * production there is nothing to restore, so the script is not emitted at all.
 */
export function themeInitScript(names: readonly PaletteName[]): string {
  // The brackets matter: without them `a` becomes the last name rather than a
  // list, and every other palette silently fails to restore.
  const allowed = names.map((n) => JSON.stringify(n)).join(",");
  return `(function(){try{var k=${JSON.stringify(themeStorageKey)},a=[${allowed}],t=localStorage.getItem(k);if(t&&a.indexOf(t)>-1&&t!==document.documentElement.getAttribute("data-theme"))document.documentElement.setAttribute("data-theme",t)}catch(e){}})();`;
}
