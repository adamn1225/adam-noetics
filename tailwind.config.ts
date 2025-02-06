import type { Config } from "tailwindcss";

export default {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary, theme('colors.teal.500'))",
        secondary: "var(--secondary, theme('colors.blue.500'))",
        foreground: "var(--foreground, theme('colors.teal.300'))",
        background: "var(--background)",
      },
    },
  },
  plugins: [],
} satisfies Config;