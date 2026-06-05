import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        sm: "2rem",
        lg: "3rem",
        xl: "4rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        // Brand palette
        cream: {
          DEFAULT: "#F2F0E9",
          50: "#FBFAF7",
          100: "#F7F5EF",
          200: "#F2F0E9",
          300: "#E8E4D8",
          400: "#D9D2BE",
        },
        charcoal: {
          DEFAULT: "#3D3D3D",
          50: "#F4F4F4",
          100: "#E0E0E0",
          200: "#B8B8B8",
          300: "#909090",
          400: "#686868",
          500: "#3D3D3D",
          600: "#2C2C2C",
          700: "#1F1F1F",
        },
        mustard: {
          DEFAULT: "#E8A84C",
          50: "#FBF1DC",
          100: "#F8E5BC",
          200: "#F2D085",
          300: "#ECBC5E",
          400: "#E8A84C",
          500: "#D69238",
          600: "#A66E25",
        },
        terracotta: {
          DEFAULT: "#E57C4A",
          50: "#FBE5D6",
          100: "#F6C6A4",
          200: "#EE9F70",
          300: "#E57C4A",
          400: "#D26033",
          500: "#A84823",
        },
        // shadcn tokens (CSS vars)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        serif: ["var(--font-baskerville)", "Georgia", "serif"],
        sans: ["var(--font-montserrat)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-baskerville)", "Georgia", "serif"],
      },
      fontSize: {
        "display-2xl": ["clamp(3rem, 8vw, 6.5rem)", { lineHeight: "1", letterSpacing: "-0.02em" }],
        "display-xl": ["clamp(2.5rem, 6vw, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2rem, 4.5vw, 3.25rem)", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(1.5rem, 3vw, 2.25rem)", { lineHeight: "1.15" }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        soft: "0 4px 24px -8px rgb(61 61 61 / 0.08), 0 2px 8px -2px rgb(61 61 61 / 0.04)",
        "soft-lg": "0 24px 48px -16px rgb(61 61 61 / 0.12), 0 8px 16px -4px rgb(61 61 61 / 0.06)",
        glow: "0 0 0 1px rgb(232 168 76 / 0.2), 0 12px 32px -8px rgb(232 168 76 / 0.35)",
        "glow-terracotta": "0 0 0 1px rgb(229 124 74 / 0.2), 0 12px 32px -8px rgb(229 124 74 / 0.35)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-from-left": {
          "0%": { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "shimmer-sweep": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "page-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.8s ease-out forwards",
        "slide-in-from-left": "slide-in-from-left 0.8s ease-out forwards",
        marquee: "marquee 40s linear infinite",
        shimmer: "shimmer 2s linear infinite",
        "shimmer-sweep": "shimmer-sweep 1.6s ease-in-out infinite",
        "page-in": "page-in 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
        "pulse-soft": "pulse-soft 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
