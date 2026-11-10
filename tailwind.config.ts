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
        // Semantic names. Re-theme by editing values here only.
        ink: "#26201B",
        bone: "#FAF8F4",
        cream: "#F7F2EA",
        // The one accent. Its three shades are CSS variables (see globals.css)
        // so the whole product changes colour from a single place.
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          dark: "rgb(var(--accent-dark) / <alpha-value>)",
          deep: "rgb(var(--accent-deep) / <alpha-value>)",
        },
        sandstone: "#E0C9A6",
        sand: "#8A7350",
        trail: "#2E6E5B",
        burgundy: "#7A2E33",
        night: "#15110E",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "ui-serif", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        // Reserved for things that really float: the hero search bar, sticky bars, menus.
        float: "0 1px 2px rgba(38,32,27,0.06), 0 12px 32px -12px rgba(38,32,27,0.22)",
      },
      letterSpacing: {
        tightish: "-0.02em",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "route-bar": {
          "0%": { transform: "scaleX(0)", opacity: "1" },
          "70%": { transform: "scaleX(1)", opacity: "1" },
          "100%": { transform: "scaleX(1)", opacity: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.35s ease-out both",
        "route-bar": "route-bar 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
