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
      fontFamily: {
        orbitron: ['var(--font-orbitron)', 'monospace'],
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'count-up': 'count-up 0.6s ease-out',
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'holographic': 'holographic 3s ease infinite',
        'light-on': 'light-on 0.3s ease-out forwards',
        'lights-out': 'lights-out 0.2s ease-in forwards',
        'bar-grow': 'bar-grow 1s ease-out forwards',
        'checkered': 'checkered 20s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 15px 0 rgba(225, 6, 0, 0.3)' },
          '50%': { boxShadow: '0 0 30px 5px rgba(225, 6, 0, 0.6)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'count-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'holographic': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'light-on': {
          '0%': { opacity: '0.2', boxShadow: '0 0 0 0 rgba(225, 6, 0, 0)' },
          '100%': { opacity: '1', boxShadow: '0 0 20px 5px rgba(225, 6, 0, 0.5)' },
        },
        'lights-out': {
          '0%': { opacity: '1', boxShadow: '0 0 20px 5px rgba(225, 6, 0, 0.5)' },
          '100%': { opacity: '0.1', boxShadow: '0 0 0 0 rgba(225, 6, 0, 0)' },
        },
        'bar-grow': {
          '0%': { width: '0%' },
          '100%': { width: 'var(--bar-width)' },
        },
        'checkered': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 40px' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
