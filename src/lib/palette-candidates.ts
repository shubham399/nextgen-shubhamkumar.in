/**
 * Candidate palettes: the local-only comparison set.
 *
 * Five alternatives to the shipped ember, so a colour decision can be judged
 * side by side instead of in the abstract. `ember` in `src/lib/theme.ts` is the
 * one that ships; nothing here reaches a production payload.
 *
 * ## Why a separate module
 *
 * The shipped palette is a standalone literal in `theme.ts`, and this module
 * imports it rather than the other way round. That direction is the point: a
 * reference into a shared object of palettes keeps every candidate alive in the
 * client bundle, because a minifier cannot split an object literal. Here, the
 * only importers are `ThemePickerControl` and the root layout, both of which
 * are behind a build-time `NODE_ENV` check.
 *
 * ## How the six differ
 *
 * Accent hues sit at least 20 degrees apart across the set, so no two candidates
 * read as the same idea, and at least 100 degrees from their own secondary:
 *
 * | Palette  | Ink                | Primary            | Reads as                    |
 * | -------- | ------------------ | ------------------ | --------------------------- |
 * | `ember`  | h215 cool graphite | `#ff9c5e` orange   | warm signal, the shipped one |
 * | `cobalt` | h218 cool graphite | `#58d3ff` azure    | instrument panel, telemetry |
 * | `noir`   | h62 warm charcoal  | `#ff8374` vermilion| printed broadsheet          |
 * | `jade`   | h205 blue-grey     | `#72d992` green    | calmest, most institutional  |
 * | `orchid` | h250 violet-cast   | `#f290f8` magenta  | loudest, most expressive    |
 * | `lapis`  | h235 cool slate    | `#82b6ff` indigo   | deep blue, dark and quiet   |
 *
 * ## Two decisions that are correctness, not taste
 *
 * - **jade pairs green with blue, not with a warm hue.** Green against salmon
 *   or orange collapses to the same colour under deuteranopia, measured at
 *   deltaE 1.4. Moving the secondary onto the blue axis fixed it.
 * - **orchid pushes its secondary much lighter.** Magenta is not safe under
 *   deuteranopia either, so lightness carries the separation.
 *
 * A known limitation, present in all six including the shipped ember:
 * `success` and `error` sit at deltaE 4.3 under deuteranopia, because they are
 * fixed semantic green and red and no amount of retuning the brand roles moves
 * them. They are always rendered with a label, never as a bare swatch, which is
 * what makes that acceptable. Worth revisiting separately.
 *
 * Authored in OKLCH like the shipped palette, and held to the same thresholds:
 * body text `Lc` 75, labels and links 60, UI boundaries 30. WCAG ratio / APCA
 * `Lc`, measured:
 *
| Pair | ember | cobalt | noir | jade | orchid | lapis |
| --- | --- | --- | --- | --- | --- | --- |
| `on-surface` on `surface` | 16.48 / 94 | 16.49 / 94 | 16.43 / 94 | 16.49 / 95 | 16.47 / 95 | 16.48 / 94 |
| `on-surface` on `surface-container` | 14.03 / 82 | 14.03 / 82 | 13.99 / 82 | 14.04 / 83 | 14.02 / 83 | 14.01 / 82 |
| `on-surface` on `surface-container-highest` | 10.51 / 73 | 10.51 / 73 | 10.48 / 73 | 10.40 / 72 | 10.53 / 73 | 10.52 / 73 |
| `on-surface-variant` on `surface` | 11.87 / 82 | 11.89 / 82 | 11.81 / 82 | 11.87 / 82 | 11.87 / 82 | 11.88 / 82 |
| `content-muted` on `surface` | 10.09 / 76 | 10.10 / 76 | 10.01 / 76 | 10.11 / 76 | 10.06 / 76 | 10.05 / 76 |
| `content-subtle` on `surface` | 6.42 / 61 | 6.43 / 61 | 6.36 / 61 | 6.44 / 61 | 6.38 / 61 | 6.39 / 61 |
| `primary` on `surface` | 9.08 / 72 | 10.88 / 79 | 7.82 / 67 | 10.79 / 78 | 9.06 / 72 | 8.99 / 72 |
| `primary` on `surface-container-low` | 8.54 / 67 | 10.21 / 74 | 7.42 / 63 | 10.14 / 74 | 8.53 / 68 | 8.51 / 68 |
| `secondary` on `surface` | 9.44 / 74 | 8.48 / 70 | 9.71 / 75 | 10.08 / 76 | 13.12 / 86 | 9.14 / 73 |
| `tertiary` on `surface` | 6.96 / 64 | 6.95 / 64 | 7.30 / 65 | 7.04 / 64 | 7.00 / 64 | 6.94 / 64 |
| `success` on `surface` | 9.92 / 75 | 9.93 / 75 | 9.94 / 76 | 9.95 / 76 | 9.95 / 76 | 9.92 / 75 |
| `warning` on `surface` | 13.16 / 86 | 13.17 / 86 | 13.18 / 86 | 13.19 / 86 | 13.20 / 86 | 13.15 / 86 |
| `error` on `surface` | 6.42 / 61 | 6.42 / 61 | 6.43 / 61 | 6.44 / 61 | 6.44 / 61 | 6.42 / 61 |
| `on-primary` on `primary` | 9.94 / 82 | 11.86 / 87 | 8.53 / 76 | 11.72 / 87 | 9.88 / 81 | 9.83 / 81 |
| `on-primary` on `primary-fixed` | 13.58 / 93 | 15.52 / 97 | 11.90 / 87 | 15.47 / 97 | 13.46 / 92 | 13.38 / 92 |
| `outline` on `surface` | 6.42 / 61 | 6.43 / 61 | 6.36 / 61 | 6.44 / 61 | 6.38 / 61 | 6.39 / 61 |
| `outline-variant` on `surface` | 2.27 / 32 | 2.27 / 32 | 2.26 / 32 | 2.30 / 32 | 2.27 / 32 | 2.28 / 32 |
| `divider` on `surface` | 2.48 / 34 | 2.49 / 34 | 2.45 / 34 | 2.48 / 34 | 2.49 / 35 | 2.46 / 34 |
| `inverse-on-surface` on `inverse-surface` | 15.20 / 88 | 15.20 / 88 | 15.21 / 88 | 15.19 / 88 | 15.18 / 88 | 15.17 / 88 |
| `on-primary-container` on `primary-container` | 9.51 / 68 | 9.78 / 69 | 9.06 / 66 | 10.16 / 70 | 9.69 / 68 | 9.78 / 69 |
| `on-secondary-container` on `secondary-container` | 9.56 / 68 | 9.46 / 67 | 9.41 / 67 | 9.58 / 68 | 9.35 / 67 | 9.26 / 67 |
| `on-tertiary-container` on `tertiary-container` | 9.50 / 68 | 9.51 / 68 | 9.49 / 68 | 9.49 / 68 | 9.49 / 68 | 9.54 / 68 |
| `on-error-container` on `error-container` | 9.83 / 67 | 9.83 / 67 | 9.83 / 67 | 9.83 / 67 | 9.83 / 67 | 9.83 / 67 |

Accent hues, kept at least 20 degrees apart across the set so no two candidates
read as the same idea, and at least 100 degrees from their own secondary:

| Palette | Ink | Primary | Secondary | Tertiary | ΔE primary/secondary under deuteranopia |
| --- | --- | --- | --- | --- | --- |
| `ember` | `h215 c0.01` | `#ff9c5e` | `#8bbee3` | `#ae9a8b` | 11.2 |
| `cobalt` | `h218 c0.011` | `#58d3ff` | `#e99e58` | `#a799aa` | 12.4 |
| `noir` | `h62 c0.009` | `#ff8374` | `#76c8c7` | `#a9a18d` | 6.7 |
| `jade` | `h205 c0.012` | `#72d992` | `#86c3ff` | `#a29f8a` | 8.1 |
| `orchid` | `h250 c0.014` | `#f290f8` | `#8ee6ea` | `#ad9b88` | 5.0 |
| `lapis` | `h235 c0.013` | `#82b6ff` | `#ff9d62` | `#ad9a8c` | 13.4 |
 */

import {
  defaultPalette,
  defaultPaletteName,
  themeCss,
  themeInitScript,
  type Palette,
  type PaletteName,
} from "./theme";

export const candidatePalettes: Record<PaletteName, Palette> = {
  cobalt: {
    label: "Cobalt",
    blurb:
      "Bright azure on cool ink, clay as the counterweight.",
    story:
      "Same ink as ember, opposite accent temperature. Azure on graphite reads as instrument panel rather than broadsheet, so this is the lane if the site should feel like telemetry instead of print. Clay keeps the page from going cold, which is also what keeps it clear of the cyan-only trap: the azure is never the only hue on screen.",
    colors: {
      surface: {
        "surface-container-lowest": "#060c0e", // oklch(0.15 0.011 218)
        "surface-dim": "#0c1315", // oklch(0.18 0.011 218)
        surface: "#0c1315", // oklch(0.18 0.011 218)
        background: "#0c1315", // oklch(0.18 0.011 218)
        "surface-container-low": "#131a1c", // oklch(0.21 0.011 218)
        "surface-container": "#1c2325", // oklch(0.25 0.011 218)
        "surface-overlay": "#232a2c", // oklch(0.28 0.011 218)
        "surface-container-high": "#272e30", // oklch(0.295 0.011 218)
        "surface-container-highest": "#31383a", // oklch(0.335 0.011 218)
        "surface-variant": "#31383a", // oklch(0.335 0.011 218)
        "surface-bright": "#3d4548", // oklch(0.385 0.011 218)
        "surface-tint": "#58d3ff", // oklch(0.82 0.135 232)
      },
      content: {
        "on-surface": "#edf1f2", // oklch(0.955 0.005 218)
        "on-background": "#edf1f2", // oklch(0.955 0.005 218)
        "on-surface-variant": "#c8cfd2", // oklch(0.85 0.009 218)
        "content-muted": "#b6c0c2", // oklch(0.8 0.011 218)
        "content-subtle": "#8f999c", // oklch(0.675 0.012 218)
      },
      primary: {
        primary: "#58d3ff", // oklch(0.82 0.135 232)
        "primary-fixed": "#a5ebff", // oklch(0.9099999999999999 0.0918 236)
        "primary-fixed-dim": "#58d3ff", // oklch(0.82 0.135 232)
        "primary-container": "#00344b", // oklch(0.3 0.0783 226)
        "on-primary": "#00050b", // oklch(0.11 0.024300000000000002 232)
        "on-primary-fixed": "#061c27", // oklch(0.215 0.035100000000000006 232)
        "on-primary-fixed-variant": "#0f6482", // oklch(0.47 0.08775000000000001 229)
        "on-primary-container": "#9fe9ff", // oklch(0.9 0.09585 236)
        "inverse-primary": "#00678c", // oklch(0.48 0.10395000000000001 229)
        "focus-ring": "#58d3ff", // oklch(0.82 0.135 232)
      },
      secondary: {
        secondary: "#e99e58", // oklch(0.76 0.125 62)
        "secondary-fixed": "#ffc796", // oklch(0.87 0.09125 62)
        "secondary-fixed-dim": "#e99e58", // oklch(0.76 0.125 62)
        "secondary-container": "#492300", // oklch(0.3 0.08375 66)
        "on-secondary": "#1e1004", // oklch(0.19 0.03375 62)
        "on-secondary-fixed": "#281200", // oklch(0.21 0.05 62)
        "on-secondary-fixed-variant": "#522e02", // oklch(0.34 0.075 64)
        "on-secondary-container": "#fccda5", // oklch(0.88 0.075 62)
      },
      tertiary: {
        tertiary: "#a799aa", // oklch(0.7 0.03 320)
        "tertiary-fixed": "#d8ccdb", // oklch(0.86 0.0234 320)
        "tertiary-fixed-dim": "#a799aa", // oklch(0.7 0.03 320)
        "tertiary-container": "#332a38", // oklch(0.3 0.028199999999999996 315)
        "on-tertiary": "#171119", // oklch(0.19 0.016800000000000002 320)
        "on-tertiary-fixed": "#1d151f", // oklch(0.21 0.024300000000000002 320)
        "on-tertiary-fixed-variant": "#3e3441", // oklch(0.34 0.0264 318)
        "on-tertiary-container": "#dfd3e1", // oklch(0.88 0.0234 320)
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
        outline: "#8f999c", // oklch(0.675 0.012 218)
        "outline-variant": "#475053", // oklch(0.425 0.013 218)
        divider: "#4c5659", // oklch(0.445 0.013 218)
      },
      inverse: {
        "inverse-surface": "#edf1f2", // oklch(0.955 0.005 218)
        "inverse-on-surface": "#141c1e", // oklch(0.22 0.012 218)
      },
      dataViz: {
        "data-1": "#58d3ff", // oklch(0.82 0.135 232)
        "data-2": "#e8ab3e", // oklch(0.78 0.14 78)
        "data-3": "#50d2a7", // oklch(0.78 0.13 168)
        "data-4": "#c39dee", // oklch(0.76 0.12 305)
        "data-5": "#ffa7d6", // oklch(0.84 0.13 350)
      },
    },
  },
  noir: {
    label: "Noir",
    blurb:
      "Vermilion on warm charcoal. A different scene, not a hue swap.",
    story:
      "The candidate that moves the neutrals furthest. Ink at hue 62, so the grays are warm paper rather than cool slate, which changes how every accent reads. Teal against vermilion is a printed-broadsheet pairing. The one to try if the page still feels cold.",
    colors: {
      surface: {
        "surface-container-lowest": "#0e0a08", // oklch(0.15 0.009 62)
        "surface-dim": "#15110e", // oklch(0.18 0.009 62)
        surface: "#15110e", // oklch(0.18 0.009 62)
        background: "#15110e", // oklch(0.18 0.009 62)
        "surface-container-low": "#1b1714", // oklch(0.21 0.009 62)
        "surface-container": "#25211d", // oklch(0.25 0.009 62)
        "surface-overlay": "#2c2824", // oklch(0.28 0.009 62)
        "surface-container-high": "#302c28", // oklch(0.295 0.009 62)
        "surface-container-highest": "#3a3632", // oklch(0.335 0.009 62)
        "surface-variant": "#3a3632", // oklch(0.335 0.009 62)
        "surface-bright": "#47433f", // oklch(0.385 0.009 62)
        "surface-tint": "#ff8374", // oklch(0.765 0.17 28)
      },
      content: {
        "on-surface": "#f3efed", // oklch(0.955 0.005 62)
        "on-background": "#f3efed", // oklch(0.955 0.005 62)
        "on-surface-variant": "#d2ccc8", // oklch(0.85 0.009 62)
        "content-muted": "#c3bcb7", // oklch(0.8 0.011 62)
        "content-subtle": "#9c958f", // oklch(0.675 0.012 62)
      },
      primary: {
        primary: "#ff8374", // oklch(0.765 0.17 28)
        "primary-fixed": "#ffb3a0", // oklch(0.855 0.11560000000000002 32)
        "primary-fixed-dim": "#ff8374", // oklch(0.765 0.17 28)
        "primary-container": "#551116", // oklch(0.3 0.09860000000000001 22)
        "on-primary": "#0d0201", // oklch(0.11 0.030600000000000002 28)
        "on-primary-fixed": "#2b110e", // oklch(0.215 0.0442 28)
        "on-primary-fixed-variant": "#8f3e3a", // oklch(0.47 0.11050000000000001 25)
        "on-primary-container": "#ffc0ac", // oklch(0.9 0.1207 32)
        "inverse-primary": "#9a3936", // oklch(0.48 0.13090000000000002 25)
        "focus-ring": "#ff8374", // oklch(0.765 0.17 28)
      },
      secondary: {
        secondary: "#76c8c7", // oklch(0.78 0.08 195)
        "secondary-fixed": "#a8e1e0", // oklch(0.87 0.0584 195)
        "secondary-fixed-dim": "#76c8c7", // oklch(0.78 0.08 195)
        "secondary-container": "#003638", // oklch(0.3 0.0536 199)
        "on-secondary": "#071717", // oklch(0.19 0.0216 195)
        "on-secondary-fixed": "#031d1d", // oklch(0.21 0.032 195)
        "on-secondary-fixed-variant": "#134040", // oklch(0.34 0.048 197)
        "on-secondary-container": "#b4e2e1", // oklch(0.88 0.048 195)
      },
      tertiary: {
        tertiary: "#a9a18d", // oklch(0.71 0.03 88)
        "tertiary-fixed": "#d7d0c0", // oklch(0.86 0.0234 88)
        "tertiary-fixed-dim": "#a9a18d", // oklch(0.71 0.03 88)
        "tertiary-container": "#352d1d", // oklch(0.3 0.028199999999999996 83)
        "on-tertiary": "#17130b", // oklch(0.19 0.016800000000000002 88)
        "on-tertiary-fixed": "#1d180b", // oklch(0.21 0.024300000000000002 88)
        "on-tertiary-fixed-variant": "#3e3728", // oklch(0.34 0.0264 86)
        "on-tertiary-container": "#ded7c7", // oklch(0.88 0.0234 88)
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
        outline: "#9c958f", // oklch(0.675 0.012 62)
        "outline-variant": "#544d47", // oklch(0.425 0.013 62)
        divider: "#59524d", // oklch(0.445 0.013 62)
      },
      inverse: {
        "inverse-surface": "#f3efed", // oklch(0.955 0.005 62)
        "inverse-on-surface": "#1f1915", // oklch(0.22 0.012 62)
      },
      dataViz: {
        "data-1": "#ff8374", // oklch(0.765 0.17 28)
        "data-2": "#76c8c7", // oklch(0.78 0.08 195)
        "data-3": "#82cd85", // oklch(0.78 0.125 145)
        "data-4": "#c39dee", // oklch(0.76 0.12 305)
        "data-5": "#f5cc58", // oklch(0.86 0.14 90)
      },
    },
  },
  jade: {
    label: "Jade",
    blurb:
      "Green on blue-grey ink. The calmest of the six.",
    story:
      "The lowest-voice accent in the set, and the closest thing here to an institutional green. Its secondary is blue rather than a warm counterweight, which is a correctness decision rather than a taste one: green against any warm hue collapses under deuteranopia, so the pair has to sit on the blue axis instead.",
    colors: {
      surface: {
        "surface-container-lowest": "#060d0e", // oklch(0.15 0.012 205)
        "surface-dim": "#0b1314", // oklch(0.18 0.012 205)
        surface: "#0b1314", // oklch(0.18 0.012 205)
        background: "#0b1314", // oklch(0.18 0.012 205)
        "surface-container-low": "#121a1b", // oklch(0.21 0.012 205)
        "surface-container": "#1b2324", // oklch(0.25 0.012 205)
        "surface-overlay": "#222b2c", // oklch(0.28 0.012 205)
        "surface-container-high": "#262e2f", // oklch(0.295 0.012 205)
        "surface-container-highest": "#30393a", // oklch(0.335 0.012 205)
        "surface-variant": "#30393a", // oklch(0.335 0.012 205)
        "surface-bright": "#3d4647", // oklch(0.385 0.012 205)
        "surface-tint": "#72d992", // oklch(0.805 0.14 152)
      },
      content: {
        "on-surface": "#ecf1f2", // oklch(0.955 0.005 205)
        "on-background": "#ecf1f2", // oklch(0.955 0.005 205)
        "on-surface-variant": "#c7cfd0", // oklch(0.85 0.009 205)
        "content-muted": "#b6c0c1", // oklch(0.8 0.011 205)
        "content-subtle": "#8f999a", // oklch(0.675 0.012 205)
      },
      primary: {
        primary: "#72d992", // oklch(0.805 0.14 152)
        "primary-fixed": "#a8f0c2", // oklch(0.895 0.09520000000000002 156)
        "primary-fixed-dim": "#72d992", // oklch(0.805 0.14 152)
        "primary-container": "#0a3812", // oklch(0.3 0.08120000000000001 146)
        "on-primary": "#010602", // oklch(0.11 0.0252 152)
        "on-primary-fixed": "#0b1e11", // oklch(0.215 0.0364 152)
        "on-primary-fixed-variant": "#31693e", // oklch(0.47 0.09100000000000001 149)
        "on-primary-container": "#a7f2c3", // oklch(0.9 0.0994 156)
        "inverse-primary": "#286e3a", // oklch(0.48 0.1078 149)
        "focus-ring": "#72d992", // oklch(0.805 0.14 152)
      },
      secondary: {
        secondary: "#86c3ff", // oklch(0.8 0.11 250)
        "secondary-fixed": "#acd9ff", // oklch(0.87 0.0803 250)
        "secondary-fixed-dim": "#86c3ff", // oklch(0.8 0.11 250)
        "secondary-container": "#102e52", // oklch(0.3 0.0737 254)
        "on-secondary": "#091521", // oklch(0.19 0.0297 250)
        "on-secondary-fixed": "#07192c", // oklch(0.21 0.044000000000000004 250)
        "on-secondary-fixed-variant": "#1c3959", // oklch(0.34 0.066 252)
        "on-secondary-container": "#b7dcff", // oklch(0.88 0.066 250)
      },
      tertiary: {
        tertiary: "#a29f8a", // oklch(0.7 0.03 100)
        "tertiary-fixed": "#d4d2c0", // oklch(0.86 0.0234 100)
        "tertiary-fixed-dim": "#a29f8a", // oklch(0.7 0.03 100)
        "tertiary-container": "#322e1d", // oklch(0.3 0.028199999999999996 95)
        "on-tertiary": "#15140b", // oklch(0.19 0.016800000000000002 100)
        "on-tertiary-fixed": "#1b190b", // oklch(0.21 0.024300000000000002 100)
        "on-tertiary-fixed-variant": "#3b3828", // oklch(0.34 0.0264 98)
        "on-tertiary-container": "#dbd8c7", // oklch(0.88 0.0234 100)
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
        outline: "#8f999a", // oklch(0.675 0.012 205)
        "outline-variant": "#475152", // oklch(0.425 0.013 205)
        divider: "#4c5657", // oklch(0.445 0.013 205)
      },
      inverse: {
        "inverse-surface": "#ecf1f2", // oklch(0.955 0.005 205)
        "inverse-on-surface": "#141c1d", // oklch(0.22 0.012 205)
      },
      dataViz: {
        "data-1": "#72d992", // oklch(0.805 0.14 152)
        "data-2": "#ff9d62", // oklch(0.8 0.15 48)
        "data-3": "#8db7ff", // oklch(0.78 0.12 262)
        "data-4": "#6ac9ce", // oklch(0.78 0.09 200)
        "data-5": "#f6cc52", // oklch(0.86 0.145 90)
      },
    },
  },
  orchid: {
    label: "Orchid",
    blurb:
      "Magenta on a violet-cast ink. The loudest of the six.",
    story:
      "The most saturated candidate and the one that most changes the register of the page. Magenta is not a safe accent under deuteranopia, so its secondary is pushed to a much lighter teal to keep the two apart on the one axis that survives. Treat it as the expressive option, not the safe one.",
    colors: {
      surface: {
        "surface-container-lowest": "#070c11", // oklch(0.15 0.014 250)
        "surface-dim": "#0d1218", // oklch(0.18 0.014 250)
        surface: "#0d1218", // oklch(0.18 0.014 250)
        background: "#0d1218", // oklch(0.18 0.014 250)
        "surface-container-low": "#13191f", // oklch(0.21 0.014 250)
        "surface-container": "#1d2228", // oklch(0.25 0.014 250)
        "surface-overlay": "#242a30", // oklch(0.28 0.014 250)
        "surface-container-high": "#272d33", // oklch(0.295 0.014 250)
        "surface-container-highest": "#31373e", // oklch(0.335 0.014 250)
        "surface-variant": "#31373e", // oklch(0.335 0.014 250)
        "surface-bright": "#3e444b", // oklch(0.385 0.014 250)
        "surface-tint": "#f290f8", // oklch(0.79 0.175 325)
      },
      content: {
        "on-surface": "#eef0f3", // oklch(0.955 0.005 250)
        "on-background": "#eef0f3", // oklch(0.955 0.005 250)
        "on-surface-variant": "#c9ced3", // oklch(0.85 0.009 250)
        "content-muted": "#b9bec5", // oklch(0.8 0.011 250)
        "content-subtle": "#91979e", // oklch(0.675 0.012 250)
      },
      primary: {
        primary: "#f290f8", // oklch(0.79 0.175 325)
        "primary-fixed": "#ffbbfe", // oklch(0.88 0.119 329)
        "primary-fixed-dim": "#f290f8", // oklch(0.79 0.175 325)
        "primary-container": "#42184d", // oklch(0.3 0.10149999999999999 319)
        "on-primary": "#09020a", // oklch(0.11 0.0315 325)
        "on-primary-fixed": "#241125", // oklch(0.215 0.0455 325)
        "on-primary-fixed-variant": "#784280", // oklch(0.47 0.11374999999999999 322)
        "on-primary-container": "#ffc0ff", // oklch(0.9 0.12424999999999999 329)
        "inverse-primary": "#803f8a", // oklch(0.48 0.13474999999999998 322)
        "focus-ring": "#f290f8", // oklch(0.79 0.175 325)
      },
      secondary: {
        secondary: "#8ee6ea", // oklch(0.87 0.085 200)
        "secondary-fixed": "#a4e1e4", // oklch(0.87 0.06205 200)
        "secondary-fixed-dim": "#8ee6ea", // oklch(0.87 0.085 200)
        "secondary-container": "#00363b", // oklch(0.3 0.05695000000000001 204)
        "on-secondary": "#061718", // oklch(0.19 0.02295 200)
        "on-secondary-fixed": "#011d1e", // oklch(0.21 0.034 200)
        "on-secondary-fixed-variant": "#0e4043", // oklch(0.34 0.051000000000000004 202)
        "on-secondary-container": "#b1e2e5", // oklch(0.88 0.051000000000000004 200)
      },
      tertiary: {
        tertiary: "#ad9b88", // oklch(0.7 0.034 70)
        "tertiary-fixed": "#ddcebf", // oklch(0.86 0.026520000000000002 70)
        "tertiary-fixed-dim": "#ad9b88", // oklch(0.7 0.034 70)
        "tertiary-container": "#392b1d", // oklch(0.3 0.03196 65)
        "on-tertiary": "#19120a", // oklch(0.19 0.019040000000000005 70)
        "on-tertiary-fixed": "#20160a", // oklch(0.21 0.027540000000000005 70)
        "on-tertiary-fixed-variant": "#423527", // oklch(0.34 0.029920000000000002 68)
        "on-tertiary-container": "#e3d5c5", // oklch(0.88 0.026520000000000002 70)
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
        outline: "#91979e", // oklch(0.675 0.012 250)
        "outline-variant": "#494f55", // oklch(0.425 0.013 250)
        divider: "#4f555b", // oklch(0.445 0.013 250)
      },
      inverse: {
        "inverse-surface": "#eef0f3", // oklch(0.955 0.005 250)
        "inverse-on-surface": "#161b20", // oklch(0.22 0.012 250)
      },
      dataViz: {
        "data-1": "#f290f8", // oklch(0.79 0.175 325)
        "data-2": "#70c8cd", // oklch(0.78 0.085 200)
        "data-3": "#d4bf3e", // oklch(0.8 0.145 100)
        "data-4": "#72cf8e", // oklch(0.78 0.13 152)
        "data-5": "#ff9d62", // oklch(0.8 0.15 48)
      },
    },
  },
  lapis: {
    label: "Lapis",
    blurb:
      "Indigo on cool slate, with ember as the counterweight.",
    story:
      "A deep blue rather than a bright one, which is the difference between lapis and cobalt: lapis is dark and quiet, cobalt is light and electric. It borrows ember as its secondary, so the pairing is the reverse of every other candidate here, primary and secondary swapped.",
    colors: {
      surface: {
        "surface-container-lowest": "#060c10", // oklch(0.15 0.013 235)
        "surface-dim": "#0c1317", // oklch(0.18 0.013 235)
        surface: "#0c1317", // oklch(0.18 0.013 235)
        background: "#0c1317", // oklch(0.18 0.013 235)
        "surface-container-low": "#13191d", // oklch(0.21 0.013 235)
        "surface-container": "#1c2327", // oklch(0.25 0.013 235)
        "surface-overlay": "#232a2e", // oklch(0.28 0.013 235)
        "surface-container-high": "#262e32", // oklch(0.295 0.013 235)
        "surface-container-highest": "#30383c", // oklch(0.335 0.013 235)
        "surface-variant": "#30383c", // oklch(0.335 0.013 235)
        "surface-bright": "#3d454a", // oklch(0.385 0.013 235)
        "surface-tint": "#82b6ff", // oklch(0.78 0.15 262)
      },
      content: {
        "on-surface": "#edf1f3", // oklch(0.955 0.005 235)
        "on-background": "#edf1f3", // oklch(0.955 0.005 235)
        "on-surface-variant": "#c8cfd3", // oklch(0.85 0.009 235)
        "content-muted": "#b7bfc4", // oklch(0.8 0.011 235)
        "content-subtle": "#90989d", // oklch(0.675 0.012 235)
      },
      primary: {
        primary: "#82b6ff", // oklch(0.78 0.15 262)
        "primary-fixed": "#b5d3ff", // oklch(0.87 0.10200000000000001 266)
        "primary-fixed-dim": "#82b6ff", // oklch(0.78 0.15 262)
        "primary-container": "#0a2d58", // oklch(0.3 0.087 256)
        "on-primary": "#02040d", // oklch(0.11 0.027 262)
        "on-primary-fixed": "#0f192b", // oklch(0.215 0.039 262)
        "on-primary-fixed-variant": "#385b91", // oklch(0.47 0.0975 259)
        "on-primary-container": "#bdddff", // oklch(0.9 0.1065 266)
        "inverse-primary": "#335d9e", // oklch(0.48 0.11549999999999999 259)
        "focus-ring": "#82b6ff", // oklch(0.78 0.15 262)
      },
      secondary: {
        secondary: "#ff9d62", // oklch(0.8 0.15 48)
        "secondary-fixed": "#ffbe95", // oklch(0.87 0.1095 48)
        "secondary-fixed-dim": "#ff9d62", // oklch(0.8 0.15 48)
        "secondary-container": "#521900", // oklch(0.3 0.1005 52)
        "on-secondary": "#220d04", // oklch(0.19 0.0405 48)
        "on-secondary-fixed": "#2d0d00", // oklch(0.21 0.06 48)
        "on-secondary-fixed-variant": "#5b2700", // oklch(0.34 0.09 50)
        "on-secondary-container": "#ffc6a4", // oklch(0.88 0.09 48)
      },
      tertiary: {
        tertiary: "#ad9a8c", // oklch(0.7 0.03 60)
        "tertiary-fixed": "#ddcec2", // oklch(0.86 0.0234 60)
        "tertiary-fixed-dim": "#ad9a8c", // oklch(0.7 0.03 60)
        "tertiary-container": "#392a20", // oklch(0.3 0.028199999999999996 55)
        "on-tertiary": "#19120c", // oklch(0.19 0.016800000000000002 60)
        "on-tertiary-fixed": "#21160d", // oklch(0.21 0.024300000000000002 60)
        "on-tertiary-fixed-variant": "#43352b", // oklch(0.34 0.0264 58)
        "on-tertiary-container": "#e4d4c9", // oklch(0.88 0.0234 60)
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
        outline: "#90989d", // oklch(0.675 0.012 235)
        "outline-variant": "#485055", // oklch(0.425 0.013 235)
        divider: "#4d555a", // oklch(0.445 0.013 235)
      },
      inverse: {
        "inverse-surface": "#edf1f3", // oklch(0.955 0.005 235)
        "inverse-on-surface": "#151c1f", // oklch(0.22 0.012 235)
      },
      dataViz: {
        "data-1": "#82b6ff", // oklch(0.78 0.15 262)
        "data-2": "#ff9d62", // oklch(0.8 0.15 48)
        "data-3": "#50d2a7", // oklch(0.78 0.13 168)
        "data-4": "#f6cc52", // oklch(0.86 0.145 90)
        "data-5": "#f290f8", // oklch(0.79 0.175 325)
      },
    },
  },
};

export type CandidateName = keyof typeof candidatePalettes;

export const candidateNames = Object.keys(candidatePalettes) as CandidateName[];

/** Every palette, shipped first, in picker order. */
export function allPalettes(): Record<PaletteName, Palette> {
  return { [defaultPaletteName]: defaultPalette, ...candidatePalettes };
}

export function allPaletteNames(): PaletteName[] {
  return [defaultPaletteName, ...candidateNames];
}

/**
 * Custom properties for the shipped palette plus every candidate.
 *
 * The shipped palette lands on `:root`; candidates are scoped to
 * `:root[data-theme=...]` and only become reachable when the picker sets that
 * attribute.
 */
export function allPaletteCss(): string {
  return themeCss(allPalettes());
}

/** The names a stored preference is allowed to resolve to. */
export function allPaletteInitScript(): string {
  return themeInitScript(allPaletteNames());
}
