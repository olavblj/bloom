import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: {
          50: "#FDFBF7",
          100: "#FAF6F0",
          200: "#F0E8DC",
          300: "#E2D5C4",
          400: "#C9B8A4",
          500: "#A8947E",
          600: "#8B7762",
          700: "#6E5D4C",
          800: "#4A3F34",
          900: "#2C2520",
          950: "#1A1612",
        },
        sage: {
          50: "#F4F7F4",
          100: "#E4EDE4",
          200: "#C8DBC8",
          300: "#A3C4A3",
          400: "#7BAE7F",
          500: "#5B8C5A",
          600: "#467045",
          700: "#385A38",
          800: "#2D482D",
          900: "#253C25",
        },
        terracotta: {
          50: "#FDF5F2",
          100: "#FAE8E0",
          200: "#F5D0C0",
          300: "#E8B4A0",
          400: "#D4906E",
          500: "#C07050",
          600: "#A85A3C",
          700: "#8B4830",
          800: "#6E3A28",
          900: "#4A2818",
        },
        ink: {
          50: "#F5F4F2",
          100: "#E8E6E2",
          200: "#D1CDC6",
          300: "#B0AAA0",
          400: "#8A8278",
          500: "#6B6358",
          600: "#524B42",
          700: "#3D3830",
          800: "#2A2620",
          900: "#1A1814",
          950: "#0F0E0C",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
