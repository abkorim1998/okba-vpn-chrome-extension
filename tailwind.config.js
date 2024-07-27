/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#341d33',
          '50': '#f9f1fc',
          '100': '#f5e6f9',
          '200': '#ebd2f3',
          '300': '#e1b6eb',
          '400': '#d999e0',
          '500': '#d17fd5',
          '600': '#c566c2',
          '700': '#ad55a8',
          '800': '#8c4789',
          '900': '#713e70',
          '950': '#341d33',
        }
      }
    },
  },
  plugins: [],
}

