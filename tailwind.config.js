/** @type {import('tailwindcss').Config} */
import { createPreset } from 'tailwindcss-shadcn-ui'

const shadcnPreset = createPreset()

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  presets: [shadcnPreset],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          900: '#312e81',
        },
        accent: '#8b5cf6',
        background: {
          light: 'linear-gradient(to right, #1e3a8a, #4338ca, #6d28d9)',
          dark: 'linear-gradient(to right, #111827, #1f2937, #374151)',
        },
      },
      boxShadow: {
        deep: '0 8px 24px rgba(0,0,0,0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
