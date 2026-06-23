/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta da marca: branco, bege, rosa claro, dourado
        cream: {
          50: '#FDFBF7',
          100: '#FAF6EF',
          200: '#F4ECDD',
          300: '#EADFC8',
        },
        beige: {
          100: '#F5EFE6',
          200: '#EADDCB',
          300: '#DEC9AE',
          400: '#CBB08A',
          500: '#B79468',
        },
        blush: {
          50: '#FDF4F4',
          100: '#FBEAEA',
          200: '#F6D6D9',
          300: '#EFBAC0',
          400: '#E498A2',
          500: '#D67A88',
        },
        gold: {
          300: '#E8CE91',
          400: '#D9B978',
          500: '#C9A35E',
          600: '#B08A45',
          700: '#8F6F35',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Poppins"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(176, 138, 69, 0.18)',
        card: '0 4px 24px -8px rgba(160, 130, 90, 0.20)',
        gold: '0 8px 30px -8px rgba(201, 163, 94, 0.45)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-left': {
          '0%': { opacity: '0', transform: 'translateX(28px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.7s cubic-bezier(0.22,1,0.36,1) both',
        'slide-left': 'slide-left 0.7s cubic-bezier(0.22,1,0.36,1) both',
        'scale-in': 'scale-in 0.3s ease-out',
        shimmer: 'shimmer 2.5s linear infinite',
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
