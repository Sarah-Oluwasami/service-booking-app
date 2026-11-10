/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          // Deep burgundy (primary)
          50: '#FBEEF1',
          100: '#F5D5DC',
          500: '#9B2335',
          600: '#800020',
          700: '#66001A',
        },
        ink: {
          900: '#0F172A',
          700: '#334155',
          500: '#64748B',
          300: '#CBD5E1',
          100: '#F1F5F9',
        },
      },
    },
  },
  plugins: [],
};
