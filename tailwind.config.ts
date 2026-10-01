import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Deep Forest Green (Primary)
        forest: {
          50: "#F0F7F4",
          100: "#D8F3DC",
          200: "#B7E4C7",
          300: "#95D5B2",
          400: "#74C69D",
          500: "#52B788",
          600: "#40916C",
          700: "#2D6A4F",
          800: "#1B4332", // Primary Forest Green
          900: "#143326",
          950: "#0B1C15",
        },
        // Warm Cream / Off-White (Backgrounds & Cards)
        cream: {
          50: "#FDFCF9",
          100: "#FBF9F4", // Warm Cream Background
          200: "#F5F1E6", // Sub-layer Cream
          300: "#ECE4D2",
          400: "#DFD3BA",
          500: "#C7B89A",
          600: "#9E8E70",
          700: "#7A6B52",
        },
        // Soft Green / Sage (Secondary)
        sage: {
          50: "#F4FAF6",
          100: "#E3F3EA",
          200: "#C7E8D5",
          300: "#9FD7B9",
          400: "#74C69D",
          500: "#52B788",
          600: "#40916C",
          700: "#2D6A4F",
        },
        // Dark Green / Charcoal (Text)
        charcoal: {
          50: "#F4F6F5",
          100: "#E5E9E7",
          200: "#CCD4D0",
          300: "#AAB6B0",
          400: "#6C8677",
          500: "#496355",
          600: "#33493D",
          700: "#24382E",
          800: "#1B2F25",
          900: "#13231B", // Primary text
          950: "#0A140F",
        },
        // Brand palette mapped to Green + Cream
        brand: {
          50: "#F0F7F4",
          100: "#D8F3DC",
          200: "#B7E4C7",
          300: "#95D5B2",
          400: "#74C69D",
          500: "#52B788",
          600: "#40916C",
          700: "#2D6A4F",
          800: "#1B4332",
          900: "#143326",
          950: "#0B1C15",
        },
        // Remap indigo classes to forest green so legacy utility classes automatically harmonize
        indigo: {
          50: "#F0F7F4",
          100: "#D8F3DC",
          200: "#B7E4C7",
          300: "#95D5B2",
          400: "#74C69D",
          500: "#52B788",
          600: "#2D6A4F",
          700: "#1B4332",
          800: "#143326",
          900: "#0F261C",
          950: "#0B1C15",
        },
        // Remap cyan classes to soft mint / sage accents
        cyan: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#74C69D",
          500: "#52B788",
          600: "#2D6A4F",
          700: "#1B4332",
          800: "#143326",
          900: "#0F261C",
          950: "#0B1C15",
        },
        cyber: {
          cyan: "#52B788",
          violet: "#2D6A4F",
          emerald: "#1B4332",
          rose: "#e11d48",
          amber: "#f59e0b",
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "gradient-x": "gradientX 8s ease infinite",
        "float": "float 4s ease-in-out infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        gradientX: {
          "0%, 100%": { "background-size": "200% 200%", "background-position": "left center" },
          "50%": { "background-size": "200% 200%", "background-position": "right center" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
