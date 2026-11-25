/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B00',
          50: '#FFF8F0',
          100: '#FFE8CC',
          200: '#FFD199',
          300: '#FFBA66',
          400: '#FF9A3C',
          500: '#FF6B00',
          600: '#E05E00',
          700: '#B84D00',
          800: '#8F3C00',
          900: '#662B00',
        },
        accent: '#FF9A3C',
        background: '#FFF8F0',
        dark: '#2D1B00',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
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
  plugins: [],
}
