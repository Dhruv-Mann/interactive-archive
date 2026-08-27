/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/components/**/*.{js,vue,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/plugins/**/*.{js,ts}",
    "./app/app.vue",
    "./genz/**/*.{js,vue,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'root': '#FAFAF7',
        'surface-dark': '#1A1A1A',
        'surface-mid': '#2A2A2A',
        'surface-light': '#F0EFEB',
        'accent': '#8B5E3C',
        'accent-hover': '#A0724E',
        'text-primary': '#1A1A1A',
        'text-light': '#FAFAF7',
        'border-subtle': 'rgba(26,26,26,0.08)',
        'border-dark': 'rgba(250,250,247,0.10)',
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee-reverse 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
  plugins: [],
}
