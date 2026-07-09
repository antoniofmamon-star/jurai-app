/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#E6EBF4',
          100: '#C0CEEA',
          200: '#96AEDD',
          300: '#6B8DD0',
          400: '#4D76C7',
          500: '#2E5FBE',
          600: '#1B3A6B',
          700: '#0F2952',
          800: '#091D3A',
          900: '#040E1C',
        },
        gold: {
          50:  '#FDF8EC',
          100: '#FAEDD0',
          200: '#F5D99A',
          300: '#EFC564',
          400: '#E8B22E',
          500: '#C9A84C',
          600: '#A8893D',
          700: '#866B2E',
          800: '#654D1F',
          900: '#432F10',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}