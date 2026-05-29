import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-cormorant)', 'Cormorant Garamond', 'Georgia', 'serif'],
        body: ['var(--font-jost)', 'Jost', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: "var(--color-bg)",
        foreground: "var(--color-text)",
        brand: {
          DEFAULT: 'var(--color-primary)',
          gold: 'var(--color-secondary)',
        },
        luxury: {
          green: '#1a3a2a',
          gold: '#c9a84c',
          cream: '#faf8f4',
          'cream-alt': '#f3ede3',
          border: '#e8e0d4',
        },
      },
    },
  },
  plugins: [],
};
export default config;
