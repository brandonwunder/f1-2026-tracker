import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'f1-dark': '#15151E',
        'f1-surface': '#1F1F2B',
        'f1-surface-hover': '#2A2A3A',
        'f1-red': '#E10600',
        'f1-border': '#2E2E3E',
        'f1-muted': '#8B8B9E',
      },
    },
  },
  plugins: [],
};
export default config;
