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
        heading: ['var(--font-jost)', 'Inter', 'system-ui', 'sans-serif'],
        body: ['var(--font-jost)', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: "var(--color-bg)",
        foreground: "var(--color-text)",
        brand: {
          DEFAULT: 'var(--button-color)',
          accent: 'var(--accent-color)',
        },
      },
    },
  },
  plugins: [],
};
export default config;
