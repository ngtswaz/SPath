import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic names — re-theme by editing values here only.
        ink: "#26201B",
        bone: "#FAF8F4",
        cream: "#F7F2EA",
        terracotta: {
          DEFAULT: "#C0532E",
          dark: "#9E411F",
        },
        sandstone: "#E0C9A6",
        amber: "#E8A23D",
        trail: "#2E6E5B",
        burgundy: "#7A2E33",
        night: "#15110E",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "ui-serif", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightish: "-0.02em",
      },
      keyframes: {
        "path-draw": {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        // Geometry-independent trace: paired with the SVG `pathLength={1}`
        // attribute so a dash of exactly 1 unit always covers the whole
        // line, whatever its actual rendered length is. Avoids guessing a
        // dasharray number per path (the bug that left path-draw partially
        // invisible when reused on a differently-sized path).
        "path-trace": {
          "0%": { strokeDashoffset: "1" },
          "100%": { strokeDashoffset: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "path-draw": "path-draw 1.1s ease-out forwards",
        "path-trace": "path-trace 1.1s ease-out forwards",
        "fade-up": "fade-up 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
