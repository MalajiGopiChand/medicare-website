/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f2f8',
          100: '#b3d9e8',
          200: '#80c0d8',
          300: '#4da7c8',
          400: '#3282b8',
          500: '#0f4c75',
          600: '#0c3d5e',
          700: '#092e47',
          800: '#061f30',
          900: '#031019',
        },
      },
    },
  },
  plugins: [],
}

