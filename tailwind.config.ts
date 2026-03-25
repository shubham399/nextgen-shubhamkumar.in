import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}", "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Surface hierarchy (darkest → lightest)
        "surface-tint": "#47d6ff",
        "surface-container-highest": "#353534",
        "surface-container-high": "#2a2a2a",
        "surface-container": "#201f1f",
        "surface-container-low": "#1c1b1b",
        "surface-container-lowest": "#0e0e0e",
        "surface-variant": "#353534",
        "surface-bright": "#3a3939",
        "surface-dim": "#131313",
        surface: "#131313",
        background: "#131313",
        // On-surface
        "on-surface": "#e5e2e1",
        "on-surface-variant": "#bbc9cf",
        "on-background": "#e5e2e1",
        // Primary (cyan / teal)
        "primary-fixed": "#b6ebff",
        "primary-fixed-dim": "#47d6ff",
        primary: "#a5e7ff",
        "primary-container": "#00d2ff",
        "on-primary": "#003543",
        "on-primary-fixed": "#001f28",
        "on-primary-fixed-variant": "#004e60",
        "on-primary-container": "#00566a",
        "inverse-primary": "#00677f",
        // Secondary
        "secondary-fixed": "#acecff",
        "secondary-fixed-dim": "#6fd4ee",
        secondary: "#6fd4ee",
        "secondary-container": "#2d9db6",
        "on-secondary": "#003640",
        "on-secondary-fixed": "#001f26",
        "on-secondary-fixed-variant": "#004e5c",
        "on-secondary-container": "#002e38",
        // Tertiary
        "tertiary-fixed": "#c0e8ff",
        "tertiary-fixed-dim": "#7bd1fa",
        tertiary: "#b3e4ff",
        "tertiary-container": "#76ccf5",
        "on-tertiary": "#003547",
        "on-tertiary-fixed": "#001e2b",
        "on-tertiary-fixed-variant": "#004d66",
        "on-tertiary-container": "#005671",
        // Error
        error: "#ffb4ab",
        "error-container": "#93000a",
        "on-error": "#690005",
        "on-error-container": "#ffdad6",
        // Misc
        outline: "#859399",
        "outline-variant": "#3c494e",
        "inverse-surface": "#e5e2e1",
        "inverse-on-surface": "#313030",
      },
      fontFamily: {
        headline: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
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
      boxShadow: {
        glow: "0 0 48px rgba(71,214,255,0.06)",
        "glow-md": "0 0 48px rgba(71,214,255,0.12)",
        "glow-lg": "0 0 64px rgba(71,214,255,0.18)",
      },
      backgroundImage: {
        "primary-gradient":
          "linear-gradient(135deg, #a5e7ff 0%, #00d2ff 100%)",
        "primary-gradient-subtle":
          "linear-gradient(135deg, rgba(165,231,255,0.15) 0%, rgba(0,210,255,0.15) 100%)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "draw-line": "drawLine 1.2s ease forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        drawLine: {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
