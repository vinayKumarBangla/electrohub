import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
        },
        dark: {
          50: '#F5F5F7',
          100: '#E4E4E7',
          500: '#52525B',
          800: '#18181B',
          900: '#0F0F12',
        },
        success: colors.emerald,
        warning: colors.amber,
        error: colors.red,
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 12px 34px -10px rgba(0, 0, 0, 0.08)',
        'subtle': '0 2px 6px rgba(0, 0, 0, 0.02)',
      },
    },
  },
  plugins: [],
};
export default config;