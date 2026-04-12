/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'soft-white': '#FAFAFA',
        'soft-gray': '#F5F5F5',
        'elegant-gold': '#D4AF37',
        'deep-burgundy': '#722F37',
        'charcoal': '#36454F',
      },
      fontFamily: {
        'bengali': ['Noto Sans Bengali', 'sans-serif'],
        'english': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
