import type { Config } from "tailwindcss";

import { cssVarColors } from "./src/lib/theme";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}", "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Every colour comes from src/lib/theme.ts, resolved through the
      // `--role` custom properties that layout.tsx emits. Nothing here holds a
      // colour literal, so re-keying the product is a one-file edit and
      // switching palettes at runtime is one attribute on <html>.
      colors: cssVarColors,
      fontFamily: {
        headline: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        label: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        sm: "0.125rem",
        md: "0.375rem",
        lg: "0.25rem",
        xl: "0.75rem",
        "2xl": "1rem",
        full: "9999px",
      },
      letterSpacing: {
        tighter: "-0.04em",
      },
    },
  },
  plugins: [],
};

export default config;
