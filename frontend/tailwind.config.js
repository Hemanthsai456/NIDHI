/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        zinc: {
          50: "hsl(var(--zinc-50) / <alpha-value>)",
          100: "hsl(var(--zinc-100) / <alpha-value>)",
          150: "hsl(var(--zinc-150) / <alpha-value>)",
          200: "hsl(var(--zinc-200) / <alpha-value>)",
          250: "hsl(var(--zinc-250) / <alpha-value>)",
          300: "hsl(var(--zinc-300) / <alpha-value>)",
          350: "hsl(var(--zinc-350) / <alpha-value>)",
          400: "hsl(var(--zinc-400) / <alpha-value>)",
          450: "hsl(var(--zinc-450) / <alpha-value>)",
          500: "hsl(var(--zinc-500) / <alpha-value>)",
          600: "hsl(var(--zinc-600) / <alpha-value>)",
          650: "hsl(var(--zinc-650) / <alpha-value>)",
          700: "hsl(var(--zinc-700) / <alpha-value>)",
          750: "hsl(var(--zinc-750) / <alpha-value>)",
          800: "hsl(var(--zinc-800) / <alpha-value>)",
          850: "hsl(var(--zinc-850) / <alpha-value>)",
          900: "hsl(var(--zinc-900) / <alpha-value>)",
          950: "hsl(var(--zinc-950) / <alpha-value>)",
        },
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}
